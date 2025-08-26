"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveFromCartMutation, useClearCartMutation } from "@/redux/features/cart/cartApi";
import { useCreateCheckoutSessionMutation } from "@/redux/features/order/orderApi";
import { ShoppingCart, Plus, Minus, Trash2, Loader2, ArrowLeft, ShoppingBag, AlertCircle, CreditCard } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

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

interface CartItem {
    _id: string;
    productId: Product;
    quantity: number;
    createdAt: string;
    updatedAt: string;
}

interface CartData {
    _id: string;
    userId: string;
    items: CartItem[];
    createdAt: string;
    updatedAt: string;
}

export default function CartPage() {
    const router = useRouter();
    const { data: cartData, isLoading, error, refetch } = useGetCartQuery();
    const [updateCartItem] = useUpdateCartItemMutation();
    const [removeFromCart] = useRemoveFromCartMutation();
    const [clearCart] = useClearCartMutation();
    const [createCheckoutSession] = useCreateCheckoutSessionMutation();
    const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isClearing, setIsClearing] = useState(false);

    const cart = cartData?.data as CartData | undefined;
    const items = cart?.items || [];

    // Calculate totals
    const totalPrice = items.reduce((total, item) => {
        const price = item.productId.discountPrice || item.productId.price;
        return total + price * item.quantity;
    }, 0);

    const totalSavings = items.reduce((savings, item) => {
        if (item.productId.discountPrice) {
            return savings + (item.productId.price - item.productId.discountPrice) * item.quantity;
        }
        return savings;
    }, 0);

    const totalItems = items.reduce((total, item) => total + item.quantity, 0);

    const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        setUpdatingItems((prev) => new Set(prev).add(productId));
        try {
            await updateCartItem({ productId, quantity: newQuantity }).unwrap();
            toast.success("Quantity updated");
        } catch (error) {
            console.log(error);
            toast.error("Failed to update quantity");
        } finally {
            setUpdatingItems((prev) => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                return newSet;
            });
        }
    };

    const handleRemoveItem = async (productId: string) => {
        setUpdatingItems((prev) => new Set(prev).add(productId));
        try {
            await removeFromCart(productId).unwrap();
            toast.success("Item removed from cart");
        } catch (error) {
            console.log(error);
            toast.error("Failed to remove item");
        } finally {
            setUpdatingItems((prev) => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                return newSet;
            });
        }
    };

    const handleClearCart = async () => {
        setIsClearing(true);
        try {
            await clearCart().unwrap();
            toast.success("Cart cleared");
        } catch (error) {
            console.log(error);
            toast.error("Failed to clear cart");
        } finally {
            setIsClearing(false);
        }
    };

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        try {
            const checkoutItems = items.map((item) => ({
                productId: item.productId._id,
                quantity: item.quantity,
            }));

            const result = await createCheckoutSession({ items: checkoutItems }).unwrap();

            if (result.success && result.data?.url) {
                await clearCart().unwrap();
                window.location.href = result.data.url;
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsCheckingOut(false);
        }
    };

    const isOutOfStock = items.some((item) => item.productId.stock === 0);
    const isEmpty = items.length === 0;

    if (isLoading) {
        return (
            <div className="container mx-auto p-3 md:p-6 max-w-6xl">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items Skeleton */}
                    <div className="flex-1 space-y-6">
                        <Skeleton className="h-8 w-48" />
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-4 p-4 border rounded-lg">
                                <Skeleton className="h-20 w-20 rounded-md" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-8 w-24" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary Skeleton */}
                    <div className="lg:w-80 space-y-4">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-3 md:p-6 max-w-4xl text-center">
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error Loading Cart</AlertTitle>
                    <AlertDescription>Failed to load your cart. Please try again.</AlertDescription>
                </Alert>
                <Button onClick={() => refetch()} variant="outline">
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-3 md:p-6 max-w-6xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                    <h1 className=" text-xl md:text-3xl font-bold flex items-center gap-3">
                        <ShoppingCart className="md:h-8 md:w-8" />
                        Shopping Cart
                    </h1>
                </div>

                {!isEmpty && (
                    <Badge variant="secondary" className="md:text-lg px-4 py-2">
                        {totalItems} item{totalItems !== 1 ? "s" : ""}
                    </Badge>
                )}
            </div>

            {isEmpty ? (
                <div className="text-center py-16 space-y-6">
                    <ShoppingCart className="h-24 w-24 mx-auto text-muted-foreground opacity-50" />
                    <h2 className="text-2xl font-semibold text-muted-foreground">Your cart is empty</h2>
                    <p className="text-muted-foreground">Start shopping to add items to your cart</p>
                    <Button onClick={() => router.push("/products")} size="lg" className="gap-2">
                        <ShoppingBag className="h-4 w-4" />
                        Continue Shopping
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Cart Items ({items.length})</h2>
                            <Button variant="outline" size="sm" onClick={handleClearCart} disabled={isClearing}>
                                {isClearing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                                Clear Cart
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {items.map((item) => {
                                const price = item.productId.discountPrice || item.productId.price;
                                const isUpdating = updatingItems.has(item.productId._id);
                                const isOutOfStock = item.productId.stock === 0;
                                const firstImage = item.productId.images?.[0] || "/placeholder-product.jpg";

                                return (
                                    <Card key={item._id} className="overflow-hidden py-0">
                                        <CardContent className="p-4">
                                            <div className="flex gap-4">
                                                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                                                    <Image src={firstImage} alt={item.productId.name} fill className="object-cover" />
                                                    {isOutOfStock && (
                                                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                                                            <Badge variant="destructive" className="text-xs">
                                                                Out of stock
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 space-y-3">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h3 className="font-semibold text-lg">{item.productId.name}</h3>
                                                            <p className="text-sm text-muted-foreground line-clamp-2">{item.productId.description}</p>
                                                        </div>
                                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.productId._id)} disabled={isUpdating}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex items-center border rounded-md">
                                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleUpdateQuantity(item.productId._id, item.quantity - 1)} disabled={item.quantity <= 1 || isUpdating || isOutOfStock}>
                                                                    <Minus className="h-3 w-3" />
                                                                </Button>
                                                                <span className="w-8 text-center text-sm font-medium">{isUpdating ? "..." : item.quantity}</span>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleUpdateQuantity(item.productId._id, item.quantity + 1)} disabled={isUpdating || isOutOfStock || item.quantity >= item.productId.stock}>
                                                                    <Plus className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                            {item.quantity >= item.productId.stock && !isOutOfStock && <span className="text-xs text-destructive">Max: {item.productId.stock}</span>}
                                                        </div>

                                                        <div className="text-right">
                                                            <p className="text-lg font-semibold">${(price * item.quantity).toFixed(2)}</p>
                                                            {item.productId.discountPrice && <p className="text-sm text-muted-foreground line-through">${(item.productId.price * item.quantity).toFixed(2)}</p>}
                                                            <p className="text-sm text-muted-foreground">${price.toFixed(2)} each</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-96 space-y-6">
                        <Card className="py-4 md:py-6">
                            <CardHeader className="px-4 md:px-6">
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Order Summary
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4 px-4 md:px-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Subtotal ({totalItems} items)</span>
                                        <span>${totalPrice.toFixed(2)}</span>
                                    </div>

                                    {totalSavings > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discounts</span>
                                            <span>-${totalSavings.toFixed(2)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span>${totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>

                                {totalSavings > 0 && (
                                    <Alert className="bg-green-50 border-green-200">
                                        <AlertTitle className="text-green-800">You saved ${totalSavings.toFixed(2)}!</AlertTitle>
                                        <AlertDescription className="text-green-700">Great deals on selected items</AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>

                            <CardFooter className="px-4 md:px-6">
                                <Button size="lg" className="w-full" onClick={handleCheckout} disabled={isOutOfStock || isCheckingOut}>
                                    {isCheckingOut ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="mr-2 h-4 w-4" />
                                            Proceed to Checkout
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>

                        {isOutOfStock && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Out of Stock Items</AlertTitle>
                                <AlertDescription>Please remove out of stock items before checkout</AlertDescription>
                            </Alert>
                        )}

                        <Button variant="outline" className="w-full" onClick={() => router.push("/products")}>
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            Continue Shopping
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
