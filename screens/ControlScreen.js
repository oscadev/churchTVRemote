import React from 'react';
// import Zeroconf from 'react-native-zeroconf'
import {View, Text, SafeAreaView, ActivityIndicator, StyleSheet, StatusBar, Button, Linking, Modal, Dimensions, TouchableOpacity} from 'react-native';
import OBSWebSocket from 'obs-websocket-js';
import Scenes from '../components/Scenes';
import LinearGradient from 'react-native-linear-gradient';
import Controls from '../components/Controls';
import { Status } from '../components/Status';
import store from 'react-native-simple-store';
import Axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';


// const zeroconf = new Zeroconf()


const ControlPanel = (props) => {
    const [server, setServer] = React.useState(null);
    const [sceneData, setSceneData] = React.useState(null);
    const [StreamStatus, setStreamStatus] = React.useState(null);
    const [isStreaming, setIsStreaming] = React.useState(false);
    const [isRecording, setIsRecording] = React.useState(false);
    const [user, setUser] = React.useState(null);
    const [ip, setIp] = React.useState(null)
    const [reloadButton, setReloadButton] = React.useState([])
    const obspass = '123456'
    const [streamMessage, setStreamMessage] = React.useState('Start Stream')
    const [recordingMessage, setRecordingMessage] = React.useState('Start Recording')
    const [IPModal, setIPModal] = React.useState(false)
    const [IPInput, setIPInput] = React.useState('')


    
    const getSchedules = () => {
        // Axios.get(`${ip}:3020/schedules`).then(d=>console.log(d))
    }

    const androidIP = () => {

        store.get('IP')
        .then((res) =>{
        console.log("Res to IP is: ", res)
        if(res===null){
            setIPModal(true)
        }
        else {
            setIp(res)
            // setIPModal(true)
        }
    
    }
)
    }

    //GET IP
    React.useEffect(()=>{

        androidIP()

//         zeroconf.scan(type = 'http', protocol = 'tcp', 
//         domain = 'local.'
//         )
// zeroconf.on('start', () => console.log('The scan has started.'))
// zeroconf.on('resolved', (d) => {
//     console.log('FOUND A THING: '. d)
//     console.log(d, d.slice(0,3))
//     if(d.slice(0,3) === "OBS"){
//         console.log(d.slice(6).split(' ').join('.'))
//         setIp(d.slice(6).split(' ').join('.'))
//     }
//     zeroconf.stop()
// })
                


    },[]);

    //MAKE OBS WEBSOCKET
    React.useEffect(()=>{
        if(ip){
            // console.log('USER PARAM', props.navigation.getParam('user'))
            console.log("this should run only once")
            setUser(props.navigation.getParam('user'))
            setServer(new OBSWebSocket) 
        }


    },[ip])

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
        // console.log("OBJ OBJECT BEFORE SENT",objSend.settings)
        server.send('SetStreamSettings', objSend).then(d=>{
            // console.log("SETTINGS RETURERNED AFTER CHANGED:", d)
            server.send('SaveStreamSettings')}).catch(err=>alert('Make sure OBS is running and press "reconnect".'))
    }



    React.useEffect(()=>{


        if(server){

            console.log("SERVER RAN and IP is: ",ip)


            


            
            server.connect({ address:`${ip}:4444`, password: props.navigation.getParam('user').password })
            .then(d=>{
                console.log("STAGE 2 @()@#()@#()@#()@#()@#()@#()@$()@#()$@#$_)@(#$_)(@#$_)(@#$)_@#$)(@#$)_(@#$")
                setStream(props.navigation.getParam('user'))
                listenAll()
                getAll(server)
                setReloadButton([])
                console.log(`&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$$$$$$$$$$$$$$$$$$$$$$$: ${ip}:3020/password`)
                Axios.post(`http://${ip}:3020/password`, {"password":props.navigation.getParam('user').password})
                .then(d=>{
                    
                })
                
            })
            .catch(err=>{
                setIPModal(true)
                console.log("OH NOES!!!!!!!")})
            // .catch(err => {
            //     console.log("ERROR IN CATCH IS:" , err.error)
            //     switch (err.error){
            //         case "Authentication Failed.":
            //             alert("Change password to: " + props.navigation.getParam('user').password)
            //             setReloadButton(<TouchableOpacity onPress={()=>setServer(new OBSWebSocket)}>
            //                 <Text>
            //                     Try Again
            //                 </Text>
            //             </TouchableOpacity>)

            //             break;
            //         // case "Connection error.":
            //         //     alert('erver connect Make sure that OBS and SCTV Desktop App are running, and press "reconnect" to try again.')

                        
            //         //     break;
                    
            //     }
            // })
            
            


        }
        
    },[server]);



    const listenAll = () => {
        //listen scenes
        
        server.on('SwitchScenes', d=>{getScenes(server)})
        server.on('SceneItemAdded', d=>getScenes(server))
        server.on('SceneItemVisibilityChanged', d=>getScenes(server))
        server.on('Exiting', d=>{alert('OBS quit. Open and reconnect.')})

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
        server.on('RecordingStarted', d=>{
            setRecordingMessage('Stop Recording')
            setIsRecording(true)
        })
        server.on('RecordingStarting', d=>{
            setRecordingMessage('Starting Recording ...')
            setIsRecording(false)})
        server.on('RecordingStopped', d=>{
            setRecordingMessage('Start Recording')
            setIsRecording(false)})
        server.on('RecordingStopping', d=>{
            setRecordingMessage('Stopping Recording ...')
            setIsRecording(false)})
        server.on('StreamStarted', d=>{
            setStreamMessage("Stop Stream")
            setIsStreaming(true)})
        server.on('StreamStarting', d=>{
            setStreamMessage("Stream is Starting ...")
            setIsStreaming(true)})
        server.on('StreamStopped', d=>{
            setStreamMessage('Start Stream')
            setIsStreaming(false)})
        server.on('StreamStopping', d=>{
            setStreamMessage('Stream is Stopping ...')
            setIsStreaming(true)})
        server.on('error', err => {
            alert('WHOOPSIE:', err);
        });
        // server.on('ConnectionOpened', d=>getScenes(server));
        // server.on('ConnectionClosed', console.log("DISCONNECTED"));


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
        }).catch(err=>alert('get scenes Make sure that OBS and SCTV Desktop App are running, and press "reconnect" to try again.'))
    }

    const toggleStreamRecord = (type) => {
        if(type==="stream"){
            server.send('StartStopStreaming').then(d=>{

            }).catch(err=>alert('Make sure that OBS and SCTV Desktop App are running, and press "reconnect" to try again.'))
        }
        else if(type==="record"){
            server.send('StartStopRecording').then(d=>{
                
            }).catch(err=>alert('Make sure that OBS and SCTV Desktop App are running, and press "reconnect" to try again.'))
        }
    }

    return (
        <>
        <StatusBar barStyle="dark-content"/>
        <SafeAreaView>
            <Modal
                style={{justifyContent:'center', alignItems:'center', width:Dimensions.get('screen').width, backgroundColor:'blue'}}
                animationType="slide"
                transparent={false}
                visible={IPModal}

            >
                <View style={styles.modal}>
                    <Text style={{color:'white', fontSize:24, textAlign:'center', padding:32}}>Enter the IP Address for the OBS Computer</Text>
                    <TextInput keyboardType="number-pad" value={IPInput} onChangeText={(e)=>setIPInput(e)} style={styles.ipInput} placeholder="example: 192.168.1.1"></TextInput>
                    <TouchableOpacity 
                        style={{width:84,height:32, backgroundColor:'white', justifyContent:'center', alignItems:'center', borderRadius:5, margin:8}}
                        onPress={()=>{
                            store.update('IP', IPInput)
                            setIPModal(false)
                            setIp(IPInput)}}>
                        <Text>Submit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={{width:84,height:32, backgroundColor:'red', justifyContent:'center', alignItems:'center', borderRadius:5, margin:8}}
                        onPress={()=>{
                            setIPModal(false)
}}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>

                </View>
                
            
            </Modal>
            <ScrollView>
            <LinearGradient style={styles.controlPanel} start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#1b4264', '#3784c8']}>
                {server?<><Controls 
                streamMessage={streamMessage}
                recordingMessage={recordingMessage}
                nav={props.navigation} 
                streaming={isStreaming} 
                recording={isRecording} 
                toggle={toggleStreamRecord} 
                ip={ip}/>
                {reloadButton}
                <View style={styles.body}>
                    <Scenes data={sceneData} server={server}/>

                </View>
                <Status status={StreamStatus}/>

                </>:<View style={styles.message}><Text style={styles.messageTxt}><Text style={{color:'red', fontSize:32}}>CANNOT FIND OBS </Text>Please make sure that the SCTV Desktop App and OBS are running, and then press "Reconnect". If you need help, press "Instructions".</Text>
                    </View>}
                
                <View style={{flexDirection:'row', marginBottom:64}}>
                    <TouchableOpacity onPress={()=>setServer(new OBSWebSocket)} style={styles.button}>
                    <Text style={{color:'darkblue'}}>
                        Reconnect
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={ ()=> Linking.openURL(`https://stream.streamingchurch.tv/stream.php?churchid=${props.navigation.getParam('orgId')}`) } >
                    <Text style={{color:'darkblue'}}>
                        View Stream
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={ ()=> Linking.openURL(`https://streamingchurch.tv/obs_remote`) } >
                    <Text style={{color:'darkblue'}}>
                        Instructions
                    </Text>
                </TouchableOpacity>

                </View>
                    


                
                
                 
            </LinearGradient>
            </ScrollView>
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
        // height:400,
    },
    button: {
        width:100,
        backgroundColor: 'white',
        justifyContent:'center',
        alignItems:'center',
        height: 32,
        color: 'blue',
        borderRadius:5,
        marginHorizontal:5
    },
    message: {
        width:'95%',
        backgroundColor:'white',
        justifyContent:'center',
        alignItems:'center',
        margin:64,
        borderRadius:5,

    },
    messageTxt: {
        fontSize:24,
        justifyContent:'center',
        alignItems:'center',
        padding:18,
        textAlign:'center',
        color: 'grey'
    },
    modal: {
        paddingVertical:100,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'blue'
    },
    ipInput : {
        width:250,
        height:32
    }
})