/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

import React, { useState, useCallback, useLayoutEffect } from "react";
import {
  FlatList,
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import Divider from "../components/Divider";
import HeaderIconButton from "../components/HeaderIconButton";
import Icon from "../components/Icon";
import {
  Caption,
  Subtitle1,
  Subtitle2
} from "../components/text/CustomText";
import TouchableItem from "../components/TouchableItem";
import ActivityIndicatorModal from "../components/modals/ActivityIndicatorModal";
import ContainedButton from "../components/buttons/ContainedButton";
import DeleteModal from "../components/modals/DeleteModal";
import {useRealm, useQuery } from '@realm/react';
import { AppSchema } from "../services/receipt-service";

import Colors from "../theme/colors";

//import mobx
import { inject, observer } from "mobx-react";

// Translations
import _useTranslate from '../hooks/_useTranslate';

// DeliverySectionA Config
const saveIcon = "checkmark-outline";
const editIcon = "create-outline";
const trashIcon = "trash-outline";


// DeliverySectionA Component
const Section = ({  
  editSection,
  deleteSection, 
  name,
  colorCaption,
  color,
  colorValue,
  vatCaption,
  vat,
  itemIndex
}) => (
  
    <View style={[styles.sectionCard, {borderColor: colorValue}]}>
      <View style={styles.leftAddresContainer}>       
        <View style={styles.sectionInfo}>         
          <Subtitle1 style={styles.sectionText}>
            {`${name}`}
          </Subtitle1>
          <Subtitle2>{colorCaption}: {`${color}`},  {vatCaption}: {`${vat}`}%</Subtitle2>
        </View>
      </View>

      <View style={styles.buttonsContainer}> 
        <TouchableItem style={styles.end} borderless  onPress={editSection}>
          <View style={styles.iconContainer}>
            <Icon name={editIcon} size={21} color={Colors.secondaryText}/>                       
          </View>
        </TouchableItem>          
        {itemIndex > 0 &&
        <TouchableItem style={styles.end} borderless  onPress={deleteSection}>
          <View style={styles.iconContainer}>
            <Icon name={trashIcon} size={21} color={Colors.secondaryColor}/>                       
          </View>
        </TouchableItem> 
        } 
      </View>
    </View>

);

// DeliverySectionA
const HistoryScreen =({navigation, feathersStore}) => {

  const realm = useRealm();
  const realm_receipts = useQuery('Receipt');

  let common = _useTranslate(feathersStore.language);

  const [indicatorModal, setIndicatorModal] = useState(false) ;
  const [deleteModal, setDeleteModal] = useState(false) ;
  const [itemToDelete, setItemToDelete] = useState(null) ;
  
  useLayoutEffect(() => {
    navigation.setOptions ({
      headerRight: () => (      
        <HeaderIconButton
          onPress={async () => {
           
            navigation.goBack();
          }}
          name={saveIcon}
          color={Colors.primaryColor}
        />
      )
  })}, [navigation]);

  const  editSection = item => () => {       
    const index = realm_receipts.indexOf(item);      
    navigation.navigate('AddSection', 
      {item: JSON.stringify(item), index, title: common.changeSection});    
  };    
  
  const addButtonPressed = () => {  
    navigation.navigate("AddSection", {title: common.addSection}) 
  }  

  const openDeleteModal = item => () => {
    setItemToDelete(item);
    setDeleteModal(true);
  }

  const  deleteSection = async() => {
    setDeleteModal(false);   
    setIndicatorModal(true);        
    realm.write(()=>{ 
      realm.delete(itemToDelete)                        
    }); 
    setIndicatorModal(false); 
  };  
    
  const keyExtractor = (item, index) => index.toString();

  const renderSectionItem = ({ item, index }) => (
    <Section
      key={item._id}
      editSection={editSection(item)}
      deleteSection={openDeleteModal(item)}     
      name={item?.name || ""}
      color={item?.color || ""}   
      colorValue={findColor(item?.color)} 
      colorCaption={common.color}   
      vatCaption={common.vat}
      vat={findVat(item?.vat)}  
      itemIndex={index}
    />
  );

  const renderSeparator = () => <Divider />;

  const findVat = (id) => {
    return AppSchema.vatsArray.find(vat => +vat.id === +id)?.label || ""
  }

  const findColor = (id) => {
    return AppSchema.colorsArray.find(color => color.id === id)?.value || ""
  }
 
  const closeIndicatorModal = () => {    
    setIndicatorModal(false); 
  }; 

  const closeDeleteModal = () => {    
    setDeleteModal(false); 
  };

  return ( 
      <SafeAreaView style={styles.screenContainer}>
        
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />      
        <View style={styles.container}>
          <FlatList
            data={realm_receipts}
            keyExtractor={keyExtractor}
            renderItem={renderSectionItem}
            ItemSeparatorComponent={renderSeparator}
            contentContainerStyle={styles.sectionList}
          />        
          <View style={styles.vSpacer}></View> 
          <View style={styles.saveButton}>                       
            <ContainedButton
              onPress={addButtonPressed}
              color={Colors.primaryColor}
              socialIconName="plus"
              iconColor={Colors.onPrimaryColor} 
              title={common.addSection}
              titleColor={Colors.onPrimaryColor} 
              titleStyle={styles.buttonTitle}            
            /> 
          </View>    
        </View> 
        <ActivityIndicatorModal
          message={common.wait}
          onRequestClose={closeIndicatorModal}
          title={common.waitStorage}
          visible={indicatorModal}
        />            
        <DeleteModal
          cancelButton={closeDeleteModal}
          deleteButton={deleteSection}
          visible={deleteModal}
        />     
      </SafeAreaView>
    );
  }


// DeliverySectionA Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background
  },
  container: {
    flex: 1,
    padding: 12
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.background,
    elevation: 1
  },
  sectionList: {
    paddingVertical: 8
  },
  sectionCard: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 20,    
    borderWidth: 2
  },
  active: {
    backgroundColor: "#f7f7f7"
  },
  leftAddresContainer: {
    flex: 8,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  sectionInfo: { flex: 1, marginRight: 4 },
  caption: {
    paddingVertical: 2,
    color: Colors.accentColor
  },
  radioIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    width: 24,
    height: 24
  },
  sectionText: { paddingVertical: 4 },
  buttonsContainer: { 
    flex:1,  
    justifyContent: "space-between",
  },
  iconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",  
  },
  end: {
    flex: 1,
    alignSelf: "flex-end"  
  },
  vSpacer: {
    height: 25
  }, 
});

export default inject('feathersStore')(observer(HistoryScreen));