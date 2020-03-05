import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'

export const Status = ({status}) => {
    if(status){
       return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Dropped Frames: <Text style={styles.value}>{status.droppedFrames}</Text>
            </Text>
            <Text style={styles.title}>
                LIVE: <Text style={styles.value}>{status.live.slice(0,8)}</Text>
            </Text>
            <Text style={styles.title}>
                REC: <Text style={styles.value}>{status.cpu.toFixed(1)}%</Text>
            </Text>
            <Text style={styles.title}>
                CPU: <Text style={styles.value}>{status.cpu.toFixed(1)}%</Text>
            </Text>
            <Text style={styles.title}>
                kb/s: <Text style={styles.value}>{status.kbs}</Text>
            </Text>
        </View>
    ) 
    }else{
        return null
    }
    
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'black',
        justifyContent:'center',
        width:Dimensions.get('screen').width/2

    },
    title: {
        width:150,
        padding:4,
        color:'white',
        fontWeight:'bold'

    },
    value: {
        color:"lime"

    }
})
