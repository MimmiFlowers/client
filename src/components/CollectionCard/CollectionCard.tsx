import { useNavigate } from "react-router";
import type { CollectionMini } from "../../types/types";

const CollectionCard = ({
    collectionMini,
}: {
    collectionMini: CollectionMini;
}) => {
    const navigate = useNavigate();

    const handleRedirect = () =>
        navigate(
            `/Catalog?collection=${encodeURIComponent(collectionMini.name.toLowerCase())}`,
        );

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleRedirect();
        }
    };

    return (
        <div
            className="group relative aspect-[5/6] w-full cursor-pointer overflow-hidden bg-[var(--color-cream)]"
            onClick={handleRedirect}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`Collection: ${collectionMini.name}`}
        >
            <img
                src={collectionMini.picture}
                alt={collectionMini.name || "Collection image"}
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                }}
            />

            {/* Editorial dark gradient */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/85 via-[var(--color-ink)]/15 to-transparent" />

            {/* Inner gold frame */}
            <div className="pointer-events-none absolute inset-4 border border-[var(--color-cream)]/30 transition-all duration-700 group-hover:inset-3 group-hover:border-[var(--color-accent)]/70" />

            {/* Caption block */}
            <div className="absolute right-6 bottom-6 left-6 flex items-end justify-between gap-4 text-[var(--color-cream)]">
                <div>
                    <p className="text-[0.65rem] tracking-[0.42em] uppercase text-[var(--color-cream)]/70">
                        Collection
                    </p>
                    <h3 className="mt-2 font-display text-2xl leading-tight tracking-tight sm:text-3xl md:text-4xl">
                        {collectionMini.name}
                    </h3>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-cream)]/60 text-sm transition-all duration-500 group-hover:border-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-[var(--color-ink)]">
                    ›
                </span>
            </div>
        </div>
    );
};

export default CollectionCard;
