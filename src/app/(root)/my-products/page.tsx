"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TProductsResponse, useGetMyProductsQuery } from "@/redux/features/product/productApi";
import { IProduct } from "@/app/types/product";
import ProductCard from "@/components/MyProductCard";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

const MyProductsPage = () => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isLoading, isError } = useGetMyProductsQuery({
        page: currentPage,
        limit: 12,
    });

    if (isLoading) return <p className="text-center py-10">Loading...</p>;
    if (isError) return <p className="text-center py-10 text-red-500">Something went wrong!</p>;

    const response = data as TProductsResponse;
    const products = response?.data || [];
    const totalItems = response?.meta?.total || 0;
    const itemsPerPage = response?.meta?.limit || 12;
    const currentPageNum = response?.meta?.page || 1;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handleViewProduct = (product: IProduct) => {
        console.log("View product:", product);
        router.push(`/my-products/${product._id}`);
    };

    const handleEditProduct = (product: IProduct) => {
        console.log("Edit product:", product);
        // Navigate to edit page
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPageNum - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust if we're near the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <div className="container mx-auto p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-center md:text-left mb-4 md:mb-0">My Products</h1>
                <Link href="/my-products/add">
                    <Button>Create Product</Button>
                </Link>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-lg font-medium text-gray-700 mb-4">No products found</p>
                    <Link href="/my-products/add">
                        <Button>Add Your First Product</Button>
                    </Link>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {products.map((product: IProduct) => (
                            <ProductCard key={product._id} product={product} onView={handleViewProduct} onEdit={handleEditProduct} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2 mt-8">
                            <Button variant="outline" size="icon" onClick={() => setCurrentPage(Math.max(1, currentPageNum - 1))} disabled={currentPageNum === 1}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            {/* First page */}
                            {getPageNumbers()[0] > 1 && (
                                <>
                                    <Button variant={currentPageNum === 1 ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(1)}>
                                        1
                                    </Button>
                                    {getPageNumbers()[0] > 2 && <MoreHorizontal className="h-4 w-4 mx-1" />}
                                </>
                            )}

                            {/* Page numbers */}
                            {getPageNumbers().map((page) => (
                                <Button key={page} variant={currentPageNum === page ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(page)}>
                                    {page}
                                </Button>
                            ))}

                            {/* Last page */}
                            {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                                <>
                                    {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && <MoreHorizontal className="h-4 w-4 mx-1" />}
                                    <Button variant={currentPageNum === totalPages ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(totalPages)}>
                                        {totalPages}
                                    </Button>
                                </>
                            )}

                            <Button variant="outline" size="icon" onClick={() => setCurrentPage(Math.min(totalPages, currentPageNum + 1))} disabled={currentPageNum === totalPages}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    {/* Results count */}
                    <div className="text-center text-sm text-gray-500 mt-4">
                        Showing {products.length} of {totalItems} products
                    </div>
                </>
            )}
        </div>
    );
};

export default MyProductsPage;
