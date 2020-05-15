import React from 'react'
import { View, Text, Switch, Modal, Button, Picker, Dimensions } from 'react-native';
import moment from 'moment'
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import store from 'react-native-simple-store';
import Axios from 'axios';
import Icon from "react-native-vector-icons/Feather"

const SettingsScreen = (props) => {
    const [items, setItems] = React.useState([])
    const [type, setType] = React.useState(null)
    const [time, setTime] = React.useState(new Date('December 17, 2020 10:00:00'));
    const [endTime, setEndTime] = React.useState(new Date('December 17, 2020 11:30:00'));
    const [day, setDay] = React.useState('Sunday')
    const [modal, setModal] = React.useState(false)



    const getData = () => {
        store.get('schedules')
        .then((res) => {
            Axios.post(`http://${props.navigation.getParam('ip')}:3020/schedules`, {"schedules":res}).then(d=>{
                try{
                if(d.data.length){
                    makeItems(d.data)
                }
                else{
                    makeItems([])
                }
                
            }
            catch(err){
            }
                alert('To add scheduled events, this app needs the SCTV Desktop App. Make sure it is installed and running on the same computer that has OBS, and try again.')
            }).catch(err=>alert('To add scheduled events, this app needs the SCTV Desktop App. Make sure it is installed and running on the same computer that has OBS, and try again.'))
            
        }
            
        )
    }

    const removeScheduleItem = (index) =>
    {
        store.get('schedules').then(d=>
            {
                let temp = d.filter((e,i)=>
                {
                    if (index!==i)
                    {
                        return true
                    }
                })
                store.delete('schedules')
                .then(async h=>
                    {
                        for(let ind = 0; ind<temp.length;ind++)
                        {
                            await store.push('schedules', temp[ind])
                        }
                        
                    })
                    .then(p=>
                        {
                            getData()
                        })
                

            })
            
    }

    const saveSchedule = (sch) => {
        store.push("schedules", sch).then(d=>getData())
        setModal(false)
        
        
    }

    React.useEffect(()=>{

        getData()

    },[])

    const makeItems = (arr) => {
        let temp = arr.map((e,i) => {
            return (<View key={i} style={{width:350, height:48, backgroundColor:"white", justifyContent:'space-between', alignItems:'center', flexDirection:'row', padding:8, marginVertical:4}}>
                <Text style={{backgroundColor:e.type==="stream"?"#7CFFE2":"#FFFF45", padding:8}}>
                        {e.type.toUpperCase()}
                    </Text>
                <Text>
                      {e.day.toUpperCase().slice(0,3)} from {moment(e.start).format("hh:mm a")} to {moment(e.end).format("hh:mm a")}
                </Text>
                <TouchableOpacity onPress={()=>removeScheduleItem(i)} style={{width:48, height:'100%', borderColor:'red', justifyContent:'center', alignItems:'center'}}>
                    <Icon
                            name={'delete'}
                            color="red"
                            size={25}
                    />
                </TouchableOpacity>
            </View>)
            
       })

        setItems(temp)
    }







    return (
        <LinearGradient style={{

            justifyContent:'flex-start',
            alignItems:'center',
            minHeight:'100%'
   
       }} start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#00258D', 'black']}>
        <SafeAreaView>
            <View>
                {items}
            </View>
            
            <Button title="Add Stream Schedule" color="#3379B8" onPress={()=>
            {
                setType('stream')
                setModal(!modal)
            }}
            />
            <Button title="Add Recording Schedule" color="#3379B8" onPress={()=>
            {
                setType('record')
                setModal(!modal)
            }}
            />
            {/* <Button title="Test Store" color="#3379B8" onPress={()=>getData()}/> */}
            {/* <Button title="DELETE TEST" onPress={()=>{
                
                store.delete("schedules")
                getData()
                }}/> */}
            

            <Modal visible={modal} animationType='slide' transparent>
                <View style={{height:'100%', justifyContent:'flex-end', alignItems:'center',backgroundColor:'#1F213F'}}> 
                    <View style={{height:'100%'}} onTouchStart={()=>setModal(!modal)}></View>

                    <View style={{width:"90%", backgroundColor:'white', height:64, justifyContent:'center', alignItems:'center'}}>
                        <Text>
                            Every {day} from {moment(time).format("hh:mm a")} to {moment(endTime).format("hh:mm a")}
                        </Text>

                    </View>

                    <View style={{flexDirection:'row', width: "100%", justifyContent:'space-between', marginVertical:64, width:320}}>
                            <TouchableOpacity onPress={()=>setModal(!modal)} containerStyle={{width:150, height:32, justifyContent:'center', alignItems:'center', backgroundColor:'red'}}>
                                <Text style={{color:'white'}}>
                                    CANCEL
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>saveSchedule({type:type, day:day, start:time, end:endTime})} containerStyle={{width:150, height:32, justifyContent:'center', alignItems:'center', backgroundColor:'white'}}>
                                <Text style={{color:'black'}}>
                                    SAVE
                                </Text>
                            </TouchableOpacity>
                        </View>

                    {/* bar */}
                    <View style={{flexDirection:'row', width:'100%', backgroundColor:'transparent', justifyContent:'flex-start', alignItems:'center', padding:16}}>
                        <Text style={{color:'white', width:100}}>
                            Day 
                        </Text>
                        <Text style={{color:'white', width:(Dimensions.get('screen').width-100)/2}}>
                            Beginning
                        </Text>
                        <Text style={{color:'white'}}>
                            Ending
                        </Text>
                       
                        
                    </View>
                    <View style={{flexDirection:'row'}}>
                    <View style={{backgroundColor:'#3379B8', width:100}}>
                        
                        <Picker
                            selectedValue={day}

                            onValueChange={(itemValue, itemIndex) =>
                                setDay(itemValue)
                            }>
                            <Picker.Item label="Sunday" value="Sunday"/>
                            <Picker.Item label="Monday" value="Monday" />
                            <Picker.Item label="Tuesday" value="Tuesday" />
                            <Picker.Item label="Wednesday" value="Wednesday" />
                            <Picker.Item label="Thursday" value="Thursday" />
                            <Picker.Item label="Friday" value="Friday" />
                            <Picker.Item label="Saturday" value="Saturday" />
                        </Picker>
                    </View>
                    
                    <View style={{backgroundColor:'white', width:(Dimensions.get('screen').width-100)/2}} >
                        <DateTimePicker 
                    //  minuteInterval={15}
                        value={time} 
                        onChange={(e,d)=>setTime(d)} 
                        mode="time"
                        testID="dateTimePicker"
                        />

                    </View>
                    <View style={{backgroundColor:'#E3E3E3', width:(Dimensions.get('screen').width-100)/2}} >
                        <DateTimePicker 
                        style={{color:'red'}}
                    //  minuteInterval={15}
                        value={endTime} 
                        onChange={(e,d)=>setEndTime(d)} 
                        mode="time"
                        testID="dateTimePicker"
                        
                        />

                    </View>

                    </View>
                    

                </View>
                

            </Modal>
            


            
        </SafeAreaView>
        </LinearGradient>
    )
}

export default SettingsScreen;
