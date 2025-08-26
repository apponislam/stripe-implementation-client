"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveFromCartMutation, useClearCartMutation } from "@/redux/features/cart/cartApi";
import { useCreateCheckoutSessionMutation } from "@/redux/features/order/orderSlice";

import { ShoppingCart, X, Plus, Minus, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface CartDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

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

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
    const { data: cartData, isLoading, error } = useGetCartQuery();
    const [updateCartItem] = useUpdateCartItemMutation();
    const [removeFromCart] = useRemoveFromCartMutation();
    const [clearCart] = useClearCartMutation();
    const [createCheckoutSession] = useCreateCheckoutSessionMutation();
    const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const cart = cartData?.data as CartData | undefined;
    const items = cart?.items || [];

    // Calculate total price
    const totalPrice = items.reduce((total, item) => {
        const price = item.productId.discountPrice || item.productId.price;
        return total + price * item.quantity;
    }, 0);

    // Calculate total savings
    const totalSavings = items.reduce((savings, item) => {
        if (item.productId.discountPrice) {
            return savings + (item.productId.price - item.productId.discountPrice) * item.quantity;
        }
        return savings;
    }, 0);

    // Handle quantity update
    const handleUpdateQuantity = async (productId: string, currentQuantity: number, newQuantity: number) => {
        if (newQuantity < 1) return;

        setUpdatingItems((prev) => new Set(prev).add(productId));

        try {
            await updateCartItem({
                productId,
                quantity: newQuantity,
            }).unwrap();
        } catch (error) {
            console.error("Failed to update quantity:", error);
        } finally {
            setUpdatingItems((prev) => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                return newSet;
            });
        }
    };

    // Handle item removal
    const handleRemoveItem = async (productId: string) => {
        setUpdatingItems((prev) => new Set(prev).add(productId));

        try {
            await removeFromCart(productId).unwrap();
        } catch (error) {
            console.error("Failed to remove item:", error);
        } finally {
            setUpdatingItems((prev) => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                return newSet;
            });
        }
    };

    // Handle checkout
    const handleCheckout = async () => {
        setIsCheckingOut(true);
        try {
            // Prepare items for checkout
            const checkoutItems = items.map((item) => ({
                productId: item.productId._id,
                quantity: item.quantity,
            }));

            // Create checkout session
            const result = await createCheckoutSession({
                items: checkoutItems,
            }).unwrap();

            if (result.success && result.data?.url) {
                // Clear cart after successful session creation
                try {
                    await clearCart().unwrap();
                } catch (clearError) {
                    console.error("Failed to clear cart:", clearError);
                    // Continue with checkout even if cart clearing fails
                }

                // Redirect to Stripe checkout
                window.location.href = result.data.url;
            }
        } catch (error: any) {
            console.error("Checkout failed:", error);
            toast.error(error?.data?.message || "Failed to proceed to checkout. Please try again.");
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (error) {
        console.error("Cart error:", error);
    }

    const isOutOfStock = items.some((item) => item.productId.stock === 0);
    const isEmpty = items.length === 0;

    return (
        <Drawer open={open} onOpenChange={onOpenChange} direction="right">
            <DrawerContent className="h-full top-0 right-0 left-auto mt-0 w-[400px] rounded-none">
                <div className="h-full flex flex-col">
                    <DrawerHeader className="flex-shrink-0 border-b">
                        <div className="flex items-center justify-between">
                            <DrawerTitle className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5" />
                                Shopping Cart
                            </DrawerTitle>
                            <DrawerClose asChild>
                                <Button variant="ghost" size="icon">
                                    <X className="h-4 w-4" />
                                </Button>
                            </DrawerClose>
                        </div>
                        <DrawerDescription>
                            {items.length} item(s) in your cart
                            {totalSavings > 0 && ` · Saved $${totalSavings.toFixed(2)}`}
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="flex-1 overflow-y-auto p-4">
                        {isLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                <p>Loading your cart...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center text-destructive py-8">
                                <p>Failed to load cart</p>
                                <p className="text-sm mt-2">Please try again later</p>
                            </div>
                        ) : items.length === 0 ? (
                            <div className="text-center text-muted-foreground py-8">
                                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Your cart is empty</p>
                                <p className="text-sm mt-2">Start shopping to add items to your cart</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {items.map((item) => {
                                    const price = item.productId.discountPrice || item.productId.price;
                                    const isUpdating = updatingItems.has(item.productId._id);
                                    const isOutOfStock = item.productId.stock === 0;

                                    // Safely get the first image or use placeholder
                                    const firstImage = item.productId.images && item.productId.images.length > 0 ? item.productId.images[0] : "/placeholder-product.jpg";

                                    return (
                                        <div key={item._id} className="flex gap-4 p-3 border rounded-lg relative">
                                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                                                <Image src={firstImage} alt={item.productId.name} fill className="object-cover" />
                                                {isOutOfStock && (
                                                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                                                        <span className="text-xs font-medium text-destructive">Out of stock</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-1 flex-col">
                                                <div className="flex justify-between">
                                                    <h3 className="text-sm font-medium line-clamp-1">{item.productId.name}</h3>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveItem(item.productId._id)} disabled={isUpdating}>
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>

                                                <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{item.productId.description}</p>

                                                <div className="mt-2 flex items-center justify-between">
                                                    <div className="flex items-center border rounded-md">
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none" onClick={() => handleUpdateQuantity(item.productId._id, item.quantity, item.quantity - 1)} disabled={item.quantity <= 1 || isUpdating || isOutOfStock}>
                                                            <Minus className="h-3 w-3" />
                                                        </Button>

                                                        <span className="w-8 text-center text-sm">{isUpdating ? "..." : item.quantity}</span>

                                                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none" onClick={() => handleUpdateQuantity(item.productId._id, item.quantity, item.quantity + 1)} disabled={isUpdating || isOutOfStock || item.quantity >= item.productId.stock}>
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>

                                                    <div className="flex flex-col items-end">
                                                        <p className="text-sm font-medium">${(price * item.quantity).toFixed(2)}</p>
                                                        {item.productId.discountPrice && <p className="text-xs text-muted-foreground line-through">${(item.productId.price * item.quantity).toFixed(2)}</p>}
                                                    </div>
                                                </div>

                                                {item.quantity >= item.productId.stock && !isOutOfStock && <p className="text-xs text-destructive mt-1">Maximum available: {item.productId.stock}</p>}
                                            </div>

                                            {isUpdating && (
                                                <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {items.length > 0 && (
                        <DrawerFooter className="flex-shrink-0 border-t">
                            <div className="space-y-2">
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total:</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>

                                {totalSavings > 0 && <p className="text-sm text-green-600">You saved ${totalSavings.toFixed(2)}!</p>}

                                <Button size="lg" className="w-full" onClick={handleCheckout} disabled={isOutOfStock || isCheckingOut || isEmpty}>
                                    {isCheckingOut ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Proceed to Checkout"
                                    )}
                                </Button>

                                {isOutOfStock && <p className="text-xs text-destructive text-center">Please remove out of stock items before checkout</p>}
                            </div>
                        </DrawerFooter>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
}
