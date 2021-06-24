import React, {Component,useEffect,useState} from 'react'
import {
    StyleSheet,
    View,
    Image,
    Text,
    Dimensions,
    InteractionManager,
    ImageBackground,
    TouchableHighlight
} from 'react-native'

import FontAwesome from "react-native-vector-icons/FontAwesome";

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const BackGround = (props)=>{

    /*props{
        y,
        url,
    }
    */

    // useEffect(()=>{
    //     console.log('Test props is ',props)
    // },[])

    const [offsetY,setOffSetY] = useState(0)
    const [r,setR] = useState('');

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


    function _onLayout(e) {
        if(r){
        r.measure((x, y, width, height, pageX, pageY) => {
            setOffSetY(pageY)
            //console.log(x, y, width, height, pageX, pageY);
        })
    }
   }
      


    function _renderLoad(text) {
        return(
         
                <Text 
                    style = {styles.loadText}
                >{text}</Text>
        
        )
    }

    function _Image(){
        return(
            <TouchableHighlight onPress={()=>props.navigation.navigate('Video',{videoId:props.id})}>
        <ImageBackground
            key={props.key}
            resizeMethod="resize"
            source={{uri:props.url}}
            style={{
                width: props.style.width,
                height: props.style.height,
                marginHorizontal: 1,
                marginBottom: 1

            }}>
       <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{position: 'absolute', bottom: 60, left: 5, color:'white', fontSize: 12, backgroundColor:'grey'}}>{props.dat?props.dat.slice(0,10):''}</Text>
                <Text style={{position: 'absolute', bottom: 5, left: 2, color:'white', fontSize: 12}}>{props.username?'@'+props.username:''}</Text>
                <Text style={{position: 'absolute', bottom: 25, left: 5, color:'white', fontSize: 14}}>{convertKeyword(props.keyword)}</Text>
                <View style={{position: 'absolute', top: 0,right: 3, bottom: 6,  alignItems: 'flex-end',flexDirection:'row'}}>
                    <FontAwesome style={{right: 3}} name={'heart'} size={16} color={'white'}/>
                    <Text style={{color:'white', fontSize: 12}}>{convertViews(props.likes)}</Text>
                </View>
        </View>
        </ImageBackground>
        </TouchableHighlight>
        )
    }


    return (
    <>
        {props.private==0? <TouchableHighlight onPress={()=>alert('please pay for this video')}>
        <ImageBackground
            key={props.key}
            resizeMethod="resize"
            source={{uri:props.url}}
            style={{
                width: props.style.width,
                height: props.style.height,
                marginHorizontal: 1,
                marginBottom: 1

            }}>
       <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                    <FontAwesome style={{right: 3}} name={'lock'} size={80} color={'white'}/>
               
        </View>
        </ImageBackground>
        </TouchableHighlight>:
        <View ref={ref=>{setR(ref)}}  style = {{
            backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        width:props.style.width,
        height: props.style.height,
        marginHorizontal: 1,
        marginBottom: 1
    }} onLayout = {_onLayout}>
        <>
            {(props.y + 2.5*screenHeight > offsetY&&props.y<offsetY+2.5*props.style.height)?_Image():_renderLoad('loading images')}
        
        </>
        </View>
}
        </>
    )
}


const styles = StyleSheet.create({
    // container style
   
    // loading style
    loadText: {
        fontSize: 20,
        color: '#ccc'
    },
});



export default BackGround;