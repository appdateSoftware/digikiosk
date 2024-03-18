import React, {useEffect, useState} from 'react';
import { completionEnum } from "../../config";
import { StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

const DecadeButtonDown = ({ onClick, completionTotalPercentage }) => { 

  const [imageSource, setImageSource] = useState(require("../../assets/img/karta_dekadas_katobelos_black_200-253.png"))

  useEffect(() => {
    switch (completionTotalPercentage){
      case completionEnum.oneThird : 
        setImageSource(require("../../assets/img/karta_dekadas_katobelos_black_1_3_red_90x114.png"));
        break;      
      case completionEnum.twoThirds :   
        setImageSource(require("../../assets/img/karta_dekadas_katobelos_black_2_3_red_90x114.png"));
        break;  
      case completionEnum.threeThirds :   
        setImageSource(require("../../assets/img/karta_dekadas_katobelos_red_90x114.png"));
        break;  
      default: setImageSource(require("../../assets/img/karta_dekadas_katobelos_black_200-253.png"))
    }
    
  },[completionTotalPercentage])

  return (
    <TouchableOpacity     
      style={ styles.container } 
      onPress={onClick}
    >
       <ImageBackground 
        source={imageSource}
        resizeMode="cover" 
        style={styles.image}
      >      
      </ImageBackground>      
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {   
    justifyContent: 'center',
    width: "100%",
    height: "100%"
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
})

export default DecadeButtonDown;