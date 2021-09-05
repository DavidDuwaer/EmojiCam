import * as React from 'react';
import {FC, useCallback, useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core";
import clsx from 'clsx';
import * as poseDetection from '@tensorflow-models/pose-detection';
import {PoseDetector} from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import {useSetPoses} from "../contexts/PoseContext";
import {useVideoStream} from "../contexts/UserVideoStreamContext";
import {CameraSelectionButton} from "./CameraSelectionButton";

const useStyles = makeStyles(theme => ({
	root: {
		transition: 'opacity 0.5s',
	},
	fadedOut: {
		opacity: 0,
	},
	fadedIn: {
		opacity: 1,
	},
	video: {
		width: '100%',
		height: '100%',
		objectFit: 'cover',
		objectPosition: 'center center',
	},
	cameraSelector: {
		zIndex: 10,
		position: 'absolute',
		bottom: 40,
		left: 'calc(50% - 70px)',
		width: 140,
	},
}));

interface VideoProps
{
	className?: string
}

export const Video: FC<VideoProps> =
    (
        {
            className,
        },
    ) =>
    {
		const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
		const [detector, setDetector] = useState<PoseDetector>();
		const srcObject = useVideoStream();
		useEffect(
			() => {
				const detectorConfig = {modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING};
				poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig)
					.then(newDetector => setDetector(newDetector));
			},
			[],
		);
		const [videoLoadedData, setVideoLoadedData] = useState(false);
		const [tensorFlowInitialized, setTensorFlowInitialized] = useState(false);
		const setPoses = useSetPoses();
		const setupDetector = useCallback(
			async (videoEl: HTMLVideoElement, detector: PoseDetector) => {
				const poses = await detector.estimatePoses(videoEl);
				const {scaleFactor, xOffset, yOffset} = getMediaScaleFactorAndOffset(videoEl);
				const adjustedPoses = poses
					.map(pose => ({
						...pose,
						keypoints: pose
							.keypoints
							.map(keypoint => ({
								...keypoint,
								x: keypoint.x * scaleFactor + xOffset,
								y: keypoint.y * scaleFactor + yOffset,
							} as poseDetection.Keypoint))
					} as poseDetection.Pose));
				setPoses(adjustedPoses);
				setTensorFlowInitialized(true);
			},
			[setPoses],
		);
		useEffect(
			() => {
				if (videoEl !== null && srcObject !== undefined && detector !== undefined)
				{
					console.log('videoEl nonnull, srcOgbject nonnull and detector nonnull')
					videoEl.srcObject = srcObject;
					if (videoLoadedData)
					{
						console.log('video loaded data')
						const callback = () => setupDetector(videoEl, detector);
						const interval = setInterval(callback, 100);
						return () => {
							clearInterval(interval);
							setVideoLoadedData(false);
							setPoses(undefined);
						}
					}
				}
			},
			[videoEl, srcObject, detector, videoLoadedData, setPoses, setupDetector],
		);
        const classes = useStyles();
        return <div
			className={clsx(classes.root, className, (srcObject && videoLoadedData && tensorFlowInitialized) ? classes.fadedIn : classes.fadedOut)}
		>
			<video
				className={classes.video}
				playsInline
				autoPlay
				// width={1200}
				// width="100%"
				// height="100%"
				onLoadedData={useCallback(() => setVideoLoadedData(true), [])}
				ref={setVideoEl}
			/>
			<CameraSelectionButton className={classes.cameraSelector}/>
		</div>;
    };

function getMediaScaleFactorAndOffset(videoElement: HTMLVideoElement)
{
	const scaleFactor = Math.max(
		videoElement.clientWidth / videoElement.videoWidth,
		videoElement.clientHeight / videoElement.videoHeight
	);
	const xOffset = Math.min(0, (videoElement.clientWidth - scaleFactor * videoElement.videoWidth) / 2);
	const yOffset = Math.min(0, (videoElement.clientHeight - scaleFactor * videoElement.videoHeight) / 2);
	return {
		scaleFactor,
		xOffset,
		yOffset,
	};
}