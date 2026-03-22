import { useTranslation } from "react-i18next";

const ContactPage = () => {
    const { t } = useTranslation();

    return (
        <div className="px-4 py-12">
            <title>{t("seo.contact_title")}</title>

            <div className="mx-auto w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] max-w-5xl">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="mb-3 text-3xl font-light tracking-wide text-gray-900 sm:text-4xl">
                        {t("contact.title")}
                    </h1>
                    <p className="mx-auto max-w-lg text-sm leading-relaxed text-gray-500">
                        {t("contact.subtitle")}
                    </p>
                </div>

                {/* Two-column grid */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Left column — Get in Touch */}
                    <div>
                        <h2 className="mb-6 text-[10px] font-medium tracking-[0.2em] text-gray-400 uppercase">
                            {t("contact.get_in_touch")}
                        </h2>

                        <div className="space-y-4">
                            {/* Email card */}
                            <a
                                href={`mailto:${t("contact.email_value")}`}
                                className="group flex items-start gap-4 rounded-2xl bg-white/70 p-5 backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-sm"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edc7f5]/30">
                                    <svg
                                        className="h-4.5 w-4.5 text-gray-600 transition-colors duration-300 group-hover:text-gray-900"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[10px] font-medium tracking-[0.15em] text-gray-400 uppercase">
                                        {t("contact.email_label")}
                                    </p>
                                    <p className="mt-1 text-sm font-light text-gray-700 transition-colors duration-300 group-hover:text-gray-900">
                                        {t("contact.email_value")}
                                    </p>
                                </div>
                            </a>

                            {/* Phone card */}
                            <a
                                href={t("contact.phone_href")}
                                className="group flex items-start gap-4 rounded-2xl bg-white/70 p-5 backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-sm"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edc7f5]/30">
                                    <svg
                                        className="h-4.5 w-4.5 text-gray-600 transition-colors duration-300 group-hover:text-gray-900"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[10px] font-medium tracking-[0.15em] text-gray-400 uppercase">
                                        {t("contact.phone_label")}
                                    </p>
                                    <p className="mt-1 text-sm font-light text-gray-700 transition-colors duration-300 group-hover:text-gray-900">
                                        {t("contact.phone_value")}
                                    </p>
                                </div>
                            </a>

                            {/* Hours card */}
                            <div className="flex items-start gap-4 rounded-2xl bg-white/70 p-5 backdrop-blur-sm">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edc7f5]/30">
                                    <svg
                                        className="h-4.5 w-4.5 text-gray-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[10px] font-medium tracking-[0.15em] text-gray-400 uppercase">
                                        {t("contact.hours_label")}
                                    </p>
                                    <p className="mt-1 text-sm font-light text-gray-700">
                                        {t("contact.hours_value")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right column — Visit Us + Follow Us */}
                    <div className="space-y-8">
                        {/* Visit Us */}
                        <div>
                            <h2 className="mb-6 text-[10px] font-medium tracking-[0.2em] text-gray-400 uppercase">
                                {t("contact.visit_us")}
                            </h2>

                            <div className="rounded-2xl bg-white/70 p-6 backdrop-blur-sm">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edc7f5]/30">
                                        <svg
                                            className="h-4.5 w-4.5 text-gray-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={1.5}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-medium tracking-[0.15em] text-gray-400 uppercase">
                                            {t("contact.address_label")}
                                        </p>
                                        <p className="mt-1 text-sm font-light text-gray-700">
                                            {t("contact.address_value")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Follow Us */}
                        <div>
                            <h2 className="mb-6 text-[10px] font-medium tracking-[0.2em] text-gray-400 uppercase">
                                {t("contact.follow_us")}
                            </h2>

                            <div className="rounded-2xl bg-white/70 p-6 backdrop-blur-sm">
                                <p className="mb-5 text-sm font-light leading-relaxed text-gray-500">
                                    {t("contact.follow_us_text")}
                                </p>

                                <div className="flex items-center gap-4">
                                    <a
                                        href="https://instagram.com/mimmi_flowers?igshid=MzMyNGUyNmU2YQ=="
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Instagram"
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edc7f5]/30 text-gray-500 transition-all duration-300 hover:bg-[#edc7f5]/50 hover:text-gray-800"
                                    >
                                        <svg
                                            className="h-4.5 w-4.5"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    </a>
                                    <a
                                        href="https://www.tiktok.com/@mimmi_flowers"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="TikTok"
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edc7f5]/30 text-gray-500 transition-all duration-300 hover:bg-[#edc7f5]/50 hover:text-gray-800"
                                    >
                                        <svg
                                            className="h-4.5 w-4.5"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.18z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
