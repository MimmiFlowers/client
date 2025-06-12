import { useState, useEffect } from 'react';
import SpecialsItem from '../BouquetCard/BouquetCard';
import axios from 'axios';
import type { SpecialProps, BouquetMini } from '../../types/types';
import './Specials.css';

const Specials = ({ setting }: SpecialProps) => {
    const [bouquetsMini, setBouquetsMini] = useState<BouquetMini[]>([]);

    const fetchBouquetsMini = async () => {
        const urlDev = 'http://localhost:8500';

        switch (setting) {
            case 'Favorite':
                const favorite = await axios.get(`${urlDev}/${setting.toLowerCase()}`)
                setBouquetsMini(favorite.data.data);
                break;
            case 'Season':
                const season = await axios.get(`${urlDev}/${setting.toLowerCase()}`)
                setBouquetsMini(season.data.data);
                break;
            default: 
                setBouquetsMini([]);
        }
    }

    useEffect(() => {
        fetchBouquetsMini();
    }, []);

    return (
        <div className='Specials-container'>
            <h2 className='Specials-container_category'>{setting}</h2>
            <div className='Specials-container_bouquets'>
                {bouquetsMini.length > 0 && bouquetsMini.map(bouquetMini => <SpecialsItem key={bouquetMini.name} bouquetMini={bouquetMini} />)}
            </div>
        </div>
    );
};

export default Specials;