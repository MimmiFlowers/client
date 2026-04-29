import { useNavigate } from "react-router";
import type { CollectionMini } from "../../types/types";

const CollectionCard = ({
    collectionMini,
}: {
    collectionMini: CollectionMini;
}) => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate(
            `/Catalog?collection=${encodeURIComponent(collectionMini.name.toLowerCase())}`
        );
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleRedirect();
        }
    };

    return (
        <article
            className="group cursor-pointer"
            onClick={handleRedirect}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`Collection: ${collectionMini.name}`}
        >
            <div className="ribbon-frame aspect-[5/6] w-full">
                <img
                    src={collectionMini.picture}
                    alt={collectionMini.name || "Collection"}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07]"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                    }}
                />

                {/* Candlelit overlay */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(to top, rgba(74,20,36,0.78) 0%, rgba(74,20,36,0.30) 45%, transparent 75%)",
                    }}
                />

                {/* Gold inner border */}
                <div className="pointer-events-none absolute inset-3 border border-[var(--color-gold-light)]/55" />

                {/* Top ornament */}
                <span className="ornament absolute top-4 left-1/2 -translate-x-1/2 text-xs text-[var(--color-gold-light)]">✦ ✦ ✦</span>

                {/* Caption inside */}
                <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-7 text-center">
                    <h3 className="font-display italic text-[var(--color-bg)] text-2xl sm:text-3xl drop-shadow-[0_2px_18px_rgba(74,20,36,0.5)]">
                        {collectionMini.name}
                    </h3>
                    <div className="mt-3 mx-auto w-16 h-px bg-[var(--color-gold-light)]/70 transition-all duration-500 group-hover:w-24" />
                    <span className="mt-3 inline-block eyebrow text-[var(--color-gold-light)] tracking-[0.42em]">
                        Discover →
                    </span>
                </div>
            </div>
        </article>
    );
};

export default CollectionCard;
