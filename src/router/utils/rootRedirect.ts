import store from '@/store';
import { UserRole } from '@prebenorwegian/sdk';

export default function (isRoot: boolean): () => string {
  return () => {
    const role: UserRole | null = store.getters.role;
    const prefix = isRoot ? '/dashboard/' : '';

    switch (role) {
      case UserRole.ADMIN:
        return `${prefix}users`;
      case UserRole.TEACHER:
        return `${prefix}courses`;
      case UserRole.STUDENT:
        return `${prefix}courses`;
      default:
        return `/login`;
    }
  }
}