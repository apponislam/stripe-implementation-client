import { ICart, ICartItem } from "@/app/types/cart";
import { baseApi } from "@/redux/api/baseApi";

// Response types from backend
export interface TCartResponse {
    success: boolean;
    message: string;
    data: ICart;
}

export interface TCartItemResponse {
    success: boolean;
    message: string;
    data: ICartItem;
}

export const cartApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCart: builder.query<TCartResponse, void>({
            query: () => `/cart`,
            providesTags: ["Cart"],
        }),

        addToCart: builder.mutation<TCartItemResponse, { productId: string; quantity: number }>({
            query: (body) => ({
                url: `/cart/add`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Cart"],
            async onQueryStarted({ productId, quantity }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    cartApi.util.updateQueryData("getCart", undefined, (draft) => {
                        const existingItem = draft.data.items.find((item) => item.productId === productId);
                        if (existingItem) {
                            existingItem.quantity += quantity;
                        } else {
                            draft.data.items.push({ productId, quantity });
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),

        updateCartItem: builder.mutation<TCartItemResponse, { productId: string; quantity: number }>({
            query: ({ productId, quantity }) => ({
                url: `/cart/${productId}`,
                method: "PATCH",
                body: { quantity },
            }),
            invalidatesTags: ["Cart"],
            async onQueryStarted({ productId, quantity }, { dispatch, queryFulfilled }) {
                // Optimistic update
                const patchResult = dispatch(
                    cartApi.util.updateQueryData("getCart", undefined, (draft) => {
                        const item = draft.data.items.find((item) => item.productId === productId);
                        if (item) {
                            item.quantity = quantity;
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),

        removeFromCart: builder.mutation<TCartResponse, string>({
            query: (productId) => ({
                url: `/cart/${productId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Cart"],
            async onQueryStarted(productId, { dispatch, queryFulfilled }) {
                // Optimistic update
                const patchResult = dispatch(
                    cartApi.util.updateQueryData("getCart", undefined, (draft) => {
                        draft.data.items = draft.data.items.filter((item) => item.productId !== productId);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),

        clearCart: builder.mutation<TCartResponse, void>({
            query: () => ({
                url: `/cart`,
                method: "DELETE",
            }),
            invalidatesTags: ["Cart"],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                // Optimistic update
                const patchResult = dispatch(
                    cartApi.util.updateQueryData("getCart", undefined, (draft) => {
                        draft.data.items = [];
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
    }),
});

export const { useGetCartQuery, useAddToCartMutation, useUpdateCartItemMutation, useRemoveFromCartMutation, useClearCartMutation } = cartApi;
