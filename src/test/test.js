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
import AntDesign from "react-native-vector-icons/AntDesign";
import {inject,observer } from "mobx-react";
import messaging from '@react-native-firebase/messaging';
import { ProgressBar, Colors} from 'react-native-paper';
import axios from 'axios'
import ImagePicker from 'react-native-image-crop-picker';
import socketIOClient from "socket.io-client";







const AddRequest = ({ navigation,RootStore }) => {

	

	return (



	
	<View style={{flex: 1, alignItems: 'center', justifyContent: 'center',top:'0%',borderWidth:1}}> 



	<View style={{alignItems: 'center', justifyContent: 'center', fontWeight: 1000,width:'90%'}}>
		
		
		<View>
			<Text style={styles.header}>Would you please</Text>
		</View>

	  

		<TouchableOpacity
			style={styles.saveButton}
			// onPress={()=>{
			// 	socket.emit('recording','bb8a0f4c-a66f-11eb-b61b-42010a800007')
			// }}
			>
			<Text style={styles.saveButtonText}>Recording</Text>
		</TouchableOpacity>


		<TouchableOpacity
			style={[styles.saveButton,{marginTop:10}]}
			// onPress={()=>socket.emit('finish_record','bb8a0f4c-a66f-11eb-b61b-42010a800007')}
			>
			<Text style={{color: '#FFFFFF',fontSize: 18,textAlign: 'center'}}>finish recording</Text>
		</TouchableOpacity>




	
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

export default inject('RootStore')(AddRequest);