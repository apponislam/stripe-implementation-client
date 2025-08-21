"use client";

import React from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
    return (
        <footer className="w-full bg-gray-100 border-t mt-10">
            <div className="container mx-auto px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <h2 className="text-xl font-semibold">Amar Shop</h2>
                        <p className="text-sm text-gray-600 mt-2">A demo store for testing Stripe payments.</p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Shop</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>
                                <Link href="/products" className="hover:text-black transition">
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link href="/cart" className="hover:text-black transition">
                                    Cart
                                </Link>
                            </li>
                            <li>
                                <Link href="/orders" className="hover:text-black transition">
                                    Orders
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Company</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>
                                <Link href="/about" className="hover:text-black transition">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-black transition">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-black transition">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Support</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>
                                <Link href="/help" className="hover:text-black transition">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="hover:text-black transition">
                                    FAQs
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-black transition">
                                    Terms & Conditions
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="my-8" />

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
                    <p>© {new Date().getFullYear()} AmarShop. All rights reserved.</p>
                    <p className="mt-2 md:mt-0">
                        Made by <span className="font-medium">Appon Islam</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
