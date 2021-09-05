import * as React from 'react';
import {FC} from 'react';
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
	ldsEllipsis: {
		display: 'inline-block',
		position: 'relative',
		width: 80,
		height: 80,
		'& div': {
			position: 'absolute',
			top: 33,
			width: 13,
			height: 13,
			borderRadius: '50%',
			background: '#fff',
			animationTimingFunction: 'cubic-bezier(0, 1, 1, 0)',
		},
		'& div:nth-child(1)': {
			left: 8,
			animation: '$lds-ellipsis1 0.6s infinite',
		},
		'& div:nth-child(2)': {
			left: 8,
			animation: '$lds-ellipsis2 0.6s infinite',
		},
		'& div:nth-child(3)': {
			left: 32,
			animation: '$lds-ellipsis2 0.6s infinite',
		},
		'& div:nth-child(4)': {
			left: 56,
			animation: '$lds-ellipsis3 0.6s infinite',
		},
	},
	'@keyframes lds-ellipsis1': {
		'0%': {
			transform: 'scale(0)',
		},
		'100%': {
			transform: 'scale(1)',
		}
	},
	'@keyframes lds-ellipsis3': {
		'0%': {
			transform: 'scale(1)',
		},
		'100%': {
			transform: 'scale(0)',
		},
	},
	'@keyframes lds-ellipsis2': {
		'0%': {
			transform: 'translate(0, 0)',
		},
		'100%': {
			transform: 'translate(24px, 0)',
		}
	}
}));

export const LoadingIndicator: FC =
    () =>
    {
        const classes = useStyles();
        return <div className={classes.ldsEllipsis}>
			<div/>
			<div/>
			<div/>
			<div/>
		</div>;
    };