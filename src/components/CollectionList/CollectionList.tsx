import { useEffect, useState } from "react";
import axios from "axios";
import type { CollectionMini } from "../../types/types";
import CollectionCard from "../CollectionCard/CollectionCard";

const CollectionList = () => {
    const [collectionsMini, setCollectionsMini] = useState<CollectionMini[]>([]);

    const urlDev = 'http://localhost:8500/collections';

    const fetchCollectionsMini = async () => {
        try {
            const response = await axios.get(urlDev);
            setCollectionsMini(response.data.data);
        } catch (error) {
            console.error("Error fetching Collections:", error);
        }
    };

    useEffect(() => {
        fetchCollectionsMini();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <h2 className="">Our Collections</h2>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {collectionsMini.length > 0 && collectionsMini.map((collectionMini) => (
                    <CollectionCard key={collectionMini.name} collectionMini={collectionMini}/> ))}
            </div>
        </div>
    )
};

export default CollectionList;