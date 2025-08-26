"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, ShoppingBag, Download, Home, Package, Truck, Clock, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useDownloadInvoiceMutation, useGetOrderBySessionIdQuery } from "@/redux/features/order/orderApi";

interface OrderItem {
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

interface Order {
    _id: string;
    orderId?: string;
    userId: {
        _id: string;
        name: string;
        email: string;
    };
    items: OrderItem[];
    totalAmount: number;
    finalAmount?: number;
    paymentStatus: string;
    paymentMethod: string;
    orderStatus: string;
    stripeSessionId: string;
    createdAt: string;
    updatedAt: string;
}

export default function OrderSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");

    const { data, isLoading, error } = useGetOrderBySessionIdQuery(sessionId as string, {
        skip: !sessionId,
    });

    const [order, setOrder] = useState<Order | null>(null);

    console.log(data);

    useEffect(() => {
        if (data?.success && data.data) {
            // Remove the ApiResponse interface and use direct type assertion
            setOrder(data.data as Order);
        }
    }, [data]);

    const [downloadInvoice, { isLoading: isPdfLoading }] = useDownloadInvoiceMutation();

    const handleDownloadPDF = () => {
        if (!order?._id) return;
        downloadInvoice(order._id);
    };

    const getOrderStatusIcon = (status: string) => {
        switch (status) {
            case "processing":
                return <Package className="h-5 w-5" />;
            case "shipped":
                return <Truck className="h-5 w-5" />;
            case "delivered":
                return <CheckCircle className="h-5 w-5" />;
            default:
                return <Clock className="h-5 w-5" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800";
            case "processing":
                return "bg-blue-100 text-blue-800";
            case "shipped":
                return "bg-amber-100 text-amber-800";
            case "delivered":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // Safe amount formatting
    const formatAmount = (amount: number | undefined) => {
        if (amount === undefined || amount === null) return "0.00";
        return amount.toFixed(2);
    };

    // Calculate item total with discount support
    const calculateItemTotal = (item: OrderItem) => {
        const price = item.productId.discountPrice || item.productId.price;
        return (price * item.quantity).toFixed(2);
    };

    // Generate order ID from timestamp if orderId doesn't exist
    const getDisplayOrderId = () => {
        if (order?.orderId) return order.orderId;
        if (order?._id) return `ORD-${order._id.slice(-8).toUpperCase()}`;
        return "N/A";
    };

    if (isLoading) {
        return (
            <div className="container mx-auto p-6 max-w-4xl">
                <div className="text-center space-y-6">
                    <Skeleton className="h-12 w-12 mx-auto rounded-full" />
                    <Skeleton className="h-8 w-64 mx-auto" />
                    <Skeleton className="h-4 w-96 mx-auto" />
                    <div className="grid gap-6 mt-8">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="container mx-auto p-6 max-w-4xl">
                <div className="text-center space-y-6">
                    <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto">
                        <ShoppingBag className="h-8 w-8 text-destructive" />
                    </div>
                    <h1 className="text-3xl font-bold text-destructive">Order Not Found</h1>
                    <p className="text-muted-foreground">We couldn&apos;t find your order details. Please try again later.</p>
                    <div className="flex gap-4 justify-center">
                        <Button onClick={() => router.push("/")}>
                            <Home className="h-4 w-4 mr-2" />
                            Go Home
                        </Button>
                        <Button variant="outline" onClick={() => router.push("/products")}>
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            Continue Shopping
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            {/* Header Section */}
            <div className="text-center space-y-4 mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="text-4xl font-bold text-green-600">Order Confirmed!</h1>
                <p className="text-muted-foreground text-lg">Thank you for your purchase, {order.userId.name}. Your order has been confirmed.</p>
                <Badge variant="outline" className="text-sm px-4 py-1">
                    Order ID: {getDisplayOrderId()}
                </Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Order Summary Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5" />
                            Order Summary
                        </CardTitle>
                        <CardDescription>Details of your purchase</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1">
                                <p className="text-muted-foreground">Order Date</p>
                                <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-muted-foreground">Total Amount</p>
                                <p className="font-medium text-2xl text-green-600">${formatAmount(order.totalAmount)}</p>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <p className="text-muted-foreground">Items ({order.items.length})</p>
                            {order.items.map((item) => {
                                const productPrice = item.productId.discountPrice || item.productId.price;
                                const originalPrice = item.productId.discountPrice ? item.productId.price : null;

                                return (
                                    <div key={item._id} className="flex justify-between items-start py-2">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">{item.productId.images && item.productId.images.length > 0 ? <Image src={item.productId.images[0]} alt={item.productId.name} width={64} height={64} className="object-cover" /> : <Package className="h-6 w-6 text-muted-foreground" />}</div>
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{item.productId.name}</p>
                                                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="font-medium text-sm">${productPrice.toFixed(2)}</span>
                                                    {originalPrice && <span className="text-xs text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="font-medium text-lg">${calculateItemTotal(item)}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleDownloadPDF} disabled={isPdfLoading} className="w-full" variant="outline">
                            {isPdfLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                            Download PDF Invoice
                        </Button>
                    </CardFooter>
                </Card>

                {/* Order Status & Actions Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {getOrderStatusIcon(order.orderStatus)}
                            Order Status
                        </CardTitle>
                        <CardDescription>Current status of your order</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Badge className={`px-3 py-1 ${getStatusColor(order.orderStatus)}`}>{order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}</Badge>
                            <p className="text-sm text-muted-foreground">Your order is currently being processed. You will receive updates via email.</p>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <h4 className="font-semibold">Payment Information</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Payment Status</p>
                                    <Badge variant={order.paymentStatus === "completed" ? "default" : "secondary"}>{order.paymentStatus}</Badge>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Payment Method</p>
                                    <p className="font-medium capitalize">{order.paymentMethod}</p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <h4 className="font-semibold">Customer Information</h4>
                            <div className="text-sm space-y-1">
                                <p>
                                    <span className="text-muted-foreground">Name:</span> {order.userId.name}
                                </p>
                                <p>
                                    <span className="text-muted-foreground">Email:</span> {order.userId.email}
                                </p>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <h4 className="font-semibold">Next Steps</h4>
                            <ul className="text-sm space-y-1 text-muted-foreground">
                                <li>• You will receive a confirmation email shortly</li>
                                <li>• Order will be processed within 24 hours</li>
                                <li>• Tracking information will be sent via email</li>
                            </ul>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3">
                        <Button className="w-full" onClick={() => router.push("/products")}>
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            Continue Shopping
                        </Button>
                        <Button className="w-full" variant="outline" onClick={() => router.push("/orders")}>
                            <Package className="h-4 w-4 mr-2" />
                            View All Orders
                        </Button>
                        <Button className="w-full" variant="ghost" onClick={() => router.push("/")}>
                            <Home className="h-4 w-4 mr-2" />
                            Go to Homepage
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
