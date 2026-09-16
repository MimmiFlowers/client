/** Primary navigation, shared by the desktop header, mobile menu and footer. */
export const navLinks = [
    { to: "/Catalog", key: "menu.catalog" },
    { to: "/About", key: "menu.about" },
    { to: "/Contact", key: "menu.contact" },
] as const;

export const SOCIAL_LINKS = {
    instagram: "https://instagram.com/mimmi_flowers?igshid=MzMyNGUyNmU2YQ==",
    tiktok: "https://www.tiktok.com/@mimmi_flowers",
} as const;
