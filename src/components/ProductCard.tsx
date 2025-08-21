// "use client";

// import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { MoreVertical, Edit, Trash2, Eye, ShoppingCart } from "lucide-react";
// import Image from "next/image";
// import { IProduct } from "@/app/types/product";

// interface ProductCardProps {
//     product: IProduct;
//     onView?: (product: IProduct) => void;
//     onEdit?: (product: IProduct) => void;
//     onDelete?: (product: IProduct) => void;
// }

// const ProductCard = ({ product, onView, onEdit, onDelete }: ProductCardProps) => {
//     return (
//         <Card className="shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group h-full flex flex-col gap-0 pt-0 pb-3">
//             {/* Product Image - No top gap */}
//             <div className="relative h-48 w-full overflow-hidden m-0 p-0">
//                 {product.images && product.images.length > 0 ? (
//                     <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
//                 ) : (
//                     <div className="w-full h-full bg-gray-100 flex items-center justify-center">
//                         <ShoppingCart className="h-12 w-12 text-gray-400" />
//                     </div>
//                 )}

//                 {/* Discount Badge */}
//                 {product.discountPrice && product.discountPrice < product.price && (
//                     <Badge variant="destructive" className="absolute top-2 left-2">
//                         {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
//                     </Badge>
//                 )}

//                 {/* Stock Status */}
//                 <Badge variant={product.stock > 0 ? "default" : "destructive"} className="absolute top-2 right-2">
//                     {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
//                 </Badge>
//             </div>

//             <CardHeader className="px-4 py-3 pb-2">
//                 <div className="flex justify-between items-start gap-2">
//                     <div className="flex-1">
//                         <CardTitle className="text-lg font-semibold line-clamp-1 mb-1">{product.name}</CardTitle>
//                         <CardDescription className="text-sm">{product.category}</CardDescription>
//                     </div>

//                     {/* Dropdown Menu */}
//                     <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" size="icon" className="h-8 w-8">
//                                 <MoreVertical className="h-4 w-4" />
//                             </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                             <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => onView?.(product)}>
//                                 <Eye className="h-4 w-4" />
//                                 View Details
//                             </DropdownMenuItem>
//                             <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => onEdit?.(product)}>
//                                 <Edit className="h-4 w-4" />
//                                 Edit Product
//                             </DropdownMenuItem>
//                             <DropdownMenuItem className="flex items-center gap-2 text-destructive cursor-pointer" onClick={() => onDelete?.(product)}>
//                                 <Trash2 className="h-4 w-4" />
//                                 Delete Product
//                             </DropdownMenuItem>
//                         </DropdownMenuContent>
//                     </DropdownMenu>
//                 </div>
//             </CardHeader>

//             <CardContent className="px-4 py-2 flex-1">
//                 <p className="text-gray-600 text-sm line-clamp-2 mb-3">{product.description}</p>

//                 {/* Price Section */}
//                 <div className="flex items-center gap-2 mb-0">
//                     {product.discountPrice && product.discountPrice < product.price ? (
//                         <>
//                             <span className="text-lg font-bold text-primary">${product.discountPrice}</span>
//                             <span className="text-sm text-gray-500 line-through">${product.price}</span>
//                         </>
//                     ) : (
//                         <span className="text-lg font-bold text-primary">${product.price}</span>
//                     )}
//                 </div>

//                 {/* Tags */}
//                 {product.tags && product.tags.length > 0 && (
//                     <div className="flex flex-wrap gap-1 mb-3">
//                         {product.tags.slice(0, 3).map((tag, index) => (
//                             <Badge key={index} variant="secondary" className="text-xs">
//                                 {tag}
//                             </Badge>
//                         ))}
//                         {product.tags.length > 3 && (
//                             <Badge variant="outline" className="text-xs">
//                                 +{product.tags.length - 3} more
//                             </Badge>
//                         )}
//                     </div>
//                 )}
//             </CardContent>

//             <CardFooter className="px-4">
//                 <div className="flex justify-between items-center w-full">
//                     <span className="text-xs text-gray-500">{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "N/A"}</span>
//                     <Button size="sm" disabled={product.stock === 0}>
//                         {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
//                     </Button>
//                 </div>
//             </CardFooter>
//         </Card>
//     );
// };

// export default ProductCard;
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, Eye, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { IProduct } from "@/app/types/product";
import { useState } from "react";

interface ProductCardProps {
    product: IProduct;
    onView?: (product: IProduct) => void;
    onEdit?: (product: IProduct) => void;
    onDelete?: (product: IProduct) => void;
}

const ProductCard = ({ product, onView, onEdit, onDelete }: ProductCardProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev === (product.images?.length || 1) - 1 ? 0 : prev + 1));
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? (product.images?.length || 1) - 1 : prev - 1));
    };

    return (
        <Card className="shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group h-full flex flex-col gap-0 pt-0 pb-3">
            {/* Product Image Gallery */}
            <div className="relative h-48 w-full overflow-hidden m-0 p-0">
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
                                    <ChevronLeft className="h-4 w-4" />
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
                                    <ChevronRight className="h-4 w-4" />
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

                {/* Discount Badge */}
                {product.discountPrice && product.discountPrice < product.price && (
                    <Badge variant="destructive" className="absolute top-2 left-2">
                        {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                    </Badge>
                )}

                {/* Stock Status */}
                <Badge variant={product.stock > 0 ? "default" : "destructive"} className="absolute top-2 right-2">
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </Badge>

                {/* Image Count Badge */}
                {product.images && product.images.length > 1 && (
                    <Badge variant="secondary" className="absolute top-2 left-20">
                        {currentImageIndex + 1}/{product.images.length}
                    </Badge>
                )}
            </div>

            {/* Rest of your card content remains the same */}
            <CardHeader className="px-4 py-3 pb-2">
                <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                        <CardTitle className="text-lg font-semibold line-clamp-1 mb-1">{product.name}</CardTitle>
                        <CardDescription className="text-sm">{product.category}</CardDescription>
                    </div>

                    {/* Dropdown Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => onView?.(product)}>
                                <Eye className="h-4 w-4" />
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => onEdit?.(product)}>
                                <Edit className="h-4 w-4" />
                                Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 text-destructive cursor-pointer" onClick={() => onDelete?.(product)}>
                                <Trash2 className="h-4 w-4" />
                                Delete Product
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            <CardContent className="px-4 py-2 flex-1">
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{product.description}</p>

                {/* Price Section */}
                <div className="flex items-center gap-2 mb-0">
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
                <div className="flex justify-between items-center w-full">
                    <span className="text-xs text-gray-500">{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "N/A"}</span>
                    <Button size="sm" disabled={product.stock === 0}>
                        {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};

export default ProductCard;
