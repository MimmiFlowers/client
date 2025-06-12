export interface SpecialProps {
    setting: string
}

export interface BouquetMini {
    id: string;
    name: string;
    picture: string;
    price: number;
}

export interface Bouquet {
    id: string;
    name: string;
    description: string;
    picture: string;
    price: number;
    flowers: string[];
}

export interface CollectionMini {
    id: string;
    name: string;
    picture: string;
}