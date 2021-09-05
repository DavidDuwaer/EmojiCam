import {useContext, useMemo} from "react";

export function useRequiredContext<T extends any>(
    contextRef: React.Context<T | undefined>,
    contextName: string = 'context',
    providerName: string = 'provider'
): T
{
    const context = useContext(contextRef);
    return useMemo(
        () => {
            if (context === undefined)
                throw new Error(`Attempting to use ${contextName} outside of ${providerName}`);
            return context;
        },
        [context, contextName, providerName],
    );
}