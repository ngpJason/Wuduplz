import React, { useState,useEffect } from 'react';
import {View, FlatList, Dimensions, ScrollView} from 'react-native';


import Post from '../../components/Post';
import posts1 from '../../../data/posts';
import axios from 'axios';
import {SERVER_ADDRESS} from '../../../data/address'
import {inject,observer } from "mobx-react";


const Home = ({route, navigation,RootStore}) => {

	const [post, setPost] = useState(route.params.itemId);
    const [posts,setPosts] = useState([])

	useEffect(()=>{
		
    },[navigation])

	useEffect(()=>{
		
		async function getData(){
			console.log('get data called')
			console.log(`${SERVER_ADDRESS}/front-end/home/${route.params.videoId}/${RootStore.UserId}`)
		var result = await axios.get(`${SERVER_ADDRESS}/front-end/home/${route.params.videoId}/${RootStore.UserId}`)
		console.log(result.data)
		/*result:
			{"VideoId": "bf368573-a954-11eb-b61b-42010a800007", 
			"comments": 0, 
			"video_image": "|videoImages|134womanbasketball.jpg",
			"creator": {"id": "cbdef4d4-7168-11eb-a09f-f0795907d9ec", 
						"imageUri": "//images//5a866542-e657-403b-92ab-b570d7e2d505.jpg", 
						"username": "Elwin0"},
			"description": "1", 
			"islike": false, 
			"likes": 0, 
			"private": 0, 
			"shares": 2, 
			"videoLocation": "//videos//cbdef4d4-7168-11eb-a09f-f0795907d9ec1619746689253.mp4"
			}
		*/
		if(result['data']){
			await axios.post(`${SERVER_ADDRESS}/front-end/deleteHistory`,{video_id:route.params.videoId,user_id:RootStore.UserId})
			await axios.post(`${SERVER_ADDRESS}/front-end/addHistory`,{video_id:route.params.videoId,user_id:RootStore.UserId})
		}else{
			await axios.post(`${SERVER_ADDRESS}/front-end/deleteHistory`,{video_id:route.params.videoId,user_id:RootStore.UserId})
		}

		if(result['data']==undefined){
			setPosts([
				{
					VideoId:'',
					likes:0,
					videoLocation:'',
					comments:0,
					shares:0,
					description:'',
					creator:{
						imageUri:'',
						username:'',
						
					}
				}
			])
			navigation.navigate('Search')
		}else{
		if(route.params.type)
			result['data'].type=route.params.type
		if(route.params.id)
			result['data'].id = route.params.id
		console.log('homepage result is ',result['data'])
		setPosts([result['data']])
		}
		
	};

		const unsubscribe = navigation.addListener('focus', async() => {
			// do something
			console.log('focused home')
			getData();
		  }); 

  
	
	return unsubscribe;

},[route.params.videoId])

console.log('home visited!',route.params)
	return (
		<View>
			<FlatList
				data={posts}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({item}) =><Post post={item}/>}
				showsVerticalScrollIndicator={false}
				snapToInterval={Dimensions.get('window').height - 72 } // scale the image according to screen height
				snapToAlignment={"start"}
				decelerationRate={"fast"}
			/>
		</View>

)
}

export default inject('RootStore')(observer(Home));