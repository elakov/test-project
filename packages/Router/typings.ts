export interface Path {
    pathname: string;
    search: string;
    hash: string;
}

export type QueryParsedValue = string | undefined | QueryParsedValue[];

export type QueryParsed = Record<string, QueryParsedValue>;

export type Parse<S extends string, N = never> = S extends `${string}:${infer O}`
    ? O extends `${infer N2}/${infer O2}`
        ? Parse<O2, N | N2>
        : N | O
    : N;

export type PathParams<P extends string> = Parse<P> extends never ? {} : Record<Parse<P>, string>;

export type RouteMetadata = {
    name: string;
    path: string;
    names: string[];
    regexp: RegExp;
};

export type FoundedRoute<N, P extends Record<string, string>> = {
    route: N;
    params: P;
    pathname: string;
    hash: string;
    query: QueryParsed;
};

export type AllFoundRoutes<R extends Record<string, string>> = {
    [Route in Extract<keyof R, string>]: FoundedRoute<Route, PathParams<R[Route]>>;
};
