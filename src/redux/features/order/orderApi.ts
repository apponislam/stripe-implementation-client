import { TSingleOrderResponse, TCheckoutSessionResponse, TCreateCheckoutSessionRequest } from "@/app/types/order";
import { ApiResponse } from "@/components/MyOrders";
import { baseApi } from "@/redux/api/baseApi";

export const orderApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // Create checkout session
        createCheckoutSession: builder.mutation<TCheckoutSessionResponse, TCreateCheckoutSessionRequest>({
            query: (body) => ({
                url: "/orders/create-checkout-session",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Orders"],
        }),

        // Get user orders
        getMyOrders: builder.query<ApiResponse, { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 10 }) => `/orders/my-orders?page=${page}&limit=${limit}`,
            providesTags: ["Orders"],
        }),

        // Get order by ID
        getOrderById: builder.query<TSingleOrderResponse, string>({
            query: (id) => `/orders/${id}`,
            providesTags: (_result, _err, id) => [{ type: "Orders", id }],
        }),

        // Get order by session ID
        getOrderBySessionId: builder.query<TSingleOrderResponse, string>({
            query: (sessionId) => `/orders/session/${sessionId}`,
            providesTags: (_result, _err, sessionId) => [{ type: "Orders", sessionId }],
        }),

        // Update order status (admin)
        updateOrderStatus: builder.mutation<TSingleOrderResponse, { id: string; status: string }>({
            query: ({ id, status }) => ({
                url: `/orders/${id}/status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: (_result, _err, { id }) => [{ type: "Orders", id }],
        }),

        // Cancel order
        cancelOrder: builder.mutation<TSingleOrderResponse, string>({
            query: (id) => ({
                url: `/orders/${id}/cancel`,
                method: "PATCH",
            }),
            invalidatesTags: (_result, _err, id) => [{ type: "Orders", id }],
        }),

        // ✅ Use MUTATION for both invoice endpoints
        // downloadInvoice: builder.mutation<Blob, string>({
        //     query: (orderId) => ({
        //         url: `/orders/${orderId}/invoice`,
        //         method: "GET",
        //         responseHandler: (response) => response.blob(),
        //         cache: "no-cache",
        //     }),
        //     transformResponse: (response: Blob) => response,
        // }),
        downloadInvoice: builder.mutation<{ success: boolean }, string>({
            async queryFn(orderId, _queryApi, _extraOptions, fetchWithBQ) {
                try {
                    const response = await fetchWithBQ({
                        url: `/orders/${orderId}/invoice`,
                        method: "GET",
                        responseHandler: (r) => r.blob(),
                    });

                    if ("error" in response) {
                        return { error: response.error as any };
                    }

                    const blob = response.data as Blob;
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `invoice-${orderId}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);

                    // ✅ always return a valid object
                    return { data: { success: true } };
                } catch (err: any) {
                    return { error: { message: err.message ?? "Unknown error" } };
                }
            },
        }),

        // downloadInvoiceHTML: builder.mutation<Blob, string>({
        //     query: (orderId) => ({
        //         url: `/orders/${orderId}/invoice/html`,
        //         method: "GET",
        //         responseHandler: (response) => response.blob(),
        //         cache: "no-cache",
        //     }),
        //     transformResponse: (response: Blob) => response,
        // }),
        downloadInvoiceHTML: builder.mutation<string, string>({
            query: (orderId) => ({
                url: `/orders/${orderId}/invoice/html`,
                method: "GET",
                responseHandler: async (response) => {
                    return await response.text(); // force text instead of JSON
                },
            }),
        }),
    }),
});

export const { useCreateCheckoutSessionMutation, useGetMyOrdersQuery, useGetOrderByIdQuery, useGetOrderBySessionIdQuery, useUpdateOrderStatusMutation, useCancelOrderMutation, useDownloadInvoiceMutation, useDownloadInvoiceHTMLMutation } = orderApi;
