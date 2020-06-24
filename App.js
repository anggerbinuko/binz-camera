import React, {useState, useEffect, useRef  } from 'react';
import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, Image, Modal } from 'react-native';
import { Camera } from 'expo-camera';
import { FontAwesome } from '@expo/vector-icons';

export default function App() {

  const camera = useRef(null);
  const [type, setType ] = useState(Camera.Constants.Type.back);
  const [flash, setState ] = useState(Camera.Constants.FlashMode.off);
  const [hasPermission, setHaspermission]  =useState(null); 
  const [picture, setPicture] = useState(null);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  useEffect(()=>{
    (async()=>{
      const {status} = await Camera.requestPermissionsAsync();
      setHaspermission(status === 'granted');
    })();
  },[]);

  if(hasPermission === null){
    return <View/>;
  }

  if(hasPermission === false){
    return (
      <View style={{flex: 1, justifyContent: "center", alignItems: 'center'}}>
        <Text >Acesso à câmera foi negado</Text>
      </View>
    );
  }

  async function doCameraCapture(){
    if(camera){
      const data = await camera.current.takePictureAsync();
      setPicture(data.uri);
      // Change action here 
      setIsVisibleModal(true);
    }
  }

  function doCameraFlash(){
    setState(            
      flash === Camera.Constants.FlashMode.off
      ? Camera.Constants.FlashMode.torch: 
      Camera.Constants.FlashMode.off
    );
  }

  function doCameraChange(){
    setType(            
      type === Camera.Constants.Type.back 
      ? Camera.Constants.Type.front: 
      Camera.Constants.Type.back
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera 
        ref={camera} 
        style={{ flex: 1, width: '100%', height: '100%', alignSelf: 'stretch'}} 
        flashMode={flash}
        type={type}
        ratio="16:9"
        autoFocus="on"
        whiteBalance="auto"
      >
      <View style={{flex: 1, backgroundColor: 'transparent', flexDirection: 'row'}}>
      </View>
      </Camera>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonFlash} onPress={doCameraFlash}>
          <Image source={require('./assets/camera-flash.png')} style={{width: 25, height: 25}}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonCapture} onPress={doCameraCapture}>
          <Image source={require('./assets/camera-capture.png')} style={{width: 66, height: 66}}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonChange} onPress={doCameraChange}>
          <Image source={require('./assets/camera-change.png')} style={{width: 25, height: 25}}/>
        </TouchableOpacity>
      </View>
      
      {/* Modal: preview photo */} 
      {
        picture && 
        (<Modal animationType="slide" transparent={false} visible={isVisibleModal}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity onPress={()=>setIsVisibleModal(false)}>
            <Image source={require('./assets/icon_close.png')} style={{width: 40, height: 40, margin: 10}}/>
            </TouchableOpacity>
            <Image
              style={styles.imageContainer}
              source={{uri: picture}}
            />
          </View>
        </Modal>)
      }

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },

  buttonContainer: {
    flex: 0.2,
    flexDirection: 'row',
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },

  buttonFlash:{
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9E9E9E',
    borderRadius: 25,
    height: 50,
    width: 50,
  },

  buttonCapture:{
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9E9E9E',
    borderRadius: 35,
    height: 70,
    width: 70
  },

  buttonChange:{
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: '#9E9E9E',
    borderRadius: 25,
    height: 50,
    width: 50
  },

  imageContainer:{
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderRadius: 25,
    height: '88%',
    width: '90%'
  }

});
