import { useNavigate } from "react-router";
import type { CollectionMini } from "../../types/types";

const CollectionCard = ({
    collectionMini,
}: {
    collectionMini: CollectionMini;
}) => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate(`/Catalog?collection=${collectionMini.id}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleRedirect();
        }
    };

    return (
        <div
            className="group relative flex aspect-4/3 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[var(--color-cream)]"
            onClick={handleRedirect}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`Collection: ${collectionMini.name}`}
        >
            <img
                src={collectionMini.picture}
                alt={collectionMini.name || "Collection image"}
                className="absolute h-full w-full object-cover object-center transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                loading="lazy"
                onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                }}
            />

            {/* Gradient overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(20,26,21,0.62)] via-[rgba(20,26,21,0.12)] to-transparent transition-opacity duration-500 group-hover:from-[rgba(20,26,21,0.72)]" />

            {/* thin brass frame appears on hover */}
            <div className="pointer-events-none absolute inset-3 border border-[rgba(232,217,189,0)] transition-colors duration-500 group-hover:border-[rgba(232,217,189,0.55)]" />

            {/* Collection name + cue */}
            <div className="absolute bottom-6 z-10 flex flex-col items-center px-4 text-center">
                <span className="font-[var(--font-display)] text-lg tracking-[0.04em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-xl md:text-2xl">
                    {collectionMini.name}
                </span>
                <span className="ui-label mt-2 text-[0.6rem] text-[#e8d9bd] opacity-0 transition-all duration-500 group-hover:opacity-100">
                    Explore &rarr;
                </span>
            </div>
        </div>
    );
};

export default CollectionCard;
