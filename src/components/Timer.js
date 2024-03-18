import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,   
    Image,   
  } from "react-native";
import { inject, observer } from "mobx-react";
import { DateTime } from 'luxon';
import Colors from "../../theme/colors";

const Timer = ({hoursMinSecs, feathersStore, auction_start,
  toggleTenToStart, toggleAuctionStart}) => {

  const auctionStartRef = useRef(false);
  const tenToStartRef = useRef(false);

  let timerId;  
  const { hours = 0, minutes = 0, seconds = 0 } = hoursMinSecs;
  let clonedHours = hours;
  let clonedMinutes = minutes;
  let clonedSeconds = Math.round(seconds);  
  const [[hrs, mins, secs], setTime] = useState([hours, minutes, Math.round(seconds)]);

  const startDateTime = DateTime
    .fromISO(feathersStore.orderItem.auction?.scheduledDate + "T" + feathersStore.orderItem.auction?.startTime); 
  const endDateTime = DateTime
    .fromISO(feathersStore.orderItem.auction?.scheduledDate + "T" + feathersStore.orderItem.auction?.endTime); 
  const tenToStartDateTime = startDateTime.minus({minutes: 10});

   
  const tick = () => {

    if (clonedHours === 0 && clonedMinutes === 0 && clonedSeconds === 0) 
        reset()
    else if (clonedMinutes === 0 && clonedSeconds === 0) {
        clonedMinutes = 59;
        clonedSeconds = 59;
        --clonedHours;
        setTime([clonedHours, 59, 59]);
    } else if (clonedSeconds === 0) {
        clonedSeconds = 59;
        --clonedMinutes;
        setTime([clonedHours, clonedMinutes, 59]);
    } else {
        --clonedSeconds;           
        setTime([clonedHours, clonedMinutes,  clonedSeconds]);
    }
    if(!auction_start){
      const tickDateTime = startDateTime.minus({hours: clonedHours, minutes: clonedMinutes, seconds: clonedSeconds})
        if(!tenToStartRef.current && tickDateTime >= tenToStartDateTime && tickDateTime < startDateTime){     
        toggleTenToStart(true);
        tenToStartRef.current = true;     
      }  
      else if (tickDateTime >= endDateTime){      
        setTime([0, 0, 0])
        clearInterval(timerId)
      }
  }
  };

  useEffect(() => {   
    auctionStartRef.current = false;
    tenToStartRef.current = false;
    timerId && clearInterval(timerId)
    timerId = setInterval(() => tick(), 1000);
    return () => clearInterval(timerId);
  }, [ hoursMinSecs]);  

  const reset = () => setTime([parseInt(hours), parseInt(minutes), parseInt(seconds)]);

  return (
    <View style={styles.timerContainer}>
      <Image 
        source={require("../../assets/img/chronometer.png")} 
        style={styles.image}
      />
      <View style={[styles.chronoDisplay, 
        !tenToStartRef.current && !auction_start && styles.beforeStart,
        tenToStartRef.current && styles.tenToStart,
        auction_start && styles.auctionStart]}
      >
        <Text style={styles.chronoText}>
        {`${hrs.toString().padStart(2, '0')}:${mins
          .toString()
          .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  timerContainer: {
    width: 120,
    height: 30,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  image: {
    width: "20%",
    height: 30,
    marginRight: 4
  },
  chronoDisplay:{
    width: "80%",
    height: "100%",  
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.logoYellow,
    borderRadius: 30   
  },
  beforeStart: {
    backgroundColor: Colors.logoYellowLight
  },
  tenToStart: {
    backgroundColor: Colors.buttonPink   
  },
  auctionStart: {
    backgroundColor: Colors.secondary
  },
  chronoText: {
    fontSize: 18,
    color: Colors.primaryText
  }
})

export default inject('feathersStore')(observer(Timer));