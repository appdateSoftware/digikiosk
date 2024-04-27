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
import Divider from "../../components/Divider";
import HeaderIconButton from "../../components/HeaderIconButton";
import Icon from "../../components/Icon";
import {
  Caption,
  Subtitle1,
  Subtitle2
} from "../../components/text/CustomText";
import TouchableItem from "../../components/TouchableItem";
import ActivityIndicatorModal from "../../components/modals/ActivityIndicatorModal";
import ContainedButton from "../../components/buttons/ContainedButton";
import DeleteModal from "../../components/modals/DeleteModal";
import {useRealm, useQuery} from '@realm/react';

import Colors from "../../theme/colors";

//import mobx
import { inject, observer } from "mobx-react";

// Translations
import _useTranslate from '../../hooks/_useTranslate';

// DeliveryUserA Config
const saveIcon = "checkmark-outline";
const editIcon = "create-outline";
const trashIcon = "trash-outline";

const rolesArray = [{
  "id" : 1,
  "label" : "Ταμείας 1",
  "role": "cashier"
}, {
  "id" : 2,
  "label" : "Ταμείας 2",
  "role": "cashier"
}, {
  "id" : 3,
  "label" : "Ταμείας 3",
  "role": "cashier"
}, {
  "id" : 4,
  "label" : "Ταμείας 4",
  "role": "cashier"
}, {
  "id" : 5,
  "label" : "Ταμείας 5",
  "role": "cashier"
}, {
  "id" : 6,
  "label" : "Διαχειριστής",
  "role": "admin"
}];

// DeliveryUserA Component
const User = ({  
  admin,
  editUser,
  deleteUser, 
  name,
  password,
  role,
  itemIndex
}) => (
  
    <View style={[styles.userCard]}>
      <View style={styles.leftAddresContainer}>       
        <View style={styles.userInfo}>         
          <Subtitle1 style={styles.userText}>
            {`${name} ${role}`} 
          </Subtitle1>
          {admin && <Subtitle2>Password: {`${password}`}</Subtitle2>}
        </View>
      </View>
      {admin &&
        <View style={styles.buttonsContainer}> 
          <TouchableItem style={styles.end} borderless  onPress={editUser}>
            <View style={styles.iconContainer}>
              <Icon name={editIcon} size={21} color={Colors.secondaryText}/>                       
            </View>
          </TouchableItem>          
          {itemIndex > 0 &&
          <TouchableItem style={styles.end} borderless  onPress={deleteUser}>
            <View style={styles.iconContainer}>
              <Icon name={trashIcon} size={21} color={Colors.secondaryColor}/>                       
            </View>
          </TouchableItem> 
          } 
        </View>
      }
    </View>

);

// DeliveryUserA
const Users =({navigation, feathersStore}) => {

  const realm = useRealm();
  const realm_users = useQuery('User');

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

  const  editUser = item => () => {       
    const index = realm_users.indexOf(item);      
    navigation.navigate('AddUser', 
      {item: JSON.stringify(item), index, title: common.changeUser});    
  };   
  
  const addButtonPressed = () => {  
    navigation.navigate("AddUser", {title: common.addUser}) 
  }

  const openDeleteModal = item => () => {
    setItemToDelete(item);
    setDeleteModal(true);
  }

  const  deleteUser = async() => {
    setDeleteModal(false);   
    setIndicatorModal(true);        
    realm.write(()=>{ 
      realm.delete(itemToDelete)                        
    }); 
    setIndicatorModal(false); 
  };  
    
  const keyExtractor = (item, index) => index.toString();

  const renderUserItem = ({ item, index }) => (
    <User
      key={item._id}
      admin={feathersStore.user?.role === 6}
      editUser={editUser(item)}
      deleteUser={openDeleteModal(item)}     
      name={item?.name || ""}
      role={findRole(item?.role)}    
      password={item?.password || ""}     
      itemIndex={index}
    />
  );

  const renderSeparator = () => <Divider />;  

  const findRole = (id) => {
    return rolesArray.find(role => +role.id === +id)?.label || ""
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
            data={realm_users}
            keyExtractor={keyExtractor}
            renderItem={renderUserItem}
            ItemSeparatorComponent={renderSeparator}
            contentContainerStyle={styles.userList}
          />        
          <View style={styles.vSpacer}></View> 
          {feathersStore.user?.role === 6 &&
            <View style={styles.saveButton}>                       
              <ContainedButton
                onPress={addButtonPressed}
                color={Colors.primaryColor}
                socialIconName="plus"
                iconColor={Colors.onPrimaryColor} 
                title={common.addUser}
                titleColor={Colors.onPrimaryColor} 
                titleStyle={styles.buttonTitle}            
              /> 
            </View>    
          }
     
        </View> 
        <ActivityIndicatorModal
          message={common.wait}
          onRequestClose={closeIndicatorModal}
          title={common.waitStorage}
          visible={indicatorModal}
          isTablet={feathersStore.isTablet}
        />            
        <DeleteModal
          cancelButton={closeDeleteModal}
          deleteButton={deleteUser}
          visible={deleteModal}
        />     
      </SafeAreaView>
    );
  }


// DeliveryUserA Styles
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
  userList: {
    paddingVertical: 8
  },
  userCard: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 20
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
  userInfo: { flex: 1, marginRight: 4 },
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
  userText: { paddingVertical: 4 },
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

export default inject('feathersStore')(observer(Users));