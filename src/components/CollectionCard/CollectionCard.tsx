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
            className="group relative aspect-[5/6] w-full cursor-pointer overflow-hidden rounded-tl-[40%] rounded-br-[40%] rounded-tr-3xl rounded-bl-3xl bg-[var(--color-surface)]"
            onClick={handleRedirect}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`Collection: ${collectionMini.name}`}
        >
            <img
                src={collectionMini.picture}
                alt={collectionMini.name || "Collection image"}
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[1500ms] ease-out group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                }}
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/80 via-[var(--color-ink)]/15 to-transparent" />

            {/* Caption */}
            <div className="absolute right-7 bottom-7 left-7 text-[var(--color-cream)]">
                <p className="text-[0.8rem] tracking-[0.34em] uppercase text-[var(--color-cream)]/75 italic">
                    A composition of
                </p>
                <h3 className="mt-2 font-display text-3xl leading-tight tracking-tight italic sm:text-4xl">
                    {collectionMini.name}
                </h3>
                <div className="mt-4 flex items-center gap-3">
                    <span className="h-px w-10 bg-[var(--color-blush)]" />
                    <span className="text-[0.82rem] tracking-[0.26em] uppercase text-[var(--color-blush)]">
                        Explore
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CollectionCard;
