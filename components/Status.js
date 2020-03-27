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
        return (
            <View style={styles.container}>
                <Text style={styles.title}>
                    Dropped Frames: <Text style={styles.value}>0</Text>
                </Text>
                <Text style={styles.title}>
                    LIVE: <Text style={styles.value}>N/A</Text>
                </Text>
                <Text style={styles.title}>
                    REC: <Text style={styles.value}>N/A</Text>
                </Text>
                <Text style={styles.title}>
                    CPU: <Text style={styles.value}>N/A</Text>
                </Text>
                <Text style={styles.title}>
                    kb/s: <Text style={styles.value}>0</Text>
                </Text>
            </View>
        ) 
    }
    
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:"#1F213F",
        justifyContent:'center',
        alignItems:'center',
        width:350,
        padding:32,
        marginVertical:16

    },
    title: {
        // width:250,
        padding:4,
        color:'white',
        fontWeight:'bold'

    },
    value: {
        color:"lime"

    }
})
