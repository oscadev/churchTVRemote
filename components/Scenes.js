import React from 'react';
import {View, Text, SafeAreaView, ActivityIndicator, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import { useHeaderHeight } from 'react-navigation-stack';
import { ScrollView } from 'react-native-gesture-handler';

const Scenes = (props) => {
    const [current, setCurrent] = React.useState('qwert');
    const [sceneDivs, setSceneDivs] = React.useState([]);
    const [counter, setCounter] = React.useState(0)

    const makeScenes = (data) =>{
        let temp = [];
        console.log('scenes data is: ', data)
        data.scenes.forEach((e,i) => {
            temp.push(
                <TouchableOpacity key={i} onPress={()=>setScene(e.name)} style={styles.box}>
                    <View style={styles[e.name===props.data['current-scene']?['active']:['inactive']]}>
                        <Text style={{color:'white', fontSize:(Dimensions.get('screen').width/18), textAlign:'center', padding:8}}>{e.name}</Text>
                    </View>
                    

                </TouchableOpacity>
            )
        });

        setSceneDivs(temp)
        setCurrent(props.data['current-scene'])
    }

    const setScene = (name) => {

        setCurrent(name)
        props.server.send('SetCurrentScene',{'scene-name':name}).then(data=>{
            console.log('data status right after press: ',data)
            
        })
    }

    React.useEffect(()=>{
        if(props.data){
            makeScenes(props.data)

            
        }
    },[props.data])

    return (
        <View style={{height:"100%"}}>
            <ScrollView style={styles.scenes}>
                {sceneDivs}


            </ScrollView>
        </View>
        
    )
}

export default Scenes;

const styles = StyleSheet.create({
    scenes: {
        // width:'100%',
        // flexWrap:'wrap',
        flexDirection:'column',
        height:'100%',


        borderTopWidth:.5,
        borderColor:'white',
        borderLeftWidth:.5
    },
    box: {
        justifyContent:'center',
        alignItems:'center',
        width:"33.33%",
        height: 100,
        borderColor: 'white',
        borderRightWidth:.5,
        borderBottomWidth:.5

    },
    active: {

        backgroundColor:'rgba(255, 254, 252, 0.5)',
        justifyContent:'center',
        alignItems:'center',
        width:'100%',
        height:'100%',
        color:'grey'
        

    },
    inactive: {


        justifyContent:'center',
        alignItems:'center'

    }
})