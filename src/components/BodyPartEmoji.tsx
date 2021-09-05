import * as React from 'react';
import {FC} from 'react';
import {makeStyles} from "@material-ui/core";
import {BodyPartName, usePoseNodes} from "../contexts/PoseContext";

const ELEMENT_SIZE = 88;

const useStyles = makeStyles(theme => ({
	root: {
		width: ELEMENT_SIZE,
		height: ELEMENT_SIZE,
		zIndex: 1,
		position: 'absolute',
		borderWidth: 0,
		textAlign: 'center',
		fontSize: 62,
		lineHeight: `${ELEMENT_SIZE}px`,
		userSelect: 'none',
		cursor: 'default',
	},
}));

interface BodyPartEmojiProps
{
	bodyPart: BodyPartName
	emoji: string
	scoreThreshold?: number
}

export const BodyPartEmoji: FC<BodyPartEmojiProps> =
    (
        {
            bodyPart,
			emoji,
			scoreThreshold,
        },
    ) =>
    {
        const classes = useStyles();
        const nodes = usePoseNodes(bodyPart, scoreThreshold);
		return <>
			{nodes?.map((node, key) => <div
				key={key}
				className={classes.root}
				style={{
					top: node.y - ELEMENT_SIZE / 2,
					left: node.x - ELEMENT_SIZE / 2,
				}}
			>
				{emoji}
			</div>)}
		</>;
    };