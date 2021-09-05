import * as React from 'react';
import {FC, useCallback, useMemo} from 'react';
import {ButtonBase, makeStyles} from "@material-ui/core";
import FlipCameraIosIcon from '@material-ui/icons/FlipCameraIos';
import clsx from "clsx";
import {useUserCameraDevices} from "../lib/browser-api/useUserCameraDevices";
import {useSelectedCameraId} from "../contexts/CameraSelectionContext";
import {useVideoStream} from "../contexts/UserVideoStreamContext";

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: '#ee886b',
        padding: 16,
        height: 60,
        borderRadius: 30,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 32,
        height: 32,
    },
}));

interface CameraSelectionButtonProps
{
    className?: string
}

export const CameraSelectionButton: FC<CameraSelectionButtonProps> =
    (
        {
            className,
        },
    ) =>
    {
        const classes = useStyles();
        const cameras = useUserCameraDevices();
        const [selectedCameraId, setSelectedCameraId] = useSelectedCameraId();
        const videoStream = useVideoStream();
        const idOfCurrentCamera = useMemo(
            () => selectedCameraId !== undefined
                ? selectedCameraId
                : videoStream?.getVideoTracks()[0]?.getSettings().deviceId,
            [selectedCameraId, videoStream],
        );
        const currentDeviceIndex = useMemo(
            () => {
                if (idOfCurrentCamera !== undefined)
                    return cameras?.findIndex(({deviceId}) => deviceId === idOfCurrentCamera);
            },
            [idOfCurrentCamera, cameras],
        );
        const nextDeviceIndex = useMemo(
            () => {
                if (cameras !== undefined)
                {
                    return currentDeviceIndex !== undefined
                        ? (currentDeviceIndex + 1) % cameras.length
                        : 0;
                }
            },
            [cameras, currentDeviceIndex],
        );
        const nextCamera = useMemo(
            () => {
                if (cameras !== undefined && nextDeviceIndex !== undefined)
                    return cameras[nextDeviceIndex];
            },
            [cameras, nextDeviceIndex],
        );
        console.log(cameras);
        const onClick = useCallback(
            () => {
                if (nextCamera !== undefined)
                    setSelectedCameraId(nextCamera.deviceId);
            },
            [nextCamera, setSelectedCameraId],
        );
        console.log(`cameras:`)
        console.log(cameras);
        console.log('camera ids:')
        console.log(cameras?.map(({deviceId}) => deviceId))
        console.log(`idOfCurrentCamera: ${idOfCurrentCamera}`)
        console.log(`currentDeviceIndex: ${currentDeviceIndex}`)
        console.log(`nextDeviceIndex: ${nextDeviceIndex}`)
        console.log(`nextCamera: ${nextCamera?.deviceId}`)
        if (nextCamera === undefined)
            return null;
        return <ButtonBase
            className={clsx(classes.root, className)}
            onClick={onClick}
        >
            <FlipCameraIosIcon className={classes.icon}/>
		</ButtonBase>;
    };