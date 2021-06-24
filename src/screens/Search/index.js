import React, {useState,useEffect} from 'react';
import {
    ScrollView,
    Image,
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight, Dimensions,RefreshControl,FlatList,ImageBackground
} from 'react-native';
import {Container} from './styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {SERVER_ADDRESS} from '../../../data/address'
import randomize from '../../functions/randomize';
import axios from 'axios'
import {inject,observer } from "mobx-react";
import VisibilitySensor from "react-visibility-sensor";
import Test from '../../components/Test'
// import ImageBackground from '../../components/ImageBackground'
 


const Search = ({navigation,RootStore }) => {


    const [y,setY] = React.useState(0)

    function _onScroll(e) {
        // get slide distance
        let {y} = e.nativeEvent.contentOffset;
        // this.setState({
        //     y
        // })
        setY(y)
    }
    const [refreshing, setRefreshing] = React.useState(false);
	const onRefresh = React.useCallback(async() => {
		setRefreshing(true);
		var result = await axios.get(`${SERVER_ADDRESS}/front-end/videoRecommendation/${RootStore.UserId}`)


		setData(result['data'])

		setRefreshing(false)
	  }, []);
   
    const [search, setSearch] = useState('');
    // const [videos,setVideos] = useState([])
    // const [categories,setCategories] = useState([])
    const [data, setData] = useState({})


    useEffect(()=>{
        async function getData(){
            var result = await axios.get(`${SERVER_ADDRESS}/front-end/videoRecommendation/${RootStore.UserId}`)
            
            setData(result['data'])
        };
        getData()
    },[])
    // const videos = [
    //     {url: "https://d8vywknz0hvjw.cloudfront.net/fitenium-media-prod/videos/45fee890-a74f-11ea-8725-311975ea9616/proccessed_720.mp4",
    //     image: 'https://i.pinimg.com/564x/27/b4/5c/27b45cfadb28dbd857ebd662fe3cc1fe.jpg',
    //     likes: 310.2},
    //     {url: "https://d8vywknz0hvjw.cloudfront.net/fitenium-media-prod/videos/45fee890-a74f-11ea-8725-311975ea9616/proccessed_720.mp4",
    //     image: 'https://66.media.tumblr.com/2170b24c045a368996ed3d0b84e74c4e/tumblr_pjn69mp52s1tbym8o_1280.jpg',
    //     likes: 43.3},
    //     {url: "https://d8vywknz0hvjw.cloudfront.net/fitenium-media-prod/videos/45fee890-a74f-11ea-8725-311975ea9616/proccessed_720.mp4",
    //     image: 'https://cdn.mensagenscomamor.com/content/images/m000518052.jpg?v=1&w=600&h=941',
    //     likes: 12.2},
    //     {url: "https://d8vywknz0hvjw.cloudfront.net/fitenium-media-prod/videos/45fee890-a74f-11ea-8725-311975ea9616/proccessed_720.mp4",
    //     image: 'https://i.pinimg.com/236x/61/69/67/61696742e1b2d8b0d3ed70efaa1b0f89.jpg',
    //     likes: 100.5},
    // ]

    // const categories = [
    //     {name: "palm-trees", description: "Profile"},
    //     {name: "star-nights", description: "Profile"},
    //     {name: "landscape", description: "Profile"},
    //     {name: "roads-and-buildings", description: "Trending"},
    //     {name: "white-cats", description: "Recently Searched"},
    // ]

    // this api fetches video results based on user's preferences
    // user preferences can be keywords of their profile
    // user preferences can be their current geolocation
    // user preferences can be based on past queries, historic
    const DiscoverAPIData = [
        api_endpoint => '/api/videoRecommendation/{user_id}',
        results => [
            keyword_1 => [
                {
                    requestId: 1,
                    requestedByUser: 1,
                    video_id: 1,
                    videoLocation: 'URL for file' || 'File path on disk',
                    creator: {
                        id: 1,
                        username: '@some_user_name',
                        imageUri: 'URL for file' || 'File path on disk',
                    },
                    description: 'Description of content',
                    likes: 31,
                    comments: 12,
                    private: true,
                },
                {
                    requestId: 2,
                    requestedByUser: 41,
                    video_id: 2,
                    videoLocation: 'URL for file' || 'File path on disk',
                    creator: {
                        id: 12,
                        username: '@some_user_name',
                        imageUri: 'URL for file' || 'File path on disk',
                    },
                    description: 'Description of content',
                    likes: 331,
                    comments: 112,
                    private: true,
                },
            ],
            keyword_2 => [
            ],
            keyword_3 => [
            ],
        ]
    ]
    const convertLikes = (param)=>{
        if(param>1000)
            return (param/1000).toFixed(1)+'k'
        else
            return param
    }



    return (
        <Container>
            <ScrollView style={{paddingHorizontal: 15}}
            	refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }
                  onScroll={_onScroll}>
                <TextInput
                    placeholder="Search"
                    placeHolderTextColor="#333"
                    value={search}
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
                    onSubmitEditing={() => {
                        navigation.navigate("Results", {query: search});
                    }}
                />
                  

               
                {Object.keys(data).map((categorie, k) => (
             
                    <View key={k} style={{
                        paddingVertical: 15,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: '#E5E5E5',
                    }}>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginVertical: 10
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
                                <FontAwesome name={'hashtag'} size={20} color="#E5E5E5" />
                            </View>
                            <View style={{
                                width: '50%'
                            }}>
                                <Text style={{fontWeight: 'bold'}}>{categorie}</Text>
                                <Text style={{color: '#333'}}>{categorie.description}</Text>
                            </View>
                            <View style={{
                                width: '25%',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <FontAwesome name={'arrow-right'} size={20} color="#E5E5E5" />
                            </View>
                        </View>
                        <View style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <FlatList horizontal={true}
                             data ={data[categorie]}
                             keyExtractor={(item, index) => index.toString()}
                             renderItem={({item})=>{
                                 return(
                                    <TouchableHighlight onPress={() => {
                                        navigation.navigate("Video", {videoId:item.VideoId})
                                    }}>
                                        <ImageBackground
                                            
                                            resizeMethod="resize"
                                            source={{uri:SERVER_ADDRESS+item.videoImg}}
                                            style={{
                                                width: 133,
                                                height: 180,
                                                marginHorizontal: 1,
                                                marginBottom: 1
                                            }}>

                                            <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                                                <Text style={{position: 'absolute', bottom: 5, left: 5, color:'white', fontSize: 11, backgroundColor:'grey', opacity: 0.8}}>{item.dat?item.dat.slice(0,10):''}</Text>
                                            </View>
                                            <View style={{position: 'absolute',right: 3, bottom: 6, flexDirection:'column',alignItems:'center'}}>
                                            
                                                {/* <Text style={{position: 'absolute', top: 2, left: 2, color:'white', fontSize: 12, opacity: 0.8}}>@daviddobrik</Text> */}
                                                <FontAwesome style={{opacity: 0.8}} name={'heart'} size={12} color={'white'}/>
                                                <Text style={{  color:'white', fontSize: 10, fontWeight: 'bold', opacity: 0.8}}>{convertLikes(item.likes)}</Text>
                                            </View>
                                        </ImageBackground>
                                    </TouchableHighlight>
                                 )
                             }
                             }
                            >
                              
                            </FlatList>
                        </View>
                    </View>
                  
                ))}
            </ScrollView>
        </Container>
    )
};

export default inject('RootStore')(observer(Search))