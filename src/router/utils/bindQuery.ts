import { Route } from "vue-router";
type RoutePropsFunction = (route: Route) => Record<string, any>;

export function bindQuery(...queryFilter: string[]): RoutePropsFunction {
    return function (route: Route) {
        const queryParams = queryFilter.reduce((x, y) => ({ ...x, [y]: route.query[y] }), {});
        return { ...queryParams, ...route.params };
    }
}