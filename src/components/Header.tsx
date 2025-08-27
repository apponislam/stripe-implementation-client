"use client";

import React from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { currentUser, logOut } from "@/redux/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu, ShoppingCart } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Root as VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import { Cart } from "./Cart";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";

const Header = () => {
    const user = useSelector(currentUser);
    const dispatch = useDispatch();

    const [logOutApi, { isLoading }] = useLogoutMutation();

    // const handleLogout = async () => {
    //     try {
    //         await logOutApi().unwrap();
    //         dispatch(logOut());
    //         // Optional: show success message
    //         toast.success("Logged out successfully");
    //     } catch (error) {
    //         console.error("Logout failed:", error);

    //         // Handle different error types
    //         if (error && typeof error === "object" && "data" in error) {
    //             const errorData = (error as { data: unknown }).data;

    //             if (errorData && typeof errorData === "object" && "message" in errorData && typeof errorData.message === "string") {
    //                 toast.error(errorData.message);
    //                 return;
    //             }
    //         }

    //         if (error instanceof Error) {
    //             toast.error(error.message);
    //         } else {
    //             toast.error("Failed to logout. Please try again.");
    //         }
    //     }
    // };
    const handleLogout = async (event?: Event): Promise<void> => {
        // Prevent default behavior if event is provided (for dropdown)
        if (event) {
            event.preventDefault();
        }

        try {
            await logOutApi().unwrap();
            dispatch(logOut());
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Logout failed:", error);

            // Handle error
            if (error && typeof error === "object" && "data" in error) {
                const errorData = (error as { data: unknown }).data;
                if (errorData && typeof errorData === "object" && "message" in errorData) {
                    toast.error((errorData as any).message);
                    return;
                }
            }

            toast.error("Failed to logout. Please try again.");
        }
    };

    return (
        <header className="w-full shadow-sm bg-white sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between py-4 px-6">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold">
                    Amar Shop
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
                    <Link href="/" className="transition">
                        Home
                    </Link>
                    <Link href="/products" className="transition">
                        Products
                    </Link>
                    {/* <Link href="/orders" className="transition flex items-center gap-1">
                        <Package className="h-4 w-4" />Top Orders
                    </Link> */}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4 relative">
                    {/* <Link href="/cart" className="relative">
                        <ShoppingCart className="h-6 w-6 text-gray-700 transition" />
                        <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">2</span>
                    </Link> */}
                    <Cart></Cart>

                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex items-center justify-center gap-2 rounded-full p-1 h-9 w-9">
                                    {user.avatarUrl ? <Image src={user.avatarUrl || "/default-avatar.png"} alt={user.name} className="rounded-full object-cover h-full w-full" width={32} height={32} /> : <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-white">{user.name.charAt(0).toUpperCase()}</div>}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem asChild>
                                    <Link href="/my-products">My Products</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/orders">Orders</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={(e: React.MouseEvent) => {
                                        handleLogout(e.nativeEvent);
                                    }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Logging out..." : "Logout"}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/auth">
                            <Button>Access Your Account</Button>
                        </Link>
                    )}
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Menu className="h-7 w-7 text-gray-700 cursor-pointer" />
                        </SheetTrigger>
                        <SheetContent side="right" className="p-6">
                            <SheetTitle>
                                <VisuallyHidden>Mobile Navigation</VisuallyHidden>
                            </SheetTitle>

                            <nav className="flex flex-col gap-4 text-lg font-medium mt-4">
                                <Link href="/" className="transition">
                                    Home
                                </Link>
                                <Link href="/products" className="transition">
                                    Products
                                </Link>
                                {/* <Link href="/toporders" className="transition flex items-center gap-2">
                                    <Package className="h-5 w-5" /> Top Orders
                                </Link> */}

                                <Link href="/cart" className="transition flex items-center gap-2">
                                    <ShoppingCart className="h-5 w-5" /> Cart
                                </Link>
                            </nav>

                            <div className="mt-6">
                                {user ? (
                                    <div className="flex flex-col gap-2 items-center">
                                        {user.avatarUrl ? <Image src={user.avatarUrl || "/default-avatar.png"} alt={user.name} className="rounded-full object-cover h-10 w-10" width={64} height={64} /> : <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center text-xl font-medium text-white">{user.name.charAt(0).toUpperCase()}</div>}
                                        <span className="font-medium">{user.name}</span>

                                        <Link href="/my-products" className="w-full">
                                            <Button variant="outline" className="w-full">
                                                My Products
                                            </Button>
                                        </Link>
                                        <Link href="/orders" className="w-full">
                                            <Button variant="outline" className="w-full">
                                                Orders
                                            </Button>
                                        </Link>
                                        <Button onClick={() => handleLogout()} variant="destructive" className="w-full" disabled={isLoading}>
                                            {isLoading ? "Logging out..." : "Logout"}
                                        </Button>
                                    </div>
                                ) : (
                                    <Link href="/auth">
                                        <Button className="w-full">Access Your Account</Button>
                                    </Link>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
};

export default Header;
