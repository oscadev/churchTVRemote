import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, ImageBackground, Image} from 'react-native';
import Icon from "react-native-vector-icons/Feather"
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons"
import logo from '../assets/logo2-white.png'

const Controls = (props) => {

    return (
        <View style={styles.container}>
            <View style={styles.bar}>
                <Image source={logo} resizeMode="contain" style={{width:'70%', height:32, justifyContent:'center', alignItems:'center'}}></Image>
                <TouchableOpacity style={{marginLeft:'auto', padding:16}} onPress={()=>props.nav.navigate('Scheduler')}>
                    <Icon
                        name={'settings'}
                        color="#3784c8"
                        size={25}
                    />

                </TouchableOpacity>
            </View>
            <View style={styles.buttons}>
                <TouchableOpacity style={styles.button} onPress={()=>props.toggle('stream')}>
                    <Icon2
                        name={props.streaming?'stop-circle':'signal-variant'}
                        color="white"
                        size={25}
                    />
                    <Text style={styles.text}>{props.streaming?'Press to stop stream':'Start stream'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={()=>props.toggle('record')}>
                    <Icon
                        name={'save'}
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
        backgroundColor:'#3379B8',
        alignItems:'center',
        marginHorizontal:16,
        borderColor:'white',
        // borderRightWidth:1,
        borderRadius:15,
    },
    text: {
        color:'white'
    },
    bar: {
        width:'100%',
        height:64,
        backgroundColor:'#fbfbfb',
        justifyContent:'flex-start',
        alignItems:'center',
        flexDirection:'row'
    }
})


