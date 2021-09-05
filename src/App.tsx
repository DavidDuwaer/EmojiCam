import React, {FC} from 'react';
import './App.css';
import {makeStyles} from "@material-ui/core";
import {Video} from "./components/Video";
import {PoseContextProvider} from "./contexts/PoseContext";
import {BodyPartEmoji} from "./components/BodyPartEmoji";
import {ErrorMessageToUserProvider} from "./contexts/ErrorMessageToUserContext";
import {UserVideoStreamProvider} from "./contexts/UserVideoStreamContext";
import {MessageOrLoadingIndicator} from "./components/MessageOrLoadingIndicator";
import {CameraSelectionProvider} from "./contexts/CameraSelectionContext";

const useStyles = makeStyles(theme => ({
    video: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        right: 0,
    },
}));

const App: FC = () => {

    const classes = useStyles();
    return <PoseContextProvider>
        <ErrorMessageToUserProvider>
            <CameraSelectionProvider>
                <UserVideoStreamProvider>
                    <MessageOrLoadingIndicator/>
                    <Video className={classes.video}/>
                    <BodyPartEmoji bodyPart="left_eye" emoji="❤️"/>
                    <BodyPartEmoji bodyPart="right_eye" emoji="❤️"/>
                    <BodyPartEmoji bodyPart="nose" emoji="🐽"/>
                </UserVideoStreamProvider>
            </CameraSelectionProvider>
        </ErrorMessageToUserProvider>
    </PoseContextProvider>;
}

export default App;
