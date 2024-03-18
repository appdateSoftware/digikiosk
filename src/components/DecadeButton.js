import React, {useEffect, useState} from 'react';
import { completionEnum } from "../../config";
import { StyleSheet, TouchableOpacity, View, ImageBackground } from 'react-native';
import { DecadeText } from '../../components/text/CustomText';

const DecadeButton = ({ start, end, onClick, completionPercentage }) => { 

  const [imageSource, setImageSource] = useState(require("../../assets/img/karta_dekadas_black_90-114.png"))

  useEffect(() => {
    switch (completionPercentage){
      case completionEnum.oneThird : 
        setImageSource(require("../../assets/img/karta_dekadas_black_1_3_red_90-114.png"));
        break;      
      case completionEnum.twoThirds :   
        setImageSource(require("../../assets/img/karta_dekadas_black_2_3_red_90x114.png"));
        break;  
      case completionEnum.threeThirds :   
        setImageSource(require("../../assets/img/karta_dekadas_red_90x114.png"));
        break;  
      default: setImageSource(require("../../assets/img/karta_dekadas_black_90-114.png"))
    }
    
  },[completionPercentage])

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
        <View style={styles.decadeNumbers}>
          <DecadeText>{start}</DecadeText> 
          <DecadeText>{end}</DecadeText>
        </View> 
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
  decadeNumbers: {
    flexDirection: "row",
    width: "100%",  
    justifyContent: "space-between",
    alignItems: "center",    
    paddingHorizontal: 1  
  }
})

export default DecadeButton;