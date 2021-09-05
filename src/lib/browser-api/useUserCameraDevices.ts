import {useEffect, useState} from "react";

export function useUserCameraDevices()
{
    const [cameras, setCameras] = useState<MediaDeviceInfo[]>();
    useEffect(
        () => {
            navigator.mediaDevices
                .enumerateDevices()
                .then(devices => {
                    const cameraDevices = devices.filter(({kind}) => kind === 'videoinput');
                    setCameras(cameraDevices);
                });
        },
        [],
    );
    return cameras;
}