import { $autHost } from "@/shared";

export const createNewRole = async (nameRole: string) => {
    const { data } = await $autHost.post('api/roles/create-role', { nameRole });
    return data;
}

export const getListRoles = async () => {
    const { data } = await $autHost.get('api/roles/get-roles');
    return data;
}

export const deleteRole = async (id: number) => {
    const { data } = await $autHost.delete(`api/roles/delete-role/${id}`);
    return data;
}