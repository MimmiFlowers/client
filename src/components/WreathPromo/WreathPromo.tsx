import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import Reveal from "../Reveal/Reveal";
import { ArrowRightIcon } from "../Icons/Icons";

const WreathPromo = () => {
    const { t } = useTranslation();
    return (
        <section
            className="container-luxe mt-24 md:mt-32"
            aria-labelledby="wreath-promo"
        >
            <Reveal className="bg-surface shadow-soft grid items-center gap-10 rounded-[2px] p-8 md:grid-cols-2 md:p-12">
                <div>
                    <h2
                        id="wreath-promo"
                        className="font-display text-[2.2rem] leading-[1.05] tracking-[-0.02em] sm:text-5xl"
                    >
                        {t("home.wreath_title")}
                    </h2>
                    <p className="text-ink-soft mt-5 max-w-md text-[15px] leading-relaxed">
                        {t("home.wreath_text")}
                    </p>
                    <Link
                        to="/Wreath"
                        className="group bg-ink text-blush ease-luxe hover:bg-ink-soft mt-8 inline-flex h-14 items-center justify-center gap-3 rounded-full px-8 text-[12px] font-medium tracking-[0.16em] uppercase transition-colors duration-500"
                    >
                        {t("home.wreath_cta")}
                        <ArrowRightIcon className="ease-luxe h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                    </Link>
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
