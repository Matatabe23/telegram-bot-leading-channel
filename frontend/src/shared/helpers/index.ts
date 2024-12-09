import { useAppStore } from "@/app/app.store";
import { useSettings } from "../store";

export const bodyLock = (boolean: boolean) => {
    if (boolean) {
        document.body.classList.remove('overflow-hidden');
        document.body.classList.add('overflow-y-scroll');
        document.body.style.paddingRight = '';
    } else {
        document.body.classList.add('overflow-hidden');
        document.body.classList.remove('overflow-y-scroll');
        document.body.style.paddingRight = `5px`;
    }
};

export const checkPermissions = (permission: string): boolean => {
    const rolePermissions = useSettings().listRoles.find(
        item => item.name === useAppStore().userData.role
    );
    return rolePermissions?.permissions?.includes(permission) ?? false;
};

