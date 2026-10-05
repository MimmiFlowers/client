import { useEffect, useState } from "react";

/*
 * Remembers which artwork URLs the browser already has, so the stage can tell a
 * cached base photo (show it at once) from one still downloading (show the
 * loading ring instead of the previous photo stretched to the new size).
 */

const settled = new Set<string>();
const pending = new Map<string, Promise<void>>();

/** True once `url` has loaded — or failed: either way there is nothing left to wait for. */
export const isImageReady = (url: string): boolean => !url || settled.has(url);

/** Start downloading `url` (once per URL); resolves when it has loaded or failed. */
export const preloadImage = (url: string): Promise<void> => {
    if (isImageReady(url)) return Promise.resolve();
    let promise = pending.get(url);
    if (!promise) {
        promise = new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = img.onerror = () => {
                settled.add(url);
                pending.delete(url);
                resolve();
            };
            img.src = url;
        });
        pending.set(url, promise);
    }
    return promise;
};

/** React view of the cache: re-renders when `url` becomes ready. */
export const useImageReady = (url: string): boolean => {
    const [, setVersion] = useState(0);
    useEffect(() => {
        if (isImageReady(url)) return;
        let active = true;
        preloadImage(url).then(() => {
            if (active) setVersion((v) => v + 1);
        });
        return () => {
            active = false;
        };
    }, [url]);
    return isImageReady(url);
};

/** Tests only. */
export const resetImageCache = (): void => {
    settled.clear();
    pending.clear();
};
