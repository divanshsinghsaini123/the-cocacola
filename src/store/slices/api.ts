// services/api.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_STRAPI_URL + "/api/extra",
    }),
    endpoints: (builder) => ({
        getExtraData: builder.query<any, void>({
            query: () => '?populate[navLinks][populate]=*',
        }),
    }),
})

export const { useGetExtraDataQuery } = api
