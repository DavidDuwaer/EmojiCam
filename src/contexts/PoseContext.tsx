import * as React from 'react';
import {createContext, FC, useContext, useMemo, useState} from 'react';
import {makeStyles} from "@material-ui/core";
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import {PoseDetector} from "@tensorflow-models/pose-detection";


interface Context
{
	poses: poseDetection.Pose[] | undefined
	setPoses: (poses: poseDetection.Pose[]) => void
}

const ContextRef = createContext<Context | undefined>(undefined);

const BODY_PART_KEYS = {
	nose: 0,
	left_eye: 1,
	right_eye: 2,
	left_ear: 3,
	right_ear: 4,
	left_shoulder: 5,
	right_shoulder: 6,
	left_elbow: 7,
	right_elbow: 8,
	left_wrist: 9,
	right_wrist: 10,
	left_hip: 11,
	right_hip: 12,
	left_knee: 13,
	right_knee: 14,
	left_ankle: 15,
	right_ankle: 16,
};

export type BodyPartName = keyof (typeof BODY_PART_KEYS);

export const PoseContextProvider: FC =
    (
        {
            children,
        },
    ) =>
    {
    	const [poses, setPoses] = useState<poseDetection.Pose[]>();
        return <ContextRef.Provider value={useMemo(() => ({
			poses,
			setPoses,
		}), [poses, setPoses])}>
			{children}
		</ContextRef.Provider>;
    };

function useThisContext()
{
	const context = useContext(ContextRef);
	return useMemo(
		() => {
			if (context === undefined)
				throw new Error('Cannot use PoseContext outside of PoseContextProvider');
			return context;
		},
		[context],
	);
}

export function useSetPoses()
{
	return useThisContext().setPoses;
}

export function usePoseNodes(node: BodyPartName)
{
	const {poses} = useThisContext();
	return useMemo(
		() => {
			const keyPointIndex = BODY_PART_KEYS[node];
			return poses
				?.map(person => person.keypoints[keyPointIndex]!);
		},
		[poses, node],
	);
}