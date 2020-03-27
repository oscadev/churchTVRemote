import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button } from 'react-native-paper';
import Axios from 'axios';
import logo from '../assets/logo.png'



export const LoginScreen = (props) => {
    const [email, setEmail] = React.useState("steve@tipcard.me");
    const [password, setPassword] = React.useState("hello123");
    const [orgId, setOrgId] = React.useState('')

    const api1 = (em, pass) => {
        Axios.get(`https://streamingchurch.tv/streaming/api_admin_login.php?api_key=oscaranguianoapikeyforjslsolutions&admin_email=${em}&password=${pass}`)
        .then(d=>{
            // console.log(d.data)
            if(d.data.status==="success"){
                setOrgId(d.data.org_id)
            }else{
                alert("Incorrect Login")
            }
            
        })
    };

    const api2 = (id) => {
        Axios.get(`https://streamingchurch.tv/streaming/api_sctv_credentials.php?api_key=oscaranguianoapikeyforjslsolutions&org_id=${id}`)
        .then(d=>{
            // console.log(d.data)
            if(d.data.status==="success"){
                props.navigation.navigate('Control', {user:d.data})
            }
        })
    }

    React.useEffect(()=>{
        if(orgId){
            api2(orgId)
            
        }
        
    },[orgId])

    React.useEffect(()=>{
        
    },[])


    return (
        <LinearGradient style={styles.screen} start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#00258D', 'black']}>
            <SafeAreaView style={styles.safe}>
                <View style={styles.inputs}>
                    <TextInput
                    
                        mode='flat'
                        label='Email'
                        value={email}
                        onChangeText={text => setEmail(text)}
                        style={{backgroundColor:'white', marginBottom:32}}
                        autoCapitalize='none'
                        autoCorrect={false}
                        autoCompleteType='email'
                        keyboardType='email-address'
                        returnKeyType='next'

                        
                    />
                    <TextInput
                        mode='flat'
                        
                        label='Password'
                        value={password}
                        onChangeText={text => setPassword(text)}
                        style={{backgroundColor:'white'}}
                        returnKeyType='default'
                        autoCapitalize='none'
                        autoCorrect={false}
                        autoCompleteType='password'
                        secureTextEntry={true}
                        onSubmitEditing={()=>api1(email,password)}
                        
                        
                    />
                </View>
                
                <Button icon="" mode="contained" onPress={() => api1(email,password)} style={{backgroundColor:'green', marginTop:16}}>
                    Login
                </Button>
                <Button icon="" mode="contained" onPress={() => getIP()} style={{backgroundColor:'green', marginTop:16}}>
                    get IP
                </Button>
                {/* <Image source={logo} style={{width:100, height:120}}/> */}

            </SafeAreaView>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    screen: {

         justifyContent:'flex-start',
         alignItems:'center',
         minHeight:'100%'

    },
    safe: {
        width:'100%',
        height: '100%',
        justifyContent:'flex-start',
        alignItems:'center'
    },
    inputs: {
        width:200,

    }
})