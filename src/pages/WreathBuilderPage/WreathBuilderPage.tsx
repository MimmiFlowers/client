import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { isAxiosError } from "axios";
import api, { registerReloadOnLanguageChange } from "../../api/api";
import { useCart } from "../../contexts/CartContext";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Reveal from "../../components/Reveal/Reveal";
import {
    AlertIcon,
    BagIcon,
    CheckIcon,
} from "../../components/Icons/Icons";
import WreathStage from "../../components/WreathBuilder/WreathStage";
import ChoiceGroup from "../../components/WreathBuilder/ChoiceGroup";
import DecorationTray from "../../components/WreathBuilder/DecorationTray";
import DecorationSheet from "../../components/WreathBuilder/DecorationSheet";
import DecorationThumb from "../../components/WreathBuilder/DecorationThumb";
import { useDragToSlot } from "../../components/WreathBuilder/useDragToSlot";
import { renderWreathPng } from "../../components/WreathBuilder/renderWreathPng";
import { priceDesign } from "../../components/WreathBuilder/wreathPricing";
import { summaryLines } from "../../components/WreathBuilder/wreathSummary";
import { ringForSize } from "../../components/WreathBuilder/wreathGeometry";
import {
    baseImage,
    chipImage,
} from "../../components/WreathBuilder/wreathArtwork";
import { preloadImage } from "../../components/WreathBuilder/imageCache";
import {
    initialDesign,
    toSpec,
    wreathReducer,
} from "../../components/WreathBuilder/wreathReducer";
import type {
    WreathAction,
    WreathDesignState,
} from "../../components/WreathBuilder/wreathReducer";
import type {
    WreathDesignResponse,
    WreathOptions,
} from "../../components/WreathBuilder/types";

const kr = (n: number) => `${n.toLocaleString("sv-SE")} kr`;

/** How long the "Wreath cleared · Undo" toast stays up. */
const UNDO_MS = 5000;

/* Same numbered heading as the checkout steps. */
function Step({ n, title }: { n: number; title: string }) {
    return (
        <div className="border-line mb-6 flex items-baseline gap-4 border-b pb-4">
            <span
                className="price font-display text-accent-ink text-[2.5rem] leading-none"
                aria-hidden="true"
            >
                0{n}
            </span>
            <h2 className="font-display text-heading leading-tight">
                {title}
            </h2>
        </div>
    );
}

const WreathBuilderPage = () => {
    const { t, i18n } = useTranslation();
    const { addItem } = useCart();

    const [options, setOptions] = useState<WreathOptions | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [design, setDesign] = useState<WreathDesignState | null>(null);
    const [armed, setArmed] = useState<string | null>(null);
    // Slot picker: pickerSlot outlives pickerOpen so the panel slides out with its content.
    const [pickerOpen, setPickerOpen] = useState(false);
    const [pickerSlot, setPickerSlot] = useState<number | null>(null);
    // Placements before the last "Clear all", while its Undo toast is up.
    const [undoPlacements, setUndoPlacements] = useState<
        (string | null)[] | null
    >(null);
    const undoTimer = useRef<number | undefined>(undefined);
    const [announcement, setAnnouncement] = useState("");
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [imageWarning, setImageWarning] = useState(false);
    const stageRef = useRef<SVGSVGElement>(null);

    const dispatch = useCallback((action: WreathAction) => {
        setDesign((current) =>
            current ? wreathReducer(current, action) : current,
        );
    }, []);

    const fetchOptions = useCallback(async () => {
        setLoading(true);
        setLoadError("");
        try {
            const response = await api.get<WreathOptions>(
                "/data/wreath/options",
            );
            if (
                response.data.sizes.length === 0 ||
                response.data.materials.length === 0
            ) {
                throw new Error("empty catalogue");
            }
            setOptions(response.data);
            // Keep the customer's choices across a language switch; only seed once.
            setDesign((current) => current ?? initialDesign(response.data));
        } catch {
            setLoadError(t("wreath.load_error"));
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchOptions();
        window.scrollTo(0, 0);
        return registerReloadOnLanguageChange(fetchOptions);
    }, [fetchOptions]);

    const decorationName = useCallback(
        (code: string) =>
            options?.decorations.find((d) => d.code === code)?.name ?? code,
        [options],
    );

    const place = useCallback(
        (slot: number, code: string) => {
            dispatch({ type: "place", slot, code });
            setPickerOpen(false);
            setUndoPlacements(null);
            setAnnouncement(
                t("wreath.placed", { name: decorationName(code), n: slot + 1 }),
            );
        },
        [dispatch, decorationName, t],
    );

    const ring =
        options && design ? ringForSize(options.sizes, design.sizeCode) : 0;
    const { ghost, onPointerDown, consumeDragClick } = useDragToSlot(
        stageRef,
        design?.placements.length ?? 0,
        ring,
        place,
    );

    const price = useMemo(
        () => (design && options ? priceDesign(design, options) : null),
        [design, options],
    );

    useEffect(() => () => window.clearTimeout(undoTimer.current), []);

    // Fetch every size's base photo for the chosen material in the background, so
    // switching sizes doesn't wait for a ~500 KB download.
    const materialCode = design?.materialCode;
    useEffect(() => {
        if (!options || !materialCode) return;
        for (const size of options.sizes)
            void preloadImage(baseImage(options, size.code, materialCode));
    }, [options, materialCode]);

    if (loading && !options) {
        return (
            <div className="container-luxe mt-10">
                <title>{t("seo.wreath_title")}</title>
                <div className="animate-shimmer bg-blush-deep mx-auto aspect-square w-full max-w-md rounded-[2px]" />
            </div>
        );
    }

    if (!options || !design || !price) {
        return (
            <div className="container-luxe mt-10">
                <title>{t("seo.wreath_title")}</title>
                <p role="alert" className="text-danger flex items-center gap-2">
                    <AlertIcon className="h-4 w-4" />{" "}
                    {loadError || t("wreath.load_error")}
                </p>
                <button
                    type="button"
                    onClick={fetchOptions}
                    className="bg-ink text-blush hover:bg-ink-soft mt-6 inline-flex h-12 cursor-pointer items-center rounded-full px-6 text-label font-medium tracking-[0.16em] uppercase"
                >
                    {t("wreath.retry")}
                </button>
            </div>
        );
    }

    // A decoration armed in the desktop tray goes straight in; otherwise open the picker.
    const onSlotTap = (slot: number) => {
        if (armed) {
            place(slot, armed);
            return;
        }
        setPickerSlot(slot);
        setPickerOpen(true);
    };

    const onArm = (code: string | null) => {
        setArmed(code);
        if (code)
            setAnnouncement(
                t("wreath.armed_hint", { name: decorationName(code) }),
            );
    };

    const removeFromPicker = () => {
        if (pickerSlot === null) return;
        dispatch({ type: "clearSlot", slot: pickerSlot });
        setAnnouncement(t("wreath.removed", { n: pickerSlot + 1 }));
        setPickerOpen(false);
        setUndoPlacements(null);
    };

    const clearAll = () => {
        setUndoPlacements(design.placements);
        dispatch({ type: "clearAll" });
        setAnnouncement(t("wreath.cleared"));
        window.clearTimeout(undoTimer.current);
        undoTimer.current = window.setTimeout(
            () => setUndoPlacements(null),
            UNDO_MS,
        );
    };

    const undoClear = () => {
        if (!undoPlacements) return;
        dispatch({ type: "restore", placements: undoPlacements });
        setUndoPlacements(null);
        window.clearTimeout(undoTimer.current);
    };

    const handleAddToCart = async () => {
        if (adding) return;
        setAdding(true);
        setSubmitError("");
        setImageWarning(false);
        try {
            let image: string | null = null;
            if (stageRef.current) {
                image = await renderWreathPng(stageRef.current, 800);
                // Stay under the server's 500 KB cap (base64 is ~4/3 of the bytes).
                if (image && image.length > 660_000)
                    image = await renderWreathPng(stageRef.current, 560);
                // Still too big at 560px: post the design without a picture
                // rather than let the server reject the whole order.
                if (image && image.length > 660_000) image = null;
            }
            const response = await api.post<WreathDesignResponse>(
                "/data/wreath/designs",
                { spec: toSpec(design), image },
            );
            const {
                designID,
                price: serverPrice,
                imageUrl,
                summary,
            } = response.data;
            // No picture either because the browser export failed or the server's
            // upload to R2 did; the shop still gets the full option list.
            if (!imageUrl) setImageWarning(true);
            addItem({
                id: `wreath-${designID}`,
                name: t("wreath.cart_name"),
                picture:
                    imageUrl ??
                    baseImage(options, design.sizeCode, design.materialCode),
                price: serverPrice,
                quantity: 1,
                designID,
                details: summaryLines(
                    summary,
                    i18n.language,
                    t("wreath.band_none"),
                ),
            });
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
        } catch (error) {
            const detail = isAxiosError(error)
                ? error.response?.data?.detail
                : undefined;
            setSubmitError(
                typeof detail === "string" ? detail : t("wreath.submit_error"),
            );
        } finally {
            setAdding(false);
        }
    };

    const selectedSize = options.sizes.find((s) => s.code === design.sizeCode);
    const selectedMaterial = options.materials.find(
        (m) => m.code === design.materialCode,
    );
    const selectedBand = options.bands.find((b) => b.code === design.bandCode);
    const filled = design.placements.filter((code) => code !== null).length;
    const sizeChoice = (code: string) => {
        const size = options.sizes.find((s) => s.code === code);
        if (size)
            dispatch({ type: "setSize", code, slotCount: size.slotCount });
    };
    const sizeChoices = options.sizes.map((s) => ({
        code: s.code,
        name: s.name,
        meta: t("wreath.size_meta", { cm: s.diameterCm, slots: s.slotCount }),
        priceLabel: kr(options.basePrices[s.code]?.[design.materialCode] ?? 0),
    }));
    const materialChoices = options.materials.map((m) => ({
        code: m.code,
        name: m.name,
        image: chipImage(options, m.code),
        priceLabel: kr(options.basePrices[design.sizeCode]?.[m.code] ?? 0),
    }));
    const bandChoices = [
        {
            code: "",
            name: t("wreath.band_none"),
            priceLabel: t("wreath.included"),
        },
        ...options.bands.map((b) => ({
            code: b.code,
            name: b.name,
            image: b.image,
            priceLabel: t("wreath.plus_price", {
                price: b.price.toLocaleString("sv-SE"),
            }),
        })),
    ];

    const addButton = (size: "lg" | "sm") => (
        <button
            type="button"
            onClick={handleAddToCart}
            disabled={adding}
            className={`group ease-luxe flex cursor-pointer items-center justify-center gap-3 rounded-full font-medium whitespace-nowrap uppercase transition-[background-color,transform] duration-500 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 ${
                size === "lg"
                    ? "h-14 w-full text-label tracking-[0.16em]"
                    : "h-12 shrink-0 px-5 text-label tracking-[0.08em]"
            } ${added ? "bg-success text-blush" : "bg-ink text-blush hover:bg-ink-soft"}`}
        >
            {added ? (
                <>
                    <CheckIcon className="h-4 w-4" strokeWidth={1.75} />
                    {t("product_page.added_to_cart")}
                </>
            ) : (
                <>
                    {size === "lg" && <BagIcon className="h-4 w-4" />}
                    {t("buttons.add_to_cart")}
                </>
            )}
        </button>
    );

    return (
        <div className="w-full">
            <title>{t("seo.wreath_title")}</title>
            <Breadcrumb
                items={[
                    { label: t("breadcrumbs.home"), to: "/" },
                    { label: t("menu.wreath") },
                ]}
            />

            <section className="container-luxe mt-6 md:mt-10">
                <h1 className="font-display text-section leading-[1] font-medium tracking-[-0.02em]">
                    {t("wreath.title")}
                </h1>
                <p className="text-ink-soft mt-4 max-w-xl text-body-sm leading-relaxed">
                    {t("wreath.intro")}
                </p>
            </section>

            <section className="container-luxe mt-8 grid gap-8 lg:mt-12 lg:grid-cols-12 lg:gap-14">
                {/* Stage. Phones: near full width, scrolls with the page, options right under it.
                    Desktop: sticky beside the numbered steps. */}
                {/* min-w-0: the sideways-scrolling chip rows must not widen the grid track. */}
                <div className="min-w-0 lg:col-span-6">
                    <div className="lg:sticky lg:top-36">
                        <div className="bg-surface shadow-soft mx-auto rounded-[2px] p-1.5 sm:max-w-wreath sm:p-3 lg:max-w-none">
                            <WreathStage
                                ref={stageRef}
                                options={options}
                                design={design}
                                armed={armed}
                                selectedSlot={pickerOpen ? pickerSlot : null}
                                onSlotTap={onSlotTap}
                            />
                        </div>
                        <div className="mx-auto mt-1.5 flex min-h-12 items-center justify-between gap-3 sm:max-w-wreath lg:max-w-none">
                            <p className="text-ink-soft text-caption">
                                {armed ? (
                                    t("wreath.armed_hint", {
                                        name: decorationName(armed),
                                    })
                                ) : filled > 0 ? (
                                    t("wreath.hint_filled", {
                                        count: filled,
                                        total: design.placements.length,
                                    })
                                ) : (
                                    <>
                                        <span className="lg:hidden">
                                            {t("wreath.hint_empty")}
                                        </span>
                                        <span className="hidden lg:inline">
                                            {t("wreath.tray_hint")}
                                        </span>
                                    </>
                                )}
                            </p>
                            <button
                                type="button"
                                onClick={clearAll}
                                disabled={filled === 0}
                                className="text-ink decoration-line-strong hover:decoration-ink disabled:text-muted min-h-11 shrink-0 cursor-pointer px-0.5 text-button font-medium tracking-[0.12em] uppercase underline underline-offset-[5px] transition-colors disabled:cursor-default disabled:opacity-50 disabled:hover:decoration-line-strong"
                            >
                                {t("wreath.clear_all")}
                            </button>
                        </div>
                        <p aria-live="polite" className="sr-only">
                            {announcement}
                        </p>
                        {design.dropped > 0 && (
                            <p
                                role="status"
                                className="text-danger mt-2 text-center text-label"
                            >
                                {t("wreath.dropped_notice", {
                                    count: design.dropped,
                                })}
                            </p>
                        )}

                        {/* Compact options, phones and tablets only (desktop has the steps). */}
                        <div className="mx-auto mt-4 space-y-5 sm:max-w-wreath lg:hidden">
                            <ChoiceGroup
                                variant="segmented"
                                label={t("wreath.step_size")}
                                name="wreath-size-compact"
                                choices={sizeChoices}
                                value={design.sizeCode}
                                valueLabel={
                                    selectedSize
                                        ? `${selectedSize.diameterCm} cm`
                                        : undefined
                                }
                                onChange={sizeChoice}
                            />
                            <ChoiceGroup
                                variant="chips"
                                label={t("wreath.step_material")}
                                name="wreath-material-compact"
                                choices={materialChoices}
                                value={design.materialCode}
                                valueLabel={selectedMaterial?.name}
                                onChange={(code) =>
                                    dispatch({ type: "setMaterial", code })
                                }
                            />
                            <ChoiceGroup
                                variant="chips"
                                label={t("wreath.step_band")}
                                name="wreath-band-compact"
                                choices={bandChoices}
                                value={design.bandCode ?? ""}
                                valueLabel={
                                    selectedBand?.name ?? t("wreath.band_none")
                                }
                                onChange={(code) =>
                                    dispatch({
                                        type: "setBand",
                                        code: code || null,
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-12 pb-24 lg:col-span-6 lg:pb-0">
                    <section
                        className="hidden lg:block"
                        aria-label={t("wreath.step_size")}
                    >
                        <Reveal>
                            <Step n={1} title={t("wreath.step_size")} />
                            <ChoiceGroup
                                label={t("wreath.step_size")}
                                name="wreath-size"
                                choices={sizeChoices}
                                value={design.sizeCode}
                                onChange={sizeChoice}
                            />
                        </Reveal>
                    </section>
                    <section
                        className="hidden lg:block"
                        aria-label={t("wreath.step_material")}
                    >
                        <Reveal>
                            <Step n={2} title={t("wreath.step_material")} />
                            <ChoiceGroup
                                label={t("wreath.step_material")}
                                name="wreath-material"
                                choices={materialChoices}
                                value={design.materialCode}
                                onChange={(code) =>
                                    dispatch({ type: "setMaterial", code })
                                }
                            />
                        </Reveal>
                    </section>
                    <section
                        className="hidden lg:block"
                        aria-label={t("wreath.step_band")}
                    >
                        <Reveal>
                            <Step n={3} title={t("wreath.step_band")} />
                            <ChoiceGroup
                                label={t("wreath.step_band")}
                                name="wreath-band"
                                choices={bandChoices}
                                value={design.bandCode ?? ""}
                                onChange={(code) =>
                                    dispatch({
                                        type: "setBand",
                                        code: code || null,
                                    })
                                }
                            />
                        </Reveal>
                    </section>
                    {/* Drag/arm tray: desktop only. On touch screens the slot picker replaces it,
                        and its touch-none tiles would block page scrolling. */}
                    <section
                        className="hidden lg:block"
                        aria-label={t("wreath.step_decorations")}
                    >
                        <Reveal>
                            <Step n={4} title={t("wreath.step_decorations")} />
                            <DecorationTray
                                decorations={options.decorations}
                                armed={armed}
                                onArm={onArm}
                                onPointerDown={onPointerDown}
                                consumeDragClick={consumeDragClick}
                            />
                        </Reveal>
                    </section>

                    <section
                        className="border-line bg-surface mx-auto rounded-[2px] border p-6 sm:max-w-wreath lg:max-w-none"
                        aria-label={t("wreath.total")}
                    >
                        <dl className="space-y-2 text-caption">
                            <div className="flex justify-between gap-4">
                                <dt className="text-ink-soft">
                                    {t("wreath.summary_base")} ·{" "}
                                    {selectedSize?.name}
                                </dt>
                                <dd className="price">{kr(price.base)}</dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt className="text-ink-soft">
                                    {t("wreath.summary_band")}
                                </dt>
                                <dd className="price">{kr(price.band)}</dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt className="text-ink-soft">
                                    {t("wreath.summary_decorations")} ({filled})
                                </dt>
                                <dd className="price">
                                    {kr(price.decorations)}
                                </dd>
                            </div>
                            <div className="border-line flex justify-between gap-4 border-t pt-3">
                                <dt className="font-medium">
                                    {t("wreath.total")}
                                </dt>
                                <dd className="price font-display text-subtitle">
                                    {kr(price.total)}
                                </dd>
                            </div>
                        </dl>
                        {imageWarning && (
                            <p
                                role="status"
                                className="text-ink-soft mt-4 text-label"
                            >
                                {t("wreath.image_warning")}
                            </p>
                        )}
                        {submitError && (
                            <p
                                role="alert"
                                className="text-danger mt-4 flex items-center gap-2 text-caption"
                            >
                                <AlertIcon className="h-4 w-4" /> {submitError}
                            </p>
                        )}
                        <div className="mt-6 hidden lg:block">
                            {addButton("lg")}
                        </div>
                    </section>
                </div>
            </section>

            {/* Mobile sticky bar (footer reserves room for it, see index.css) */}
            <div
                data-sticky-buy-bar
                className="border-line bg-surface/95 fixed inset-x-0 bottom-0 z-30 border-t backdrop-blur-xl lg:hidden"
            >
                <div className="container-luxe flex items-center gap-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                    <div className="min-w-0 flex-1">
                        <p className="font-display truncate text-item-title leading-tight">
                            {t("wreath.cart_name")}
                        </p>
                        <p className="price text-ink-soft text-caption">
                            {kr(price.total)}
                        </p>
                    </div>
                    {addButton("sm")}
                </div>
            </div>

            <DecorationSheet
                open={pickerOpen}
                slot={pickerSlot}
                current={
                    pickerSlot !== null
                        ? (design.placements[pickerSlot] ?? null)
                        : null
                }
                decorations={options.decorations}
                onPick={(code) => {
                    if (pickerSlot !== null) place(pickerSlot, code);
                }}
                onRemove={removeFromPicker}
                onClose={() => setPickerOpen(false)}
            />

            {/* Undo for "Clear all"; sits above the phone buy bar. */}
            <div
                className={`bg-ink text-blush ease-luxe fixed inset-x-4 bottom-24 z-40 mx-auto flex max-w-sm items-center justify-between gap-3 rounded-xl py-1.5 pr-2 pl-4.5 text-caption shadow-lift transition-[opacity,transform] duration-300 lg:bottom-8 ${
                    undoPlacements
                        ? "translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-5 opacity-0"
                }`}
                inert={!undoPlacements}
            >
                <span>{t("wreath.cleared")}</span>
                <button
                    type="button"
                    onClick={undoClear}
                    className="text-primary min-h-11 cursor-pointer px-3 text-button font-medium tracking-[0.12em] uppercase"
                >
                    {t("wreath.undo")}
                </button>
            </div>

            {ghost && (
                <div
                    className="pointer-events-none fixed z-50 h-14 w-14 -translate-x-1/2 -translate-y-1/2 drop-shadow-lg"
                    style={{ left: ghost.x, top: ghost.y }}
                >
                    <DecorationThumb src={ghost.image} className="h-full w-full" />
                </div>
            )}
        </div>
    );
};

export default WreathBuilderPage;
