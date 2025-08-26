"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, ShoppingCart, ChevronLeft, ChevronRight, Heart, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { IProduct } from "@/app/types/product";
import { useState } from "react";
import { toast } from "sonner";
import { useAddToCartMutation } from "@/redux/features/cart/cartApi";

interface PublicProductCardProps {
    product: IProduct;
    onView?: (product: IProduct) => void;
    onAddToCart?: (product: IProduct, quantity: number) => void; // Updated to include quantity
    onAddToWishlist?: (product: IProduct) => void;
}

const PublicProductCard = ({ product, onView, onAddToCart, onAddToWishlist }: PublicProductCardProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [quantity, setQuantity] = useState(1); // Added quantity state
    const [showQuantityControls, setShowQuantityControls] = useState(false);
    const [addToCart] = useAddToCartMutation();

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev === (product.images?.length || 1) - 1 ? 0 : prev + 1));
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? (product.images?.length || 1) - 1 : prev - 1));
    };

    const handleAddToWishlist = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
        onAddToWishlist?.(product);
    };

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (showQuantityControls) {
            onAddToCart?.(product, quantity);
            await addToCart({
                productId: product._id,
                quantity,
            }).unwrap();

            toast.success(`${quantity} ${product.name} has been added to your cart.`);
            setShowQuantityControls(false);
            setQuantity(1);
        } else {
            setShowQuantityControls(true);
        }
    };

    const handleViewDetails = (e: React.MouseEvent) => {
        e.stopPropagation();
        onView?.(product);
    };

    const increaseQuantity = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    };

    const decreaseQuantity = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    // const handleQuantityClick = (e: React.MouseEvent) => {
    //     e.stopPropagation();
    //     setShowQuantityControls(true);
    // };

    return (
        <Card className="shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group h-full flex flex-col gap-0 pt-0 pb-3 cursor-pointer">
            {/* Product Image Gallery */}
            <div className="relative h-48 w-full overflow-hidden m-0 p-0" onClick={handleViewDetails}>
                {product.images && product.images.length > 0 ? (
                    <>
                        <Image src={product.images[currentImageIndex]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />

                        {/* Image Navigation Arrows (show if multiple images) */}
                        {product.images.length > 1 && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-black/50 hover:bg-black/70 text-white"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        prevImage();
                                    }}
                                >
                                    <ChevronLeft className="h-4 w-4 text-white" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-black/50 hover:bg-black/70 text-white"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        nextImage();
                                    }}
                                >
                                    <ChevronRight className="h-4 w-4 text-white" />
                                </Button>

                                {/* Image Indicator Dots */}
                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                                    {product.images.map((_, index) => (
                                        <div key={index} className={`h-2 w-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`} />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <ShoppingCart className="h-12 w-12 text-gray-400" />
                    </div>
                )}

                {/* Wishlist Button */}
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 bg-white/90 hover:bg-white text-gray-800 hover:text-red-500" onClick={handleAddToWishlist}>
                    <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                </Button>

                {/* Discount Badge */}
                {product.discountPrice && product.discountPrice < product.price && (
                    <Badge variant="destructive" className="absolute top-2 left-2">
                        {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                    </Badge>
                )}

                {/* Stock Status */}
                <Badge variant={product.stock > 0 ? "default" : "destructive"} className="absolute top-10 left-2">
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </Badge>

                {/* Image Count Badge */}
                {product.images && product.images.length > 1 && (
                    <Badge variant="secondary" className="absolute top-2 left-20">
                        {currentImageIndex + 1}/{product.images.length}
                    </Badge>
                )}
            </div>

            <CardHeader className="px-4 py-3 pb-2" onClick={handleViewDetails}>
                <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                        <CardTitle className="text-lg font-semibold line-clamp-1 mb-1">{product.name}</CardTitle>
                        <CardDescription className="text-sm">{product.category}</CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-4 py-2 flex-1" onClick={handleViewDetails}>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{product.description}</p>

                {/* Price Section */}
                <div className="flex items-center gap-2 mb-3">
                    {product.discountPrice && product.discountPrice < product.price ? (
                        <>
                            <span className="text-lg font-bold text-primary">${product.discountPrice}</span>
                            <span className="text-sm text-gray-500 line-through">${product.price}</span>
                        </>
                    ) : (
                        <span className="text-lg font-bold text-primary">${product.price}</span>
                    )}
                </div>

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {product.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                        {product.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                                +{product.tags.length - 3} more
                            </Badge>
                        )}
                    </div>
                )}
            </CardContent>

            <CardFooter className="px-4">
                <div className="flex justify-between items-center w-full gap-2">
                    <Button variant="outline" size="sm" onClick={handleViewDetails} className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                    </Button>

                    {showQuantityControls ? (
                        <div className="flex items-center gap-1 bg-primary rounded-md">
                            <Button variant="ghost" size="icon" onClick={decreaseQuantity} disabled={quantity <= 1} className="h-8 w-8 text-white ">
                                <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-white font-medium text-sm min-w-[2rem] text-center">{quantity}</span>
                            <Button variant="ghost" size="icon" onClick={increaseQuantity} disabled={quantity >= product.stock} className="h-8 w-8 text-white ">
                                <Plus className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleAddToCart} className="h-8 text-white px-2">
                                OK
                            </Button>
                        </div>
                    ) : (
                        <Button variant="default" size="sm" onClick={handleAddToCart} disabled={product.stock === 0} className="flex-1">
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Add to Cart
                        </Button>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
};

export default PublicProductCard;
