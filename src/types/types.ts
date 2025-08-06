export interface SpecialProps {
    setting: string;
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
    category: string;
    collection: string;
    description: string;
    picture: string;
    price: number;
    contents: string[];
}

export interface CollectionMini {
    id: string;
    name: string;
    picture: string;
}

type Crumb = {
    label: string;
    to?: string;
};

export interface BreadcrumbProps {
    items: Crumb[];
}
