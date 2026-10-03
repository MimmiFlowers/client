import { useTranslation } from "react-i18next";
import Reveal from "../Reveal/Reveal";
import PillLink from "../PillLink/PillLink";

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
                    <p className="text-ink-soft mt-5 max-w-md text-body-sm leading-relaxed">
                        {t("home.wreath_text")}
                    </p>
                    <PillLink to="/Wreath" className="mt-8">
                        {t("home.wreath_cta")}
                    </PillLink>
                </div>
                <img
                    src="/wreath/promo.svg"
                    alt=""
                    loading="lazy"
                    className="mx-auto w-full max-w-xs md:max-w-sm"
                />
            </Reveal>
        </section>
    );
};

export default WreathPromo;
