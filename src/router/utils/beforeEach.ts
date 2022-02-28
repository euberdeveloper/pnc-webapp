import { NavigationGuard } from 'vue-router';
import { UserRole } from 'pnc-sdk';
import store, { ActionTypes } from '@/store';

const beforeEach: NavigationGuard = function (to, _from, next) {
    const role: UserRole | null = store.getters.role;
    const authorizedRoles = to.matched.reduce((prev: UserRole[], curr) => curr.meta.authorizedRoles
        ? [...prev, ...curr.meta.authorizedRoles]
        : prev, []);
    const authentication = authorizedRoles.length || to.matched.some(record => record.meta.authentication === true);

    if (!authentication) {
        next();
    }
    else if (role !== null && (!authorizedRoles.length || authorizedRoles.includes(role))) {
        next();
    }
    else {
        if (role !== null) {
            store.dispatch(ActionTypes.SHOW_ALERT_ERROR, `The user has no permissions to access this page, try to remove everything after '?' in the URL bar`);
        }
        next({ name: 'login', query: { requestedRoute: to.path } });
    }
}

export default beforeEach;