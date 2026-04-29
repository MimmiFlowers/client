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
            <div className="tile-frame aspect-[5/6] w-full">
                <img
                    src={collectionMini.picture}
                    alt={collectionMini.name || "Collection"}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                    }}
                />
                {/* Subtle veil on hover */}
                <div className="absolute inset-0 bg-[var(--color-obsidian)]/0 transition-colors duration-500 group-hover:bg-[var(--color-obsidian)]/10" />
            </div>

            {/* Gallery caption — under the plate */}
            <div className="mt-5 flex items-baseline justify-between gap-4">
                <h3 className="font-display text-[var(--color-obsidian)] text-xl sm:text-2xl tracking-tight">
                    {collectionMini.name}
                </h3>
                <span className="eyebrow-muted whitespace-nowrap transition-transform duration-500 group-hover:translate-x-1">
                    View &nbsp;→
                </span>
            </div>
            <div className="mt-3 hairline transition-colors duration-500 group-hover:[background:var(--color-obsidian)]" />
        </article>
    );
};

export default CollectionCard;
