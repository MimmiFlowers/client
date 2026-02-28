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
            className="relative flex aspect-4/3 w-[45%] cursor-pointer items-center justify-center overflow-hidden shadow-lg transition-transform"
            onClick={handleRedirect}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`Collection: ${collectionMini.name}`}
        >
            <img
                src={collectionMini.picture}
                alt={collectionMini.name || "Collection image"}
                className="absolute h-full w-full object-cover object-center duration-500 hover:scale-110"
                loading="lazy"
                onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                }}
            />
            <span className="absolute bottom-0 z-10 mb-4 text-5xl text-white drop-shadow-lg sm:text-3xl md:text-4xl">
                {collectionMini.name}
            </span>
            <div className="pointer-events-none absolute bottom-0 left-0 z-0 h-[60%] w-full bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
    );
};

export default CollectionCard;
