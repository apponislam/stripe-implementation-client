import { IProduct } from "@/app/types/product";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TProductState = {
    products: IProduct[];
    myProducts: IProduct[];
    selectedProduct: IProduct | null;
};

const initialState: TProductState = {
    products: [],
    myProducts: [],
    selectedProduct: null,
};

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setProducts: (state, action: PayloadAction<IProduct[]>) => {
            state.products = action.payload;
        },
        setMyProducts: (state, action: PayloadAction<IProduct[]>) => {
            state.myProducts = action.payload;
        },
        setSelectedProduct: (state, action: PayloadAction<IProduct | null>) => {
            state.selectedProduct = action.payload;
        },
    },
});

export const { setProducts, setMyProducts, setSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
