import React, {FC, useCallback, useEffect, useState} from 'react';
import './App.css';
import {LoadingIndicator} from "./components/LoadingIndicator";
import {makeStyles} from "@material-ui/core";
import clsx from "clsx";
import {Video} from "./components/Video";
import {Message} from "./components/Message";
import {PoseContextProvider} from "./contexts/PoseContext";
import {BodyPartEmoji} from "./components/BodyPartEmoji";

const useStyles = makeStyles(theme => ({
    video: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        right: 0,
        opacity: 0,
    },
    fadedIn: {
        opacity: 1,
        animation: '$fadein 0.5s',
    },
    '@keyframes fadein': {
        from: {
            opacity: 0,
        },
        to: {
            opacity: 1,
        },
    },
}));

const App: FC = () => {
    const [videoSrcObject, setVideoSrcObject] = useState<MediaStream>();
    const [message, setMessage] = useState<string>();
    useEffect(
        () => {
            navigator
                .mediaDevices
                .getUserMedia({
                    audio: false,
                    video: true,
                })
                .then(stream => {
                    // window.stream = stream; // make stream available to browser console
                    // videoEl.srcObject = stream;
                    setVideoSrcObject(stream);
                    // videoEl.classList.add('faded-in')

                })
                .catch(e => {
                    setMessage(`Unable to obtain camera stream. Error: ${e.message}`);
                });
        },
        [],
    );
    const classes = useStyles();
    return <PoseContextProvider>
        <Message message={message}/>
        {!message && <LoadingIndicator/>}
        <Video
            className={clsx(classes.video, videoSrcObject ? classes.fadedIn : undefined)}
            srcObject={videoSrcObject}
        />
        <BodyPartEmoji bodyPart="left_eye" emoji="❤️"/>
        <BodyPartEmoji bodyPart="right_eye" emoji="❤️"/>
    </PoseContextProvider>;
}

export default App;
