import React, {useState,useEffect} from 'react';
import {
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    ActivityIndicator,
    View,
    FlatList
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {Container} from "../Search/styles";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {SERVER_ADDRESS} from '../../../data/address'
import axios from 'axios'

const Search = ({route, navigation}) => {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [loadMore,setLoadMore] = React.useState(false)
    const [refreshing, setRefreshing] = React.useState(false);
    const [page,setPage] = React.useState(0)
    const bar = [{type:'bar'}]


    useEffect(()=>{
		const unsubscribe = navigation.addListener('focus', async() => {
			// do something
           var  result = await axios.get(`${SERVER_ADDRESS}/front-end/getRequest/all/${0}/${10}`)
           setResults(bar.concat(result['data']));
		  }); 
		  return unsubscribe;
    },[navigation])

    useEffect(()=>{
        async function getData(){
        var result = await axios.get(`${SERVER_ADDRESS}/front-end/getRequest/all/${0}/${10}`)
        setResults(bar.concat(result['data']))
        };
        getData();
    },[])

    const onRefresh = React.useCallback(async() => {
		setRefreshing(true);
		var result = await axios.get(`${SERVER_ADDRESS}/front-end/getRequest/all/${0}/${10}`)
		setPage(10)
		setResults(bar.concat(result['data']))
		setRefreshing(false)
	  }, []);

    const updateResults = async() => {
        console.log('updating!')
        var result={}
        if(search=='')
            result = await axios.get(`${SERVER_ADDRESS}/front-end/getRequest/all/${0}/${10}`)
        else
            result = await axios.get(`${SERVER_ADDRESS}/front-end/getRequest/search/${search}/0'`)
        setResults(bar.concat(result['data']));
    };

    const loadData = async()=> {
        if(results.length>=10){
            setLoadMore(true)
            var result = await axios.get(`${SERVER_ADDRESS}/front-end/getRequest/all/${page}/${10}`)
            setResults(results.concat(result['data']))
            setPage(page+10)
            setLoadMore(false)
        }
    }

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



    return (
        <View style={{paddingHorizontal: 15}}>

            <FlatList
                refreshing={refreshing} 
                onRefresh={onRefresh}
                data = {results}
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
                        paddingBottom: 10,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: '#E5E5E5',
                    }} >
                        <View>
                        <Image
                            style={{borderColor: '#EEE', borderRadius: 25, width: 46, height: 46}}
                            source={{uri:item.img&&item.img.includes('//')?SERVER_ADDRESS+item.img:'https://th.bing.com/th/id/OIP.lBi3OEEGJwlNxuDo6OQRbQHaNH?pid=ImgDet&rs=1'}} />
                             <Text style={{marginTop: 5, fontWeight: 'bold', marginLeft: 0}}>@{item.requestor}</Text>
                        </View>

                        <View style={{
                            width: '50%',
                            top:'-5%'
                        }}>
                            <TouchableOpacity onPress={() => {navigation.navigate("Responses", {responses:item.responses})}} >
                                <Text style={{ fontWeight: 'bold' }}>{item.requestMessage}</Text>
                                <Text style={{ color: '#333' }}>{item.responseCount}</Text>
                            </TouchableOpacity>
                           
                        </View>
                    
                        <View style={{
                            width: '18%',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            <TouchableOpacity style={{paddingLeft:10}} onPress={() => {navigation.push("Record",{
                                'requestor_id':item.requestor_id,
                                'response_id':'new',
                                'request_message':item.requestMessage,
                                'request_id':item.RequestId
                            })}} >
                                <FontAwesome5 name={'video'} size={25} color="pink" />
                            </TouchableOpacity>
                            {/*<TouchableOpacity style={{paddingRight:9}} onPress={() => {toggle(request.id)}} >*/}
                            {/*    <FontAwesome5 name={'trash-alt'} size={22} color="pink" />*/}
                            {/*</TouchableOpacity>*/}
                        </View>
                    </View>
                }
                    </View>
                                )
                        }}
                onEndReached={() =>loadData()}
				onEndReachedThreshold={0.7}
                ListFooterComponent={()=>renderLoadMoreView()}
             />
                    
           
    </View>)
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

export default Search;