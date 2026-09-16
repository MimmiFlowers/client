import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import TituleBlock from "../../components/TituleBlock/TituleBlock";
import Specials from "../../components/Specials/Specials";
import CollectionList from "../../components/CollectionList/CollectionList";
import Reveal from "../../components/Reveal/Reveal";
import {
    ArrowRightIcon,
    HandIcon,
    TruckIcon,
    GiftIcon,
} from "../../components/Icons/Icons";

const promises = [
    { icon: HandIcon, n: 1 },
    { icon: TruckIcon, n: 2 },
    { icon: GiftIcon, n: 3 },
] as const;

const LandingPage = () => {
    const { t } = useTranslation();

    return (
        <div className="w-full">
            <title>{t("seo.home_title")}</title>

            <TituleBlock />

            {/* Promises */}
            <section className="container-luxe mt-20 md:mt-28">
                <ul className="grid border-y border-line sm:grid-cols-3">
                    {promises.map(({ icon: Icon, n }, i) => (
                        <Reveal
                            as="li"
                            key={n}
                            delay={i * 90}
                            className={`flex gap-5 py-7 sm:flex-col sm:gap-4 sm:px-6 sm:py-10 lg:px-10 ${
                                i > 0
                                    ? "border-t border-line sm:border-t-0 sm:border-l"
                                    : ""
                            }`}
                        >
                            <Icon className="h-7 w-7 shrink-0 text-ink" />
                            <div>
                                <h2 className="font-display text-xl leading-tight">
                                    {t(`home.promise_${n}_title`)}
                                </h2>
                                <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-soft">
                                    {t(`home.promise_${n}_text`)}
                                </p>
                            </div>
                        </Reveal>
                    ))}
                </ul>
            </section>

            <Specials key="Favorite" setting="Favorite" />

            {/* Story */}
            <section className="mt-24 bg-blush-deep py-20 md:mt-36 md:py-32">
                <Reveal className="container-luxe grid gap-10 lg:grid-cols-12">
                    <p className="eyebrow lg:col-span-3">{t("about.our_story")}</p>
                    <div className="lg:col-span-8">
                        <p className="font-display text-[1.9rem] leading-[1.15] tracking-[-0.015em] text-ink sm:text-[2.6rem] lg:text-[3.2rem]">
                            <span className="text-accent-ink" aria-hidden="true">
                                “
                            </span>
                            {t("about.paragraph1")}
                        </p>
                        <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-ink-soft">
                            {t("about.paragraph2")}
                        </p>
                        <Link
                            to="/About"
                            className="group mt-10 inline-flex min-h-11 items-center gap-3 text-[12px] font-medium tracking-[0.16em] text-ink uppercase"
                        >
                            <span className="border-b border-ink/30 pb-1 transition-colors duration-300 group-hover:border-ink">
                                {t("home.story_cta")}
                            </span>
                            <ArrowRightIcon className="h-4 w-4 transition-transform duration-500 ease-luxe group-hover:translate-x-1" />
                        </Link>
                    </div>
                </Reveal>
            </section>

            <Specials key="Season" setting="Season" />

            <CollectionList />
        </div>
    );
};

export default LandingPage;
