
import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Bouquet } from '../../types/types';
import './ProductPage.css';
import { useParams } from 'react-router';

function Product() {
    const [bouquet, setBouquet] = useState<Bouquet>({} as Bouquet);
    const { id } = useParams<string>();

    const fetchBouquet = async (id: string) => {
        const urlDev = `http://localhost:8500/flowers/${id}`;
        try {
            const response = await axios.get(urlDev);
            setBouquet(response.data);
        } catch (error) {
            console.error("Error fetching bouquet:", error);
        }
    };

    useEffect(() => {
        id && fetchBouquet(id);
    }, []);

    return (
        <div>
            <p className='text-center text-lg text-red-600'>{bouquet.name}</p>
            <div className='ProductPage-container'>
                <img className='ProductPage-img' src={bouquet.picture} alt={bouquet.name} />
                <div className='ProductPage-details'>
                    <h3 className='ProductPage-price'>{bouquet.price} kr</h3>
                    <p className='ProductPage-desc'>{bouquet.description}</p>
                </div>
            </div>
        </div>
    );
};

export default Product;