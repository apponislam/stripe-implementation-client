"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { IProduct } from "@/app/types/product";
import { useGetMyProductsQuery } from "@/redux/features/product/productApi";

const MyProductsPage = () => {
    // Fetch my products
    const { data, isLoading, isError } = useGetMyProductsQuery({ page: 1, limit: 20 });

    if (isLoading) return <p className="text-center py-10">Loading...</p>;
    if (isError) return <p className="text-center py-10 text-red-500">Something went wrong!</p>;

    console.log(data);
    const products = data?.data || [];

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
                        <Card key={product._id} className="shadow-md hover:shadow-lg transition">
                            <CardHeader>
                                <CardTitle>{product.name}</CardTitle>
                                <CardDescription>{product.category}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">{product.description}</p>
                                <p className="mt-2 font-semibold">${product.price}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyProductsPage;
