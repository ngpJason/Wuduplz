import React, {Component,useEffect,useState} from 'react'
import {
    StyleSheet,
    View,
    Image,
    Text,
    Dimensions,
    InteractionManager,
    ImageBackground,
    NativeModules
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
    // const r =0;

    const [r,setR] = useState('');

    function _onLayout(e) {
        if(r){
        r.measure((x, y, width, height, pageX, pageY) => {
            setOffSetY(pageY)
            console.log(x, y, width, height, pageX, pageY);
        })
    }
   }


    function _renderLoad(text) {
        return(
            <View 
             ref={ref=>{setR(ref)}}
                style = {{
                    backgroundColor: '#eee',
                justifyContent: 'center',
                alignItems: 'center',
                width:props.style.width,
                height: props.style.height,
                marginHorizontal: 1,
                marginBottom: 1
            }}
                onLayout = {_onLayout}
            >
                <Text 
                    style = {styles.loadText}
                >{text}</Text>
            </View>
        )
    }



    // console.log('view is ',props.key,props.y_value)
    console.log('offseet is ',props.key,offsetY)
    return (
        <>
        {props.y_value + screenHeight > offsetY&&props.y_value<offsetY+props.style.height?_renderLoad('loaded'):_renderLoad('loading images')}
        
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