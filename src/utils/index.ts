/* eslint-disable @typescript-eslint/no-var-requires */
import { UserRole } from "pnc-sdk";

const background_0 = () => require('@/assets/norway_backgrounds/0.jpg');
const background_1 = () => require('@/assets/norway_backgrounds/1.jpg');
const background_2 = () => require('@/assets/norway_backgrounds/2.jpg');
const background_3 = () => require('@/assets/norway_backgrounds/3.jpg');
const background_4 = () => require('@/assets/norway_backgrounds/4.jpg');
const background_5 = () => require('@/assets/norway_backgrounds/5.jpg');

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
        background_0,
        background_1,
        background_2,
        background_3,
        background_4,
        background_5
    ];
    return norwayBackgrounds[Math.floor(Math.random() * norwayBackgrounds.length)]();
}