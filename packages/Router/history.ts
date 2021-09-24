import { parsePath } from './helpers';
import { Path } from './typings';

export enum Action {
    Pop = 'POP',
    Push = 'PUSH',
    Replace = 'REPLACE',
}

export type Blocker = (tx: Transition) => void;
export type Listener = (url: string, action: Action) => void;

type NavigationCallbacks = {
    onComplete: () => void;
    onCancel: () => void;
};

type TransitionOptions = {
    forced?: boolean;
} & Partial<NavigationCallbacks>;

export type RouterNavigateOptions = {
    replace?: boolean;
};

export interface Location extends Path {}

export interface Transition {
    action: Action;
    // The new location.
    location: Location;
    // Retries the update to the current location.
    retry(): void;
    forceRetry(): void;
    cancel(): void;
}

export class History {
    private blockers: Blocker[] = [];
    private listeners: Listener[] = [];

    private currentIndex: number = 0;

    history: globalThis.History;
    window: globalThis.Window;

    private blockedPopTx: Transition | null = null;

    constructor(globalHistory: globalThis.History = history, globalWindow: globalThis.Window = window) {
        this.history = globalHistory;
        this.window = globalWindow;
        const [index] = this.getIndexAndLocation();

        if (index === null || index === undefined) {
            this.currentIndex = 0;

            this.history.replaceState({ ...this.history.state, idx: 0 }, '');
        }

        this.bindListeners();
    }

    private getIndexAndLocation(): [number, Location] {
        let { pathname, search, hash } = this.window.location;
        let state = this.history.state || {};
        return [
            state.idx,
            {
                pathname,
                search,
                hash,
            },
        ];
    }

    private isTransitionAllowed() {
        return this.blockers.length === 0;
    }

    private notificateBlockers(
        action: Action,
        url: string,
        operations: {
            retry(): void;
            forceRetry(): void;
            cancel(): void;
        },
    ) {
        this.blockers.forEach((blocker) => blocker({ action, location: parsePath(url), ...operations }));
    }

    private push(url: string, options: TransitionOptions) {
        const action = Action.Push;

        const retry = () => this.push(url, options);
        const forceRetry = () => this.push(url, { ...options, forced: true });

        if (!options.forced && !this.isTransitionAllowed()) {
            this.notificateBlockers(action, url, { retry, forceRetry, cancel: () => options.onCancel?.() });
            return;
        }

        try {
            this.history.pushState({ idx: this.currentIndex + 1 }, '', url);
        } catch (error) {
            this.window.location.assign(url);
        }

        this.currentIndex += 1;

        this.applyTransition(action);
        options.onComplete?.();
    }

    private replace(url: string, options: TransitionOptions) {
        const action = Action.Replace;

        const retry = () => this.replace(url, options);
        const forceRetry = () => this.replace(url, { ...options, forced: true });

        if (!options.forced && !this.isTransitionAllowed()) {
            this.notificateBlockers(action, url, { retry, forceRetry, cancel: () => options.onCancel?.() });
            return;
        }

        try {
            this.history.replaceState({ idx: this.currentIndex }, '', url);
        } catch (error) {
            this.window.location.assign(url);
        }

        this.applyTransition(action);
        options.onComplete?.();
    }

    private applyTransition(nextAction: Action) {
        const [_index, location] = this.getIndexAndLocation();
        this.listeners.forEach((listener) => listener(createPath(location), nextAction));
    }

    public navigate(url: string, options: RouterNavigateOptions & Partial<NavigationCallbacks> = {}) {
        let { replace = false, ...callbacks } = options;

        if (replace) {
            this.replace(url, callbacks);
        } else {
            this.push(url, callbacks);
        }
    }

    public listen(listener: Listener) {
        this.listeners.push(listener);
    }

    public go = (delta: number) => {
        this.history.go(delta);
    };

    private handlePop = () => {
        if (this.blockedPopTx) {
            this.blockers.forEach((blocker) => blocker(this.blockedPopTx!));
            this.blockedPopTx = null;
            return;
        }

        const nextAction = Action.Pop;
        const [nextIndex, nextLocation] = this.getIndexAndLocation();

        if (this.blockers.length > 0) {
            if (nextIndex === null) {
                throw new Error(
                    'You are trying to block a POP navigation to a location that was not created by the history library.',
                );
            }

            const delta = this.currentIndex - nextIndex;
            if (delta) {
                // Revert the POP
                this.blockedPopTx = {
                    action: nextAction,
                    location: nextLocation,
                    retry: () => {
                        this.go(delta * -1);
                    },
                    forceRetry: () => {
                        this.go(delta * -1);
                    },
                    cancel: () => {},
                };

                this.go(delta);
            }

            return;
        }

        this.currentIndex = nextIndex;

        this.applyTransition(nextAction);
    };

    private handleClick = (event: MouseEvent) => {
        let link: HTMLElement | null = event.target as HTMLElement;

        while (link && !(link instanceof HTMLAnchorElement)) {
            link = link.parentElement;
        }

        if (!(link instanceof HTMLAnchorElement)) {
            return;
        }

        let href = attr(link, 'href');
        let replace = dataBool(link, 'replace', false);
        let prevent = dataBool(link, 'prevent', false);
        let navigate = dataBool(link, 'navigate', true);
        let target = link.target;

        if (prevent) {
            event.preventDefault();

            return;
        }

        if (!href || href === '#' || /^(javascript):/.test(href)) {
            return;
        }

        // check system keys (open link in other tab)
        if (event.ctrlKey || event.shiftKey || event.metaKey) {
            return;
        }

        if (!navigate) {
            return;
        }

        if (target === '_blank' || target === '_top') {
            return;
        }

        event.preventDefault();

        this.navigate(href, { replace });
    };

    private bindListeners() {
        this.window.addEventListener('popstate', this.handlePop);
        this.window.addEventListener('click', this.handleClick);
    }

    public block = (blocker: Blocker) => {
        this.blockers.push(blocker);
        const unblock = () => (this.blockers = this.blockers.filter((blockerToFilter) => blockerToFilter !== blocker));

        if (this.blockers.length === 1) {
            this.window.addEventListener('beforeunload', promptBeforeUnload);
        }

        return () => {
            unblock();

            if (!this.blockers.length) {
                this.window.removeEventListener('beforeunload', promptBeforeUnload);
            }
        };
    };
}

function attr(element: HTMLAnchorElement, name: string): string | undefined {
    return element.getAttribute(name) || element.dataset[name];
}

function dataBool(element: HTMLAnchorElement, name: string, defaultValue: boolean): boolean {
    let value = element.dataset[name];

    if (!value) {
        return defaultValue;
    }

    return value === 'true' || value === '1';
}

function promptBeforeUnload(event: BeforeUnloadEvent) {
    // Cancel the event.
    event.preventDefault();
    // Chrome (and legacy IE) requires returnValue to be set.
    event.returnValue = '';
}

export function createPath({ pathname = '/', search = '', hash = '' }: Partial<Path>) {
    return pathname + search + hash;
}
