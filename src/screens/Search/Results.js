import React, {useState,useEffect} from 'react';
import {Dimensions, Text, View, FlatList, ScrollView, TextInput,StyleSheet, TouchableHighlight, Image,ImageBackground,RefreshControl} from 'react-native';
//import ImageBackground from '../../components/ImageBackground'
import FontAwesome from "react-native-vector-icons/FontAwesome";
import randomize from "../../functions/randomize";
import {Container} from "./styles";
import axios from 'axios'
import {SERVER_ADDRESS} from '../../../data/address'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import {inject,observer } from "mobx-react";
// import {
//     LazyloadScrollView,
//     LazyloadView,
//     LazyloadImage
// } from 'react-native-lazyload';

const numColumns=2

const Results = ({route, navigation,RootStore}) => {
    const [search, setSearch] = useState(route.params.query);
    const bar = [{type:'input'},{type:'blank'}]
    const [videos,setVideos] = useState([])

    const [refreshing, setRefreshing] = React.useState(false);

    const convertViews = (param)=>{
        if(param>1000)
            return (param/1000).toFixed(1)+'k'
        else
            return param
    }

    const convertKeyword = (keyword)=>{
        
        var string = ''
        if(keyword &&keyword.length>0){
            for(var i=0;i<keyword.length;i++){
                if(i==2)
                    string +='\n'
                string += '#'+keyword[i] + ' '
            }
        }

        return string
    }


	const onRefresh = React.useCallback(async() => {
		setRefreshing(true);
		
		setRefreshing(false)
	  }, []);

    useEffect(()=>{
        async function getData(){
            console.log('started',route.params.query)
            var result = await axios.get(SERVER_ADDRESS+`/front-end/searchVideos/${route.params.query}`)
            setSearch(route.params.query)
            setVideos(bar.concat(result['data']))
        }
       
        getData()

    },[route.params.query])
   
    
    const renderItem = ({ item, index }) => {

        var priva = RootStore.membership>0||RootStore.UserId==item.creator_id?1:item.private
  
        return (
            <View>
          {index==0?Input():index==1?<></>
            :<TouchableHighlight onPress={()=>{
                if(priva==1)
                    navigation.navigate('Video',{videoId:item.video_id})
                else
                    alert('please pay for this video')
            }}>
            <ImageBackground
              source={{uri:SERVER_ADDRESS+item.video_image.split('|').join('//')}}
              style={{
                width: (Dimensions.get('window').width / 2) - 16,
                height: 250,
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
                <Text style={{position: 'absolute', bottom: 60, left: 5, color:'white', fontSize: 12, backgroundColor:'grey'}}>{item.dat?item.dat.slice(0,10):''}</Text>
                <Text style={{position: 'absolute', bottom: 5, left: 2, color:'white', fontSize: 12}}>@{item.username}</Text>
                <Text style={{position: 'absolute', bottom: 25, left: 5, color:'white', fontSize: 14}}>{convertKeyword(item.keyword)}</Text>
                <View style={{position: 'absolute', top: 0,right: 3, bottom: 6,  alignItems: 'flex-end',flexDirection:'row'}}>
                    <FontAwesome style={{right: 3}} name={'heart'} size={16} color={'white'}/>
                    <Text style={{color:'white', fontSize: 12}}>{convertViews(item.likes)}</Text>
                </View>
                </View>
                 }
            </>
    
            </ImageBackground>
          </TouchableHighlight>
    }
          </View>
                
 
        );
      };

      const Input = ()=>{
		return(
        <View style={{width:500}}>
		<TextInput
                    placeholder={search}
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
                        var result = await axios.get(SERVER_ADDRESS+`/front-end/searchVideos/${search}`)
                        setVideos(bar.concat(result['data']))
                    }}
                />
                 <View  style={{
                        paddingVertical: 15,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: '#E5E5E5',
                    }}>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 10
                        }}>
                            <View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 30,
                                height: 30,
                                borderRadius: 15,
                                borderColor: '#333',
                                borderWidth: StyleSheet.hairlineWidth
                            }}>
                                <FontAwesome name={'question'} size={20} color="#E5E5E5" />
                            </View>
                            <View style={{
                                width: '50%'
                            }}>
                                <Text style={{fontWeight: 'bold'}}>Results</Text>
                                <Text style={{color: '#333'}}>{search}</Text>
                            </View>
                            <View style={{
                                width: '25%',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <FontAwesome name={'arrow-right'} size={20} color="#E5E5E5" />
                            </View>
                        </View>
                        </View>
                        </View>

		)
	}


    return(
        <Container>
            <View  style={{paddingHorizontal: 15} } >
             
         {/* <View>
            <TextInput
                        placeholder={search}
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
                            var result = await axios.get(SERVER_ADDRESS+`/front-end/searchVideos/${search}`)
                            setVideos(result['data'])
                        }}
                    />
                 <View  style={{
                        paddingVertical: 15,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: '#E5E5E5',
                    }}>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 10
                        }}>
                            <View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 30,
                                height: 30,
                                borderRadius: 15,
                                borderColor: '#333',
                                borderWidth: StyleSheet.hairlineWidth
                            }}>
                                <FontAwesome name={'question'} size={20} color="#E5E5E5" />
                            </View>
                            <View style={{
                                width: '50%'
                            }}>
                                <Text style={{fontWeight: 'bold'}}>Results</Text>
                                <Text style={{color: '#333'}}>{search}</Text>
                            </View>
                            <View style={{
                                width: '25%',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <FontAwesome name={'arrow-right'} size={20} color="#E5E5E5" />
                            </View>
                        </View>
                        </View>
                        </View> */}
          
            <FlatList refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }
            data={videos}
            style={{
                flex: 1,
                marginVertical:0,
            }}
            renderItem={renderItem}
            numColumns={numColumns}
            nestedScrollEnabled={true}
        />

        </View>
      </Container>
    )

    // return (
    //     <Container>
    //         <ScrollView style={{paddingHorizontal: 15}} onScroll={_onScroll}>
    //             <TextInput
    //                 placeholder={search}
    //                 value={search}
    //                 placeHolderTextColor="#333"
    //                 style={{
    //                     //flex: 1,
    //                     marginTop: 10,
    //                     marginBottom: 5,
    //                     paddingHorizontal: 15,
    //                     alignSelf: 'stretch',
    //                     width: StyleSheet.hairLineWidth,
    //                     backgroundColor: '#F5F5F5'
    //                 }}
    //                 onChangeText={(text) => setSearch(text)}
    //                 onSubmitEditing={async() => {
    //                     var result = await axios.get(SERVER_ADDRESS+`/front-end/searchVideos/${search}`)
    //                     setVideos(result['data'])
    //                 }}
    //             />
    //                 <View  style={{
    //                     paddingVertical: 15,
    //                     borderBottomWidth: StyleSheet.hairlineWidth,
    //                     borderBottomColor: '#E5E5E5',
    //                 }}>
    //                     <View style={{
    //                         display: 'flex',
    //                         flexDirection: 'row',
    //                         alignItems: 'center',
    //                         justifyContent: 'space-between',
    //                         marginBottom: 10
    //                     }}>
    //                         <View style={{
    //                             alignItems: 'center',
    //                             justifyContent: 'center',
    //                             width: 30,
    //                             height: 30,
    //                             borderRadius: 15,
    //                             borderColor: '#333',
    //                             borderWidth: StyleSheet.hairlineWidth
    //                         }}>
    //                             <FontAwesome name={'question'} size={20} color="#E5E5E5" />
    //                         </View>
    //                         <View style={{
    //                             width: '50%'
    //                         }}>
    //                             <Text style={{fontWeight: 'bold'}}>Results</Text>
    //                             <Text style={{color: '#333'}}>{search}</Text>
    //                         </View>
    //                         <View style={{
    //                             width: '25%',
    //                             alignItems: 'center',
    //                             justifyContent: 'center',
    //                         }}>
    //                             <FontAwesome name={'arrow-right'} size={20} color="#E5E5E5" />
    //                         </View>
    //                     </View>
    //                     {/* <View style={{
    //                         flex: 1,
    //                         display: 'flex',
    //                         flexDirection: 'row',
    //                         alignItems: 'center',
    //                     }}> */}
                           
    //                             {/*<View style={{marginTop: 5, marginLeft: 5, marginBottom: 5,  borderBottom: 3, flexDirection:'row', alignItems:'center', justifyContent: 'center'}}>*/}
    //                             {/*    <FontAwesome style={{paddingRight: 5}} name={'arrow-right'} size={12} color={'grey'} />*/}
    //                             {/*    <View style={{width: '90%'}}>*/}
    //                             {/*        <Text style={{fontSize: 13}}>Query for $placeholder</Text>*/}
    //                             {/*    </View>*/}
    //                             {/*</View>*/}

    //                             {/* <View style={{
    //                                 flexDirection: 'row',
    //                                 flexWrap: 'wrap',
    //                             }}>
    //                                 {videos.map((video, key) => (
    //                                     <TouchableHighlight > */}
    //                                          {/* <ImageBackground
    //                                             key={key}
    //                                             source={{uri:SERVER_ADDRESS+video.video_image.split('|').join('//')}}
    //                                             resizeMethod="resize"
    //                                             style={{
    //                                                 width: (Dimensions.get('window').width / 2) - 18,
    //                                                 height: 250,
    //                                                 marginHorizontal: 1,
    //                                                 marginBottom: 1
    //                                             }}
    //                                          >
    //                                             <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
    //                                                 <Text style={{position: 'absolute', bottom: 60, left: 5, color:'white', fontSize: 12, backgroundColor:'grey'}}>2020-03-04</Text>
    //                                                 <Text style={{position: 'absolute', bottom: 5, left: 2, color:'white', fontSize: 12}}>@daviddobrik</Text>
    //                                                 <Text style={{position: 'absolute', bottom: 25, left: 5, color:'white', fontSize: 14}}>#skiing #adventure #palmtrees</Text>
    //                                                 <FontAwesome style={{position:'absolute', bottom:6, right: 45}} name={'heart'} size={16} color={'white'}/>
    //                                                 <Text style={{position: 'absolute', bottom: 6, right: 3, color:'white', fontSize: 12}}>302.4K</Text>
    //                                             </View>
    //                                         </ImageBackground>  */}
    //                                         {/* <ImageBackground  
    //                                         // url={SERVER_ADDRESS+video.video_image.split('|').join('//')}
    //                                         url={video.image}
    //                                         key={key}
    //                                         // id={video.video_id}
    //                                         y={y}
    //                                         style={{
    //                                                 width: (Dimensions.get('window').width / 2) - 18,
    //                                                 height: 250,
    //                                                 marginHorizontal: 1,
    //                                                 marginBottom: 1
    //                                             }}/>
    //                                                              */}
                                                            
                                
                                            
    //                                     {/* </TouchableHighlight>
    //                                 ))}
    //                             </View>
                      
    //                     </View>
    //                 </View> */}
                     
    //               <View style={{
    //                         flex: 1,
    //                         display: 'flex',
    //                         flexDirection: 'row',
    //                         alignItems: 'center',
    //                     }}>
    //                 <View style={{
    //                                 flexDirection: 'row',
    //                                 flexWrap: 'wrap',
    //                             }}>

    //                         {videos.map((video, key) => (               
                         
    //                        <ImageBackground  
                        
    //                                         url={SERVER_ADDRESS+video.video_image.split('|').join('//')}
    //                                         // url={video.image}
    //                                         likes={video.likes}
    //                                         username={video.username}
    //                                         dat={video.dat}
    //                                         keyword={video.keyword}
    //                                         key={key}
    //                                         private={RootStore.membership>0||RootStore.UserId==video.creator_id?1:video.private}
    //                                         id={video.video_id}
    //                                         y={y}
    //                                         navigation={navigation}
    //                                         style={{
    //                                                 width: (Dimensions.get('window').width / 2) - 18,
    //                                                 height: 250,
    //                                                 marginHorizontal: 1,
    //                                                 marginBottom: 1
    //                                             }}>
                                                    

    //                                                 </ImageBackground>
                                                            
                          
    //                                 ))}
    //                 </View>
    //             </View>
    //             </View>

    //         </ScrollView>
    //     </Container>
    // )
}

export default inject('RootStore')(observer(Results));