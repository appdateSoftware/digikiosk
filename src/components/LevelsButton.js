import React, {useEffect, useState} from 'react';
import { completionEnum } from "../../config";
import { StyleSheet, TouchableOpacity, View, ImageBackground, Text } from 'react-native';
import Colors from '../../theme/colors';
import { LabelText, LevelButtonText } from '../../components/text/CustomText';

const LevelsButton = ({ num, onClick, disabled, completionPercentage }) => { 

  const [imageSource, setImageSource] = useState(require("../../assets/img/cardLevels-90-107.png"))

  useEffect(() => {
    switch (completionPercentage){
      case completionEnum.oneThird : 
        setImageSource(require("../../assets/img/kart_level_black_red_1_3_90x110.png"));
        break;      
      case completionEnum.twoThirds :   
        setImageSource(require("../../assets/img/kart_level_black_red_2_3_90x107.png"));
        break;     
      default:  setImageSource(require("../../assets/img/cardLevels-90-107.png"))
    }
    
  },[completionPercentage])

  return (
    <TouchableOpacity     
      style={ [styles.container, completionPercentage === completionEnum.threeThirds ?  styles.full : styles.empty] } 
      onPress={onClick}
      disabled={disabled}
    >
{imageSource &&
       <ImageBackground 
        source={imageSource}
        resizeMode="cover" 
        style={styles.image}
      >      
        <View style={[styles.yellowTopLabel]}>
          <LabelText>Level</LabelText>
        </View>  
        <View style={[styles.levelsNumber]}> 
          <LevelButtonText>{num}</LevelButtonText>
        </View> 
      </ImageBackground> 
}         
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {    
    justifyContent: 'space-between',
    width: "100%",
    height: "100%",
    backgroundColor: Colors.black    
  },
  empty: {
    backgroundColor: Colors.black
  },
  full: {
    backgroundColor: Colors.red
  },
  image: {
    flex: 1,
    justifyContent: "center"
  }, 
  yellowTopLabel: {
    flexDirection: "row",
    width: "100%",
    height: "20%",
    justifyContent: "center",
    alignItems: 'center',
    backgroundColor: Colors.logoYellow,
    borderBottomWidth: 1,
    borderBottomColor: Colors.black   
  },  
  levelsNumber: {   
    width: "100%",
    height: "80%",
    justifyContent: "center",
    alignItems: 'center'
  }
})

export default LevelsButton;