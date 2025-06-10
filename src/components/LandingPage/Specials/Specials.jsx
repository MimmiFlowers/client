import React, { useState, useEffect } from 'react';
// import SpecialsItem from '../../ReusableComponents/BouquetCard/BouquetCard.jsx';
import axios from 'axios';
import './Specials.css';

const Specials = ({ setting }) => {
    const [bouquets, setBouquets] = useState([]);

    const fetchBouquets = async () => {
        const urlDev = 'http://localhost:8500';

        switch (setting) {
            case 'Favorite':
                const favorite = await axios.get(`${urlDev}/${setting.toLowerCase()}`)
                setBouquets(favorite.data.data);
                break;
            case 'Season':
                const season = await axios.get(`${urlDev}/${setting.toLowerCase()}`)
                setBouquets(season.data.data);
                break;
            default: 
                setBouquets(['Something went wrong']);
        }
    }

    useEffect(() => {
        fetchBouquets();
      }, []);

    return (
        <div className='Specials-container'>
            <h2 className='Specials-container_category'>{setting}</h2>
            <div className='Specials-container_bouquets'>
                <h4>Hello hello</h4>
                {/* {bouquets.length > 0 && bouquets.map(bouquet => <SpecialsItem key={bouquet.name} bouquet={bouquet} />)} */}
            </div>
        </div>
    );
};

export default Specials;