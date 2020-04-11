import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { TextInput, Button } from 'react-native-paper';
import Axios from 'axios';
import logo from '../assets/logo2-white.png'
import store from 'react-native-simple-store';



export const LoginScreen = (props) => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [orgId, setOrgId] = React.useState('')

    const checkIfLoggedIn = () =>
    {
        store.get('login')
        .then(data=>
            {
                if(data)
                {
                    api1(data.email, data.password)
                }
            })
    }

    const api1 = (em, pass) => {
        Axios.get(`https://streamingchurch.tv/streaming/api_admin_login.php?api_key=oscaranguianoapikeyforjslsolutions&admin_email=${em}&password=${pass}`)
        .then(d=>{
            if(d.data.status==="success"){
                setOrgId(d.data.org_id)
                store.update('login', {
                    email:em,
                    password:pass
                })
            }else{
                alert("Incorrect Login")
                store.delete('login')
            }
            
        })
    };

    const api2 = (id) => {
        Axios.get(`https://streamingchurch.tv/streaming/api_sctv_credentials.php?api_key=oscaranguianoapikeyforjslsolutions&org_id=${id}`)
        .then(d=>{
            if(d.data.status==="success"){
                props.navigation.navigate('Control', {user:d.data, orgId:orgId})
                setOrgId('')
            }
        })
    }

    React.useEffect(()=>{
        if(orgId){
            api2(orgId)
            
        }
        
    },[orgId])

    React.useEffect(()=>{
        checkIfLoggedIn()
        
    },[])


    return (
        <LinearGradient style={styles.screen} start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#3784c8', '#00258D']}>
            <SafeAreaView style={styles.safe}>
                <View style={{width:'100%',
        height:64,
        backgroundColor:'#fbfbfb',
        justifyContent:'flex-start',
        alignItems:'center',
        flexDirection:'row',
        marginBottom:64}}>
                   <Image source={logo} resizeMode="contain" style={{width:200,justifyContent:'center', alignItems:'center'}}></Image> 
                </View>
            
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
                
                <Button icon="" mode="contained" onPress={() => api1(email,password)} style={{backgroundColor:'#3784c8', marginTop:16}}>
                    Login
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