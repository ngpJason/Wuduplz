import React,{useState,useEffect} from 'react';
import {ScrollView, Text, Image, View, TouchableOpacity, StyleSheet,Alert,RefreshControl,FlatList,TextInput } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Container } from './styles';
import Responses from "./Responses";
import {SERVER_ADDRESS} from '../../../data/address'
import {inject,observer } from "mobx-react";
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';


const RequestsForYou = ({route, navigation,RootStore }) => {

    const [refreshing, setRefreshing] = React.useState(false);
    const [time,setTime] = useState(Date.now())
    const [search, setSearch] = useState('');
    const onRefresh = React.useCallback(async() => {
		setRefreshing(true);
        var result = await axios.get(`${SERVER_ADDRESS}/front-end/getResponses/${RootStore.UserId}/null/null`)
        
        setRequest(result['data'])

		setRefreshing(false)
	  }, []);

    const[requests,setRequest] = useState([])

    useEffect(()=>{
		const unsubscribe = messaging().onMessage(async remoteMessage => {

			if(remoteMessage["data"]["request"]){
                var result = await axios.get(`${SERVER_ADDRESS}/front-end/getResponses/${RootStore.UserId}/null/null`)
                setRequest(result['data'])
			}
        })
	  
		  return unsubscribe;
    },[])

    useEffect(()=>{
		const unsubscribe = navigation.addListener('focus', () => {
			// do something
            var length = Date.now()-time

			if(length>30000){
				onRefresh()
			}
			setTime(Date.now())
		  });
	  
		  return unsubscribe;
    },[navigation])
    /*
    {"requestId":"00c27cf0-8f38-11eb-b61b-42010a800007",
    "requestMessage":"urwqrwq",
    "img":"|Requestimages|chrismas.jpg",
    "responseContent":"0 users has responded!",
    "requestor_id":"ea598ce5-7168-11eb-a09f-f0795907d9ec"
    "response_id":
    },


    */

    const updateResults = async() => {
        var result={}
        if(search=='')
            result = await axios.get(`${SERVER_ADDRESS}/front-end/getResponses/${RootStore.UserId}/null/null`)
        else
            result = await axios.get(`${SERVER_ADDRESS}/front-end/getResponses/search/${RootStore.UserId}/${search}`)
        setRequest(result['data']);
    };

    const deleteResponse = async(response_id)=>{
        var result = await axios.get(`${SERVER_ADDRESS}/front-end/deleteResponse/${response_id}`)
        var result = await axios.get(`${SERVER_ADDRESS}/front-end/getResponses/${RootStore.UserId}/null/null`)
        setRequest(result['data'])
    }
    
    useEffect(()=>{
        async function getData(){
            
            var result = await axios.get(`${SERVER_ADDRESS}/front-end/getResponses/${RootStore.UserId}/null/null`)
            console.log('RequestsForYou.js data is ',result['data'][0])
            setRequest(result['data'])
        };

        getData()

    },[])
    
	useEffect(() => {
		const unsubscribe = messaging().onMessage(async remoteMessage => {
		    //Alert.alert('Request For you!', JSON.stringify(remoteMessage));
            var result = await axios.get(`${SERVER_ADDRESS}/front-end/getResponses/${RootStore.UserId}`)
            setRequest(result['data'])
        
		})

		return unsubscribe

	  }, []);


 

    return (
        <Container>
            <ScrollView style={{paddingHorizontal: 10, margin: 5}}
            	refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }>
                {/*<View style={{marginTop: 15, marginBottom: 5}}>*/}
                {/*    <Text style={{color: 'black', fontSize: 15, fontWeight: 'bold', marginLeft: 7}}>Requests for you!</Text>*/}
                {/*</View>*/}
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
                        backgroundColor: '#F5F5F5'
                    }}
                    onChangeText={(text) => setSearch(text)}
                    onSubmitEditing={updateResults}
                />
               <FlatList
                data = {requests}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item})=>{
                    return(
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
                        {/*<Image*/}
                        {/*    style={{*/}
                        {/*        width: 66,*/}
                        {/*        height: 66,*/}
                        {/*        borderRadius: 50,*/}
                        {/*        borderColor: '#333',*/}
                        {/*    }}*/}
                        {/*    source={{ uri: request.img }} />*/}
                        <View style={{
                            width: '75%',
                            paddingLeft: 5,
                        }}>
                            <View style={{marginLeft: 0, paddingTop: 10, flex: 1, flexDirection: 'row', alignItems: 'center', width: '60%'}}>
                                <Image
                                    style={{borderColor: '#EEE', borderRadius: 25, width: 46, height: 46}}
                                    source={{uri:item.user_image?SERVER_ADDRESS+item.user_image.split('|').join('//'):''}}
                                />
                                 <Text style={{ paddingLeft: 6 }}>{item.requestMessage}</Text>
                                

                            </View>
                            <Text style={{marginTop: 5, fontWeight: 'bold', marginLeft: 0}}>@{item.username}</Text>
                            {/*<Text style={{ color: '#333' }}>{request.responsesCount}</Text>*/}
                        </View>
                        <View style={{
                            width: '19%',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                                  <TouchableOpacity style={{
                            }} onPress={() => {navigation.push("Record",{
                                'requestor_id':item.requestor_id,
                                'response_id':item.response_id,
                                'request_message':item.requestMessage,
                                'request_id':item.requestId
                            })}} >
                                <FontAwesome5 name={'video'} size={25} color="pink" />
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                            }} onPress={() => {deleteResponse(item.response_id)}} >
                                <FontAwesome5 name={'ban'} size={22} color="grey" />
                            </TouchableOpacity>
                     
                        </View>
                    </View>
                    )
                }
            }
                         
               />

            </ScrollView>
        </Container>
    )
}

export default inject('RootStore')(observer(RequestsForYou));