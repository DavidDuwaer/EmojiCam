import * as React from 'react';
import {FC} from 'react';
import {makeStyles} from "@material-ui/core";
import {Message} from "./Message";
import {LoadingIndicator} from "./LoadingIndicator";
import {useErrorMessageToUser} from "../contexts/ErrorMessageToUserContext";

const useStyles = makeStyles(theme => ({}));

interface MessageOrLoadingIndicatorProps
{
}

export const MessageOrLoadingIndicator: FC<MessageOrLoadingIndicatorProps> =
    (
        {
            children,
        },
    ) =>
    {
    	const [message] = useErrorMessageToUser();
        const classes = useStyles();
        return <>
			<Message message={message}/>
			{!message && <LoadingIndicator/>}
		</>;
    };