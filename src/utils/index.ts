/* eslint-disable @typescript-eslint/no-var-requires */
import { UserRole } from "pnc-sdk";
import CONFIG from '@/config';

export function getRoleIcon(role?: UserRole | null): string | null {
    switch (role) {
        case UserRole.ADMIN:
            return 'mdi-powershell';
        case UserRole.TEACHER:
            return 'mdi-account-supervisor';
    }
    return null;
}

export function getRandomNorwayBackground() {
    const norwayBackgrounds = [
        require('@/assets/norway_backgrounds/0.jpg'),
        require('@/assets/norway_backgrounds/1.jpg'),
        require('@/assets/norway_backgrounds/2.jpg'),
        require('@/assets/norway_backgrounds/3.jpg'),
        require('@/assets/norway_backgrounds/4.jpg'),
        require('@/assets/norway_backgrounds/5.jpg'),
    ];
    return norwayBackgrounds[Math.floor(Math.random() * norwayBackgrounds.length)];
}

export const localStorage = {
    getItem(key: string): string | null {
        const handledKey = `${CONFIG.STORAGE_PREFIX}${key}`;
        return window.localStorage.getItem(handledKey);
    },
    setItem(key: string, value: string): void {
        const handledKey = `${CONFIG.STORAGE_PREFIX}${key}`;
        window.localStorage.setItem(handledKey, value);
    },
    removeItem(key: string): void {
        const handledKey = `${CONFIG.STORAGE_PREFIX}${key}`;
        window.localStorage.removeItem(handledKey);
    }
} 