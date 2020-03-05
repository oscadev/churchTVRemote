import React from 'react'
import { View, Text, Switch, AsyncStorage } from 'react-native';

const SettingsScreen = (props) => {
    const [churchMode, setChurchMode] = React.useState(true)
    const [churchMode2, setChurchMode2] = React.useState(true)
    const [churchMode3, setChurchMode3] = React.useState(true)

    // const saveData = async () => {
    //     try {
    //       await AsyncStorage.setItem('churchmode', JSON.stringify(churchMode));
    //       console.log('changed to: ',churchMode)
    //     } catch (error) {
    //       // Error saving data
    //     }
    //   };

    // const getData = async () => {
    //     try {
    //       const value = await AsyncStorage.getItem('churchmode');
    //       console.log('my value here is: ', value)
          
    //     } catch (error) {
    //         saveData()
    //     }
    // };

    React.useEffect(()=>{
        // getData()
    },[])




    React.useEffect(()=>{
        // saveData()

    },[churchMode]);


    return (
        <View>
            <Text>Some Option 1</Text>
            <Switch value={churchMode} onValueChange={()=>setChurchMode(!churchMode)}/>
            <Text>Some Option 2</Text>
            <Switch value={churchMode2} onValueChange={()=>setChurchMode2(!churchMode2)}/>
            <Text>Some Option 3</Text>
            <Switch value={churchMode3} onValueChange={()=>setChurchMode3(!churchMode3)}/>
            
        </View>
    )
}

export default SettingsScreen;
