import { Path } from './typings';

export function parseHash(hash: string = '') {
    return hash.startsWith('#') ? hash.slice(1) : hash;
}

export function parsePath(path: string): Path {
    let partialPath: Partial<Path> = {};

    if (path) {
        let hashIndex = path.indexOf('#');
        if (hashIndex >= 0) {
            partialPath.hash = path.substr(hashIndex);
            path = path.substr(0, hashIndex);
        }

        let searchIndex = path.indexOf('?');
        if (searchIndex >= 0) {
            partialPath.search = path.substr(searchIndex);
            path = path.substr(0, searchIndex);
        }

        if (path) {
            partialPath.pathname = path;
        }
    }

    return partialPath as Path;
}

export const urlBuilder = (pathname: string, searchParams: Record<string, string> = {}, hash = '') => {
    const query = new URLSearchParams(searchParams);

    let url = pathname;

    if (query) {
        url += `?${query}`;
    }

    if (hash) {
        url += `#${hash}`;
    }

    return url;
};
