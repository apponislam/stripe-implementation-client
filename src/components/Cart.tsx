"use client";

import { useState } from "react";
import { CartButton } from "./CartButton";
import { CartDrawer } from "./CartDrawer";

export function Cart() {
    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <div>
            <CartButton onClick={() => setIsCartOpen(true)} />
            <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
        </div>
    );
}
