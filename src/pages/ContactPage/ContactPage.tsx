import { useTranslation } from "react-i18next";
import Reveal from "../../components/Reveal/Reveal";
import {
    ArrowUpRightIcon,
    InstagramIcon,
    MailIcon,
    PhoneIcon,
    TikTokIcon,
    TruckIcon,
} from "../../components/Icons/Icons";
import { SOCIAL_HANDLE, SOCIAL_LINKS } from "../../layout/navigation";

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

    const socials = [
        {
            icon: InstagramIcon,
            name: "Instagram",
            handle: SOCIAL_HANDLE,
            href: SOCIAL_LINKS.instagram,
        },
        {
            icon: TikTokIcon,
            name: "TikTok",
            handle: SOCIAL_HANDLE,
            href: SOCIAL_LINKS.tiktok,
        },
    ];

    return (
        <div className="w-full">
            <title>{t("seo.contact_title")}</title>

            <header className="container-luxe pt-10 md:pt-16">
                <h1
                    className="animate-rise font-display text-page leading-[0.95] font-medium tracking-[-0.03em]"
                    style={{ animationDelay: "100ms" }}
                >
                    {t("contact.title")}
                </h1>
                <p
                    className="mt-6 max-w-xl animate-rise text-lead leading-relaxed text-ink-soft"
                    style={{ animationDelay: "180ms" }}
                >
                    {t("contact.subtitle")}
                </p>
            </header>

            <div className="container-luxe mt-14 grid gap-14 md:mt-20 lg:grid-cols-12 lg:gap-16">
                {/* Direct channels */}
                <section
                    className="lg:col-span-7"
                    aria-label={t("contact.get_in_touch")}
                >
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

                {/* Social — the shop is online-only for now */}
                <aside className="lg:col-span-5">
                    <Reveal className="rounded-[1.75rem] bg-surface p-7 shadow-soft sm:p-10">
                        <h2 className="font-display text-title">
                            {t("contact.follow_us")}
                        </h2>
                        <p className="mt-3 text-body-sm leading-relaxed text-ink-soft">
                            {t("contact.follow_us_text")}
                        </p>
                        <ul className="mt-8">
                            {socials.map(
                                ({ icon: Icon, name, handle, href }) => (
                                    <li key={name}>
                                        <a
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center gap-4 border-t border-line py-5"
                                        >
                                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-ink transition-colors duration-300 group-hover:bg-primary-deep">
                                                <Icon className="h-[1.15rem] w-[1.15rem]" />
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block font-display text-subtitle leading-tight text-ink">
                                                    {name}
                                                </span>
                                                <span className="block text-body-sm text-ink-soft">
                                                    {handle}
                                                </span>
                                            </span>
                                            <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-ink transition-transform duration-500 ease-luxe group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </a>
                                    </li>
                                ),
                            )}
                        </ul>
                        <p className="flex gap-3 border-t border-line pt-6 text-body-sm leading-relaxed text-ink-soft">
                            <TruckIcon className="mt-0.5 h-5 w-5 shrink-0 text-ink" />
                            {t("contact.online_only")}
                        </p>
                    </Reveal>
                </aside>
            </div>
        </div>
    );
};

export default ContactPage;
