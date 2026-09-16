import { useTranslation } from "react-i18next";
import Reveal from "../../components/Reveal/Reveal";
import {
    ArrowUpRightIcon,
    ClockIcon,
    InstagramIcon,
    MailIcon,
    PhoneIcon,
    PinIcon,
    TikTokIcon,
} from "../../components/Icons/Icons";
import { SOCIAL_LINKS } from "../../layout/navigation";

const ContactPage = () => {
    const { t } = useTranslation();

    const channels = [
        {
            icon: MailIcon,
            label: t("contact.email_label"),
            value: t("contact.email_value"),
            href: `mailto:${t("contact.email_value")}`,
        },
        {
            icon: PhoneIcon,
            label: t("contact.phone_label"),
            value: t("contact.phone_value"),
            href: t("contact.phone_href"),
        },
    ];

    const details = [
        { icon: PinIcon, label: t("contact.address_label"), value: t("contact.address_value") },
        { icon: ClockIcon, label: t("contact.hours_label"), value: t("contact.hours_value") },
    ];

    return (
        <div className="w-full">
            <title>{t("seo.contact_title")}</title>

            <header className="container-luxe pt-10 md:pt-16">
                <p className="eyebrow animate-rise">{t("contact.get_in_touch")}</p>
                <h1
                    className="mt-5 animate-rise font-display text-[3rem] leading-[0.95] font-medium tracking-[-0.03em] sm:text-7xl lg:text-[6.5rem]"
                    style={{ animationDelay: "100ms" }}
                >
                    {t("contact.title")}
                </h1>
                <p
                    className="mt-6 max-w-xl animate-rise text-lg leading-relaxed text-ink-soft"
                    style={{ animationDelay: "180ms" }}
                >
                    {t("contact.subtitle")}
                </p>
            </header>

            <div className="container-luxe mt-14 grid gap-14 md:mt-20 lg:grid-cols-12 lg:gap-16">
                {/* Direct channels */}
                <section className="lg:col-span-7" aria-label={t("contact.get_in_touch")}>
                    {channels.map(({ icon: Icon, label, value, href }, i) => (
                        <Reveal key={label} delay={i * 80}>
                            <a
                                href={href}
                                className="group flex items-center justify-between gap-6 border-t border-line py-8 md:py-10"
                            >
                                <span className="min-w-0">
                                    <span className="eyebrow flex items-center gap-2.5">
                                        <Icon className="h-4 w-4 text-ink" />
                                        {label}
                                    </span>
                                    <span className="price mt-3 block font-display text-[1.4rem] leading-tight whitespace-nowrap text-ink transition-transform duration-700 ease-luxe group-hover:translate-x-2 min-[400px]:text-[1.6rem] sm:text-4xl lg:text-5xl">
                                        {value}
                                    </span>
                                </span>
                                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line-strong transition-all duration-500 ease-luxe group-hover:border-ink group-hover:bg-ink group-hover:text-blush">
                                    <ArrowUpRightIcon className="h-4 w-4" />
                                </span>
                            </a>
                        </Reveal>
                    ))}
                    <div className="border-t border-line" />
                </section>

                {/* Studio details */}
                <aside className="lg:col-span-5">
                    <Reveal className="rounded-[1.75rem] bg-surface p-7 shadow-soft sm:p-10">
                        <h2 className="font-display text-3xl">{t("contact.visit_us")}</h2>
                        <dl className="mt-8 space-y-6">
                            {details.map(({ icon: Icon, label, value }) => (
                                <div key={label} className="flex gap-4">
                                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-ink" />
                                    <div>
                                        <dt className="eyebrow">{label}</dt>
                                        <dd className="price mt-1.5 text-[15px] leading-relaxed text-ink">
                                            {value}
                                        </dd>
                                    </div>
                                </div>
                            ))}
                        </dl>

                        <div className="mt-10 border-t border-line pt-8">
                            <h2 className="eyebrow">{t("contact.follow_us")}</h2>
                            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                                {t("contact.follow_us_text")}
                            </p>
                            <div className="mt-5 flex gap-3">
                                <a
                                    href={SOCIAL_LINKS.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-ink transition-colors duration-300 hover:bg-primary-deep"
                                >
                                    <InstagramIcon />
                                </a>
                                <a
                                    href={SOCIAL_LINKS.tiktok}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="TikTok"
                                    className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-ink transition-colors duration-300 hover:bg-primary-deep"
                                >
                                    <TikTokIcon className="h-[1.1rem] w-[1.1rem]" />
                                </a>
                            </div>
                        </div>
                    </Reveal>
                </aside>
            </div>
        </div>
    );
};

export default ContactPage;
