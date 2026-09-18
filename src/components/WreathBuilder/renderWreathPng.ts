/**
 * Serialise the wreath stage <svg> to a PNG data URL.
 *
 * Why the dance: an <img> that displays an SVG blob is not allowed to load
 * external resources, so every <image href="/wreath/x.svg"> is fetched and
 * inlined as a data URL first. Assets therefore MUST be same-origin (or CORS
 * enabled) or the fetch — and the export — fails. Returns null on any failure;
 * the caller then submits the design without a picture.
 */
const toDataUrl = async (href: string): Promise<string> => {
    const response = await fetch(href);
    if (!response.ok) throw new Error(`Failed to fetch ${href}`);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
    });
};

const loadImage = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("SVG could not be decoded"));
        img.src = src;
    });

export const renderWreathPng = async (
    svg: SVGSVGElement,
    size = 800,
): Promise<string | null> => {
    try {
        const clone = svg.cloneNode(true) as SVGSVGElement;
        // Slot markers, numbers and highlights are UI only.
        clone
            .querySelectorAll("[data-export-hide]")
            .forEach((el) => el.remove());
        clone.setAttribute("width", String(size));
        clone.setAttribute("height", String(size));
        clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");

        const cache = new Map<string, string>();
        for (const image of Array.from(clone.querySelectorAll("image"))) {
            const href = image.getAttribute("href") ?? "";
            if (!href || href.startsWith("data:")) continue;
            let data = cache.get(href);
            if (!data) {
                data = await toDataUrl(href);
                cache.set(href, data);
            }
            image.setAttribute("href", data);
        }

        const xml = new XMLSerializer().serializeToString(clone);
        const url = URL.createObjectURL(
            new Blob([xml], { type: "image/svg+xml;charset=utf-8" }),
        );
        try {
            const img = await loadImage(url);
            const canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d");
            if (!ctx) return null;
            // Opaque background so the picture reads well in email clients and Telegram.
            const surface = getComputedStyle(document.documentElement)
                .getPropertyValue("--color-surface")
                .trim();
            ctx.fillStyle = surface || "white";
            ctx.fillRect(0, 0, size, size);
            ctx.drawImage(img, 0, 0, size, size);
            return canvas.toDataURL("image/png");
        } finally {
            URL.revokeObjectURL(url);
        }
    } catch {
        return null;
    }
};
