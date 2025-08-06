import { useNavigate } from "react-router";
import type { CollectionMini } from "../../types/types";

const CollectionCard = ({
  collectionMini,
}: {
  collectionMini: CollectionMini;
}) => {
  const navigate = useNavigate();

  const handleRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`Collection/${collectionMini.id}`);
  };

  return (
    <div
      className="relative w-[45%] aspect-4/3 flex items-center justify-center shadow-lg cursor-pointer transition-transform overflow-hidden"
      onClick={handleRedirect}
    >
      <img
        src={collectionMini.picture}
        alt={collectionMini.name || "Collection image"}
        className="absolute w-full h-full object-cover object-center hover:scale-110 duration-500"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/fallback-image.jpg"; // Запасное изображение
        }}
      />
      <span className="absolute bottom-0 z-10 mb-4 text-5xl md:text-4xl sm:text-3xl text-white drop-shadow-lg">
        {collectionMini.name}
      </span>
      <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-black/50 to-transparent z-0 pointer-events-none"></div>
    </div>
  );
};

export default CollectionCard;
