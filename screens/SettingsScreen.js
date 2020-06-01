import React from 'react'
import { View, Text, Switch, Modal, Button, Picker, Dimensions, TouchableOpacity } from 'react-native';
import moment from 'moment'
import { SafeAreaView } from 'react-native-safe-area-context';

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
    const [howLong, setHowLong] = React.useState(30)
    const [day, setDay] = React.useState('Sunday')
    const [modal, setModal] = React.useState(false)
    const [start, setStart] = React.useState(new Date('December 17, 2020 8:30:00'))
    const [startVal, setStartVal] = React.useState("8:30")


    const makePickerItems = () =>
    {
        let temp = []
        for(let i = 8; i<23; i++)
        {


            temp.push(<Picker.Item key={i} label={`${i>12?i-12:i}:00 ${i>11?"pm":"am"}`} value={`${i}:00`}/>)
            temp.push(<Picker.Item key={i+1000} label={`${i>12?i-12:i}:30 ${i>11?"pm":"am"}`} value={`${i}:30`}/>)
        }
        return temp
    }

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
                            Every {day} from {moment(start).format("hh:mm a")} to {moment(start).add(howLong, 'minutes').format("hh:mm a")}
                        </Text>

                    </View>

                    <View style={{flexDirection:'row', width: "100%", justifyContent:'space-between', marginVertical:64, width:320}}>
                            <TouchableOpacity onPress={()=>setModal(!modal)} containerStyle={{width:150, height:32, justifyContent:'center', alignItems:'center', backgroundColor:'green'}}>
                                <Text style={{color:'red'}}>
                                    CANCEL
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>saveSchedule({type:type, day:day, start:start, end:moment(start).add(howLong, 'minutes')})} containerStyle={{width:150, height:32, justifyContent:'center', alignItems:'center', backgroundColor:'white'}}>
                                <Text style={{color:'green'}}>
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
                            Starts at
                        </Text>
                        <Text style={{color:'white'}}>
                            How long?
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
                        <Picker
                            selectedValue={startVal}

                            onValueChange={(itemValue, itemIndex) =>
                                {

                                    setStart(new Date(`December 17, 2020 ${itemValue}`))
                                    setStartVal(itemValue)
                            }
                            }>
                                {makePickerItems()}
                            {/* <Picker.Item label="8:00 am" value={"8:00"}/>
                            <Picker.Item label="8:30 am" value={"8:30"}/> */}
                            {/* <Picker.Item label="9:00 am" value={new Date('December 17, 2020 09:00')}/>
                            <Picker.Item label="9:30 am" value={new Date('December 17, 2020 09:30')}/>
                            <Picker.Item label="10:00 am" value={new Date('December 17, 2020 10:00:00')}/>
                            <Picker.Item label="10:30 am" value={new Date('December 17, 2020 10:30')}/>
                            <Picker.Item label="11:00 am" value={new Date('December 17, 2020 11:00')}/>
                            <Picker.Item label="11:30 am" value={new Date('December 17, 2020 11:30')}/>
                            <Picker.Item label="12:00 pm" value={new Date('December 17, 2020 12:00')}/>
                            <Picker.Item label="12:30 pm" value={new Date('December 17, 2020 12:30')}/>
                            <Picker.Item label="1:00 pm" value={new Date('December 17, 2020 13:00')}/>
                            <Picker.Item label="1:30 pm" value={new Date('December 17, 2020 13:30')}/>
                            <Picker.Item label="2:00 pm" value={new Date('December 17, 2020 14:00')}/>
                            <Picker.Item label="2:30 pm" value={new Date('December 17, 2020 14:30')}/>
                            <Picker.Item label="3:00 pm" value={new Date('December 17, 2020 15:00')}/>
                            <Picker.Item label="3:30 pm" value={new Date('December 17, 2020 15:30')}/>
                            <Picker.Item label="4:00 pm" value={new Date('December 17, 2020 16:00')}/>
                            <Picker.Item label="4:30 pm" value={new Date('December 17, 2020 16:30')}/>
                            <Picker.Item label="5:00 pm" value={new Date('December 17, 2020 17:00')}/>
                            <Picker.Item label="5:30 pm" value={new Date('December 17, 2020 17:30')}/>
                            <Picker.Item label="6:00 pm" value={new Date('December 17, 2020 18:00')}/>
                            <Picker.Item label="6:30 pm" value={new Date('December 17, 2020 18:30')}/>
                            <Picker.Item label="7:00 pm" value={new Date('December 17, 2020 19:00')}/>
                            <Picker.Item label="7:30 pm" value={new Date('December 17, 2020 19:30')}/>
                            <Picker.Item label="8:00 pm" value={new Date('December 17, 2020 20:00')}/>
                            <Picker.Item label="8:30 pm" value={new Date('December 17, 2020 20:00')}/>
                            <Picker.Item label="9:00 pm" value={new Date('December 17, 2020 21:00')}/>
                            <Picker.Item label="9:30 pm" value={new Date('December 17, 2020 21:00')}/>
                            <Picker.Item label="10:00 pm" value={new Date('December 17, 2020 22:00')}/>
                            <Picker.Item label="10:30 pm" value={new Date('December 17, 2020 22:00')}/>
                            <Picker.Item label="11:00 pm" value={new Date('December 17, 2020 23:00')}/>
                            <Picker.Item label="11:30 pm" value={new Date('December 17, 2020 23:00')}/>
                            <Picker.Item label="12:00 am" value={new Date('December 17, 2020 00:00')}/>
                            <Picker.Item label="12:30 am" value={new Date('December 17, 2020 00:00')}/> */}
                        </Picker>
                    </View>
                    <View style={{backgroundColor:'white', width:(Dimensions.get('screen').width-100)/2}} >
                        <Picker
                            selectedValue={howLong}

                            onValueChange={(itemValue, itemIndex) =>
                                setHowLong(itemValue)
                            }>
                            <Picker.Item label="30 min" value="30"/>
                            <Picker.Item label="1 hr" value="60" />
                            <Picker.Item label="1.5 hr" value="90" />
                            <Picker.Item label="2 hr" value="120" />
                            <Picker.Item label="2.5 hr" value="150" />
                            <Picker.Item label="3 hr" value="180" />
                            <Picker.Item label="3.5 hr" value="210" />
                            <Picker.Item label="4 hr" value="240" />
                        </Picker>
                    </View>
                    
                    {/* <View style={{backgroundColor:'white', width:(Dimensions.get('screen').width-100)/2}} >
                        <DateTimePicker 
                        minuteInterval={15}
                        value={time} 
                        onChange={(e,d)=>setTime(d)} 
                        mode="time"
                        testID="dateTimePicker"
                        />

                    </View>
                    <View style={{backgroundColor:'white', width:(Dimensions.get('screen').width-100)/2}} >
                        <DateTimePicker 
                        style={{color:'red'}}
                         minuteInterval={15}
                        value={endTime} 
                        onChange={(e,d)=>setEndTime(d)} 
                        mode="time"
                        testID="dateTimePicker"
                        
                        />

                    </View> */}

                    </View>
                    

                </View>
                

            </Modal>
            


            
        </SafeAreaView>
        </LinearGradient>
    )
}

export default SettingsScreen;
