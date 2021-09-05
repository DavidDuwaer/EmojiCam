import * as React from 'react';
import {FC, useCallback, useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core";
import clsx from 'clsx';
import * as poseDetection from '@tensorflow-models/pose-detection';
import {PoseDetector} from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import {useSetPoses} from "../contexts/PoseContext";

const useStyles = makeStyles(theme => ({
	root: {
		objectFit: 'cover',
		objectPosition: 'center center',
	},
}));

interface VideoProps
{
	className?: string
	srcObject: MediaStream | undefined
}

export const Video: FC<VideoProps> =
    (
        {
            className,
			srcObject,
        },
    ) =>
    {
		const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
		const [detector, setDetector] = useState<PoseDetector>();
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
			className={clsx(classes.root, className)}
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