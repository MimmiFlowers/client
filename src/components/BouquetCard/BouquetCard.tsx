import { useNavigate } from "react-router";
import type { BouquetMini } from "../../types/types";

const BouquetCard = ({ bouquetMini }: { bouquetMini: BouquetMini }) => {
  const navigate = useNavigate();

  const handleRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`Catalog/${bouquetMini.id}`);
  };

  return (
    <div
      className="w-[24%] flex flex-col items-center justify-center transition duration-500 overflow-hidden hover:cursor-pointer"
      onClick={handleRedirect}
    >
      <img
        className="w-[100%] aspect-square object-cover shadow-lg rounded transform transition duration-500 hover:scale-105"
        src={bouquetMini.picture}
        alt={bouquetMini.name}
      />
      <p className="text-lg pt-2 text-center">{bouquetMini.price}kr</p>
      <p className="text-base text-center">{bouquetMini.name}</p>
    </div>
  );
};

export default BouquetCard;
