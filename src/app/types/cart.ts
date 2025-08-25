export interface ICartItem {
    productId: string;
    quantity: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface ICart {
    userId: string;
    items: ICartItem[];
    createdAt?: string;
    updatedAt?: string;
}
