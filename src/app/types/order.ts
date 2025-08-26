export interface IOrderItem {
    _id: string;
    productId: {
        _id: string;
        name: string;
        price: number;
        discountPrice?: number;
        images: string[];
    };
    quantity: number;
}

// export interface IOrder {
//     _id?: string;
//     orderId: string;
//     userId: {
//         _id: string;
//         name: string;
//         email: string;
//     };
//     items: IOrderItem[];
//     totalAmount: number;
//     discountAmount?: number;
//     finalAmount: number;
//     paymentStatus: "pending" | "completed" | "failed" | "refunded";
//     paymentMethod: "stripe";
//     stripeSessionId?: string;
//     stripePaymentIntentId?: string;
//     orderStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
//     createdAt?: Date;
//     updatedAt?: Date;
// }
export interface IOrder {
    _id: string;
    orderId?: string;
    userId: {
        _id: string;
        name: string;
        email: string;
    };
    items: IOrderItem[];
    totalAmount: number;
    finalAmount?: number;
    paymentStatus: string;
    paymentMethod: string;
    orderStatus: string;
    stripeSessionId: string;
    createdAt: string;
    updatedAt: string;
}

// Response types from backend
export interface TOrdersResponse {
    success: boolean;
    message: string;
    data: IOrder[];
    meta?: {
        page: number;
        limit: number;
        total: number;
    };
}

export interface TSingleOrderResponse {
    success: boolean;
    message: string;
    data: IOrder;
}

export interface TCheckoutSessionResponse {
    success: boolean;
    message: string;
    data: {
        sessionId: string;
        url: string;
        orderId: string;
    };
}

export interface TCreateCheckoutSessionRequest {
    items: Array<{
        productId: string;
        quantity: number;
    }>;
}
