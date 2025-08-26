"use client";

import { useDownloadInvoiceHTMLMutation, useDownloadInvoiceMutation, useGetOrderByIdQuery } from "@/redux/features/order/orderApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Truck, CheckCircle, Clock, ArrowLeft, Download, Home, ShoppingBag, Loader2 } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";

interface OrderItem {
    _id: string;
    productId: {
        _id: string;
        name: string;
        price: number;
        discountPrice?: number;
        images: string[];
        description: string;
        category: string;
        stock: number;
    };
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
    finalAmount?: number;
    paymentStatus: "pending" | "completed" | "failed" | "refunded";
    paymentMethod: string;
    orderStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
    stripeSessionId?: string;
    stripePaymentIntentId?: string;
    createdAt: string;
    updatedAt: string;
}

export default function OrderDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params as { id: string };
    const { data, isLoading, error } = useGetOrderByIdQuery(id);

    const order = data?.data as Order;
    console.log(order);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "processing":
            case "confirmed":
                return <Package className="h-5 w-5" />;
            case "shipped":
                return <Truck className="h-5 w-5" />;
            case "delivered":
                return <CheckCircle className="h-5 w-5" />;
            case "cancelled":
                return <Clock className="h-5 w-5" />;
            default:
                return <Clock className="h-5 w-5" />;
        }
    };

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

    // const [downloadInvoice, { isLoading: isPdfLoading }] = useDownloadInvoiceMutation();

    // const handleDownloadPDF = async () => {
    //     if (!order?._id) return;

    //     try {
    //         const blob = await downloadInvoice(order._id).unwrap();
    //         const url = window.URL.createObjectURL(blob);
    //         const a = document.createElement("a");
    //         a.href = url;
    //         a.download = `invoice-${order._id}.pdf`;
    //         document.body.appendChild(a);
    //         a.click();
    //         window.URL.revokeObjectURL(url);
    //         document.body.removeChild(a);
    //     } catch (error) {
    //         console.error("PDF download failed:", error);
    //     }
    // };

    const [downloadInvoice, { isLoading: isPdfLoading }] = useDownloadInvoiceMutation();

    const handleDownloadPDF = () => {
        if (!order?._id) return;
        downloadInvoice(order._id);
    };

    const [downloadInvoiceHTML, { isLoading: isHtmlLoading }] = useDownloadInvoiceHTMLMutation();

    const handleDownloadHTML = async () => {
        if (!order?._id) return;

        try {
            const htmlText = await downloadInvoiceHTML(order._id).unwrap();

            // download as file
            const blob = new Blob([htmlText], { type: "text/html" });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `invoice-${order._id}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed:", err);
        }
    };

    // const handleDownloadInvoice = () => {
    //     console.log("Download invoice for order:", order?._id);
    //     // Implement invoice download logic here
    // };

    if (isLoading) {
        return (
            <div className="container mx-auto p-6 max-w-4xl">
                <div className="space-y-6">
                    <Skeleton className="h-8 w-48" />
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-64" />
                            <Skeleton className="h-4 w-32" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-32 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="container mx-auto p-6 max-w-4xl text-center">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-8">
                    <Package className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-destructive mb-2">Order Not Found</h2>
                    <p className="text-muted-foreground mb-4">The order you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.</p>
                    <div className="space-x-4">
                        <Button onClick={() => router.push("/orders")} variant="outline">
                            View All Orders
                        </Button>
                        <Button onClick={() => router.push("/")}>Go Home</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => router.push("/orders")} className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Orders
                    </Button>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Package className="h-8 w-8" />
                        Order Details
                    </h1>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-2">
                    Order #{order._id.slice(-8).toUpperCase()}
                </Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Order Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Order Summary
                        </CardTitle>
                        <CardDescription>Details of your purchase</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1">
                                <p className="text-muted-foreground">Order Date</p>
                                <p className="font-medium">{format(new Date(order.createdAt), "PPP")}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-muted-foreground">Last Updated</p>
                                <p className="font-medium">{format(new Date(order.updatedAt), "PPP")}</p>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <p className="text-muted-foreground">Items ({order.items.length})</p>
                            {order.items.map((item) => {
                                const product = item.productId;
                                const price = product.discountPrice || product.price;
                                const firstImage = product.images?.[0] || "/placeholder-product.jpg";

                                return (
                                    <div key={item._id} className="flex justify-between items-start py-2">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                                                <Image src={firstImage} alt={product.name} width={64} height={64} className="object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{product.name}</p>
                                                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                                <p className="text-sm font-medium">${price.toFixed(2)} each</p>
                                            </div>
                                        </div>
                                        <p className="font-medium text-lg">${(price * item.quantity).toFixed(2)}</p>
                                    </div>
                                );
                            })}
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${order.totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-green-600">
                                <span>Discount</span>
                                <span>
                                    -$
                                    {order.items
                                        .reduce((total, item) => {
                                            const product = item.productId;
                                            if (product.discountPrice) {
                                                return total + (product.price - product.discountPrice) * item.quantity;
                                            }
                                            return total;
                                        }, 0)
                                        .toFixed(2)}
                                </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>${order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </CardContent>
                    {/* <CardFooter>
                        <Button onClick={handleDownloadPDF} disabled={isPdfLoading} className="w-full" variant="outline">
                            {isPdfLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                            Download PDF Invoice
                        </Button>
                    </CardFooter> */}
                    <CardFooter className="flex flex-col gap-3">
                        <Button onClick={handleDownloadPDF} disabled={isPdfLoading} className="w-full" variant="outline">
                            {isPdfLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                            Download PDF Invoice
                        </Button>

                        <Button onClick={handleDownloadHTML} disabled={isHtmlLoading} className="w-full" variant="outline">
                            {isHtmlLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                            Download HTML Invoice
                        </Button>
                    </CardFooter>
                </Card>

                {/* Order Status & Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {getStatusIcon(order.orderStatus)}
                            Order Status & Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Badge className={`px-3 py-1 text-sm ${getStatusColor(order.orderStatus)}`}>{order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}</Badge>
                            <p className="text-sm text-muted-foreground">Your order is currently being processed. You will receive updates via email.</p>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <h4 className="font-semibold">Payment Information</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Payment Status</p>
                                    <Badge variant="outline" className={getPaymentStatusColor(order.paymentStatus)}>
                                        {order.paymentStatus}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Payment Method</p>
                                    <p className="font-medium capitalize">{order.paymentMethod}</p>
                                </div>
                            </div>
                            {order.stripePaymentIntentId && <p className="text-xs text-muted-foreground break-all">Transaction ID: {order.stripePaymentIntentId}</p>}
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
                            <h4 className="font-semibold">Order Timeline</h4>
                            <div className="text-sm space-y-2 text-muted-foreground">
                                <div className="flex justify-between">
                                    <span>Order Placed</span>
                                    <span>{format(new Date(order.createdAt), "MMM dd, yyyy")}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Last Updated</span>
                                    <span>{format(new Date(order.updatedAt), "MMM dd, yyyy")}</span>
                                </div>
                            </div>
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
