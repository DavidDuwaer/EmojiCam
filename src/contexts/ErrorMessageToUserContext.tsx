import * as React from 'react';
import {createContext, FC, useMemo, useState} from 'react';
import '@tensorflow/tfjs-backend-webgl';
import {useRequiredContext} from "../lib/contexts/useRequiredContext";


interface Context
{
	message: string | undefined
	setMessage: (message: string | undefined) => void
}

const ContextRef = createContext<Context | undefined>(undefined);

export const ErrorMessageToUserProvider: FC =
    (
        {
            children,
        },
    ) =>
    {
		const [message, setMessage] = useState<string>();
        return <ContextRef.Provider value={useMemo(() => ({
			message,
			setMessage,
		}), [message, setMessage])}>
			{children}
		</ContextRef.Provider>;
    };

export function useErrorMessageToUser(): [string | undefined, (value: string | undefined) => void]
{
	const {message, setMessage} = useRequiredContext(ContextRef, 'ErrorMessageToUserContext');
	return [
		message,
		setMessage
	];
}