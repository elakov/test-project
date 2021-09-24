import { useCallback } from "preact/hooks"

export const useMutation = <T>(query: string, variables?: object, callback?: (data: T) => void) => {
    return useCallback(async () => {
        const data = await fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query, variables }),
        })
            .then((response) => response.json())
            .then((data) => {
                return data.data;
            });

        console.log(data);
        callback?.(data);

        return data;
    }, [query, variables, callback])
}