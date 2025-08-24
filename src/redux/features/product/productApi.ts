import { IProduct } from "@/app/types/product";
import { baseApi } from "@/redux/api/baseApi";

// Response type from backend
export interface TProductsResponse {
    success: boolean;
    message: string;
    data: IProduct[];
    meta?: {
        page: number;
        limit: number;
        total: number;
    };
}

export interface TSingleProductsResponse {
    success: boolean;
    message: string;
    data: IProduct;
}
export const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createProduct: builder.mutation<IProduct, Partial<IProduct>>({
            query: (body) => ({
                url: "/products",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Products", "MyProducts"],
        }),

        getAllProducts: builder.query<TProductsResponse, { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 20 }) => `/products?page=${page}&limit=${limit}`,
            providesTags: ["Products"],
        }),

        getMyProducts: builder.query<TProductsResponse, { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 10 }) => `/products/my-products?page=${page}&limit=${limit}`,
            providesTags: ["MyProducts"],
        }),

        getProductById: builder.query<TSingleProductsResponse, string>({
            query: (id) => `/products/${id}`,
            providesTags: (_result, _err, id) => [{ type: "Products", id }],
        }),

        updateProduct: builder.mutation<IProduct, { id: string; data: Partial<IProduct> }>({
            query: ({ id, data }) => ({
                url: `/products/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _err, { id }) => [{ type: "Products", id }, "MyProducts"],
        }),

        deleteProduct: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({
                url: `/products/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Products", "MyProducts"],
        }),
    }),
});

export const { useCreateProductMutation, useGetAllProductsQuery, useGetMyProductsQuery, useGetProductByIdQuery, useUpdateProductMutation, useDeleteProductMutation } = productApi;
