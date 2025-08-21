export interface IProduct {
    _id: string;
    userId: string;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    category?: string;
    tags: string[];
    images: string[];
    stock: number;
    quantity?: number;
    createdAt?: string;
    updatedAt?: string;
}
