import React from 'react';
import {View, Text, SafeAreaView, ActivityIndicator, StyleSheet, StatusBar} from 'react-native';
import OBSWebSocket from 'obs-websocket-js';
import Scenes from '../components/Scenes';
import LinearGradient from 'react-native-linear-gradient';
import Controls from '../components/Controls';
import { Status } from '../components/Status';

const ControlPanel = (props) => {
    const [server, setServer] = React.useState(null);
    const [sceneData, setSceneData] = React.useState(null);
    const [StreamStatus, setStreamStatus] = React.useState(null);
    const [isStreaming, setIsStreaming] = React.useState(false);
    const [isRecording, setIsRecording] = React.useState(false);
    const [user, setUser] = React.useState(null);


    React.useEffect(()=>{
        console.log('USER PARAM', props.navigation.getParam('user'))
        setUser(props.navigation.getParam('user'))
        setServer(new OBSWebSocket)


    },[]);

    const setStream = (obj) => {
        let objSend = {
            type: "rtmp_custom",
            settings: {
                server: obj.fms_url,
                key: obj.stream_key,
                use_auth: true,
                username: obj.login,
                password: obj.password,
                save:true
            }
        }
        console.log("OBJ OBJECT BEFORE SENT",objSend.settings)
        server.send('SetStreamSettings', objSend).then(d=>{
            console.log("SETTINGS RETURERNED AFTER CHANGED:", d)
            server.send('SaveStreamSettings')}).catch(err=>console.log(err))
    }

    React.useEffect(()=>{
        if(user){
            
        }
    },[user])

    React.useEffect(()=>{
        if(server){
            console.log("SERVER RAN")
            
            server.connect({ address:'192.168.1.11:4444', password: 'qwertyuiop' })
            .then(d=>{
                console.log("HEEEEEE")
                setStream(props.navigation.getParam('user'))
                
                getAll(server)
                listenAll()
            })
            .catch(err => {
                console.log("ERROR IN CATCH IS:" , err.error)
                switch (err.error){
                    case "Authentication Failed.":
                        alert('wrong password')
                        break;
                    case "Connection error.":
                        alert('Make sure that OBS is running')
                        break;
                    
                }
            })
            
            


        }
        
    },[server]);



    const listenAll = () => {
        //listen scenes
        
        server.on('SwitchScenes', d=>{getScenes(server)})
        server.on('SceneItemAdded', d=>getScenes(server))
        server.on('SceneItemVisibilityChanged', d=>getScenes(server))

        //Listen Stream Status
        server.on('StreamStatus', d=>{
                    setStreamStatus({
                        droppedFrames : d.numDroppedFrames,
                        live: d.streamTimecode,
                        cpu: d.cpuUsage,
                        fps: d.fps,
                        kbs: d.kbitsPerSec
                    })
                    console.log('stream status: ', d.streamTimecode, d.recTimecoded, d.cpuUsage,d.numDroppedFrames, d.kbitsPerSec, d.fps )
                })
        //Listen for Streaming and Recording
        server.on('RecordingStarted', d=>setIsRecording(true))
        server.on('RecordingStopped', d=>setIsRecording(false))
        server.on('StreamStarted', d=>setIsStreaming(true))
        server.on('StreamStopped', d=>setIsStreaming(false))
        server.on('error', err => {
            console.error('WHOOPSIE:', err);
        });


    }

    const getAll = (s) => {
        s.send('GetSceneList').then(d=>{
            setSceneData(d)
        })

        // s.send('StreamStatus').then(d=>{
        //     console.log('stream status: ')
        //     setStreamStatus(d)
        // })
    }

    const getScenes = (s) => {
        s.send('GetSceneList').then(d=>{
            setSceneData(d)
        })
    }

    const toggleStreamRecord = (type) => {
        if(type==="stream"){
            server.send('StartStopStreaming').then(d=>{

            })
        }
        else if(type==="record"){
            server.send('StartStopRecording').then(d=>{
                
            })
        }
    }

    return (
        <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
            <LinearGradient style={styles.controlPanel} start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#1b4264', '#3784c8']}>
                <Controls nav={props.navigation} streaming={isStreaming} recording={isRecording} toggle={toggleStreamRecord}/>
                <View style={styles.body}>
                    <Scenes data={sceneData} server={server}/>

                </View>
                
                <View style={{justifyContent:'flex-start', width:"100%", flexDirection:'row'}}>
                    <Status status={StreamStatus}/>
                    <Status status={StreamStatus}/>
                </View>
                
                
                 
            </LinearGradient>
        </SafeAreaView>
        </>
    )
}

export default ControlPanel;

const styles = StyleSheet.create({
    controlPanel: {

         justifyContent:'flex-start',

         alignItems:'center',
         minHeight:'100%'

    },
    body: {
        width: '100%',
        height:400,
    }
})