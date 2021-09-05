import * as React from 'react';
import {createContext, FC, useMemo, useState} from 'react';
import '@tensorflow/tfjs-backend-webgl';
import {useRequiredContext} from "../lib/contexts/useRequiredContext";


interface Context
{
	cameraId: string | undefined
	setCameraId: (cameraId: string | undefined) => void
}

const ContextRef = createContext<Context | undefined>(undefined);

export const CameraSelectionProvider: FC =
    (
        {
            children,
        },
    ) =>
    {
    	const [cameraId, setCameraId] = useState<string>();
        return <ContextRef.Provider value={useMemo(() => ({
			cameraId,
			setCameraId,
		}), [cameraId, setCameraId])}>
			{children}
		</ContextRef.Provider>;
    };

export function useSelectedCameraId(): [string | undefined, (cameraId: string | undefined) => void]
{
	const {cameraId, setCameraId} = useRequiredContext(ContextRef, 'CameraSelectionContext');
	return [cameraId, setCameraId];
}