"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, ArrowLeft, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useGetProductByIdQuery } from "@/redux/features/product/productApi";
import { useAddToCartMutation } from "@/redux/features/cart/cartApi"; // Added this import
import { toast } from "sonner";
import { useState } from "react";

const ProductPage = () => {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;
    const [quantity, setQuantity] = useState(1);

    // Added cart mutation hook
    const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

    const { data, error, isLoading } = useGetProductByIdQuery(productId);
    const product = data?.data || null;

    const handleAddToCart = async () => {
        if (!product) return;

        try {
            // Use the actual mutation hook
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
                        <Image src={product.images?.[0] || "/placeholder-image.jpg"} alt={product.name} fill className="object-cover" />
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
                                <div key={index} className="relative h-20 w-full overflow-hidden rounded-md cursor-pointer">
                                    <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="space-y-4">
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
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">Quantity:</span>
                            <div className="flex items-center border rounded-md">
                                <Button variant="ghost" size="icon" onClick={decreaseQuantity} disabled={quantity <= 1} className="h-8 w-8">
                                    <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center font-medium">{quantity}</span>
                                <Button variant="ghost" size="icon" onClick={increaseQuantity} disabled={quantity >= product.stock} className="h-8 w-8">
                                    <Plus className="h-3 w-3" />
                                </Button>
                            </div>
                            <span className="text-sm text-gray-500">Max: {product.stock}</span>
                        </div>
                    )}

                    {/* Description */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        <p className="text-gray-700">{product.description}</p>
                    </div>

                    {/* Tags */}
                    {product.tags && product.tags.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-4 pt-6">
                        <Button onClick={handleAddToCart} disabled={product.stock === 0 || isAddingToCart} className="flex-1" size="lg">
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            {isAddingToCart ? "Adding..." : `Add to Cart (${quantity})`}
                        </Button>

                        <Button variant="outline" onClick={handleAddToWishlist} className="px-4" size="lg" disabled={isAddingToCart}>
                            <Heart className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Total Price */}
                    {product.stock > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Total:</span>
                                <span className="text-xl font-bold text-primary">${((product.discountPrice || product.price) * quantity).toFixed(2)}</span>
                            </div>
                        </div>
                    )}

                    {/* Additional info */}
                    <div className="pt-6 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                            <p>SKU: {product._id}</p>
                            <p>Category: {product.category || "N/A"}</p>
                            {product.createdAt && <p>Added: {new Date(product.createdAt).toLocaleDateString()}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
