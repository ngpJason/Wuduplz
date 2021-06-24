import React, { useState,useEffect } from 'react';
import {ScrollView, Text, Image, View, TouchableOpacity, StyleSheet,RefreshControl,TouchableHighlight,Button,Dimensions,FlatList,ImageBackground } from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


import axios from 'axios'
import {inject,observer } from "mobx-react";
import request from '../../util/request'
import {SERVER_ADDRESS} from '../../../data/address'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Swipeout from 'react-native-swipeout';
import {Container} from "./styles";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Toast1 from 'react-native-toast-message';

const SideTab = createMaterialTopTabNavigator();
const numColumns=3

const Favourite = ({route, navigation,RootStore}) => {

	const [videos,setVideos] = useState([])
	const [time,setTime] = useState(Date.now())

    const [y,setY] = React.useState(0)

    function _onScroll(e) {
        let {y} = e.nativeEvent.contentOffset;
        setY(y)
    }

	useEffect(()=>{
	    const unsubscribe=navigation.addListener('focus', async() => {

            
            
			// do something
			var result = await axios.get(SERVER_ADDRESS+`/front-end/getLikedVideo/${RootStore.UserId}`)
			setVideos(result['data'])		
			/*
				[
					{
					video_id:,
					video_image:|videoImages|videoname
					},
					......
			]
			*/
		  });
          return unsubscribe
		
    },[navigation])


    useEffect(()=>{
        const unsubscribe = navigation.addListener('blur', async() => {
            setVideos([])
        });

        return unsubscribe

    })


    const convertViews = (param)=>{
        if(param>1000)
            return (param/1000).toFixed(1)+'k'
        else
            return param
    }

    const renderItem = ({ item, index }) => {

        var priva = RootStore.membership>0||RootStore.UserId==item.creator_id?1:item.private

  
        return (
            <TouchableHighlight onPress={()=>{
                if(priva==1)
                    navigation.navigate('Video',{videoId:item.video_id})
                else
                    alert('please pay for this video')
            }}>
            <ImageBackground
              source={{uri:SERVER_ADDRESS+item.video_image}}
              style={{
                width: ((Dimensions.get('window').width-10) / 3),
                height: ((Dimensions.get('window').width) / 3)*1.3,
                marginHorizontal: 1,
                marginBottom: 1,
                alignSelf:'center'
            }}
            >
            <>{
            priva==0? <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                            <FontAwesome style={{right: 3}} name={'lock'} size={80} color={'white'}/>
                    </View>
            :
            <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>  
                <View style={{position: 'absolute', top: 0,right: 3, bottom: 6,  alignItems: 'flex-end',flexDirection:'row'}}>
                    <FontAwesome style={{right: 3}} name={'heart'} size={16} color={'white'}/>
                    <Text style={{color:'white', fontSize: 12}}>{convertViews(item.likes)}</Text>
                </View>
            </View>
                 }
            </>
    
            </ImageBackground>
          </TouchableHighlight>
        );
      };
	
	return (
		<Container>
           
            <FlatList
             data = {videos}
             keyExtractor={(item, index) => index.toString()}
             renderItem={renderItem}
             numColumns={numColumns}
            />
                       
               
        </Container>
	)
}

export default inject('RootStore')(observer(Favourite));