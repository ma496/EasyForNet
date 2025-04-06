import { appApi } from "../_app-api";
import { RoleCreateResponse } from "./dto/role-create-response";
import { RoleCreateRequest } from "./dto/role-create-request";
import { RoleUpdateRequest } from "./dto/role-update-request";
import { RoleUpdateResponse } from "./dto/role-update-response";
import { RoleDeleteRequest } from "./dto/role-delete-request";
import { RoleDeleteResponse } from "./dto/role-delete-response";
import { RoleGetRequest } from "./dto/role-get-request";
import { RoleGetResponse } from "./dto/role-get-response";
import { RoleListResponse } from "./dto/role-list-response";
import { RoleListRequest } from "./dto/role-list-request";
import { ChangePermissionsRequest } from "./dto/change-permissions-request";
import { ChangePermissionsResponse } from "./dto/change-permissions-response";

export const rolesApi = appApi.enhanceEndpoints({
  addTagTypes: ['Roles'],
}).injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    roleCreate: builder.mutation<RoleCreateResponse, RoleCreateRequest>({
      query: (input) => ({
        url: "/roles",
        method: "POST",
        body: input
      }),
      invalidatesTags: ['Roles']
    }),
    roleUpdate: builder.mutation<RoleUpdateResponse, RoleUpdateRequest>({
      query: (input) => ({
        url: `/roles/${input.id}`,
        method: "PUT",
        body: { ...input, id: undefined }
      }),
      invalidatesTags: (result, error, arg) => [
        'Roles',
        { type: 'Roles', id: arg.id }
      ]
    }),
    roleDelete: builder.mutation<RoleDeleteResponse, RoleDeleteRequest>({
      query: (input) => ({
        url: `/roles/${input.id}`,
        method: "DELETE"
      }),
      invalidatesTags: (result, error, arg) => [
        'Roles',
        { type: 'Roles', id: arg.id }
      ]
    }),
    roleGet: builder.query<RoleGetResponse, RoleGetRequest>({
      query: (input) => ({
        url: `/roles/${input.id}`,
        method: "GET"
      }),
      providesTags: (result, error, arg) => [
        { type: 'Roles', id: arg.id }
      ]
    }),
    roleList: builder.query<RoleListResponse, RoleListRequest>({
      query: (input) => ({
        url: `/roles?page=${input.page}&pageSize=${input.pageSize}&sortField=${input.sortField ? input.sortField : ""}&sortDirection=${input.sortDirection ? input.sortDirection : 0}&search=${input.search ? input.search : ""}&all=${input.all ?? false}`,
        method: "GET"
      }),
      providesTags: (result) => [
        'Roles',
        ...(result?.items?.map(item => ({ type: 'Roles' as const, id: item.id })) ?? [])
      ]
    }),
    changePermissions: builder.mutation<ChangePermissionsResponse, ChangePermissionsRequest>({
      query: (input) => ({
        url: `/roles/change-permissions/${input.id}`,
        method: "PUT",
        body: input
      }),
      invalidatesTags: (result, error, arg) => [
        'Roles',
        { type: 'Roles', id: arg.id }
      ]
    }),
  }),
})

export const { useRoleCreateMutation, useRoleUpdateMutation, useRoleDeleteMutation, useRoleGetQuery, useLazyRoleGetQuery, useRoleListQuery, useLazyRoleListQuery, useChangePermissionsMutation } = rolesApi
