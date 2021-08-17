import React, { useState,useEffect } from 'react';
import {ScrollView, Text, Image, View, TextInput, StyleSheet,RefreshControl,TouchableHighlight,Button,Dimensions,FlatList,ImageBackground } from 'react-native';

import ModalDropdown from 'react-native-modal-dropdown';
import axios from 'axios'
import {inject,observer } from "mobx-react";
import {SERVER_ADDRESS} from '../../../data/address'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {Container} from "./styles";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const SideTab = createMaterialTopTabNavigator();
const numColumns=2
const cache=[]

const Favourite = ({route, navigation,RootStore}) => {
    const type=['Sort by: Date','Sort by: Likes']
    const [search, setSearch] = useState('');
	const [videos,setVideos] = useState([])
    const [vt,setVt] = useState([])

    const [svideos,setSvideos] = useState([])
    //const bar = [{type:'input'},{type:'blank'}]
    //const bar = []
	const [time,setTime] = useState(Date.now())

    const [y,setY] = React.useState(0)
    const [sortindex,setSortindex] = React.useState(1)

    function _onScroll(e) {
        let {y} = e.nativeEvent.contentOffset;
        setY(y)
    }
    const [refreshing, setRefreshing] = React.useState(false);
	const onRefresh = React.useCallback(async() => {
		setRefreshing(true);
		var result = await axios.get(`${SERVER_ADDRESS}/front-end/getLikedVideo/${RootStore.UserId}`)
        var r1 = await axios.get(SERVER_ADDRESS+`/front-end/getDLikedVideo/${RootStore.UserId}`) 
		setVideos(result['data'])
        setVt(r1['data'])
		setRefreshing(false)
	  }, []);

	useEffect(()=>{
	    const unsubscribe=navigation.addListener('focus', async() => {

            
            
			// do something
			var result = await axios.get(SERVER_ADDRESS+`/front-end/getLikedVideo/${RootStore.UserId}`)
            var r1 = await axios.get(SERVER_ADDRESS+`/front-end/getDLikedVideo/${RootStore.UserId}`) 
			//setVideos(bar.concat(result['data']))
            
            setVideos(result['data'])
            setVt(r1['data'])
            console.log(videos)
            cache.push(result['data'])
            console.log(cache[0])
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

    _selectType = (index,value) => {
        console.log(index + '--' + value)
        /*this.setState({
            statusShow: false,
            typeText: value
        })
        */
        setSortindex(index)
        /*
        var arr=videos
        console.log(arr)
        if(index==0){
            arr.sort((a,b)=>new Date(b.dat).getTime()-new Date(a.dat).getTime())
            var result=[]
            var m={}
            for(var i=0; i<arr.length-1; i++) {
                if (!m[arr[i].video_id]){
                    m[arr[i].video_id]=true
                    result.push(arr[i])
                }
            }
            setVideos(result)
           //videos.filter((item,index)=>videos.indexOf(item.VideoId)===index)
            console.log(videos)
            
        }
        if(index==1){
            arr.sort((c,d)=>d.likes-c.likes)
            var result=[]
            var h={}
            for(var j=0; j<arr.length-1; j++) {
                if (!h[arr[j].video_id]){
                    h[arr[j].video_id]=true
                    result.push(arr[j])
               }
            }
            setVideos(result)
            //videos.filter((item,index)=>videos.indexOf(item.VideoId)===index)
            console.log(videos)
        }
        */
    }
    // 下拉列表分隔符
    _separator = () => {
        return(
            <Text style={{height:0}}></Text>
        )
    }
    // 状态选择下拉框位置
    _adjustStatus = () => {
        return({
            right: width / 3,
            top: 99,
        })
    }
    // 分类选择下拉框位置
    _adjustType = () => {
        return({
            right: 0,
            top: 99,
        })
    }
   

    
    const Input = ()=>{
		return(
      
        
		<TextInput
                    //placeholder={search}
                    placeholder="Search"
                    value={search}
                    placeHolderTextColor="#333"
                    style={{
                        flex: 1,
                        marginTop: 10,
                        marginBottom: 5,
                        paddingHorizontal: 15,
                        alignSelf: 'stretch',
                        width: StyleSheet.hairLineWidth,
                        backgroundColor: '#F5F5F5'
                    }}
                    onChangeText={(text) => setSearch(text)}
                    onSubmitEditing={async() => {
                        if(search==''){
                            //let start=[]
                            //let start=[{type:'input'},{type:'blank'}]
                            setVideos(start.concat(cache[0]))
                        }else{
                            let start=[]
                            //let start=[{type:'input'},{type:'blank'}]
                            setVideos(start.concat(cache[0].filter((value)=>{
                                
                                return value.name.includes(search)
                            }))
                            )
                        }
                    }}
                />
             
                       

		)
	}


    const renderItem = ({ item, index }) => {

        var priva = RootStore.membership>0||RootStore.UserId==item.creator_id?1:item.private

  
        return (
        <View>
            <TouchableHighlight onPress={()=>{
                if(priva==1)
                    navigation.navigate('Video',{videoId:item.video_id})
                else
                    alert('please pay for this video')
            }}>
            <ImageBackground
                resizeMethod="resize"
                source={{uri:SERVER_ADDRESS+item.video_image}}
                style={{
                width: ((Dimensions.get('window').width-40) / 2),
                height: ((Dimensions.get('window').width) / 2)*1.2,
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
                <Text style={{position: 'absolute', bottom: 5, left: 5, color:'white', fontSize: 11, backgroundColor:'grey', opacity: 0.8}}>{item.dat?item.dat.slice(0,10):''}</Text>
                <View style={{position: 'absolute', right: 3, bottom: 6,alignItems: 'center',flexDirection:'column'}}>
                    <FontAwesome style={{opacity: 0.8}} name={'heart'} size={12} color={'white'}/>
                    <Text style={{color:'white', fontSize: 12}}>{convertViews(item.likes)}</Text>
                </View>
            </View>
            
            /*
            <View style={{position: 'absolute',right: 3, bottom: 6, flexDirection:'column',alignItems:'center'}}>
                <FontAwesome style={{opacity: 0.8}} name={'heart'} size={12} color={'white'}/>
                <Text style={{  color:'white', fontSize: 10, fontWeight: 'bold', opacity: 0.8}}>{convertViews(item.likes)}</Text>
            </View>
            */
                 }
            
                 
            </>
    
            </ImageBackground>
          </TouchableHighlight>
        </View>
        );
      };
	
	return (
		<Container>
             <ScrollView style={{paddingHorizontal: 15}}
            	refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }
                  onScroll={_onScroll}>
                <View style={{flexDirection:"row",alignItems: 'center'}}>
                <View style={{flex:3}}>
                {Input()}
                </View>
                <View style={{flex:1,justifyContent:'center',alignItems: 'center'}}>
                    <ModalDropdown
                        options={type}    //下拉内容数组
                        //style={styles.modal}    //按钮样式
                        //dropdownStyle={[styles.dropdown,{height:32*type.length}]}    //下拉框样式
                       // dropdownTextStyle={styles.dropdownText}    //下拉框文本样式
                        renderSeparator={this._separator}    //下拉框文本分隔样式
                        adjustFrame={this._adjustType}    //下拉框位置
                        dropdownTextHighlightStyle={{color:'rgba(42, 130, 228, 1)'}}    //下拉框选中颜色
                        //onDropdownWillShow={() => setTypeShow(false)}   //按下按钮显示按钮时触发 
                        //onDropdownWillHide={() => setTypeShow(false)}    //当下拉按钮通过触摸按钮隐藏时触发
                        onSelect={this._selectType}    //当选项行与选定的index 和 value 接触时触发
                        defaultValue={'Sort by: Likes'}
                    >
                      
                       
                    </ModalDropdown>
 

                </View>

                </View>
                {sortindex==0?
                <View style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                }}>
                <FlatList
                    data = {vt}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    numColumns={numColumns}
                />
                </View>
                :
                <View style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    }}>
                    <FlatList
                        data = {videos}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                        numColumns={numColumns}
                    />
                    </View>
                }     
            </ScrollView>             
        </Container>
	)
}

export default inject('RootStore')(observer(Favourite));