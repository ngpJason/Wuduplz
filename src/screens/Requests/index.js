import React, { useState,useEffect } from 'react';
import {ScrollView, Text,
	Image,View,TouchableOpacity,ActivityIndicator,
	StyleSheet,RefreshControl,Button,FlatList,TextInput } from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


import { Container } from './styles';
import axios from 'axios'
import {inject,observer } from "mobx-react";
import request from '../../util/request'
import {SERVER_ADDRESS} from '../../../data/address'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Responses from "./Responses";
import Swipeout from 'react-native-swipeout';

const SideTab = createMaterialTopTabNavigator();

const Requests = ({route, navigation,RootStore}) => {

	const [search, setSearch] = useState('');
	const [time,setTime] = useState(Date.now())
	const [refreshing, setRefreshing] = React.useState(false);
	const [loadMore,setLoadMore] = React.useState(false)
	const [page,setPage] = React.useState(0)
	const bar = [{type:'bar'}]

	const [requests,setRequest] = useState([])

	const onRefresh = React.useCallback(async() => {
		setRefreshing(true);
		var result = await axios.get(`${SERVER_ADDRESS}/front-end/getRequest/${RootStore.UserId}/${0}/${10}`)
		console.log('request from you result is ',result.data[0])
		setPage(10)
		setRequest(bar.concat(result['data']))
		setRefreshing(false)
	  }, []);
	
	 useEffect(()=>{
		const unsubscribe = navigation.addListener('focus', () => {
			// do something
			var length = Date.now()-time

			if(length>20000){
				onRefresh()
			}
			setTime(Date.now())
		  });
	  
		  return unsubscribe;
    },[navigation])


	const updateResults = async() => {
        var result={}
        if(search=='')
            result = await axios.get(`${SERVER_ADDRESS}/front-end/getRequest/${RootStore.UserId}/${0}/${10}`)
        else
            result = await axios.get(`${SERVER_ADDRESS}/front-end/getRequest/request-from-you/${RootStore.UserId}/${search}`)
        setRequest(bar.concat(result['data']));
    };



	const Delete = async(item)=>{
		var deletere = await request.get(`/front-end/deleteRequest/${item.RequestId}`)
		if(deletere.status!=0)
			await axios.post(SERVER_ADDRESS+'/front-end/editUser',{RequestCount:true,UserId:RootStore.UserId})
		// var result = await axios.get(`${SERVER_ADDRESS}/front-end/getRequest/${RootStore.UserId}/${0}/${10}`)
		// setPage(10)
		// setRequest(result['data'])
		const list = []
		for(var i=1;i<requests.length;i++){
			list[i-1] = requests[i]
		}
		item['hidden']=true
		setRequest(bar.concat(list))
	}
	


	useEffect( ()=>{
		async function getRequest(){
			var result = await axios.get(`${SERVER_ADDRESS}/front-end/getRequest/${RootStore.UserId}/${0}/${10}`)
			setPage(10)
			setRequest(bar.concat(result['data']))
			console.log('request from you data is ',result['data'])
		};
		getRequest();

	},[])

	const renderLoadMoreView =()=> {
	
		if(!loadMore)
			return null
		else{
			return (<View style={styles.loadMore}>
				<ActivityIndicator
					style={styles.indicator}
					size={"large"}
					color={"red"}
					animating={true}
				/>
				<Text>Loading</Text>
			</View>)
		}
    }


	const Input = ()=>{
		return(
			<TextInput
				placeholder="Search"
				placeHolderTextColor="#333"
				value={search}
				style={{
					flex: 1,
					marginTop: 20,
					marginBottom: 5,
					paddingHorizontal: 15,
					alignSelf: 'stretch',
					width: StyleSheet.hairLineWidth,
					backgroundColor: '#F5F5F5',
				}}
				onChangeText={(text) => setSearch(text)}
				onSubmitEditing={updateResults}
					/>
		)
	}


	const loadData = async()=> {
	
		console.log('loading!!!!!!!!')
        

		var result = await axios.get(`${SERVER_ADDRESS}/front-end/getRequest/${RootStore.UserId}/${page}/${10}`)

		console.log(`new result data is ${result['data'].length}`)

	
		setRequest(requests.concat(result['data']))
	
		setPage(page+10)
		//setLoadMore(false) item
    }


	const videoImages = (num,item)=>{

		if(num!=0){
			if(num==item.responses.length){
				return (
						<View>
							<Image
							style={{
								width: 66,
								height: 88,
								//borderRadius: 50,
								borderColor: '#333',
							}}
							source={{uri:SERVER_ADDRESS+item.responses[0].video_image.split('|').join('//')}} />
							{videoImages(num-1,item)}
						</View>

				)
			}else{
				return (
					<View style={{
						position:"absolute",
						top:5,
						left:5
					}}>
						<Image
						style={{
							width: 66,
							height: 88,
							//borderRadius: 50,
							borderColor: '#333',
						}}
						source={{uri:SERVER_ADDRESS+item.responses[num].video_image.split('|').join('//')}} />
						{videoImages(num-1,item)}
					</View>

			)
			}
		}else{
			return <></>
		}
	}

	/*const requests = [
		{
			request_id:'1',
			img: 'https://t1.ea.ltmcdn.com/en/images/1/7/1/20_white_cat_breeds_full_list_3171_orig.jpg',
			requestMessage: 'Record your white cat',
			responsesCount: '10 users have responded!',
		},
	];
	*/

	return (

		
			<View style={{paddingHorizontal: 15}}>
			
				<FlatList
				refreshing={refreshing} 
				onRefresh={onRefresh}
				  
			  		data = {requests}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({item,index})=>{
					
							return(
							<View>
								{index==0?Input():
								<View style={{
									display: item.hidden ? 'none' : 'flex',
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'space-between',
									marginVertical: 10,
									marginBottom: 5,
									height:100,
									borderBottomWidth: StyleSheet.hairlineWidth,
									borderBottomColor: '#E5E5E5',
								}} >
									
									{/* <Image
										style={{
											width: 66,
											height: 88,
											//borderRadius: 50,
											borderColor: '#333',
										}}
										source={{uri:SERVER_ADDRESS+item.img}} /> */}
									<View style={{
										width: '50%'
									}}>
										<Text style={{ fontWeight: 'bold' }}>{item.requestMessage}</Text>
										<Text style={{ color: '#333' }}>{item.responseCount}</Text>
									</View>
								
										<View style={{
											width: '18%',
											display: 'flex',
											flexDirection: 'row',
											alignItems: 'center',
											justifyContent: 'space-between',
											left:'0%'
										}}>
											<TouchableOpacity onPress={() => {navigation.navigate("Responses", {responses:item.responses})}}>
												<FontAwesome5 name={'chevron-right'} size={20} color="#E5E5E5" />
											</TouchableOpacity>
											<TouchableOpacity style={{paddingRight:9}} onPress={() => {
												
												Delete(item)
												}} >
												<FontAwesome5 name={'trash-alt'} size={22} color="pink" />
											</TouchableOpacity>
										</View>
										{
											index==0?<></>:
											item.responses.length==0?	
											<Image
												style={{
													width: 66,
													height: 88,
													//borderRadius: 50,
													borderColor: '#333',
												}}
												source={{uri:SERVER_ADDRESS+item.img}} />:
												videoImages(item.responses.length,item)
												
											

										}
										
			
										</View>
					}
										</View>
							)
					}}


					ListFooterComponent={()=>renderLoadMoreView()}
					onEndReached={() =>loadData()}
					onEndReachedThreshold={0.7}
		
				
			

				/>
			</View>
				
	
	)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        backgroundColor: "#169",
        height: 200,
        margin: 15,
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        color: "red",
        fontSize: 20,
    },

    loadMore: {
        alignItems: "center"
    },
    indicator: {
        color: "red",
        margin: 10
    }
});

export default inject('RootStore')(observer(Requests));