import { useId } from "react";
import { BAND_END, CENTER, STAGE, slotRadius } from "./wreathGeometry";

interface Props {
    /** The size's whole-band picture (see wreathArtwork.bandOverlay). */
    overlay: string;
    /** The base photo under it: its outline decides where the ribbon ends. */
    base: string;
    /** Drawn wreath size and drawn picture size, stage units. */
    ring: number;
    art: number;
}

/**
 * A whole-band picture laid over the base photo, with ribbon ends that look
 * tucked under the inner rim instead of cut along every needle:
 *  - inside the ring's middle line the ribbon is cut along a smoothed version
 *    of the base photo's outline (blurred, then made solid again);
 *  - it darkens just before that edge, where a real ribbon turns away;
 *  - a thin strip of the base photo along the inner rim is drawn back on top,
 *    so needle tips lie over the ribbon end.
 * Outside the middle line the picture shows as drawn. Everything is SVG masks
 * and filters, so the PNG export (renderWreathPng) looks the same.
 * Tunables: BAND_END in wreathGeometry.ts.
 */
const BandOverlay = ({ overlay, base, ring, art }: Props) => {
    const id = useId().replace(/[^a-zA-Z0-9-]/g, "");
    const at = {
        x: CENTER - art / 2,
        y: CENTER - art / 2,
        width: art,
        height: art,
    };
    const mid = slotRadius(ring);
    const px = (share: number) => share * art;

    // The smoothed wreath outline, as alpha: blur, then a steep ramp around `solid`.
    const smooth = (result: string) => (
        <>
            <feGaussianBlur
                in="SourceAlpha"
                stdDeviation={px(BAND_END.smooth)}
                result={`${result}-blur`}
            />
            <feComponentTransfer in={`${result}-blur`} result={result}>
                <feFuncA
                    type="linear"
                    slope={12}
                    intercept={-12 * BAND_END.solid}
                />
            </feComponentTransfer>
        </>
    );
    const maskProps = {
        maskUnits: "userSpaceOnUse" as const,
        x: 0,
        y: 0,
        width: STAGE,
        height: STAGE,
        style: { maskType: "alpha" as const },
    };
    const filterProps = {
        filterUnits: "userSpaceOnUse" as const,
        x: at.x,
        y: at.y,
        width: art,
        height: art,
    };

    return (
        <>
            <defs>
                <clipPath id={`${id}-inside`}>
                    <circle cx={CENTER} cy={CENTER} r={mid} />
                </clipPath>
                <filter id={`${id}-cut`} {...filterProps}>
                    {smooth("s")}
                </filter>
                <filter id={`${id}-shadow`} {...filterProps}>
                    {smooth("s")}
                    <feMorphology
                        in="s"
                        operator="erode"
                        radius={px(BAND_END.shadowDepth)}
                        result="e"
                    />
                    <feGaussianBlur
                        in="e"
                        stdDeviation={px(BAND_END.shadowSoft)}
                        result="n"
                    />
                    <feComposite in="s" in2="n" operator="out" />
                </filter>
                <filter id={`${id}-rim`} {...filterProps}>
                    {smooth("s")}
                    <feMorphology
                        in="s"
                        operator="erode"
                        radius={px(BAND_END.tipsWidth)}
                        result="e"
                    />
                    <feComposite in="s" in2="e" operator="out" result="r" />
                    <feGaussianBlur
                        in="r"
                        stdDeviation={px(BAND_END.tipsSoft)}
                    />
                </filter>
                <filter id={`${id}-darken`}>
                    <feComponentTransfer>
                        <feFuncR
                            type="linear"
                            slope={1 - BAND_END.shadowStrength}
                        />
                        <feFuncG
                            type="linear"
                            slope={1 - BAND_END.shadowStrength}
                        />
                        <feFuncB
                            type="linear"
                            slope={1 - BAND_END.shadowStrength}
                        />
                    </feComponentTransfer>
                </filter>

                {/* Where the ribbon shows: outside the middle line, or on the smoothed wreath. */}
                <mask id={`${id}-keep`} {...maskProps}>
                    <image href={base} {...at} filter={`url(#${id}-cut)`} />
                    <path
                        fillRule="evenodd"
                        fill="white"
                        d={`M0 0H${STAGE}V${STAGE}H0Z M${CENTER} ${CENTER - mid}a${mid} ${mid} 0 1 0 0.01 0Z`}
                    />
                </mask>
                {/* The strip just before the smoothed inner edge. */}
                <mask id={`${id}-shadow-zone`} {...maskProps}>
                    <image
                        href={base}
                        {...at}
                        filter={`url(#${id}-shadow)`}
                        clipPath={`url(#${id}-inside)`}
                    />
                </mask>
                {/* A thin rim of the base along the inner edge, for needle tips on top. */}
                <mask id={`${id}-rim-zone`} {...maskProps}>
                    <image
                        href={base}
                        {...at}
                        filter={`url(#${id}-rim)`}
                        clipPath={`url(#${id}-inside)`}
                    />
                </mask>
            </defs>

            <image href={overlay} {...at} mask={`url(#${id}-keep)`} />
            <image
                href={overlay}
                {...at}
                filter={`url(#${id}-darken)`}
                mask={`url(#${id}-shadow-zone)`}
            />
            <image href={base} {...at} mask={`url(#${id}-rim-zone)`} />
        </>
    );
};

export default BandOverlay;
