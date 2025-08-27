"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, ArrowLeft, Plus, Minus, CreditCard } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useGetProductByIdQuery } from "@/redux/features/product/productApi";
import { useAddToCartMutation } from "@/redux/features/cart/cartApi";
import { toast } from "sonner";
import { useState } from "react";
import { useCreateCheckoutSessionMutation } from "@/redux/features/order/orderApi";

const ProductPage = () => {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
    const { data, error, isLoading } = useGetProductByIdQuery(productId);
    const product = data?.data || null;

    const handleAddToCart = async () => {
        if (!product) return;

        try {
            await addToCart({
                productId: product._id,
                quantity,
            }).unwrap();

            toast.success(`${quantity} ${product.name} has been added to your cart.`);
        } catch (error) {
            toast.error("Failed to add to cart. Please try again.");
            console.error("Add to cart error:", error);
        }
    };

    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [createCheckoutSession] = useCreateCheckoutSessionMutation();

    // const handleDirectCheckout = async () => {
    //     if (!product) return;

    //     try {
    //         await addToCart({
    //             productId: product._id,
    //             quantity,
    //         }).unwrap();

    //         toast.success(`${quantity} ${product.name} added to cart. Redirecting to checkout...`);
    //         router.push("/checkout");
    //     } catch (error) {
    //         toast.error("Failed to proceed to checkout. Please try again.");
    //         console.error("Checkout error:", error);
    //     }
    // };

    const handleDirectCheckout = async () => {
        if (!product) return;

        setIsCheckingOut(true);
        try {
            // Prepare item for checkout
            const checkoutItem = {
                productId: product._id,
                quantity: quantity,
            };

            // Create checkout session
            const result = await createCheckoutSession({
                items: [checkoutItem],
            }).unwrap();

            if (result.success && result.data?.url) {
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

    const handleAddToWishlist = () => {
        if (!product) return;
        toast.success(`${product.name} has been added to your wishlist.`);
    };

    const increaseQuantity = () => {
        if (product && quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleThumbnailClick = (index: number) => {
        setSelectedImageIndex(index);
    };

    const selectedImage = product?.images?.[selectedImageIndex] || "/placeholder-image.jpg";

    if (isLoading) {
        return (
            <div className="container mx-auto p-4 md:p-6">
                <Button variant="ghost" onClick={() => router.back()} className="mb-6">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Products
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Image skeleton */}
                    <div className="space-y-4">
                        <Skeleton className="h-96 w-full rounded-lg" />
                        <div className="grid grid-cols-4 gap-2">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="h-20 w-full rounded-md" />
                            ))}
                        </div>
                    </div>

                    {/* Content skeleton */}
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <div className="flex gap-2 pt-4">
                            <Skeleton className="h-10 w-32" />
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container mx-auto p-6">
                <Button variant="ghost" onClick={() => router.back()} className="mb-6">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Products
                </Button>

                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h2>
                    <p className="text-gray-600 mb-6">{error ? ("status" in error ? error.status : "An error occurred") : "The product you're looking for doesn't exist."}</p>
                    <Button onClick={() => router.push("/products")}>Browse Products</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-6">
            {/* Back button */}
            <Button variant="ghost" onClick={() => router.back()} className="mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Images */}
                <div>
                    <div className="relative h-96 w-full overflow-hidden rounded-lg mb-4">
                        <Image src={selectedImage} alt={product.name} fill className="object-cover" priority />
                        {/* Discount badge */}
                        {product.discountPrice && product.discountPrice < product.price && (
                            <Badge variant="destructive" className="absolute top-4 left-4">
                                {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                            </Badge>
                        )}
                    </div>

                    {/* Thumbnail gallery */}
                    {product.images && product.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                            {product.images.map((image, index) => (
                                <div key={index} className={`relative h-20 w-full overflow-hidden rounded-md cursor-pointer border-2 transition-all ${selectedImageIndex === index ? "border-primary ring-2 ring-primary ring-opacity-50" : "border-transparent hover:border-gray-300"}`} onClick={() => handleThumbnailClick(index)}>
                                    <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" sizes="(max-width: 768px) 25vw, 20vw" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                        <p className="text-gray-600">{product.category}</p>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                        {product.discountPrice && product.discountPrice < product.price ? (
                            <>
                                <span className="text-3xl font-bold text-primary">${product.discountPrice}</span>
                                <span className="text-lg text-gray-500 line-through">${product.price}</span>
                            </>
                        ) : (
                            <span className="text-3xl font-bold text-primary">${product.price}</span>
                        )}
                    </div>

                    {/* Stock status */}
                    <div>
                        <Badge variant={product.stock > 0 ? "default" : "destructive"}>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</Badge>
                    </div>

                    {/* Quantity Selector */}
                    {product.stock > 0 && (
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium">Quantity:</span>
                            <div className="flex items-center border rounded-md bg-white">
                                <Button variant="ghost" size="icon" onClick={decreaseQuantity} disabled={quantity <= 1} className="h-10 w-10">
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                                <Button variant="ghost" size="icon" onClick={increaseQuantity} disabled={quantity >= product.stock} className="h-10 w-10">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <span className="text-sm text-gray-500">Max: {product.stock}</span>
                        </div>
                    )}

                    {/* Total Price */}
                    {product.stock > 0 && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-gray-800">Total:</span>
                                <span className="text-2xl font-bold text-primary">${((product.discountPrice || product.price) * quantity).toFixed(2)}</span>
                            </div>
                        </div>
                    )}

                    {/* Action buttons */}
                    {product.stock > 0 && (
                        <div className="flex flex-col gap-3 pt-4">
                            <div className="grid grid-cols-2 gap-3">
                                <Button onClick={handleAddToCart} disabled={isAddingToCart} className="flex-1" size="lg" variant="outline">
                                    <ShoppingCart className="h-5 w-5 mr-2" />
                                    {isAddingToCart ? "Adding..." : "Add to Cart"}
                                </Button>

                                {/* <Button onClick={handleDirectCheckout} disabled={isAddingToCart} className="flex-1" size="lg">
                                    <CreditCard className="h-5 w-5 mr-2" />
                                    Buy Now
                                </Button> */}
                                <Button onClick={handleDirectCheckout} disabled={isCheckingOut} className="flex-1" size="lg">
                                    <CreditCard className="h-5 w-5 mr-2" />
                                    Buy Now
                                </Button>
                            </div>

                            <Button variant="secondary" onClick={handleAddToWishlist} disabled={isAddingToCart} size="lg">
                                <Heart className="h-5 w-5 mr-2" />
                                Add to Wishlist
                            </Button>
                        </div>
                    )}

                    {/* Description */}
                    <div className="pt-4">
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        <p className="text-gray-700 leading-relaxed">{product.description}</p>
                    </div>

                    {/* Tags */}
                    {product.tags && product.tags.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="px-3 py-1">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Additional info */}
                    <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-semibold mb-3">Product Information</h3>
                        <div className="text-sm text-gray-600 space-y-2">
                            <p>
                                <span className="font-medium">SKU:</span> {product._id}
                            </p>
                            <p>
                                <span className="font-medium">Category:</span> {product.category || "N/A"}
                            </p>
                            {product.createdAt && (
                                <p>
                                    <span className="font-medium">Added:</span> {new Date(product.createdAt).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
