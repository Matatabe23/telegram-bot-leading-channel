import { $autHost } from "@/shared";

export const createNewRole = async (nameRole: string) => {
    const { data } = await $autHost.post('roles/create-role', { nameRole });
    return data;
}

export const getListRoles = async () => {
    const { data } = await $autHost.get('roles/get-roles');
    return data;
}

export const deleteRole = async (id: number) => {
    const { data } = await $autHost.delete(`roles/delete-role/${id}`);
    return data;
}

export const updatePermissions = async (id: number, permissions: string) => {
    const { data } = await $autHost.put(`roles/update-permissions/${id}`, {permissions});
    return data;
}