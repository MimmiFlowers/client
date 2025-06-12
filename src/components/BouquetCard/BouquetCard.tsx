import { useNavigate } from 'react-router';
import type { BouquetMini } from '../../types/types';
import './BouquetCard.css';

function BouquetCard({ bouquetMini }: { bouquetMini: BouquetMini }) {
    const navigate = useNavigate();

    const handleRedirect = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate(`Product/${bouquetMini.id}`);
    }

    return (
        <div className='Bouquet' onClick={handleRedirect}>
            <img className='Bouquet-img' src={bouquetMini.picture} alt={bouquetMini.name} />
            <h4 className='Bouquet-price'>{bouquetMini.price}kr</h4>
            <p className='Bouquet-desc'>{bouquetMini.name}</p>
        </div>
    )
};

export default BouquetCard;