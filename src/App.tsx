import React, {FC, useState} from 'react';
import './App.css';
import {makeStyles} from "@material-ui/core";
import {Video} from "./components/Video";
import {PoseContextProvider} from "./contexts/PoseContext";
import {BodyPartEmoji} from "./components/BodyPartEmoji";
import {CameraSelectionButton} from "./components/CameraSelectionButton";
import {ErrorMessageToUserProvider} from "./contexts/ErrorMessageToUserContext";
import {UserVideoStreamProvider} from "./contexts/UserVideoStreamContext";
import {MessageOrLoadingIndicator} from "./components/MessageOrLoadingIndicator";

const useStyles = makeStyles(theme => ({
    video: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        right: 0,
    },
    cameraSelector: {
        zIndex: 10,
        position: 'absolute',
        bottom: 40,
        left: 'calc(50% - 70px)',
        width: 140,
    },
}));

const App: FC = () => {

    const classes = useStyles();
    return <PoseContextProvider>
        <ErrorMessageToUserProvider>
            <UserVideoStreamProvider>
                <MessageOrLoadingIndicator/>
                <Video className={classes.video}/>
                <CameraSelectionButton className={classes.cameraSelector}/>
                <BodyPartEmoji bodyPart="left_eye" emoji="❤️"/>
                <BodyPartEmoji bodyPart="right_eye" emoji="❤️"/>
            </UserVideoStreamProvider>
        </ErrorMessageToUserProvider>
    </PoseContextProvider>;
}

export default App;
