import { useState, useEffect } from "react";
import SpecialsItem from "../BouquetCard/BouquetCard";
import { useTranslation } from "react-i18next";
import axios from "axios";
import type { SpecialProps, BouquetMini } from "../../types/types";

const Specials = ({ setting }: SpecialProps) => {
  const [bouquetsMini, setBouquetsMini] = useState<BouquetMini[]>([]);
  const { t } = useTranslation();

  const fetchBouquetsMini = async () => {
    const urlDev = "http://localhost:8500";

    switch (setting) {
      case "Favorite":
        const favorite = await axios.get(`${urlDev}/${setting.toLowerCase()}`);
        setBouquetsMini(favorite.data.data);
        break;
      case "Season":
        const season = await axios.get(`${urlDev}/${setting.toLowerCase()}`);
        setBouquetsMini(season.data.data);
        break;
      default:
        setBouquetsMini([]);
    }
  };

  useEffect(() => {
    fetchBouquetsMini();
  }, []);

  return (
    <div className="w-[90%] flex flex-col items-center justify-center m-2">
      <div className="w-full mt-4 flex items-center justify-between">
        <h2 className="text-4xl uppercase text-left">
          {t(`specials.${setting.toLowerCase()}`)}
        </h2>
        <button className="p-1 cursor-pointer transform transition duration-500 hover:scale-110 underline">
          {t("specials.show_all")}
        </button>
      </div>
      <div className="w-full flex flex-row items-center justify-between my-4 flex-wrap gap-2">
        {bouquetsMini.length > 0 &&
          bouquetsMini.map((bouquetMini) => (
            <SpecialsItem key={bouquetMini.name} bouquetMini={bouquetMini} />
          ))}
      </div>
    </div>
  );
};

export default Specials;
