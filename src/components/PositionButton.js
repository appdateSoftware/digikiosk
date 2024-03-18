import React from 'react';
import { StyleSheet, TouchableOpacity, View, ImageBackground, Text } from 'react-native';
import Colors from '../../theme/colors';
import { inject, observer } from "mobx-react";
import Validators from '../../utils/validators';
import { LabelText, LevelText } from '../../components/text/CustomText';

const PositionButton = ({item, onClick, selected, feathersStore}) => {  

  return (
    <TouchableOpacity     
      style={ [styles.container, 
        item?.occupied === "random" && (item?.customerId === feathersStore.user._id ? styles.myRandom : styles.random),
        item?.occupied === "hundred" && (item?.customerId === feathersStore.user._id ? styles.myHundred : styles.hundred), 
        item?.captured && item?.occupied === "hundred" && (item?.customerId === feathersStore.user._id ? styles.myHundred : styles.notMyHundred),
        item?.first && !selected && styles.first,
        selected?.id === item?.id && styles.selected
      ] } 
      onPress={onClick}      
    >
       <ImageBackground 
        source={require("../../assets/img/cardPosition-90-95.png")}
        resizeMode="cover" 
        style={styles.image}
      > 
        <View style={styles.yellowLabelContainer}>
          <View style={[styles.positionLabel]}>
            <LabelText>{item?.id}</LabelText>
          </View>
          <View style={styles.euroLabel}>
            <LabelText>{Validators.convertPrice(item?.levelPrice)}
              <LabelText>€</LabelText>
            </LabelText>
          </View>
        </View>       
        <View style={[styles.levelsLabel]}> 
          <LevelText>{item?.levelId}</LevelText>
        </View> 
      </ImageBackground>      
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {     
    alignItems: 'center',
    justifyContent: 'space-between',
    width: "100%",
    height: "100%"  ,
    backgroundColor: Colors.backgroundDarker  
  },
  random: {
    backgroundColor: Colors.buttonBlue
  },  
  myRandom: {
    backgroundColor: Colors.buttonPurpleLight
  },  
  hundred: {
    backgroundColor: Colors.buttonPink
  },  
  myHundred: {
    backgroundColor: Colors.buttonPurple
  },  
  notMyHundred: {
    backgroundColor: Colors.buttonRed
  },  
  first: {
    backgroundColor: Colors.buttonGreen 
   // animation: blinker 3s linear infinite;
  },  
  selected: {
    backgroundColor: Colors.buttonGreen 
  },  
  image: {
    flex: 1,
    justifyContent: "center"
  },
  yellowLabelContainer: {
    flexDirection: "row",
    width: "100%",
    height: "20%",   
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: Colors.logoYellowLight
  }, 
  positionLabel: { 
    flexDirection: "row",
    width: "20%",   
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",    
    paddingLeft: 1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.black   
  },  
  euroLabel:{
    flexDirection: "row",
    width: "80%",   
    justifyContent: "flex-start",  
    alignItems: "center",
    marginTop: 0,
    backgroundColor: Colors.logoYellow,
    borderBottomWidth: 1,
    borderBottomColor: Colors.black,
    borderLeftWidth: 1,
    borderLeftColor: Colors.black,    
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10  
  },
  levelsLabel: {
    flex: 1,    
    justifyContent: "flex-end",
    alignItems: 'center'
  }
})

export default inject('feathersStore')(observer(PositionButton));