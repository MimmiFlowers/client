import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CategoriesContainer.css';

const CategoriesContainer = () => {
    const [categories, setCategories] = useState([]);

    const fetchCategories = () => {
        const urlDev = 'http://localhost:8500';

        const categoriesData = axios.get(`${urlDev}/categories`);
        setCategories(categoriesData.data.data);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className='Categories-container'>
            <div className='Categories-container_category'>
                {categories.length > 0 && categories.map(category => <CategoryItem key={category.name} category={category} />)}
            </div>
        </div>
    );
};

export default CategoriesContainer;