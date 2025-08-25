"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProductByIdQuery, useDeleteProductMutation } from "@/redux/features/product/productApi";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { useState } from "react";

const MyProductPage = () => {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const { data, error, isLoading } = useGetProductByIdQuery(productId);
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

    const product = data?.data || null;

    const handleEditProduct = () => {
        if (!product) return;
        router.push(`/my-products/edit/${product._id}`);
    };

    const handleDeleteProduct = async () => {
        if (!product) return;

        const result = await Swal.fire({
            title: "Are you sure?",
            html: `
                <div class="text-left">
                    <p>You are about to delete the product:</p>
                    <p class="font-semibold mt-2">${product.name}</p>
                    <p class="text-sm text-muted-foreground mt-2">This action cannot be undone!</p>
                </div>
            `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            reverseButtons: false,
        });

        if (result.isConfirmed) {
            try {
                await deleteProduct(product._id).unwrap();

                toast.success(`${product.name} has been deleted successfully.`);
                router.push("/my-products");
            } catch (error: unknown) {
                console.error("Delete product error:", error);

                let errorMessage = "Failed to delete product. Please try again.";

                if (typeof error === "object" && error !== null && "data" in error) {
                    const maybeError = error as { data?: { message?: string } };

                    if (maybeError.data?.message) {
                        errorMessage = maybeError.data.message;
                    }
                } else if (error instanceof Error) {
                    errorMessage = error.message;
                }

                toast.error(errorMessage);
            }
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
                    Back to My Products
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
                <Button variant="ghost" onClick={() => router.push("/my-products")} className="mb-6">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to My Products
                </Button>

                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h2>
                    <p className="text-gray-600 mb-6">{error ? ("status" in error ? error.status : "An error occurred") : "The product you're looking for doesn't exist."}</p>
                    <Button onClick={() => router.push("/my-products")}>Back to My Products</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-6">
            {/* Back button */}
            <Button variant="ghost" onClick={() => router.push("/my-products")} className="mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to My Products
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Images */}
                <div>
                    <div className="relative h-96 w-full overflow-hidden rounded-lg mb-4">
                        <Image src={selectedImage} alt={product.name} fill className="object-cover" />
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
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                            <p className="text-gray-600">{product.category}</p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2">
                            <Button onClick={handleEditProduct} variant="outline" size="sm" className="flex items-center gap-2">
                                <Edit className="h-4 w-4" />
                                Edit
                            </Button>
                            <Button onClick={handleDeleteProduct} variant="destructive" size="sm" disabled={isDeleting} className="flex items-center gap-2">
                                <Trash2 className="h-4 w-4" />
                                {isDeleting ? "Deleting..." : "Delete"}
                            </Button>
                        </div>
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
                    <div className="flex items-center gap-4">
                        <Badge variant={product.stock > 0 ? "default" : "destructive"}>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</Badge>
                        <span className="text-sm text-gray-500">Quantity: {product.quantity}</span>
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

                    {/* Product Stats */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3">Product Statistics</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">Original Price:</span>
                                <span className="font-medium ml-2">${product.price}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Discount Price:</span>
                                <span className="font-medium ml-2">{product.discountPrice ? `$${product.discountPrice}` : "N/A"}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Stock Level:</span>
                                <span className="font-medium ml-2">{product.stock}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Initial Quantity:</span>
                                <span className="font-medium ml-2">{product.quantity}</span>
                            </div>
                        </div>
                    </div>

                    {/* Additional info */}
                    <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-semibold mb-3">Product Information</h3>
                        <div className="text-sm text-gray-600 space-y-2">
                            <p>
                                <span className="font-medium">Product ID:</span> {product._id}
                            </p>
                            <p>
                                <span className="font-medium">Category:</span> {product.category || "N/A"}
                            </p>
                            <p>
                                <span className="font-medium">Created:</span> {product?.createdAt ? new Date(product.createdAt).toLocaleDateString() : "N/A"}
                            </p>
                            <p>
                                <span className="font-medium">Last Updated:</span> {product?.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : "N/A"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProductPage;
