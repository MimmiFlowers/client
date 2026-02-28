import { useTranslation } from "react-i18next";

const ContactPage = () => {
    const { t } = useTranslation();

    return (
        <div className="mx-auto max-w-3xl px-6 py-12">
            <title>{t("seo.contact_title")}</title>
            <h1 className="mb-6 text-3xl font-bold">{t("contact.title")}</h1>
            <div className="space-y-4 text-lg text-gray-700">
                <p>
                    <span className="font-semibold">{t("contact.address_label")}</span>{" "}
                    {t("contact.address_value")}
                </p>
                <p>
                    <span className="font-semibold">{t("contact.email_label")}</span>{" "}
                    <a
                        href="mailto:info@mimmiflowers.se"
                        className="text-green-600 hover:underline"
                    >
                        info@mimmiflowers.se
                    </a>
                </p>
                <p>
                    <span className="font-semibold">{t("contact.phone_label")}</span>{" "}
                    <a
                        href="tel:+46000000000"
                        className="text-green-600 hover:underline"
                    >
                        +46 (0) 00 000 00 00
                    </a>
                </p>
                <p>
                    <span className="font-semibold">{t("contact.hours_label")}</span>{" "}
                    {t("contact.hours_value")}
                </p>
            </div>
        </div>
    );
};

export default ContactPage;
