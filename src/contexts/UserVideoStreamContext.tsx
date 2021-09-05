import * as React from 'react';
import {createContext, FC, useEffect, useMemo, useState} from 'react';
import '@tensorflow/tfjs-backend-webgl';
import {useRequiredContext} from "../lib/contexts/useRequiredContext";
import {useErrorMessageToUser} from "./ErrorMessageToUserContext";


interface Context
{
	videoSrcObject: MediaStream | undefined
}

const ContextRef = createContext<Context | undefined>(undefined);

export const UserVideoStreamProvider: FC =
    (
        {
            children,
        },
    ) =>
    {
		const [videoSrcObject, setVideoSrcObject] = useState<MediaStream>();
		const [_, setMessage] = useErrorMessageToUser();
		useEffect(
			() => {
				navigator
					.mediaDevices
					.getUserMedia({
						audio: false,
						video: {
							deviceId: {
								exact: undefined,
							}
						},
					})
					.then(stream => {
						// window.stream = stream; // make stream available to browser console
						// videoEl.srcObject = stream;
						setVideoSrcObject(stream);
						// videoEl.classList.add('faded-in')

					})
					.catch(e => {
						setMessage(`Unable to obtain camera stream. Error: ${e.message}`);
					});
			},
			[setMessage],
		);
        return <ContextRef.Provider value={useMemo(() => ({
			videoSrcObject,
		}), [videoSrcObject])}>
			{children}
		</ContextRef.Provider>;
    };

export function useVideoStream(): MediaStream | undefined
{
	return useRequiredContext(ContextRef, 'UserVideoStreamContext', 'UserVideoStreamProvider').videoSrcObject;
}