import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import bannerMock from "../../assets/images/bannerMock.jpg";
import Reveal from "../../components/Reveal/Reveal";
import { ArrowRightIcon } from "../../components/Icons/Icons";

const AboutPage = () => {
    const { t } = useTranslation();

    const chapters = [
        { title: t("about.our_story"), body: [t("about.paragraph1"), t("about.paragraph2")] },
        { title: t("about.what_we_offer"), body: [t("about.paragraph3")] },
        { title: t("about.delivery_title"), body: [t("about.delivery_text")] },
    ];

    return (
        <div className="w-full">
            <title>{t("seo.about_title")}</title>

            <header className="container-luxe pt-10 md:pt-16">
                <p className="eyebrow animate-rise">Mimmi Flowers</p>
                <h1
                    className="mt-5 max-w-5xl animate-rise font-display text-[3rem] leading-[0.95] font-medium tracking-[-0.03em] sm:text-7xl lg:text-[6.5rem]"
                    style={{ animationDelay: "100ms" }}
                >
                    {t("about.title")}
                </h1>
                <p
                    className="mt-6 max-w-xl animate-rise text-lg leading-relaxed text-ink-soft"
                    style={{ animationDelay: "180ms" }}
                >
                    {t("about.subtitle")}
                </p>
            </header>

            <div className="container-luxe mt-16 grid gap-12 md:mt-24 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-5">
                    <div className="lg:sticky lg:top-36">
                        <div className="aspect-[4/5] animate-fade overflow-hidden rounded-t-full bg-blush-deep">
                            <img
                                src={bannerMock}
                                alt={t("home.hero_caption")}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7">
                    {chapters.map((chapter, i) => (
                        <Reveal
                            as="section"
                            key={chapter.title}
                            className="grid gap-4 border-t border-line py-10 first:border-t-0 first:pt-0 sm:grid-cols-[5rem_1fr] md:py-14"
                        >
                            <span className="price font-display text-4xl text-primary-deep">
                                0{i + 1}
                            </span>
                            <div>
                                <h2 className="font-display text-3xl leading-tight sm:text-4xl">
                                    {chapter.title}
                                </h2>
                                {chapter.body.map((paragraph) => (
                                    <p
                                        key={paragraph}
                                        className="mt-5 max-w-xl text-[17px] leading-[1.75] text-ink-soft"
                                    >
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </Reveal>
                    ))}

                    <Reveal className="border-t border-line pt-10">
                        <Link
                            to="/Catalog"
                            className="group inline-flex h-14 items-center gap-5 rounded-full bg-ink pr-2 pl-7 text-[12px] font-medium tracking-[0.18em] text-blush uppercase active:scale-[0.98]"
                        >
                            {t("about.browse_catalog")}
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-ink transition-transform duration-500 ease-luxe group-hover:translate-x-1">
                                <ArrowRightIcon className="h-4 w-4" />
                            </span>
                        </Link>
                    </Reveal>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
