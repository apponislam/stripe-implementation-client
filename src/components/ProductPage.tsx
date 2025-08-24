"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useGetProductByIdQuery } from "@/redux/features/product/productApi";
import { toast } from "sonner";

const ProductPage = () => {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;

    const { data, error, isLoading } = useGetProductByIdQuery(productId);
    const product = data?.data || null;

    console.log(data);

    const handleAddToCart = () => {
        if (!product) return;

        toast.success(`${product.name} has been added to your cart.`);
        // Add to cart logic here
    };

    const handleAddToWishlist = () => {
        if (!product) return;

        toast.success(`${product.name} has been added to your wishlist.`);
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
                        <Button onClick={handleAddToCart} disabled={product.stock === 0} className="flex-1" size="lg">
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            Add to Cart
                        </Button>

                        <Button variant="outline" onClick={handleAddToWishlist} className="px-4" size="lg">
                            <Heart className="h-5 w-5" />
                        </Button>
                    </div>

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
