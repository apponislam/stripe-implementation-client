import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { logOut, setUser, TUser } from "../features/auth/authSlice";

interface RefreshTokenResponse {
    data: {
        accessToken: string;
        user: TUser;
    };
}

const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_API}/api/v1/`,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState)?.auth?.token;
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return headers;
    },
});

const waitForToken = async (getState: () => RootState | unknown, timeout = 5000) => {
    const start = Date.now();
    while (!(getState() as RootState).auth.token) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        if (Date.now() - start > timeout) break;
    }
};

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    await waitForToken(api.getState);

    const result = await baseQuery(args, api, extraOptions);
    const state = api.getState() as RootState;
    const isLoggedOut = !state.auth.token;

    if (result?.error?.status === 401 && !isLoggedOut) {
        if (typeof args === "object" && "url" in args && args.url === "/auth/logout") {
            return result;
        }

        console.log("Attempting token refresh...");

        const refreshResult = await baseQuery({ url: "auth/refresh-token", method: "POST", credentials: "include" }, api, extraOptions);

        if (refreshResult.data && typeof refreshResult.data === "object" && "data" in refreshResult.data) {
            const { accessToken, user } = (refreshResult.data as RefreshTokenResponse).data;

            api.dispatch(setUser({ user, token: accessToken }));

            // Retry the original query with the new token
            return await baseQuery(args, api, extraOptions);
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
