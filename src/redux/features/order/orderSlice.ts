import { TOrdersResponse, TSingleOrderResponse, TCheckoutSessionResponse, TCreateCheckoutSessionRequest } from "@/app/types/order";
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
        getMyOrders: builder.query<TOrdersResponse, { page?: number; limit?: number }>({
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
    }),
});

export const { useCreateCheckoutSessionMutation, useGetMyOrdersQuery, useGetOrderByIdQuery, useGetOrderBySessionIdQuery, useUpdateOrderStatusMutation, useCancelOrderMutation } = orderApi;
