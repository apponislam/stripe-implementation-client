import { ICartItem } from "@/app/types/cart";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TCartState = {
    items: ICartItem[];
    isLoading: boolean;
    lastUpdated: number;
};

const initialState: TCartState = {
    items: [],
    isLoading: false,
    lastUpdated: Date.now(),
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCartItems: (state, action: PayloadAction<ICartItem[]>) => {
            state.items = action.payload;
            state.lastUpdated = Date.now();
        },
        addCartItem: (state, action: PayloadAction<ICartItem>) => {
            const existingItem = state.items.find((item) => item.productId === action.payload.productId);

            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
            state.lastUpdated = Date.now();
        },
        updateCartItem: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
            const item = state.items.find((item) => item.productId === action.payload.productId);
            if (item) {
                item.quantity = action.payload.quantity;
                state.lastUpdated = Date.now();
            }
        },
        removeCartItem: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((item) => item.productId !== action.payload);
            state.lastUpdated = Date.now();
        },
        clearCart: (state) => {
            state.items = [];
            state.lastUpdated = Date.now();
        },
        setCartLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        // Sync cart with server response
        syncCart: (state, action: PayloadAction<ICartItem[]>) => {
            state.items = action.payload;
            state.lastUpdated = Date.now();
        },
    },
});

export const { setCartItems, addCartItem, updateCartItem, removeCartItem, clearCart, setCartLoading, syncCart } = cartSlice.actions;

export default cartSlice.reducer;
