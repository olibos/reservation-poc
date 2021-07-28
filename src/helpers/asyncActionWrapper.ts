interface ActionLifeCycle {
    update?: (parameters: unknown) => void;
    destroy?: () => void;
}

export function asyncActionWrapper<TParams extends unknown[], TReturn extends ActionLifeCycle>(
    asyncAction: (...params: TParams) => Promise<TReturn>
): (...params: TParams) => TReturn {
    return (...params: TParams) => {
        let proxy: TReturn;
        const result: ActionLifeCycle = {
            destroy() {
                proxy?.destroy();
            },
            update(paramters) {
                proxy?.update(paramters);
            }
        };
        asyncAction(...params).then(r => proxy = r);
        return result as TReturn;
    };
}
