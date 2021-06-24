import React, {useEffect,useState}from 'react';
import {
	View, 
	Text, 
	Button, 
	TextInput,
	Dimensions,
	StyleSheet,
	Alert,
	Keyboard,
	TouchableOpacity,
	Image,
	ActivityIndicator,
	ScrollView
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import request from '../../util/request'
import AntDesign from "react-native-vector-icons/AntDesign";
import {inject,observer } from "mobx-react";
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import fire from '../../util/Firebase'
import { ProgressBar, Colors} from 'react-native-paper';
import axios from 'axios'
import Toast from '../../util/Toast'
import {SERVER_ADDRESS} from '../../../data/address'
import ImagePicker from 'react-native-image-crop-picker';
import DefaultImage from '../../../data/cover.jpg'
import socketIOClient from "socket.io-client";


const DEFAULT_IMAGE = Image.resolveAssetSource(DefaultImage).uri.split('?')[0];


const socket = socketIOClient('http://35.232.22.251:5000');

const AddReques = ({ navigation,RootStore }) => {

	const [value, onChangeText] = React.useState('');
	const [value1, onChangeText1] = React.useState('');
	const [value2, onChangeText2] = React.useState('');
	const [value3, onChangeText3] = React.useState('');
	const [requestNum, setRequestNum] = React.useState(0)
	const [membership,setMembership] =React.useState(RootStore.membership)
	const [format,setFormat] = React.useState({})
	const [image_url,setImageUrl]= React.useState('')
	
	const [head,setHead] = useState(DEFAULT_IMAGE)
	const [responder_num,setResponder] = useState(0)
	const [request_id,setRequestId] = useState('')
	const [receiver_num,setReceiver] = useState(0)


	const [sendIndicator,setSendIndicator] = useState(RootStore.sendIndicator)
	const [receivingIndicator,setReceivingIndicator] = useState(false)
	const [respondIndicator,setRespondIndicator] = useState(false)



	useEffect(() => {
		async function run(){
			var user = await axios.post(SERVER_ADDRESS+'/front-end/getUser',{'UserId':RootStore.UserId})
			console.log('user data is ',user.data['RequestCount'])
			setRequestNum(user.data['RequestCount'])
		}
		run();
	  }, []);


	  useEffect(() => {
		const unsubscribe = messaging().onMessage(async remoteMessage => {
		if(remoteMessage['data']["test"])
			Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage['data']));
		})

		return unsubscribe

	  }, []);


	  useEffect(()=>{
		const unsubscribe = navigation.addListener('focus', async() => {
			setSendIndicator(RootStore.sendIndicator)
			setMembership(RootStore.membership)
			var user = await axios.post(SERVER_ADDRESS+'/front-end/getUser',{'UserId':RootStore.UserId})
			setRequestNum(user.data['RequestCount'])
		  });
	  
		  return unsubscribe;
    },[navigation])


	

	const sendRequest = async ()=>{
		var num = [100,200,10000]

		if(requestNum <=num[membership]){
	
		
			if(value==''){
				Toast.info('please input the request')
			}else{
					
					setSendIndicator(true)
					setReceivingIndicator(true)
					setRespondIndicator(false)
					setReceiver(0)
					setResponder(0)


					if(image_url!=''){

						await request.post('/front-end/upload', format, {
							headers: {
							"Content-Type": "multipart/form-data"
							}
						})
					}
		
					var result = await request.post('/front-end/sendRequest',{
						'requestContent':value,
						'requestorId':RootStore.UserId,
						 'image_url':image_url==''?'|RequestImages|default.jpg':image_url
		
					})

					//set the status after sending 
					Toast.success('Request Sent')
					//setSendIndicator(false)
					setReceivingIndicator(false)
					setRespondIndicator(true)
					RootStore.setSendIndicator(true)

	
					socket.on(result['request_id'],(data)=>{
						setResponder(data.number)
					})

					setRequestId(result['request_id'])
					setReceiver(result['receiver_number'])
		
					var user = await axios.post(SERVER_ADDRESS+'/front-end/getUser',{'UserId':RootStore.UserId})
					setRequestNum(user.data['RequestCount'])
					onChangeText('')
			}

			
		}else{
			Toast.sad('exceeded maximum number!')
		}
	}



	

	const free = ()=>{
		return (
			<Text>Requests {requestNum}/100</Text>
		)
	}

	const golden = ()=>{
		return (
			<Text>Requests {requestNum}/200</Text>
		)
	}

	const diamond = ()=>{
		return (
			<Text style={{fontSize:20,fontWeight: 'bold',width:'80%',borderWidth:1}}>unlimited requests</Text>
		)
	}


	const ImagePick = async()=>{
		const image = await ImagePicker.openPicker({
		  width: 300,
		  height: 400,
		  cropping: true
		});
	
	
		let formData = new FormData();
		formData.append("requestPhoto", {
		  // local address
		  uri: image.path,
		  // image type
		  type: image.mime,
		  // image name
		  name: image.path.split("/").pop(),
	
	
		});
	
		console.log('format is ',formData._parts)
		setFormat(formData)
	
		console.log(image.path)
		setHead(image.path)

		var name = image.path.split("/").pop()
		setImageUrl('|RequestImages|'+name)
		//this.setState({image_uri:result.path})
		//this.setState({image_name:image.path.split("/").pop()})
		  
	}

	return (



	
	<View style={{flex: 1, alignItems: 'center', justifyContent: 'center',top:'0%',borderWidth:1}}> 


	{/* <TouchableOpacity onPress={()=>ImagePick()} style={{marginBottom:30}}>
				<Image roundAsCircle={true} resizeMode={'stretch'} style={styles.ImageStyle} source={{uri:head}} />
	</TouchableOpacity> */}

	<View style={{alignItems: 'center', justifyContent: 'center', fontWeight: 1000,width:'90%'}}>
		
		
		<View>
			<Text style={styles.header}>Would you please</Text>
		</View>

	    <TextInput
	      style={styles.textInput}
		  placeholder="show me......."
		  maxLength={100}
		  onBlur={Keyboard.dismiss}
	      onChangeText={text => onChangeText(text)}
	      value={value}
	    />

		<TouchableOpacity
			style={styles.saveButton}
			onPress={sendRequest}>
			<Text style={styles.saveButtonText}>Send Request</Text>
		</TouchableOpacity>


		<TouchableOpacity
			style={[styles.saveButton,{marginTop:10}]}
			onPress={()=>navigation.navigate('Requests',{screen:'Home'})}>
			<Text style={{color: '#FFFFFF',fontSize: 18,textAlign: 'center'}}>Request From You</Text>
		</TouchableOpacity>

		<View style={{marginTop:20,fontWeight:10,width:'60%'}}>
		{membership==2?null:
			<ProgressBar progress={membership==0?requestNum/100:requestNum/200} color={Colors.red800} style={{alignSelf:'center'}}/>
		}
		<Text style={{textAlign:'center'}}>{membership==0?free():membership==1?golden():diamond()}</Text>

		<View style={styles.inputContainer}>
						<TouchableOpacity
						>
							<View style={{flexDirection: 'column', justifyContent: 'center', display: 'flex'}}>

								{sendIndicator && <View style={{flexDirection: 'row', justifyContent: 'center'}}>
								{receivingIndicator ? <ActivityIndicator size="small" color="blue" /> : <AntDesign style={{marginTop: 2, marginRight: 3}} name={'checkcircleo'} size={15} color={'blue'} />}
									<Text style={{
										fontSize: 13,
										textAlign: 'center',
										marginRight: 5
									}}>{receiver_num==1||receiver_num==0?receiver_num+' user':receiver_num+' users'} received you request</Text>
								</View>}

								{sendIndicator&&respondIndicator && <View style={{flexDirection: 'row', justifyContent: 'center',right:'55%'}}>
									{responder_num!==0 ?<ActivityIndicator size="small" color="blue" style={{marginTop: 2,marginRight: 3}}/>: <Text></Text>}
									<Text style={{
										fontSize: 13,
										textAlign: 'center',
										marginRight: 5
									}}>{responder_num==0?'none user is':responder_num==1?'1 user is':responder_num+'users are'} responding  </Text>
								</View>}


							</View>
						</TouchableOpacity>
					</View>
		{/* <Text style={{textAlign:'center'}}>{receiver_num} has received you request</Text>
		<Text style={{textAlign:'center'}}>{responder_num}</Text> */}
		
		
		

	</View>


	
	</View>
	

	{/* <TouchableOpacity
			style={[styles.saveButton,{marginTop:10}]}
			onPress={()=>socket.emit('sendRequest',RootStore.UserId)}>
			<Text style={{color: '#FFFFFF',fontSize: 18,textAlign: 'center'}}>send tcp</Text>
		</TouchableOpacity> */}

	</View>




	)
}

const styles = StyleSheet.create({
	ImageStyle:{
		width:100,
		height:100,
		borderWidth:3,
		borderColor:'#fff',
		borderRadius:80
	},
	container: {
		flex: 1,
		paddingTop: 45,
		backgroundColor: '#F5FCFF',
	},
	header: {
		fontSize: 35,
		margin: 10,
		fontWeight: 'bold',
	},
	inputContainer: {
		paddingTop: 15
	},
	textInput: {
		borderColor: '#CCCCCC',
		borderTopWidth: 1,
		borderBottomWidth: 1,
		height: 50,
		width:'100%',
		fontSize: 20,
		paddingLeft: 20,
		paddingRight: 20,
		marginBottom:10
	},
	saveButton: {
		borderWidth: 1,
		borderColor: '#007BFF',
		backgroundColor: '#007BFF',
		padding: 10,
		margin: 5,
		width:'95%'
	},
	saveButtonText: {
		color: '#FFFFFF',
		fontSize: 20,
		textAlign: 'center'
	}
});

export default inject('RootStore')(observer(AddReques));