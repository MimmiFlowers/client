import { useTranslation } from "react-i18next";
import Reveal from "../Reveal/Reveal";
import PillLink from "../PillLink/PillLink";

// Transparent 800 × 800 WebP; shown at up to 384 px (max-w-sm).
const PROMO_IMAGE =
    "https://images-stg.mimmiflowers.se/wreaths/promo/wreathPromo-v1.webp";

const WreathPromo = () => {
    const { t } = useTranslation();
    return (
        <section
            className="container-luxe mt-section"
            aria-labelledby="wreath-promo"
        >
            <Reveal className="bg-surface shadow-soft grid items-center gap-10 rounded-[2px] p-8 md:grid-cols-2 md:p-12">
                <div>
                    <h2
                        id="wreath-promo"
                        className="font-display text-section leading-[1.05] tracking-[-0.02em]"
                    >
                        {t("home.wreath_title")}
                    </h2>
                    <p className="text-ink-soft text-body-sm mt-5 max-w-md leading-relaxed">
                        {t("home.wreath_text")}
                    </p>
                    <PillLink to="/Wreath" className="mt-8">
                        {t("home.wreath_cta")}
                    </PillLink>
                </div>
                {/* R2, cached immutable: new artwork = new file name (…-v2.webp). */}
                <img
                    src={PROMO_IMAGE}
                    alt=""
                    width={800}
                    height={800}
                    loading="lazy"
                    className="mx-auto w-full max-w-xs md:max-w-sm"
                />
            </Reveal>
        </section>
    );
};

export default WreathPromo;
