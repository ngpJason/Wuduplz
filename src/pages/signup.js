import React from 'react';
import {
  View, 
  Text, 
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';

import { TextInput} from 'react-native-paper';
import {inject,observer } from "mobx-react";
import request from '../util/request'
import Toast from '../util/Toast'
import Geolocation from 'react-native-geolocation-service';
import socketIOClient from "socket.io-client";
import axios from 'axios'
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'
import { SERVER_ADDRESS } from '../../data/address';
import AntDesign from "react-native-vector-icons/AntDesign";
import { ReactNativeFirebase } from '@react-native-firebase/app';


const api_key = "AIzaSyAWtsz4ALYdHQJKRSeGv-invChqgL7tAFs"

const cache = []

const verificationTime = []




const AddRequest = ({ navigation,RootStore }) => {
  //input values====================================================================================
  const [email, onChangeEmail] = React.useState('');
  const [country,onChangeCountry] = React.useState('');
  const [province,onChangeProvince] = React.useState('');
  const [city,onChangeCity] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const [password1, onChangePassword1] = React.useState('');
  const [username, onChangeUserName] = React.useState('');
  const [age, setAge] = React.useState(0);
  const [keyword1,onChange1] = React.useState('')
  const [keyword2,onChange2] = React.useState('')
  const [keyword3,onChange3] = React.useState('')
  const [latitude,setLat] = React.useState(0)
  const [longitude,setLong] = React.useState(0)
  const [birthday,onChangeBirthDay]= React.useState(0)
//==================================================================================================



  const [Eindicator,setEindicator] = React.useState(false)
  const [generatedCode,setGeneratedCode]= React.useState('')
  const [codeTime,setCodeTime] = React.useState(0)

  const [codeStatus,setCodeStatus] = React.useState(-1)

  const [verificationCode,setVerificationCode]= React.useState('')
  const [verifyMessageIndicator,setVerifyMessageIndicator] = React.useState(false)
  const [loadIndicator,setLoadIndicator] = React.useState(false)

  const [passwordInfoIndicator,setPasswordInfoIndicator]= React.useState(false)

  const [passwordInterruptIndicator,setPasswordInterruptIndicator]= React.useState(false)

  const [passwordTime,setPasswordTime]= React.useState(0)

  const [countDownIndicator,setCountDownIndicator]=React.useState(false)

  const [countDown,setCountDown]=React.useState(0)

  const [passwordVisible, setPasswordVisible] = React.useState(true);

  const [passwordVisibleSecond, setPasswordVisibleSecond] = React.useState(true);



  //const regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  const regEmail =/^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/
  



  const changeEmail=(text)=>{
    onChangeEmail(text)
    setTimeout(()=>{
      if(text=='')
        setEindicator(false)
     else
        setEindicator(true)
    },1000)
  }

  



  const setLocations = async(lat,long)=>{
    var result = await axios.get('https://maps.googleapis.com/maps/api/geocode/json?'+'address='+lat+','+long+'&key='+api_key)
    var final = JSON.parse(result.request._response).results[0].address_components
    for(var i=0;i<final.length;i++){
    console.log(final[i])
     if(final[i].types[0]=='locality')
        onChangeCity(final[i].long_name)

     if(final[i].types[0]=='administrative_area_level_1')
        onChangeProvince(final[i].long_name)

     if(final[i].types[0]=='country')
        onChangeCountry(final[i].long_name)
    }

  }

  const hasLocationPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert('Location permission denied');
    }

    if (status === 'disabled') {
      Alert.alert(
        `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
        '',
        [
          { text: 'Go to Settings', onPress: openSetting },
          { text: "Don't Use Location", onPress: () => {} },
        ],
      );
    }

    return false;
  };

  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasLocationPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };


  const getLocation = async()=>{
    await hasLocationPermission();
    // if (!hasLocationPermission) {
    //   return;
    // }


    console.log('fetching the location')
    Geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        setLocations(position.coords.latitude,position.coords.longitude)
        //setLocations(35.4215,-79.6972)
      },
      (error) => {
        
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 10000 }
  );
         

  }
  const disconnect =()=>{
    socket.disconnect()
  }

  const Start = async ()=>{
   
      let code =await axios.get(`${SERVER_ADDRESS}/front-end/verifyUser/${email.toLowerCase()}/${verificationCode}`)
      var status=code.data.status
      var message = code.data.message
      var keywords = []
      if(keyword1!='')
        keywords.push(keyword1)
      if(keyword2!='')
        keywords.push(keyword2)
      if(keyword3!='')
        keywords.push(keyword3)

      if(age==1){
        setAge(new Date().getFullYear()-birthday)
      }

      var data = {
        'Email':email.toLowerCase(),
        'PassWord':password,
        'UserName':username,
        'City':city,
        'Country':country,
        'Age':age,
        'Province':province,
        'Keywords':keywords
      }
      if(verificationCode==''){
        Toast.info('please input verification code')
      }else if(status!=2){
        Toast.info(message)
      }
      else if(data['Email']==''||data['Password']=='' || data['UserName']==''){
          Toast.info('no blank input')
      }else if(password!=password1){
        Toast.info('please make sure you type the same password')
      }
      else{
        console.log(data)
        let result = await request.post('/front-end/addUser',data)
        console.log(result)
        if(!result.status){
          Toast.fail(result.message)
        }else{
        Toast.smile('succes!')
        navigation.navigate('Login')
        }
      }
   
   
  }

  const checkPassword = async(text)=>{
    return new Promise((resolve,reject)=>{
      setTimeout(()=>{
        console.log('password is ',password,'password1 is ',password1)

        if(password==text){
          resolve(true)
        }
        else{
          resolve(false)
        }
            
      },3000)
    })
  }
  
  return (
    <ScrollView>

  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center',alignSelf: 'stretch',paddingTop:45}}>

    <Text style={styles.step}> Email </Text>
    <View style={{flexDirection:'row'}}>
      <TextInput
        style={{ height: 40, borderColor: 'blue', borderWidth: 1, margin: 10, width: (2*Dimensions.get('window').width)/3 }}
        onChangeText={text => changeEmail(text)}
        keyboardType={'email-address'}
        placeholder={'Your email'}
        value={email}
        autoCapitalize='none'
      />
      <TouchableOpacity style={{paddingVertical:5,borderRadius:9,borderWidth:1,height:40,marginVertical:10,backgroundColor:'blue'}}
      onPress={async()=>{
        if(countDown==0){
        if(regEmail.test(email)){
          let result = await request.get(`/sendCode/${email.toLowerCase()}`)
          Toast.success('code has been sent')
          setCountDown(60)
          setCountDownIndicator(true)
          const currentTime = Date.now()
          const endTime=Date.now()+60000
          setInterval(()=>{
            if(((endTime-Date.now())/1000).toFixed(0)>=0){
                setCountDown(((endTime-Date.now())/1000).toFixed(0))
            }
            if(((endTime-Date.now())/1000).toFixed(0)==0){
              setCountDownIndicator(false)
            }
          },1000)
        }else
          Toast.info('please input valid email addrss')
      }else{
        Toast.info('wait')
      }
      }}>
        {countDownIndicator?<Text style={{fontSize:10,width:Dimensions.get('window').width/4,alignSelf:'stretch',textAlign:'center',color:'white'}}>{countDown}</Text>:<Text style={{fontSize:10,width:Dimensions.get('window').width/4,alignSelf:'stretch',textAlign:'center',color:'white'}}>Send Verification Code</Text>}
      </TouchableOpacity>
      </View>
      {Eindicator && <View>{regEmail.test(email)?<Text style={{color:'green'}}>valid email address format</Text>:<Text style={{color:'red'}}>invalid email address!</Text>}</View>
      }

<View style={{flexDirection:'row',alignSelf:'baseline'}}>
  <TextInput
          style={{ height: 40, borderColor: 'blue', borderWidth: 1, margin: 13, width: (2*Dimensions.get('window').width)/3 }}
          onChangeText={text =>{
            setVerificationCode(text)
            if(text==''||email==''){
              if(verificationTime.length!=0){
                verificationTime.pop()
            }
            verificationTime.push(Date.now())
              setVerifyMessageIndicator(false)
            }else{
            if(verificationTime.length!=0){
                verificationTime.pop()
            }
            verificationTime.push(Date.now())
              setTimeout(async()=>{
                if(Date.now()-verificationTime[verificationTime.length-1]>=800){
                  setVerifyMessageIndicator(true)
                  setLoadIndicator(true)
                  console.log('email is ',email,'text is ',text)
                  let result =await axios.get(`${SERVER_ADDRESS}/front-end/verifyUser/${email.toLowerCase()}/${text}`)
                  setCodeStatus(result.data.status)
                  setLoadIndicator(false)
                }
              },800)
            }                
          } }
          keyboardType={'email-address'}
          autoCapitalize='none'
          placeholder={'Verification Code'}
          onBlur={()=>{
            if(verificationCode=='')
              setVerifyMessageIndicator(false)
          }}
          value={verificationCode}
      />
      {/* {verifyMessageIndicator&&<View style={{alignSelf:'center'}}>{
       Date.now()-codeTime>120000?
       <View style={{marginRight: 3,flexDirection:'row',alignItems:'center'}}>
        <AntDesign  name={'closecircleo'} size={15} color={'red'} />
        <Text style={{color:'red',fontSize:10,alignSelf:'center',width:'45%',textAlign:'center'}}>code expired</Text>
      </View>
      :generatedCode==verificationCode?
      <View style={{marginRight: 3,flexDirection:'row',alignItems:'center'}}>
          <AntDesign name={'checkcircleo'} size={15} color={'green'} />
          <Text style={{color:'green',fontSize:10,alignSelf:'center',width:'45%',textAlign:'center'}}>correct verification code</Text>
      </View>
      :<View style={{marginRight: 3,flexDirection:'row',alignItems:'center'}}>
        <AntDesign  name={'closecircleo'} size={15} color={'red'} />
        <Text style={{color:'red',fontSize:10,alignSelf:'center',width:'45%',textAlign:'center'}}>incorrect verification code</Text>
      </View>
      }</View>} */}
      {verifyMessageIndicator&&<View style={{alignSelf:'center'}}>{
       loadIndicator?
       <ActivityIndicator size="large" color="green" />
      :codeStatus==2?<AntDesign name={'check'} size={25} color={'green'} />
      :<AntDesign name={'close'} size={25} color={'red'} />
      }</View>}
  </View>

    <Text style={styles.step}>Password</Text>
    <View style={{flexDirection:'row'}}>
      <TextInput
        style={{ height: 40, borderColor: 'blue', borderWidth: 1, margin: 10, width: Dimensions.get('window').width - 30 }}
        onChangeText={text => onChangePassword(text)}
        secureTextEntry={passwordVisible}
        placeholder={'Set your password'}
        value={password}
      />
      <TextInput.Icon style={{marginTop: 44, marginLeft: Dimensions.get('window').width*1.75}} name={passwordVisible ? "eye" : "eye-off"} onPress={() => setPasswordVisible(!passwordVisible)}/>
    </View>

    <Text style={styles.step}>Please type your password again</Text>
    <View style={{flexDirection:'row'}}>
          <TextInput
            style={{ height: 40, borderColor: 'blue', borderWidth: 1, margin: 10, width: Dimensions.get('window').width - 30 }}
            onChangeText={async(text)=>{
              onChangePassword1(text)
              // if(passwordTime==0){
              //   setPasswordTime(Date.now())
              // }

              //setPasswordTime(Date.now())
              // if(cache.length!=0)
              //   cache.pop()
              // cache.push(Date.now())
              // console.log(cache)

              // setTimeout(async()=>{

              //     //let result = await checkPassword(text)
              //     if(Date.now()-cache[cache.length-1]>=2000){
              //     console.log('Date now is ',Date.now(),'last change time is ',cache)
              //     console.log('typed!')
              //     }

              // },2000)
            }}
            secureTextEntry={passwordVisibleSecond}
            placeholder={'Confirm your password'}
            onBlur={()=>{
              if(password1=='')
                setPasswordInfoIndicator(false)
              else
                setPasswordInfoIndicator(true)
            }}
            value={password1}
          />
          <TextInput.Icon style={{marginTop: 44, marginLeft: Dimensions.get('window').width*1.75}} name={passwordVisibleSecond ? "eye" : "eye-off"} onPress={() => setPasswordVisibleSecond(!passwordVisibleSecond)}/>
        </View>
          {passwordInfoIndicator&&
              <View style={{alignSelf:'center'}}>{
                password!=password1?
                <View style={{marginRight: 3,flexDirection:'row',alignItems:'center'}}>
                  <AntDesign  name={'closecircleo'} size={15} color={'red'} />
                  <Text style={{color:'red',fontSize:10,width:'75%',marginLeft:10}}>incorrect password</Text>
                </View>:
                <View style={{marginRight: 3,flexDirection:'row',alignItems:'center'}}>
                  <AntDesign  name={'checkcircleo'} size={15} color={'green'} />
                  <Text style={{color:'green',fontSize:10,width:'75%',marginLeft:10}}>correct password</Text>
                </View>

          }</View>}
          
    <Text style={styles.step}> Nick Name </Text>
      <TextInput
        style={{ height: 40, borderColor: 'blue', borderWidth: 1, margin: 10, width: Dimensions.get('window').width - 30 }}
        onChangeText={text => onChangeUserName(text)}
        keyboardType={'email-address'}
        placeholder={'User name'}
        value={username}
      /> 



    <Text style={styles.text}> use GPS to get your location </Text>
    <View style={{flexDirection:'row', alignItems:'baseline',}}> 

    <TouchableOpacity activeOpacity={0.5} onPress={getLocation}>
          <View style={styles.GPSbottonON}>
            <Text style={styles.GPSbottonTxt}>GPS</Text>
          </View>
    </TouchableOpacity>

    </View>
    <Text style={styles.text}> Or you can type your city and country </Text> 
    <View style={{flexDirection:'row'}}>
    <TextInput
        style={{ height: 35, borderColor: 'blue', borderWidth: 1, margin: 10, width: Dimensions.get('window').width/3 - 30 }}
        onChangeText={text => onChangeCity(text)}
        keyboardType={'email-address'}
        value={city}
        placeholder={'Your city'}
 
      />

    <TextInput
        style={{ height: 35, borderColor: 'blue', borderWidth: 1, margin: 10, width: Dimensions.get('window').width/3 - 30 }}
        onChangeText={text => onChangeProvince(text)}
        keyboardType={'email-address'}
        value={province}
        placeholder={'Your province'}
 
      />

  <TextInput
        style={{ height: 35, borderColor: 'blue', borderWidth: 1, margin: 10, width: Dimensions.get('window').width/3 - 30 }}
        onChangeText={text => onChangeCountry(text)}
        keyboardType={'email-address'}
        value={country}
        placeholder={'Your country'}

      />
    </View>

    <Text style={styles.text}> Please input three keywords </Text>
    <View style={{flexDirection:'row'}}>
    <TextInput
        style={{ height: 35, borderColor: 'blue', borderWidth: 1, margin: 10, width: Dimensions.get('window').width/3 - 30 }}
        onChangeText={text => onChange1(text)}
        keyboardType={'email-address'}
        placeholder={'keyword1'}
 
      />

    <TextInput
        style={{ height: 35, borderColor: 'blue', borderWidth: 1, margin: 10, width: Dimensions.get('window').width/3 - 30 }}
        onChangeText={text => onChange2(text)}
        keyboardType={'email-address'}
        placeholder={'keyword2'}
 
      />

  <TextInput
        style={{ height: 35, borderColor: 'blue', borderWidth: 1, margin: 10, width: Dimensions.get('window').width/3 - 30 }}
        onChangeText={text => onChange3(text)}
        keyboardType={'email-address'}
        placeholder={'keyword3'}

      />
    </View>

    <View>
    <Text style={styles.text}> Are you more than 21 years old </Text> 
    <View style={{flexDirection:'row',alignItems:'flex-start',width:'95%',alignSelf:'center'}}> 
      <RadioGroup onSelect = {(index, value) => {
        if(index==0)
          setAge(-1)
        else
          setAge(1)}} style={{flexDirection:'row'}} selectedIndex={0}>
          <RadioButton value={'item1'} style={{justifyContent: 'center',alignSelf:'flex-start'}} >
            <Text>YES</Text>
          </RadioButton>
          <RadioButton value={'item2'} style={{justifyContent: 'center',alignSelf:'flex-start'}}  >
            <Text>NO</Text>
          </RadioButton>        
      </RadioGroup>
    </View>
    </View>

    <View>
      {age==1?
      <View>
        <TextInput
        style={{ height: 40, borderColor: 'blue', borderWidth: 1, margin: 10, width: Dimensions.get('window').width - 30 }}
        onChangeText={text => onChangeBirthDay(text)}
        keyboardType={'email-address'}
        placeholder={'Your year of birth'}
        value={birthday}
      />
      </View>:<></>}
    </View>
   
    {/* <TextInput
        style={{ height: 40, borderColor: 'blue', borderWidth: 1, margin: 10, width: Dimensions.get('window').width - 30 }}
        onChangeText={text => onChangeBirthDay(text)}
        keyboardType={'email-address'}
        placeholder={'Your year of birth'}
        value={birthday}
      /> */}


    <TouchableOpacity activeOpacity={0.5} onPress={Start}>
          <View style={styles.startBottom}>
            <Text style={styles.startText}>Let's get start!</Text>
          </View>
    </TouchableOpacity>

    {/* <TouchableOpacity activeOpacity={0.5} onPress={disconnect}>
          <View style={styles.startBottom}>
            <Text style={styles.startText}>disconnect</Text>
          </View>
    </TouchableOpacity> */}
    <Text>{countDown}</Text>
  </View>
  </ScrollView>
  )
}


const styles = StyleSheet.create({
  title:{
    color:'#2B49C1',
    fontSize:30,
    fontWeight:'bold',
    textShadowColor:'#C0C0C0',
    textShadowRadius:2,
    textShadowOffset:{width:2,height:2},
  },

  step:{
    color:'#2B49C1',
    fontSize:14,
  },

  text:{
    color:'#2B49C1'
  },

  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  
  GPSbottonON:{
    width:'80%',
    height: 30,
    backgroundColor:'#5858FA',
    marginHorizontal:10
  },
  GPSbottonOFF:{
    width:'80%',
    height: 30,
    backgroundColor:'#5858FA',
    marginHorizontal:10,
  },
  GPSbottonTxt:{
    color:'white',
    alignSelf:'center', 
    fontSize: 18,
    padding:5,
  },
  AgeBottom:{
    width:50, 
    height: 30,
    backgroundColor:'#5858FA',
    marginHorizontal:10
  },
  AgeBottomTxt:{
    color:'white',
    alignSelf:'center', 
    fontSize:20
  },


  startBottom:{
    width:100,
    height:30,
    backgroundColor:'blue',
    alignItems:'center',
    justifyContent:'center',
    marginBottom:15,
    marginTop:15,
    borderRadius:8
  },

  startText:{
    color:'#ffffff',
    alignItems:'center',
    fontSize:14,
  },
});



export default inject('RootStore')(observer(AddRequest));