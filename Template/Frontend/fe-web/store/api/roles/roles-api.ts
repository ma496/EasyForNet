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

export const rolesApi = appApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    roleCreate: builder.mutation<RoleCreateResponse, RoleCreateRequest>({
      query: (input) => ({
        url: "/roles",
        method: "POST",
        body: input
      })
    }),
    roleUpdate: builder.mutation<RoleUpdateResponse, RoleUpdateRequest>({
      query: (input) => ({
        url: `/roles/${input.id}`,
        method: "PUT",
        body: { ...input, id: undefined }
      })
    }),
    roleDelete: builder.mutation<RoleDeleteResponse, RoleDeleteRequest>({
      query: (input) => ({
        url: `/roles/${input.id}`,
        method: "DELETE"
      })
    }),
    roleGet: builder.query<RoleGetResponse, RoleGetRequest>({
      query: (input) => ({
        url: `/roles/${input.id}`,
        method: "GET"
      })
    }),
    roleList: builder.query<RoleListResponse, RoleListRequest>({
      query: (input) => ({
        url: `/roles?page=${input.page}&pageSize=${input.pageSize}&sortField=${input.sortField ? input.sortField : ""}&sortDirection=${input.sortDirection ? input.sortDirection : 0}&search=${input.search ? input.search : ""}&all=${input.all ?? false}`,
        method: "GET"
      })
    }),
    changePermissions: builder.mutation<ChangePermissionsResponse, ChangePermissionsRequest>({
      query: (input) => ({
        url: `/roles/change-permissions/${input.id}`,
        method: "PUT",
        body: input
      })
    }),
  }),
})

export const { useRoleCreateMutation, useRoleUpdateMutation, useRoleDeleteMutation, useRoleGetQuery, useLazyRoleGetQuery, useRoleListQuery, useLazyRoleListQuery, useChangePermissionsMutation } = rolesApi
