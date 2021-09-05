import * as React from 'react';
import {FC, useCallback, useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core";
import clsx from 'clsx';
import * as poseDetection from '@tensorflow-models/pose-detection';
import {PoseDetector} from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import {useSetPoses} from "../contexts/PoseContext";
import {useVideoStream} from "../contexts/UserVideoStreamContext";

const useStyles = makeStyles(theme => ({
	root: {
		objectFit: 'cover',
		objectPosition: 'center center',
		transition: 'opacity 0.5s',
	},
	fadedOut: {
		opacity: 0,
	},
	fadedIn: {
		opacity: 1,
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
		const onVideoLoadedData = useCallback(() => setVideoLoadedData(true), []);
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
						const interval = setInterval(callback, 50);
						return () => clearInterval(interval);
					}
				}
			},
			[videoEl, srcObject, detector, videoLoadedData],
		)
		const setPoses = useSetPoses();
		const setupDetector = useCallback(
			async (videoEl: HTMLVideoElement, detector: PoseDetector) => {
				console.log('detection \\')
				const poses = await detector.estimatePoses(videoEl);
				console.log('detection /')
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
			},
			[],
		);
        const classes = useStyles();
        return <video
			className={clsx(classes.root, className, srcObject ? classes.fadedIn : classes.fadedOut)}
			playsInline
			autoPlay
			// width={1200}
			// width="100%"
			// height="100%"
			onLoadedData={onVideoLoadedData}
			ref={setVideoEl}
		/>;
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