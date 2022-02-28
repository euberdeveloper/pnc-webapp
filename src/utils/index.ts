import { UserRole } from "pnc-sdk";

export function getRoleIcon(role?: UserRole | null): string | null {
    switch (role) {
        case UserRole.ADMIN:
            return 'mdi-powershell';
        case UserRole.TEACHER:
            return 'mdi-account-supervisor';
    }
    return null;
}
