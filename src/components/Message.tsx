import * as React from 'react';
import {FC} from 'react';
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    root: {
        fontSize: 24,
        marginLeft: 24,
        marginRight: 24,
        textAlign: 'center',
    },
}));

interface MessageProps
{
    message?: string
}

export const Message: FC<MessageProps> =
    (
        {
            message,
        },
    ) =>
    {
        const classes = useStyles();
        return message !== undefined
            ?
            <div className={classes.root}>
                {message}
            </div>
            :
            null;
    };