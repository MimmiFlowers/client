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
            className="group relative flex aspect-4/3 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl"
            onClick={handleRedirect}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`Collection: ${collectionMini.name}`}
        >
            <img
                src={collectionMini.picture}
                alt={collectionMini.name || "Collection image"}
                className="absolute h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                }}
            />

            {/* Gradient overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

            {/* Collection name */}
            <span className="absolute bottom-5 z-10 text-sm font-light uppercase tracking-[0.2em] text-white drop-shadow-lg sm:text-base md:text-lg">
                {collectionMini.name}
            </span>
        </div>
    );
};

export default CollectionCard;
