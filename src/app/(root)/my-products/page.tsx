"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGetMyProductsQuery } from "@/redux/features/product/productApi";
import { IProduct } from "@/app/types/product";
import ProductCard from "@/components/ProductCard";

const MyProductsPage = () => {
    const { data, isLoading, isError } = useGetMyProductsQuery({ page: 1, limit: 20 });

    if (isLoading) return <p className="text-center py-10">Loading...</p>;
    if (isError) return <p className="text-center py-10 text-red-500">Something went wrong!</p>;

    const products = data?.data || [];

    const handleViewProduct = (product: IProduct) => {
        console.log("View product:", product);
        // Navigate to product details page or show modal
    };

    const handleEditProduct = (product: IProduct) => {
        console.log("Edit product:", product);
        // Navigate to edit page
    };

    const handleDeleteProduct = (product: IProduct) => {
        console.log("Delete product:", product);
        // Show confirmation dialog and delete
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product: IProduct) => (
                        <ProductCard key={product._id} product={product} onView={handleViewProduct} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyProductsPage;
