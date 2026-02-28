import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api/api";
import type { CollectionMini } from "../../types/types";
import CollectionCard from "../CollectionCard/CollectionCard";

const CollectionList = () => {
    const [collectionsMini, setCollectionsMini] = useState<CollectionMini[]>(
        [],
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { t } = useTranslation();
    const fetchCollectionsMini = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/data/collections");
            setCollectionsMini(response.data.data);
        } catch {
            setError(t("errors.load_collections"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCollectionsMini();
    }, []);

    return (
        <div className="flex w-[85%] flex-col items-center justify-center">
            <h2 className="my-4 text-4xl">{t("collections.title")}</h2>
            <div className="my-4 flex w-[100%] flex-wrap justify-center gap-8">
                {loading && (
                    <p className="w-full py-8 text-center text-gray-400">
                        {t("loading")}
                    </p>
                )}
                {error && (
                    <p className="w-full py-8 text-center text-red-500">
                        {error}
                    </p>
                )}
                {!loading &&
                    !error &&
                    collectionsMini.map((collectionMini) => (
                        <CollectionCard
                            key={collectionMini.name}
                            collectionMini={collectionMini}
                        />
                    ))}
            </div>
        </div>
    );
};

export default CollectionList;
