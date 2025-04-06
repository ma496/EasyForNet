import { appApi } from "../_app-api";
import { UserCreateRequest } from "./dto/user-create-request";
import { UserCreateResponse } from "./dto/user-create-response";
import { UserDeleteRequest } from "./dto/user-delete-request";
import { UserDeleteResponse } from "./dto/user-delete-response";
import { UserGetRequest } from "./dto/user-get-request";
import { UserGetResponse } from "./dto/user-get-response";
import { UserListRequest } from "./dto/user-list-request";
import { UserListResponse } from "./dto/user-list-response";
import { UserUpdateRequest } from "./dto/user-update-request";
import { UserUpdateResponse } from "./dto/user-update-response";

export const usersApi = appApi.enhanceEndpoints({
  addTagTypes: ['Users'],
}).injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    userCreate: builder.mutation<UserCreateResponse, UserCreateRequest>({
      query: (input) => ({
        url: "/users",
        method: "POST",
        body: input
      }),
      invalidatesTags: ['Users']
    }),
    userUpdate: builder.mutation<UserUpdateResponse, UserUpdateRequest>({
      query: (input) => ({
        url: `/users/${input.id}`,
        method: "PUT",
        body: { ...input, id: undefined }
      }),
      invalidatesTags: (result, error, arg) => [
        'Users',
        { type: 'Users', id: arg.id }
      ]
    }),
    userDelete: builder.mutation<UserDeleteResponse, UserDeleteRequest>({
      query: (input) => ({
        url: `/users/${input.id}`,
        method: "DELETE"
      }),
      invalidatesTags: (result, error, arg) => [
        'Users',
        { type: 'Users', id: arg.id }
      ]
    }),
    userGet: builder.query<UserGetResponse, UserGetRequest>({
      query: (input) => ({
        url: `/users/${input.id}`,
        method: "GET"
      }),
      providesTags: (result, error, arg) => [
        { type: 'Users', id: arg.id }
      ]
    }),
    userList: builder.query<UserListResponse, UserListRequest>({
      query: (input) => ({
        url: `/users?page=${input.page}&pageSize=${input.pageSize}&sortField=${input.sortField ? input.sortField : ""}&sortDirection=${input.sortDirection}&search=${input.search ? input.search : ""}&all=${input.all ?? false}`,
        method: "GET"
      }),
      providesTags: (result) => [
        'Users',
        ...(result?.items?.map(item => ({ type: 'Users' as const, id: item.id })) ?? [])
      ]
    })
  }),
})

export const { useUserCreateMutation, useUserUpdateMutation, useUserDeleteMutation, useUserGetQuery, useLazyUserGetQuery, useUserListQuery, useLazyUserListQuery } = usersApi
