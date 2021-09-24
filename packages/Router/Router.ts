import { parseHash, parsePath, urlBuilder } from './helpers';
import { PathParams, Parse, RouteMetadata, AllFoundRoutes, FoundedRoute } from './typings';

const NAMES_PARAM: RegExp = /:([^/()]+)/g;

function routeToRegexp(routePath: string): { names: string[]; regexp: RegExp } {
    let names: string[] = [];

    let pathRule = routePath
        .replace(NAMES_PARAM, (_, value) => {
            names.push(value);

            return '([^/]+)';
        })
        .replace('*', () => '.+');

    return {
        names,
        regexp: new RegExp(`^${pathRule}$`),
    };
}

export class Router<R extends Record<string, string>> {
    private defaultSearchParams: Record<string, string>;
    private routesBySpecificity: RouteMetadata[];
    private rawRoutes: R;

    constructor(routes: R, defaultSearchParams: Record<string, string> = {}) {
        this.routesBySpecificity = buildRoutes(routes);
        this.rawRoutes = routes;
        this.defaultSearchParams = defaultSearchParams;
    }

    public generatePath<N extends keyof R>(
        route: N,
        options: {
            params?: PathParams<R[N]>;
            searchParams?: Record<string, string>;
            hash?: string;
        } = {},
    ) {
        let path: string = this.rawRoutes[route];

        Object.entries<string>(options.params || {}).forEach(([name, value]) => {
            path = path.replace(`:${name}`, () => value);
        });

        return urlBuilder(path, Object.assign({}, this.defaultSearchParams, options.searchParams), options.hash);
    }

    public getRouteParamsNames<N extends keyof R>(route: N): Parse<R[N]>[] {
        const routeData = this.routesBySpecificity.find(({ name }) => route === name);

        return routeData?.names || [];
    }

    public matchRoute(path: string): AllFoundRoutes<R>[Extract<keyof R, string>] {
        const location = parsePath(path);

        const route = this.routesBySpecificity.find((route) => {
            let match = location.pathname.match(route.regexp);

            if (match) {
                return true;
            }
        });

        if (!route) {
            throw Error('route was not found');
        }

        const params = getPathParams(location.pathname, route);
        // @ts-expect-error
        const query = Object.entries(new URLSearchParams(location.search).entries());
        const hash = parseHash(location.hash);

        return {
            route: route.name,
            pathname: location.pathname,
            params,
            query: Object.assign({}, this.defaultSearchParams, query),
            hash,
        } as FoundedRoute<any, any>;
    }

    public attachFunctions<RT = void, Args extends [] = []>(metadata: {
        [Route in keyof R]: (route: FoundedRoute<Route, PathParams<R[Route]>>, ...args: Args) => RT;
    }) {
        return metadata;
    }

    public attach<RT = void>(metadata: { [Route in keyof R]: RT }) {
        return metadata;
    }
}

const buildRoutes = (routes: Record<string, string>): RouteMetadata[] => {
    const sortedRoutes = sortRoutesBySpecifity(routes);

    return sortedRoutes.map((route) => {
        const regexp = routeToRegexp(route.path);

        return {
            name: route.route,
            path: route.path,
            names: regexp.names,
            regexp: regexp.regexp,
        };
    });
};

/**
 * /home - вес 10
 * /home/page - вес 120
 * /home/:id - вес 110
 */
const sortRoutesBySpecifity = (routes: Record<string, string>) => {
    const routesWithWeight = Object.keys(routes).map((route) => {
        const path = routes[route];

        if (path === '*') {
            return {
                route,
                path,
                weight: 0,
            };
        }

        const levels = path.split('/');

        const weights = levels.map((level, index) => {
            const specificity = level.startsWith(':') ? 10 : 20;

            return specificity * (index + 1);
        });

        const weight = weights.reduce((sum, weight) => sum + weight);

        return {
            route,
            path,
            weight,
        };
    });

    return routesWithWeight.sort((routeA, routeB) => routeB.weight - routeA.weight);
};

const getPathParams = (path: string, routeMetadata: RouteMetadata) => {
    const { regexp, names } = routeMetadata;
    let match = path.match(regexp);
    let params: Record<string, string> = {};

    if (match) {
        names.forEach((name, index) => {
            params[name] = match![index + 1];
        });

        return params;
    }
};
