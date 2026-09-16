export interface SpecialProps {
    setting: string;
}

export interface ProductMini {
    productID: string;
    name: string;
    picture: string;
    price: number;
}

export interface Product {
    productID: string;
    sku: string;
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
