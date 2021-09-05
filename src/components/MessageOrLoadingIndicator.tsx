import * as React from 'react';
import {FC} from 'react';
import {Message} from "./Message";
import {LoadingIndicator} from "./LoadingIndicator";
import {useErrorMessageToUser} from "../contexts/ErrorMessageToUserContext";

export const MessageOrLoadingIndicator: FC =
    () =>
    {
    	const [message] = useErrorMessageToUser();
        return <>
			<Message message={message}/>
			{!message && <LoadingIndicator/>}
		</>;
    };