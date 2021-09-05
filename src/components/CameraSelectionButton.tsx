import * as React from 'react';
import {FC} from 'react';
import {ButtonBase, makeStyles} from "@material-ui/core";
import FlipCameraIosIcon from '@material-ui/icons/FlipCameraIos';
import clsx from "clsx";

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
        return <ButtonBase
            className={clsx(classes.root, className)}

        >
            <FlipCameraIosIcon className={classes.icon}/>
		</ButtonBase>;
    };