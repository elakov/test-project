import { useRef, useEffect, useState } from 'preact/hooks';
export const useQuery = <T>(query: string, variables?: object): { data: T | null, fetching: boolean } => {
    const currentRequestId = useRef(0);
    const [result, setResult] = useState(null);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        setFetching(true);
        const requestId = Math.random();
        currentRequestId.current = requestId;
        fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query, variables }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (requestId === currentRequestId.current) {
                    setFetching(false);
                    setResult(data.data);
                }
            });


    }, [query, variables]);

    return {
        data: result,
        fetching,
    }
}