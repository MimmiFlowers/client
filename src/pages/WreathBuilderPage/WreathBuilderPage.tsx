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
    CloseIcon,
} from "../../components/Icons/Icons";
import WreathStage from "../../components/WreathBuilder/WreathStage";
import ChoiceGroup from "../../components/WreathBuilder/ChoiceGroup";
import DecorationTray from "../../components/WreathBuilder/DecorationTray";
import { useDragToSlot } from "../../components/WreathBuilder/useDragToSlot";
import { renderWreathPng } from "../../components/WreathBuilder/renderWreathPng";
import { priceDesign } from "../../components/WreathBuilder/wreathPricing";
import { summaryLines } from "../../components/WreathBuilder/wreathSummary";
import { ringForSize } from "../../components/WreathBuilder/wreathGeometry";
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
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
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
            setSelectedSlot(null);
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

    const onSlotTap = (slot: number) => {
        const current = design.placements[slot] ?? null;
        if (armed) {
            place(slot, armed);
            return;
        }
        if (current) {
            setSelectedSlot(selectedSlot === slot ? null : slot);
            return;
        }
        setAnnouncement(t("wreath.tray_hint"));
    };

    const onArm = (code: string | null) => {
        setArmed(code);
        setSelectedSlot(null);
        if (code)
            setAnnouncement(
                t("wreath.armed_hint", { name: decorationName(code) }),
            );
    };

    const clearSelected = () => {
        if (selectedSlot === null) return;
        dispatch({ type: "clearSlot", slot: selectedSlot });
        setAnnouncement(t("wreath.removed", { n: selectedSlot + 1 }));
        setSelectedSlot(null);
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
            if (!image) setImageWarning(true);
            const response = await api.post<WreathDesignResponse>(
                "/data/wreath/designs",
                { spec: toSpec(design), image },
            );
            const {
                designID,
                price: serverPrice,
                imagePath,
                summary,
            } = response.data;
            const material = options.materials.find(
                (m) => m.code === design.materialCode,
            );
            addItem({
                id: `wreath-${designID}`,
                name: t("wreath.cart_name"),
                // Same-origin in Docker (VITE_API_URL is ""), the API host in local dev.
                picture: imagePath
                    ? `${import.meta.env.VITE_API_URL ?? ""}${imagePath}`
                    : (material?.image ?? ""),
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
    const selectedDecoration =
        selectedSlot !== null
            ? (design.placements[selectedSlot] ?? null)
            : null;
    const sizeChoices = options.sizes.map((s) => ({
        code: s.code,
        name: s.name,
        meta: t("wreath.size_meta", { cm: s.diameterCm, slots: s.slotCount }),
        priceLabel: kr(options.basePrices[s.code]?.[design.materialCode] ?? 0),
    }));
    const materialChoices = options.materials.map((m) => ({
        code: m.code,
        name: m.name,
        image: m.image,
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
                {/* Stage: sticky under the header so the wreath stays visible while choosing. */}
                <div className="bg-blush/95 sticky top-24 z-20 -mx-5 px-5 pb-3 backdrop-blur-xl sm:-mx-8 sm:px-8 md:top-28 lg:static lg:col-span-6 lg:mx-0 lg:bg-transparent lg:px-0 lg:pb-0 lg:backdrop-blur-none">
                    <div className="lg:sticky lg:top-36">
                        <div className="bg-surface shadow-soft mx-auto max-w-[16rem] rounded-[2px] p-3 sm:max-w-[22rem] lg:max-w-none">
                            <WreathStage
                                ref={stageRef}
                                options={options}
                                design={design}
                                armed={armed}
                                selectedSlot={selectedSlot}
                                onSlotTap={onSlotTap}
                            />
                        </div>
                        <div className="text-ink-soft mt-3 flex min-h-11 flex-wrap items-center justify-center gap-3 text-center text-label">
                            {selectedDecoration && selectedSlot !== null ? (
                                <button
                                    type="button"
                                    onClick={clearSelected}
                                    className="border-line-strong text-ink-soft hover:border-danger hover:text-danger inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border px-4 transition-colors"
                                >
                                    <CloseIcon className="h-3.5 w-3.5" />
                                    {t("wreath.remove_from_slot", {
                                        name: decorationName(
                                            selectedDecoration,
                                        ),
                                        n: selectedSlot + 1,
                                    })}
                                </button>
                            ) : (
                                <span>
                                    {armed
                                        ? t("wreath.armed_hint", {
                                              name: decorationName(armed),
                                          })
                                        : t("wreath.tray_hint")}
                                </span>
                            )}
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
                    </div>
                </div>

                <div className="space-y-12 pb-24 lg:col-span-6 lg:pb-0">
                    <section aria-label={t("wreath.step_size")}>
                        <Reveal>
                            <Step n={1} title={t("wreath.step_size")} />
                            <ChoiceGroup
                                label={t("wreath.step_size")}
                                name="wreath-size"
                                choices={sizeChoices}
                                value={design.sizeCode}
                                onChange={(code) => {
                                    const size = options.sizes.find(
                                        (s) => s.code === code,
                                    );
                                    if (size)
                                        dispatch({
                                            type: "setSize",
                                            code,
                                            slotCount: size.slotCount,
                                        });
                                }}
                            />
                        </Reveal>
                    </section>
                    <section aria-label={t("wreath.step_material")}>
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
                    <section aria-label={t("wreath.step_band")}>
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
                    <section aria-label={t("wreath.step_decorations")}>
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
                        className="border-line bg-surface rounded-[2px] border p-6"
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
                                    {t("wreath.summary_decorations")}
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

            {ghost && (
                <img
                    src={ghost.image}
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none fixed z-50 h-14 w-14 -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-lg"
                    style={{ left: ghost.x, top: ghost.y }}
                />
            )}
        </div>
    );
};

export default WreathBuilderPage;
