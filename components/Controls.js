import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, ImageBackground, Image} from 'react-native';
import Icon from "react-native-vector-icons/Feather"
import logo from '../assets/logo2-white.png'

const Controls = (props) => {

    return (
        <View style={styles.container}>
            <View style={styles.bar}>
                <Image source={logo} resizeMode="contain" style={{width:'70%', height:32, justifyContent:'center', alignItems:'center'}}></Image>
            </View>
            <View style={styles.buttons}>
                <TouchableOpacity style={styles.button} onPress={()=>props.toggle('stream')}>
                    <Icon
                        name={props.streaming?'stop-circle':'play'}
                        color="white"
                        size={25}
                    />
                    <Text style={styles.text}>{props.streaming?'Press to stop stream':'Start stream'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={()=>props.toggle('record')}>
                    <Icon
                        name={'settings'}
                        color="white"
                        size={25}
                    />
                    <Text style={styles.text}>{props.recording?'Press to stop recording':'Start recording'}</Text>
                </TouchableOpacity>
            </View>
            
            

        </View>
    )
}

export default Controls;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        // height: Dimensions.get('screen').height/4,

    },
    buttons: {
        flexDirection:'row',
        padding:32,
        justifyContent:'space-evenly'
    },
    button: {
        width:(Dimensions.get('screen').width/2)-32,
        height:(Dimensions.get('screen').height/2)/3.33,
        justifyContent:'center',
        alignItems:'center',
        borderColor:'white',
        borderRightWidth:1
    },
    text: {
        color:'white'
    },
    bar: {
        width:'100%',
        height:64,
        backgroundColor:'#fbfbfb',
        justifyContent:'center',
        alignItems:'flex-start'
    }
})


