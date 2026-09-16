import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import bannerMock from "../../assets/images/bannerMock.jpg";
import { ArrowRightIcon } from "../Icons/Icons";

/** Circular text seal that slowly turns next to the hero image. */
const Seal = ({ label }: { label: string }) => (
    <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-primary text-ink shadow-soft sm:h-36 sm:w-36">
        <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full animate-[spin_28s_linear_infinite]"
            aria-hidden="true"
        >
            <defs>
                <path
                    id="seal-circle"
                    d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0"
                />
            </defs>
            <text className="fill-current text-[8.5px] font-medium uppercase">
                <textPath
                    href="#seal-circle"
                    textLength="230"
                    lengthAdjust="spacing"
                >
                    {`${label} · Mimmi Flowers · `}
                </textPath>
            </text>
        </svg>
        <span className="font-display text-3xl sm:text-4xl" aria-hidden="true">
            M
        </span>
    </div>
);

const TituleBlock = () => {
    const { t } = useTranslation();

    return (
        <section className="container-luxe pt-8 pb-4 md:pt-14 lg:pt-10">
            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
                {/* Copy */}
                <div className="lg:col-span-7">
                    <p
                        className="eyebrow flex animate-rise items-center gap-3"
                        style={{ animationDelay: "80ms" }}
                    >
                        <span className="h-px w-8 bg-muted" />
                        {t("home.hero_eyebrow")}
                    </p>
                    <h1
                        className="mt-6 animate-rise font-display text-[3.4rem] leading-[0.95] font-medium tracking-[-0.03em] text-ink sm:text-[5rem] lg:text-[5.75rem] xl:text-[6.75rem]"
                        style={{ animationDelay: "160ms" }}
                    >
                        {t("home.hero_title")}
                    </h1>
                    <p
                        className="mt-6 max-w-md animate-rise text-[17px] leading-relaxed text-ink-soft sm:text-lg"
                        style={{ animationDelay: "260ms" }}
                    >
                        {t("banner.slide1_subtitle")}
                    </p>

                    <div
                        className="mt-9 flex animate-rise flex-wrap items-center gap-x-8 gap-y-4"
                        style={{ animationDelay: "360ms" }}
                    >
                        <Link
                            to="/Catalog"
                            className="group inline-flex h-14 items-center gap-5 rounded-full bg-ink pr-2 pl-7 text-[12px] font-medium tracking-[0.18em] text-blush uppercase transition-transform duration-300 active:scale-[0.98]"
                        >
                            {t("banner.slide3_cta")}
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-ink transition-transform duration-500 ease-luxe group-hover:translate-x-1 group-hover:-rotate-45">
                                <ArrowRightIcon className="h-4 w-4" />
                            </span>
                        </Link>
                        <Link
                            to="/Catalog?filter=season"
                            className="group inline-flex min-h-11 items-center gap-2 text-[12px] font-medium tracking-[0.18em] text-ink uppercase"
                        >
                            <span className="border-b border-ink/30 pb-1 transition-colors duration-300 group-hover:border-ink">
                                {t("banner.slide2_cta")}
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Image */}
                <div
                    className="relative mx-auto w-full max-w-[34rem] animate-rise lg:col-span-5 lg:col-start-8"
                    style={{ animationDelay: "200ms" }}
                >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-t-full bg-blush-deep">
                        <img
                            src={bannerMock}
                            alt={t("home.hero_caption")}
                            width={960}
                            height={1280}
                            fetchPriority="high"
                            className="h-full w-full animate-fade object-cover"
                        />
                        <div className="pointer-events-none absolute inset-0 rounded-t-full ring-1 ring-ink/5 ring-inset" />
                    </div>

                    {/* Caption card */}
                    <div className="absolute -bottom-6 left-4 max-w-[15rem] bg-surface/95 px-5 py-4 shadow-soft sm:left-[-2rem]">
                        <p className="eyebrow">{t("banner.slide3_title")}</p>
                        <p className="mt-1 font-display text-lg leading-snug">
                            {t("banner.slide3_subtitle")}
                        </p>
                    </div>

                    <div className="absolute -top-4 right-2 sm:-right-8 sm:top-10">
                        <Seal label={t("home.hero_eyebrow")} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TituleBlock;
