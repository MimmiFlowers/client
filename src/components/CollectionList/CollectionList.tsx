import { useEffect, useState } from "react";
import axios from "axios";
import type { CollectionMini } from "../../types/types";
import CollectionCard from "../CollectionCard/CollectionCard";

const CollectionList = () => {
    const [collectionsMini, setCollectionsMini] = useState<CollectionMini[]>(
        [],
    );
    const apiUrl = import.meta.env.VITE_API_URL;

    const fetchCollectionsMini = async () => {
        try {
            const response = await axios.get(`${apiUrl}/collections`);
            setCollectionsMini(response.data.data);
        } catch (error) {
            console.error("Error fetching Collections:", error);
        }
    };

    useEffect(() => {
        fetchCollectionsMini();
    }, []);

    return (
        <div className="flex w-[85%] flex-col items-center justify-center">
            <h2 className="my-4 text-4xl">Our Collections</h2>
            <div className="my-4 flex w-[100%] flex-wrap justify-center gap-8">
                {collectionsMini.length > 0 &&
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
