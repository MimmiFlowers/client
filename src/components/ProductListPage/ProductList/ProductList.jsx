import React, { useState, useEffect} from 'react';
// import ProductListItem from '../../ReusableComponents/BouquetCard/BouquetCard.jsx';
import axios from 'axios';
import './ProductList.css';

function ProductList() {
    const [bouquets, setBouquets] = useState([]);

    const fetchFlowers = async () => {
        const urlDev = 'http://localhost:8500/flowers';
        
        const flowers = await axios.get(urlDev)
        setBouquets(flowers.data.data);
        return;
    }

    useEffect(() => {
        fetchFlowers();
    }, []);

    return (
        <div className='Flowers-container'>
            <h2 className='Flowers-container_title'>Our Bouquets</h2>
            <div className='Flowers-container_bouquets'>
                <h4>Hello hello</h4>
                {/* {bouquets.length > 0 && bouquets.map(bouquet => <ProductListItem key={bouquet.name} bouquet={bouquet} />)} */}
            </div>
        </div>
    );
};

export default ProductList;