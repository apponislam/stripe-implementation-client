"use client";

import { useGetMyOrdersQuery } from "@/redux/features/order/orderApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Calendar, CreditCard, ArrowRight, ShoppingBag, Home, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TrackOrderModal } from "./orders/track-order-modal";

interface Product {
    _id: string;
    name: string;
    price: number;
    discountPrice?: number;
    images?: string[];
    description: string;
    category: string;
    stock: number;
}

interface OrderItem {
    _id: string;
    productId: Product;
    quantity: number;
}

interface Order {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
    };
    items: OrderItem[];
    totalAmount: number;
    paymentStatus: "pending" | "completed" | "failed" | "refunded";
    paymentMethod: string;
    orderStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
    stripeSessionId?: string;
    stripePaymentIntentId?: string;
    createdAt: string;
    updatedAt: string;
}

interface OrdersResponse {
    orders: Order[];
    total: number;
    page: number;
    totalPages: number;
}

export interface ApiResponse {
    success: boolean;
    message: string;
    data: OrdersResponse; // The data contains OrdersResponse
}

const MyOrders = () => {
    const { data, isLoading, error } = useGetMyOrdersQuery({ page: 1, limit: 10 });
    const router = useRouter();

    const ordersData = data?.data;
    const orders = ordersData?.orders || [];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
            case "delivered":
                return "bg-green-100 text-green-800 border-green-200";
            case "confirmed":
            case "processing":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "shipped":
                return "bg-amber-100 text-amber-800 border-amber-200";
            case "pending":
                return "bg-gray-100 text-gray-800 border-gray-200";
            case "failed":
            case "cancelled":
                return "bg-destructive/10 text-destructive border-destructive/20";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800 border-green-200";
            case "pending":
                return "bg-amber-100 text-amber-800 border-amber-200";
            case "failed":
                return "bg-destructive/10 text-destructive border-destructive/20";
            case "refunded":
                return "bg-purple-100 text-purple-800 border-purple-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatAmount = (amount: number) => {
        return amount.toFixed(2);
    };

    const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
    const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);

    // ... existing code ...

    const handleTrackOrder = (order: Order) => {
        setTrackingOrder(order);
        setIsTrackModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto p-6 max-w-4xl">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="overflow-hidden">
                            <CardHeader>
                                <Skeleton className="h-6 w-64" />
                                <Skeleton className="h-4 w-32" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-20 w-full" />
                            </CardContent>
                            <CardFooter>
                                <Skeleton className="h-10 w-full" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-6 max-w-4xl text-center">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-8">
                    <Package className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-destructive mb-2">Failed to load orders</h2>
                    <p className="text-muted-foreground mb-4">Please try again later</p>
                    <Button onClick={() => window.location.reload()} variant="outline">
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Package className="h-8 w-8" />
                        My Orders
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {orders.length} order{orders.length !== 1 ? "s" : ""} found
                    </p>
                </div>
                <Button onClick={() => router.push("/products")} variant="outline" className="gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Continue Shopping
                </Button>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-16 space-y-6">
                    <Package className="h-24 w-24 mx-auto text-muted-foreground opacity-50" />
                    <h2 className="text-2xl font-semibold text-muted-foreground">No orders yet</h2>
                    <p className="text-muted-foreground">Start shopping to see your orders here</p>
                    <div className="space-x-4">
                        <Button onClick={() => router.push("/products")} size="lg" className="gap-2">
                            <ShoppingBag className="h-4 w-4" />
                            Browse Products
                        </Button>
                        <Button onClick={() => router.push("/")} variant="outline" className="gap-2">
                            <Home className="h-4 w-4" />
                            Go Home
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <Card key={order._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <CardHeader className="bg-muted/50">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            Order #{order._id.slice(-8).toUpperCase()}
                                            <Badge variant="outline" className={getStatusColor(order.orderStatus)}>
                                                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                            </Badge>
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-2 mt-2">
                                            <Calendar className="h-4 w-4" />
                                            {formatDate(order.createdAt)}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className={getPaymentStatusColor(order.paymentStatus)}>
                                            <CreditCard className="h-3 w-3 mr-1" />
                                            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                        </Badge>
                                        <span className="text-lg font-semibold">${formatAmount(order.totalAmount)}</span>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {order.items.map((item) => {
                                        const product = item.productId;
                                        const price = product.discountPrice || product.price;
                                        const firstImage = product.images?.[0] || "/placeholder-product.jpg";

                                        return (
                                            <div key={item._id} className="flex items-center gap-4 p-3 border rounded-lg">
                                                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                                                    <Image src={firstImage} alt={product.name} fill className="object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-sm truncate">{product.name}</h4>
                                                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                                    <p className="text-sm font-medium">${price.toFixed(2)} each</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">${(price * item.quantity).toFixed(2)}</p>
                                                    {product.discountPrice && <p className="text-xs text-muted-foreground line-through">${(product.price * item.quantity).toFixed(2)}</p>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <Separator className="my-4" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <h4 className="font-semibold mb-2">Payment Information</h4>
                                        <p>Method: {order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}</p>
                                        <p>Status: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}</p>
                                        {order.stripePaymentIntentId && <p className="text-xs text-muted-foreground truncate">Transaction: {order.stripePaymentIntentId}</p>}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">Order Summary</h4>
                                        <div className="flex justify-between">
                                            <span>Items ({order.items.length})</span>
                                            <span>${formatAmount(order.totalAmount)}</span>
                                        </div>
                                        <div className="flex justify-between text-green-600">
                                            <span>Discounts</span>
                                            <span>
                                                -$
                                                {formatAmount(
                                                    order.items.reduce((total, item) => {
                                                        const product = item.productId;
                                                        if (product.discountPrice) {
                                                            return total + (product.price - product.discountPrice) * item.quantity;
                                                        }
                                                        return total;
                                                    }, 0)
                                                )}
                                            </span>
                                        </div>
                                        <Separator className="my-2" />
                                        <div className="flex justify-between font-semibold">
                                            <span>Total</span>
                                            <span>${formatAmount(order.totalAmount)}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="bg-muted/30 flex justify-between">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/orders/${order._id}`}>
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Details
                                    </Link>
                                </Button>
                                <TrackOrderModal open={isTrackModalOpen} onOpenChange={setIsTrackModalOpen} order={trackingOrder || { _id: "", orderStatus: "pending", createdAt: "", updatedAt: "" }} />
                                <Button size="sm" className="gap-2" onClick={() => handleTrackOrder(order)}>
                                    Track Order
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination (if you have multiple pages) */}
            {ordersData && ordersData.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" disabled={ordersData.page === 1}>
                            Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Page {ordersData.page} of {ordersData.totalPages}
                        </span>
                        <Button variant="outline" size="sm" disabled={ordersData.page === ordersData.totalPages}>
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyOrders;
