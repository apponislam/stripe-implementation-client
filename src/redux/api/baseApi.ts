import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { logOut, setUser, TUser } from "../features/auth/authSlice";

// Interface for refresh token response
interface RefreshTokenResponse {
    data: {
        accessToken: string;
        user: TUser;
    };
}

// 1. Basic fetchBaseQuery setup
const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_API}/api/v1/`,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState)?.auth?.token;
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    const state = api.getState() as RootState;
    const isLoggedOut = !state.auth.token;

    if (result?.error?.status === 401 && !isLoggedOut) {
        // Don't attempt refresh if we're already trying to logout or if we're already logged out
        if (typeof args === "object" && "url" in args && args.url === "/auth/logout") {
            return result;
        }

        console.log("Attempting token refresh...");

        const refreshResult = await baseQuery(
            {
                url: "auth/refresh-token",
                method: "POST",
                credentials: "include",
            },
            api,
            extraOptions
        );

        if (refreshResult.data && typeof refreshResult.data === "object" && "data" in refreshResult.data) {
            const responseData = refreshResult.data as RefreshTokenResponse;
            const { accessToken, user } = responseData.data;

            api.dispatch(setUser({ user, token: accessToken }));

            // Retry with updated token
            result = await baseQuery(args, api, extraOptions);
            return result;
        } else {
            console.log("Refresh failed - logging out");
            api.dispatch(logOut());
            return { error: { status: 401, data: "Session expired" } };
        }
    }

    return result;
};

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["User", "Products", "MyProducts", "Cart", "Orders"],
    endpoints: () => ({}),
});
