"use client";

import { useState } from "react";

import { IProduct } from "@/app/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllProductsQuery } from "@/redux/features/product/productApi";
import PublicProductCard from "./PublicProductCard";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ProductsPage = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const router = useRouter();

    // Use your Redux RTK Query hook
    const { data, error, isLoading, isFetching } = useGetAllProductsQuery({
        page,
        limit,
    });

    const products = data?.data || [];
    const totalProducts = data?.meta?.total || 0;
    const totalPages = Math.ceil(totalProducts / limit);

    // Handle product actions
    const handleViewProduct = (product: IProduct) => {
        // Navigate to product detail page
        router.push(`/products/${product._id}`);
    };

    // Handle product actions
    // const handleViewProduct = (product: IProduct) => {
    //     // Navigate to product detail page
    //     window.location.href = `/products/${product._id}`;
    // };

    const handleAddToCart = (product: IProduct) => {
        // Add to cart logic
        console.log("Add to cart:", product);

        // Show success toast
        // toast({
        //     title: "Added to Cart",
        //     description: `${product.name} has been added to your cart.`,
        //     duration: 3000,
        // });

        // Here you would typically dispatch to your cart store
        // dispatch(addToCart({ product, quantity: 1 }));
    };

    const handleAddToWishlist = (product: IProduct) => {
        // Add to wishlist logic
        console.log("Add to wishlist:", product);

        // Show success toast
        toast.success(`${product.name} has been added to your wishlist.`);

        // Here you would typically dispatch to your wishlist store
        // dispatch(addToWishlist(product));
    };

    const filteredProducts = products
        .filter((product) => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = category === "all" || product.category === category;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "price-low":
                    return a.price - b.price;
                case "price-high":
                    return b.price - a.price;
                case "name":
                    return a.name.localeCompare(b.name);
                case "newest":
                    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
                default:
                    return 0;
            }
        });

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Products</h2>
                    <p className="text-gray-600 mb-6">{"status" in error ? error.status : "An error occurred"}</p>
                    <Button onClick={() => window.location.reload()}>Try Again</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
                <p className="text-gray-600">Discover our amazing collection of products</p>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>

                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {Array.from(new Set(products.map((p) => p.category).filter(Boolean))).map((cat) => (
                            <SelectItem key={cat} value={cat || "uncategorized"}>
                                {cat}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={limit.toString()} onValueChange={(value) => setLimit(Number(value))}>
                    <SelectTrigger className="w-full md:w-[120px]">
                        <SelectValue placeholder="Show" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">Show 10</SelectItem>
                        <SelectItem value="20">Show 20</SelectItem>
                        <SelectItem value="50">Show 50</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <Skeleton className="h-48 w-full" />
                            <div className="p-4">
                                <Skeleton className="h-6 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-full mb-4" />
                                <Skeleton className="h-6 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Products Grid */}
            {!isLoading && (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-gray-600">
                            Showing {filteredProducts.length} of {totalProducts} products
                        </p>
                        {isFetching && (
                            <div className="flex items-center text-blue-600">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                Updating...
                            </div>
                        )}
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600">No products found matching your criteria.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                                {filteredProducts.map((product) => (
                                    <PublicProductCard key={product._id} product={product} onView={handleViewProduct} onAddToCart={handleAddToCart} onAddToWishlist={handleAddToWishlist} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center space-x-4 mt-8">
                                    <Button onClick={() => setPage(page - 1)} disabled={page === 1} variant="outline" className="flex items-center">
                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                        Previous
                                    </Button>

                                    <span className="text-gray-600">
                                        Page {page} of {totalPages}
                                    </span>

                                    <Button onClick={() => setPage(page + 1)} disabled={page === totalPages} variant="outline" className="flex items-center">
                                        Next
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default ProductsPage;
