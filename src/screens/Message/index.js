import React, { useState,useEffect } from 'react';
import {ScrollView, Text, Image, View, TouchableOpacity, StyleSheet,RefreshControl,Button,Alert,FlatList } from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import { useEffect } from 'react/cjs/react.development';

import { Container } from './styles';
import axios from 'axios'
//import {SERVER_ADDRESS} from '../../../data/address'
import {inject,observer } from "mobx-react";
import request from '../../util/request'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Swipeout from 'react-native-swipeout';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import fire from '../../util/Firebase'
import Time from '../../util/Time'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {SERVER_ADDRESS} from '../../../data/address'


const SideTab = createMaterialTopTabNavigator();

 const Messages = ({route, navigation,RootStore}) => {
/*
	user_image---|**|*****.jpg
	user_name
	type---comment/like
	dat
	comment(if type==comment)
	video_id,



*/

	const [refreshing, setRefreshing] = React.useState(false);
	const onRefresh = React.useCallback(async() => {
		 setRefreshing(true);
		var result = await request.get(`/front-end/Message/${RootStore.UserId}`)
		setRequest(result)
  
		setRefreshing(false)

	  }, []);
	
	  useEffect(()=>{
		const unsubscribe = navigation.addListener('focus', () => {
			// do something
			onRefresh()
		  });
	  
		  return unsubscribe;
    },[navigation])
	
	const Delete = async(message_id)=>{
		var deletere = await request.get(`/front-end/deleteMessage/${message_id}`)
		var result = await request.get(`/front-end/Message/${RootStore.UserId}`)
		setRequest(result)
	}
	const [requests,setRequest] = useState([])

	useEffect( ()=>{
		async function getRequest(){
			var result = await axios.get(`${SERVER_ADDRESS}/front-end/Message/${RootStore.UserId}`)
			setRequest(result['data'])
		};
        async function message(){
            const unsubscribe = messaging().onMessage(async remoteMessage => {

                if(remoteMessage["data"]["message"]){
                    //Alert.alert('Message For you!', JSON.stringify(remoteMessage['data']));
                    var result = await axios.get(`${SERVER_ADDRESS}/front-end/commentMessage/${RootStore.UserId}`)
                    setRequest(result['data'])
            
                }
            });
            return unsubscribe;
        };
        message();
      
		getRequest();

	},[])

	const deleteMessage = async(id)=>{
		await axios.post(`${SERVER_ADDRESS}/front-end/deleteMessage`,{id:id})
		var result = await axios.get(`${SERVER_ADDRESS}/front-end/Message/${RootStore.UserId}`)
			setRequest(result['data'])
	}



    // useEffect( ()=>{
  
    //     },[])
	// const requests = [
	// 	{
	// 		request_id:'1',
	// 		img: 'https://t1.ea.ltmcdn.com/en/images/1/7/1/20_white_cat_breeds_full_list_3171_orig.jpg',
	// 		requestMessage: 'Record your white cat',
	// 		responsesCount: '10 users have responded!',
	// 	},

	// ];
	

	return (
		<Container>
			<View style={{paddingHorizontal: 10, margin: 5}}>
				
			
				<FlatList

					refreshing={refreshing} 
					onRefresh={onRefresh}
					data = {requests}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({item,index})=>{
						console.log(item)
						return(
							<TouchableOpacity 
									onPress={()=>{
										if(item.video)
											navigation.navigate('Video',{'videoId':item.VideoId,'type':item.message_type,'id':item.item_id})
										else
											alert('video has been deleted!')}}
									onLongPress={()=>{Alert.alert( 
										"",
										"Do you want to delete this message?",
										[
										{
											text: "Cancel",
											onPress: () => console.log("Cancel Pressed"),
											style: {color:'red'}
										},
										{ text: "OK", onPress: () => deleteMessage(item.message_id) }
										])}}
									style={{
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'space-between',
		
							
									}} >
						
						<View style={{
                            display: item.hidden ? 'none' : 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginVertical: 10,
                            paddingBottom: 10,
                            borderBottomWidth: StyleSheet.hairlineWidth,
                            borderBottomColor: '#E5E5E5',
					
                        }} >
                    
                        <View style={{
                            width: '80%',
                            paddingLeft: 5,
                        }}>
                            <View style={{marginLeft: 0, paddingVertical: 10, flex: 1, flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                                <Image
                                    style={{borderColor: '#EEE', borderRadius: 25, width: 46, height: 46,top:'2%'}}
                                    source={{uri:item.user_image?SERVER_ADDRESS+item.user_image.split('|').join('//'):''}}
                                />

								<View style={{flexDirection:'column',width:'100%'}}>
									{item.message_type=='comment'&&
										<View>
										<Text style={{marginTop: 0, fontWeight: 'bold', marginLeft: 5,width:'80%',alignSelf:'baseline'}}>{item.user_name} commented:</Text>
										<Text style={{alignSelf:"baseline",left:'5%',backgroundColor: '#F5F5F5'}}>{item.item?item.item.CommentContent+'  \n'+Time.convertTime(Date.now()/1000,new Date(item.dat).getTime()/1000):'deleted'}</Text>
										</View>
									}
									{item.message_type=='like'&&
									<Text style={{marginTop: 15, fontWeight: 'bold', marginLeft: 5}}>{item.user_name} has liked your video</Text>
									}
								</View>

                               

                            </View>
							
                            
                        </View>
						
						</View>
						<View>
						{item.video?
						<Image
                                    style={{borderColor: '#EEE',width: 56, height: 76,bottom:0,top:0}}
                                    source={{uri:item.video.VideoImagePath?SERVER_ADDRESS+item.video.VideoImagePath.split('|').join('//'):''}}
                                />
						:<Text style={{borderColor: '#EEE',width: 56, height: 76,bottom:0,top:0}}>Deleted</Text>
						}
						</View>
							
					</TouchableOpacity>
						)}}
					/>
				
			

			</View>
		</Container>
	)
}

export default inject('RootStore')(observer(Messages));