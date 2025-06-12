import { useNavigate } from "react-router";
import type { CollectionMini } from "../../types/types"


const CollectionCard = ({ collectionMini }: { collectionMini: CollectionMini }) => {
    const navigate = useNavigate();

    const handleRedirect = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate(`Collection/${collectionMini.id}`);
    }

    return (
        <div className="bg-cover bg-center h-64 w-64 flex items-center justify-center text-white text-2xl font-bold cursor-pointer"
            style={{ backgroundImage: `url(${collectionMini.picture})` }}
            onClick={handleRedirect}>{collectionMini.name}</div>
    )
}

export default CollectionCard