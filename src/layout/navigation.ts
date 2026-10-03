/** Primary navigation, shared by the desktop header, mobile menu and footer. */
export const navLinks = [
    { to: "/Catalog", key: "menu.catalog" },
    { to: "/Wreath", key: "menu.wreath" },
    { to: "/About", key: "menu.about" },
    { to: "/Contact", key: "menu.contact" },
] as const;

export const SOCIAL_LINKS = {
    instagram: "https://instagram.com/mimmi_flowers?igshid=MzMyNGUyNmU2YQ==",
    tiktok: "https://www.tiktok.com/@mimmi_flowers",
} as const;

/** Same handle on every network. */
export const SOCIAL_HANDLE = "@mimmi_flowers";
