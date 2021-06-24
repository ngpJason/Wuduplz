import React from 'react';
import { Image, TextInput, Button, Title, Text,AsyncStorage } from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import Home from '../screens/Home';
import Search from '../screens/Search/bar';
import Profile from '../screens/Profile';
import Requests from '../screens/Requests';
import AddRequest from '../screens/Upload';
import {inject,observer } from "mobx-react";

import RequestForYou from '../screens/Requests/RequestsForYou'

import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'

import plusIcon from '../assets/images/green-plus-icon.png'
//import plusIcon from '../assets/images/blue-plus-icon.webp'

// import plusIcon from '../assets/images/blue-plus-icon.webp'
import Responses from "../screens/Requests/Responses";
import Results from "../screens/Search/Results";
import TabBar from "../screens/Requests/TopBar";
import Message from "../screens/Message/TopBar"
import Pro from "../screens/Profile/TopBar"

import fire from '../util/Firebase'
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = (props) => {
	async function removeItemValue(key) {
		try {
			await AsyncStorage.removeItem(key);
			return true;
		}
		catch(exception) {
			return false;
		}
	}

	React.useEffect(()=>{
		async function message(){
			messaging().onNotificationOpenedApp(remoteMessage => {
				console.log(
				'Notification caused app to open from background state:',
				remoteMessage.data.type,
				);

			
				
				props.navigation.navigate('Requests',{screen:'Settings'});
			});


				messaging().getInitialNotification().then(remoteMessage => {
					if (remoteMessage) {
						if(remoteMessage.data)
							if(remoteMessage.data.request)
								props.navigation.navigate('Requests',{screen:'Settings'}); // e.g. "Settings"
						}
				})
			
		
	}
	async function message1(){
		const unsubscribe = messaging().onMessage(async remoteMessage => {

			if(remoteMessage["data"]["request"]){
				
				Toast.show({
					text1: 'Hello',
					text2: 'A request is sent to you 👋',
					onPress: () =>{
						props.navigation.navigate('Requests',{screen:'Settings'});
					}
				  });
			}

			if(remoteMessage["data"]["logout"]){
				
				await removeItemValue('UserInfo')
				await props.navigation.navigate('Login')
				alert('logout!')
			}

			if(remoteMessage["data"]["Like"]||remoteMessage["data"]["comment"]){
				
				Toast.show({
					text1: 'Hello',
					text2: 'Someone liked or commented you 👋',
					onPress: () =>{
						props.navigation.navigate('Notification');
					}
				  });
			}
		});
		return unsubscribe;
	};

	message1()


	message();
	},[])

	return (
		<Tab.Navigator tabBarOptions={{
			tabStyle: {
				backgroundColor:'#000',
				borderTopWidth: 0,
			},
			style: {
				borderTopWidth: 0,
			},
			activeTintColor: 'white',
			keyboardHidesTabBar: true,
			animationEnabled: true,
		}}>
		
			<Tab.Screen
				name='Videos'
				component={Search}
				options={{
					tabBarIcon: ({color}) => (
						<AntDesign name={'search1'} size={24} color={color} />
					),
					tabLeft: () => null,
					tabRight: () => null,
				}}
				initialParams={{query: ''}}
			/>
					<Tab.Screen
			name='Requests'
			component={TabBar}
			options={{
				tabBarIcon: ({color}) => (
					<AntDesign name={'search1'} size={24} color={color} />
				),
			}}
			/>
			
			<Tab.Screen
				name='AddRequest'
				component={AddRequest}
				options={{
					tabBarIcon: ({}) => (
						<Image
							source={plusIcon}
							style={{height: 25, resizeMode: 'contain'}}
						/>
					),
				// tabBarLabel : () => null,
				}}
			/>


<Tab.Screen
				name={'Notification'}
				component={Message}
				options={{
					tabBarIcon: ({color}) => (
						<Entypo name={'bell'} size={24} color={color} />
					)
				}}
				initialParams={{itemId: 15, otherParams: 26}}
			/>
			<Tab.Screen
				name='Profile'
				component={Profile}
				options={{
					tabBarIcon: ({color}) => (
						<AntDesign name={'user'} size={24} color={color} />
					)
				}}
				/>
			<Tab.Screen
				name='Responses'
				component={Responses}
				options={{
					tabBarButton: () => null
				}}
			/>
			<Tab.Screen
				name='Results'
				component={Results}
				options={{
					tabBarButton: () => null
				}}
				initialParams={{query: ''}}
			/>
			<Tab.Screen
				name='RequestForYou'
				component={RequestForYou}
				options={{
					tabBarButton: () => null
				}}
				initialParams={{query: ''}}
			/>
		</Tab.Navigator>
	);
}
export default inject('RootStore')(observer(BottomTabNavigator));