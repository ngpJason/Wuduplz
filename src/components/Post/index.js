import React, {useState,useEffect} from 'react';
import {
	View,
	Text,
	TouchableWithoutFeedback, 
	Image,
	TouchableOpacity,
    Modal,
	ScrollView,
	FlatList
} from 'react-native';

import Video from 'react-native-video';
import styles from './styles';

import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Fontisto from 'react-native-vector-icons/Fontisto'
import Comment from "../Comment";
import Input from "../Comment/input";
import axios from 'axios' 
import {SERVER_ADDRESS} from '../../../data/address'
import request from '../../util/request'
import {inject,observer } from "mobx-react";
import RNFetchBlob from 'rn-fetch-blob';

/*
"post": {
		"RequestorId": "56",
		 "VideoId": "1134",
		 "comments": 2,
		 "creator": {"id": "8", 
		  			 "imageUri": "yellow",
					  "username": "tempor"
					},
		 "description": "Sport",
		 "islike": true, 
		 "likes": 3, 
		 "private": 1, 
		 "shares": 15,
		 "videoLocation": "//videos//134womanbasketball.mp4", 
		 "video_image": "|videoImages|134womanbasketball.jpg"
		}
*/

const Post = (props) => {
	

	const [comment,setComment]= useState([]);
	const [text,setText] = useState('')
	const [isLiked, setIsLiked] = useState(false);
	const [isViewed,setIsViewed] = useState(false)

	// state used to represent the pause/play feature
	const [paused, setPaused] = useState(true);
	const onPlayPausePress = () => {
		setPaused(!paused);
		if(!isViewed){
			setIsViewed(true)
			axios.get(`${SERVER_ADDRESS}/front-end/addVideoViews/${post.VideoId}`)
		}
			
	};
	const [post, setPost] = useState(props.post);

	// data of the post
	useEffect(()=>{

		if(props.post.type=='comment'){
			setModal(true)
			loadComment(post.id)

		}
			
		if(props.post.creator.id!=props.RootStore.UserId){
			console.log('self')
			setPost({
				...props.post,
				self:false,
			})
		}else{
			console.log('not self')
			setPost({
				...props.post,
				self:true,
			})
		}

		setIsLiked(props.post.islike)
		
	},[props])
	

	const [modal, setModal] = useState(false);
	const setModalVisible = () => {
		setModal(!modal);
	};

	const loadComment = async(comment_id)=>{
		if(comment_id){
			var result = await axios.post(SERVER_ADDRESS+'/front-end/getComment',{'video_id':post.VideoId,'comment_id':comment_id})

			setComment(result['data'])
		}else{
			var result = await axios.post(SERVER_ADDRESS+'/front-end/getComment',{'video_id':post.VideoId,'comment_id':comment_id?comment_id:undefined})
			setComment(result['data'])
		}
	}

	// data to represent the like state
	const onLikePress = async () => {
		console.log(props.RootStore)
		const likesToAdd = isLiked ? -1 : 1;
		var result = await request.post('/front-end/like',{
			UserId:props.RootStore.UserId,
			VideoId:post.VideoId,
			islike:isLiked,
			creator_id:props.post.creator.id
		})
		setPost({
			...post,
			likes: post.likes + likesToAdd
		})
		setIsLiked(!isLiked)
	};

	// data to represent the comment state
	const [isCommented, setIsCommented] = useState(false);
	const onCommentPress = async() => {
		setModalVisible(!modal);
		loadComment()
		
	}

	// data to represent the share state
	const [isShared, setIsShared] = useState(false);
	const onSharePress = () => {
		const sharesToAdd = isShared ? -1 : 1;
		setPost({
			...post,
			shares: post.shares + sharesToAdd
		})
		setIsShared(!isShared)
	}
	const textChange = (text)=>{
		setText(text)
	}

	const countComments = async ()=>{
		var result = await axios.get(SERVER_ADDRESS+`/front-end/countComments/${post.VideoId}`)
		console.log(result['data'][0]['count(*)'])
		setPost({
			...post,
			comments:result['data'][0]['count(*)']
		}
		)
	}

	const postComments = async()=>{
	

		await request.post('/front-end/comment',{
			CommentContent: text,
			CommentatorId:`${props.RootStore.UserId}`,
			CommentDate:null,
			ThumberNumber:3,
			videoId:post.VideoId,
			UserId:props.post.creator.id,
		})

		setText('')

		var result = await request.post('/front-end/getComment/',{video_id:post.VideoId})


		// var result = await axios.create({
		// 	baseURL:SERVER_ADDRESS
		// }).get('/front-end/getComment/'+post.video_id)
		setComment(result)

		
	}

	const deleteComment = async(comment_id)=>{
		await request.get(`/front-end/deleteComment/${comment_id}`)

		var result = await request.post('/front-end/getComment/',{video_id:post.VideoId})
		setComment(result)

	}

	// const checkPermission = async () => {
    
	// 	// Function to check the platform
	// 	// If iOS then start downloading
	// 	// If Android then ask for permission
	
	// 	if (Platform.OS === 'ios') {
	// 	  downloadImage(SERVER_ADDRESS+post.videoLocation);
	// 	} else {
	// 	  try {
	// 		const granted = await PermissionsAndroid.request(
	// 		  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
	// 		  {
	// 			title: 'Storage Permission Required',
	// 			message:
	// 			  'App needs access to your storage to download Photos',
	// 		  }
	// 		);
	// 		if (granted === PermissionsAndroid.RESULTS.GRANTED) {
	// 		  // Once user grant the permission start downloading
	// 		  console.log('Storage Permission Granted.');
	// 		  downloadImage(SERVER_ADDRESS+post.videoLocation);
	// 		} else {
	// 		  // If permission denied then show alert
	// 		  alert('Storage Permission Not Granted');
	// 		}
	// 	  } catch (err) {
	// 		// To handle permission related exception
	// 		console.warn(err);
	// 	  }
	// 	}
	//   };
	
	  const downloadImage = () => {
		// Main function to download the image
		
		// To add the time suffix in filename
		let date = new Date();
		// Image URL which we want to download
		let image_URL = SERVER_ADDRESS+post.videoLocation;    
		// Getting the extention of the file
		let ext = getExtention(image_URL);
		ext = '.' + ext[0];
		// Get config and fs from RNFetchBlob
		// config: To pass the downloading related options
		// fs: Directory path where we want our image to download
		const { config, fs } = RNFetchBlob;
		let PictureDir = fs.dirs.PictureDir;
		//PictureDir:/storage/emulated/0/Pictures
		let options = {
		  fileCache: true,
		  addAndroidDownloads: {
			// Related to the Android only
			useDownloadManager: true,
			notification: true,
			path:
			  PictureDir +
			  '/video_' + 
			  Math.floor(date.getTime() + date.getSeconds() / 2) +
			  ext,
			description: 'Video',
		  },
		};
		config(options)
		  .fetch('GET', image_URL)
		  .then(res => {
			// Showing alert after successful downloading
			console.log('res -> ', JSON.stringify(res));
			alert('Video Downloaded Successfully.');
		  });
	  };
	
	  const getExtention = filename => {
		// To get the file extension
		return /[.]/.exec(filename) ?
				 /[^.]+$/.exec(filename) : undefined;
	  };


	const deleteVideo = async()=>{
		alert(props.post.VideoId)
		axios.get(SERVER_ADDRESS+`/front-end/deleteVideo/${props.post.VideoId}`)
	}
	
	const icon = ()=>{
		if(post.private==1){
			console.log('download')
			return 'download'
		}
		return 'lock'
		
	}
	console.log('props is ',props)
	return (
		<View style={styles.container}>
			{/*comment modal start*/}
			<View style={styles.centeredView}>
				<Modal
					animationType={"slide"}
					transparent={true}
					visible={modal}
				>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<Text style={{fontWeight: 'bold', padding: 5, fontSize: 20}}>Comments</Text>
							<View style={{flex: 1, backgroundColor: '#FFF'}}>
								<FlatList
									data = {comment}
									keyExtractor={(item, index) => index.toString()}
									renderItem={({item})=>{
										return (
											<Comment username={item.username} 
											content={item.content} uri={SERVER_ADDRESS+item.photopath} comment_id={item.comment_id}
											deleteComment={deleteComment}/>
										)
									}}
							
									/>
									

								{/*keyboard input start*/}
								<Input closeModal={setModalVisible} textChange={textChange} postComments={postComments} countComments={countComments}values={text}/>
								{/*keyboard input end */}
							</View>
						</View>
					</View>
				</Modal>
			</View>
			{/*comment modal end*/}

			<TouchableWithoutFeedback onPress={onPlayPausePress}>
				<View>
						{(props.RootStore.membership>0||post.private==1||post.private==0&&props.RootStore.UserId==post.creator.id)?paused && <FontAwesome style={{
							zIndex: 999,
							opacity: 1.0,
							position: 'absolute',
							alignSelf: 'center',
							top:'43%',
							left:'43%'
						}} name={'play'} size={100} color="white" />:<FontAwesome style={{
							zIndex: 999,
							opacity: 1.0,
							position: 'absolute',
							alignSelf: 'center',
							top:'43%',
							left:'43%'
						}} name={'lock'} size={100} color="white" />}
						
						{(props.RootStore.membership>0||post.private==1||post.private==0&&props.RootStore.UserId==post.creator.id)?
						<Video
							source={{uri:SERVER_ADDRESS+post.videoLocation}}
							style = {styles.video}
							poster={SERVER_ADDRESS+post.video_image.split('|').join('//')}
							onError={(e) => console.log("from video: ", e)}
							posterResizeMode={'cover'}
							resizeMode={'cover'}
							repeat={true}
							paused={paused}
							controls={false}
						/>:<></>
						}			

				<View style={styles.uiContainer}>
					<View style={styles.rightContainer}>
				

						<TouchableOpacity style={styles.iconContainer} onPress={onLikePress}>
							<AntDesign name={'heart'} size={25} color={isLiked ? 'red' : 'white'} />
							<Text style={styles.statsLabel}>{post.likes}</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.iconContainer} onPress={onCommentPress}>
							<FontAwesome name={'commenting'} size={25} color={isCommented ? 'cyan' : 'white'} />
							<Text style={styles.statsLabel}>{post.comments}</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.iconContainer}>
							<FontAwesome name={'eye'} size={25} color={'white'} />
							<Text style={styles.statsLabel}>{post.shares}</Text>
						</TouchableOpacity>

					
						<TouchableOpacity style={styles.iconContainer} onPress={post.self ?deleteVideo:downloadImage}>
							<Fontisto name={post.self?'trash':'download'} size={25} color={'white'} />
							<Text style={styles.statsLabel}></Text>
						</TouchableOpacity>
			

					</View>

					<View style={styles.bottomContainer}> 
						
						<View style={[styles.profilePictureContainer]}>
							<Image style={styles.profilePicture} 
								   source={{uri: post.creator.imageUri?post.creator.imageUri.includes('//')?SERVER_ADDRESS+post.creator.imageUri:'https://th.bing.com/th/id/OIP.lBi3OEEGJwlNxuDo6OQRbQHaNH?pid=ImgDet&rs=1':'https://th.bing.com/th/id/OIP.lBi3OEEGJwlNxuDo6OQRbQHaNH?pid=ImgDet&rs=1'}}	
							/>	
						</View>
							<Text style={styles.handle}>{post.creator.username}</Text>
							<Text style={styles.description}>{post.description}</Text>

							<View style={styles.songRow}>
								<Entypo name={'users'} size={20} color='white'/>
								<Text style={styles.requestedBy}>Requested by <Text style={{textDecorationLine:'underline'}}>{post.requestor}</Text></Text>
							</View>
					

					</View>
				</View>

				 </View>
			</TouchableWithoutFeedback>
		</View>
	);
}

export default inject('RootStore')(observer(Post));