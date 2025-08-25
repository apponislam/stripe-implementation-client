"use client";

import { Button } from "@/components/ui/button";
import { useGetCartQuery } from "@/redux/features/cart/cartApi";
import { ShoppingCart } from "lucide-react";

interface CartButtonProps {
    onClick: () => void;
}

export function CartButton({ onClick }: CartButtonProps) {
    const { data: cartData } = useGetCartQuery();

    const itemCount = cartData?.data?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

    return (
        <Button variant="ghost" size="icon" className="relative" onClick={onClick}>
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">{itemCount}</span>}
        </Button>
    );
}
