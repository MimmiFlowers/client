import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import axios from "axios";
import type { Bouquet } from "../../types/types";
import BasketShopping3 from "../../icons/basketIcon";
import { useCart } from '../../contexts/CartContext';

const Product = () => {
    const [bouquet, setBouquet] = useState<Bouquet>({} as Bouquet);
    const [subgroup, setSubgroup] = useState<string>("");
    const { id } = useParams<string>();
    const { t } = useTranslation();
    const{ addItem } = useCart();

    const fetchBouquet = async (id: string) => {
        const urlDev = `http://localhost:8500/flowers/${id}`;
        try {
            const response = await axios.get(urlDev);
            setBouquet(response.data);
        } catch (error) {
            console.error("Error fetching bouquet:", error);
        }
    };

    const subgroupSetter = () => {
        if (bouquet.category) {
            setSubgroup(bouquet.category.toLowerCase());
        } else if (bouquet.collection) {
            setSubgroup(bouquet.collection.toLowerCase());
        } else {
            setSubgroup("subgroup");
        }
    };

    // const addToCart = (productID: string) => {
    //     const shoppingCart = localStorage.getItem("shoppingCart");
    //     const cartItems = shoppingCart ? JSON.parse(shoppingCart) : [];
    //     const existingItemIndex = cartItems.findIndex((item: Bouquet) => item.id === productID);
    //     if (existingItemIndex !== -1) {
    //         cartItems[existingItemIndex].quantity += 1;
    //     } else {
    //         const bouquetWithQuantity = { id: bouquet.id , quantity: 1 };
    //         cartItems.push(bouquetWithQuantity);
    //     }
    //     increase(productID);
    //     localStorage.setItem("shoppingCart", JSON.stringify(cartItems));
    // };

    useEffect(() => {
        id && fetchBouquet(id);
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        bouquet && subgroupSetter();
    }, [bouquet]);

    return (
        <div className="flex flex-col relative items-center h-screen w-screen">
            {bouquet.name && (
                <Breadcrumb
                    items={[
                        { label: `${t("breadcrumbs.home")}`, to: "/" },
                        { label: `${t("breadcrumbs.catalog")}`, to: "/Catalog" },
                        {
                            label: `${t(`breadcrumbs.subgroup.${subgroup}`)}`,
                            to: `/Catalog?filter=${subgroup}`,
                        },
                        { label: bouquet.name },
                    ]}
                />
            )}
            <div className="flex flex-row w-[85%] m-4">
                {/* <div className='w-[50%] flex justify-center items-start'>
                            <img className='w-[90%] aspect-square shadow-lg mx-4' src={bouquet.picture} alt={bouquet.name} />
                        </div> */}
                <img
                    className="w-[50%] aspect-square rounded shadow-lg mr-8"
                    src={bouquet.picture}
                    alt={bouquet.name}
                />

                <div className="flex flex-col w-[50%] ml-8">
                    <p className="mb-2 text-4xl uppercase">{bouquet.name}</p>
                    <p className="m-2 text-2xl">{bouquet.price} kr</p>
                    {/* <input type='number' min='1' max='10' step='1' value='1' className='border-1 border-solid' /> */}
                    <div className="w-full my-2 flex flex-row items-center">
                        <button className="w-[50%] flex flex-row items-center justify-center px-4 py-2 rounded cursor-pointer shadow-lg text-xl bg-[#edc7f5] hover:scale-105 transition-transform duration-300" onClick={() => addItem({
                                                                                                    id: bouquet.id,
                                                                                                    name: bouquet.name,
                                                                                                    picture: bouquet.picture,
                                                                                                    price: bouquet.price,
                                                                                                    quantity: 1
                                                                                                })}>
                            <BasketShopping3 className="mr-2"/>
                            {t("buttons.add_to_cart")}
                        </button>
                        {/* <button className='w-[45%] p-2 ml-6 border-1 border-solid cursor-pointer shadow-lg'>Order now</button> */}
                    </div>
                    <p className="text-lg uppercase mt-4">
                        {t("product_page.description")}
                    </p>
                    <p className="mt-2">{bouquet.description}</p>
                </div>
            </div>
        </div>
    );
};

export default Product;
