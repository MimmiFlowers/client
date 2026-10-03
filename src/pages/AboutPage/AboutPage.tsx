import { useTranslation } from "react-i18next";
import banner480 from "../../assets/images/banner-480.webp";
import banner960 from "../../assets/images/banner-960.webp";
import Reveal from "../../components/Reveal/Reveal";
import PillLink from "../../components/PillLink/PillLink";

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
                <h1
                    className="max-w-5xl animate-rise font-display text-page leading-[0.95] font-medium tracking-[-0.03em]"
                    style={{ animationDelay: "100ms" }}
                >
                    {t("about.title")}
                </h1>
                <p
                    className="mt-6 max-w-xl animate-rise text-lead leading-relaxed text-ink-soft"
                    style={{ animationDelay: "180ms" }}
                >
                    {t("about.subtitle")}
                </p>
            </header>

            <div className="container-luxe mt-16 grid gap-12 md:mt-24 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-5">
                    <div className="lg:sticky lg:top-36">
                        <div className="aspect-[4/5] overflow-hidden rounded-t-full bg-blush-deep">
                            <img
                                src={banner960}
                                srcSet={`${banner480} 480w, ${banner960} 960w`}
                                sizes="(min-width: 1024px) 40vw, 100vw"
                                loading="lazy"
                                alt={t("home.hero_caption")}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7">
                    {chapters.map((chapter) => (
                        <Reveal
                            as="section"
                            key={chapter.title}
                            className="border-t border-line py-10 first:border-t-0 first:pt-0 md:py-14"
                        >
                            <div>
                                <h2 className="font-display text-heading-lg leading-tight">
                                    {chapter.title}
                                </h2>
                                {chapter.body.map((paragraph) => (
                                    <p
                                        key={paragraph}
                                        className="mt-5 max-w-xl text-lead leading-[1.75] text-ink-soft"
                                    >
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </Reveal>
                    ))}

                    <Reveal className="border-t border-line pt-10">
                        <PillLink to="/Catalog">
                            {t("about.browse_catalog")}
                        </PillLink>
                    </Reveal>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
