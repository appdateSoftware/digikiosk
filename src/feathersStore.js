import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeObservable, observable, action} from 'mobx';
import { feathers } from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client'; 
import authentication from '@feathersjs/authentication-client';
import cloneDeep from 'lodash/cloneDeep';
import { toString } from 'diacritic-regex';

const diacriticsMappings ={
  'α': 'αάΑΆ',
  'ε': 'εέΈΕ',
  'η': 'ηήΗΉ', 
  'ι': 'ιίΙΊϊιϊΪ',
  'ο': 'οόΟΌ',
  'υ': 'υύΥΎϋΫ',
  'ω': 'ωώΩΏ'  
}

const API_URL = "https://digikiosk.hellochat.gr"

class FeathersStore{  
   
  isAuthenticated= false;
  newVersion = false;
  user = null;
  categories = null;
  settings = {};
  cartLength = 0; 
  orderItem = {};
  language = "el";
  invoiceType ="alp"
 
  currentVersion = "1.0.1";

  constructor(){
    makeObservable(this,  {     
      isAuthenticated: observable,
      user: observable,
      categories: observable,
      settings: observable,
      cartLength: observable,
      orderItem: observable,
      language: observable,    
      invoiceType: observable,      
      newVersion: observable, 
      currentVersion: observable,
      setIsAuthenticated: action,
      setUser: action,
      setCategories: action,
      setSettings: action,
      setObservables: action,
      setCartLength: action,
      setOrderItem: action,
      setLanguage: action,   
      setInvoiceType: action, 
      setNewVersion: action
    })
  } 
  
  setOrderItem = data => {
    const clonedOrderItem = cloneDeep(this.orderItem);
    const mergedObject = {...clonedOrderItem, ...data};
    this.orderItem = mergedObject;
  }
 
  setIsAuthenticated = value => {
    this.isAuthenticated = value;
  }

  setUser = value => {
    this.user = value;
  }
  
  setCategories = value => {
    this.categories = value;
  }

  setSettings = value => {
    this.settings = value;
  }

  setCartLength = value => {
    this.cartLength = value;
  } 

  setLanguage = value => {
    this.language = value;
  }

  setInvoiceType = value => {
    this.invoiceType = value;
  }

  setNewVersion = val => {      
    this.newVersion = val;
  }


  connect = async () => {
    try{

    //ESTABLISH FEATHERS CONNECTION

    const options = {transports: ['websocket'],forceNew: true, pingTimeout: 3000, pingInterval: 5000};
    this.app = feathers();

    this.socket = io(API_URL,  /* options */);    

    this.app
        .configure(socketio(this.socket)) 
        // .configure(feathers.socketio(this.socket))
        .configure( authentication({            
            storage: AsyncStorage // To store our accessToken
        }));
  
    this.isConnecting = true;
    await this.setObservables();

    
    this.app.io.on('connect', async () => {
      this.isConnecting = false;
      try{
        await this.setObservables();
        console.log('authenticated after reconnection');
      }catch(error) {
        console.log('error authenticating after reconnection', error);
      };
    });

    this.app.io.on('disconnect', (reason) => {
      console.log('disconnected', reason);
      this.isConnecting = true;
    });

    }catch(error){
      console.log("error: ", error)
      throw(error)
    }
  }
    
  setObservables = async() => {
      try{       
        const auth = await this.app.reAuthenticate(); 
        const { user } = await this.app.get('authentication');
        this.setUser(user)          
        this.user && (this.setIsAuthenticated(true));    
   //    this.setCategories(tree.youTree);    
  //      await this.fetchSettings();               
      }catch(error){       
              console.log("VOOO")

      }
  }

  
 // fetchSettings = async() => {
 //   const settingsArray = await this.app.service('settings').find(); 
 //   this.setSettings(settingsArray[0]); 
 // }
 
  login = async (email, password) => {        
      return this.app.authenticate({
          strategy: 'local',
          email,
          password
        });
  };

        
  promptForLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel', onPress: () => {
        }, style: 'cancel'
        },
        {text: 'Yes', onPress: this.logout, style: 'destructive'},
      ]
    );
  }

  logout = async () => {
    await this.app.logout();      
    this.setUser(null);
    this.setIsAuthenticated(false);
    this.setCategories(null);
    this.setSettings({});
  }

  
    getAccessToken = async() => {
      return await this.app.get('authentication');
    }   

 
    createLocalPrint = async(payload) => {      
      return await this.app
        .service('localprint')
        .create(payload); 
    }

    postToMyData = async(payload) => {      
      return await this.app
        .service('mydata')
        .create(payload); 
    }

    createReceipt = async(payload) => {      
      return await this.app
        .service('receipts')
        .create(payload); 
    }

    patchReceipt = async(id, payload) => {      
      return await this.app
        .service('receipts')
        .patch(id, payload);
    }

    removeReceipt = async(id) => {      
      return await this.app
        .service('receipts')
        .remove(id); 
    }

    patchCounters = async(id, payload) => {      
      return await this.app
        .service('counters')
        .patch(id, payload);
    }


  createLogEntry = async (payload) => {      
    return await this.app
      .service('errorLogs')
      .create(payload); 
  }

    translate = (lang, textEL, textEN) => {
      return (this.language === lang) && textEL ?  textEL : (textEN ? textEN : textEL)
    }

    _translate = (textEL, textTR) => {
      if(this.language === this.settings.masterLanguage)return textEL;
      else return textTR ? textTR : textEL;
    }
  
    _translateName = (item) => {
      if(this.language === this.settings.masterLanguage)return item?.name || "";
      else return item?.nameTranslations?.find(tr => tr?.code === this.language)?.text || item?.name;
    }
  
    _translateTitle = (item) => {
      if(this.language === this.settings.masterLanguage)return item?.title || "";
      else return item?.titleTranslations?.find(tr => tr?.code === this.language)?.text || item?.title;
    }
  
    _translateNameAttr = (item) => {
      if(this.language === this.settings.masterLanguage)return item?.name || "";
      else return item?.translations?.find(tr => tr?.code === this.language)?.text || item?.name;
    }
  
    _translateAddress = () => {
      if(this.language === this.settings.masterLanguage)return this.settings?.address || "";
      else return this.settings?.addressTranslations?.find(tr => tr?.code === this.language)?.text || this.settings?.address;
    }
  
    _translateClosedShopText = () => {
      if(this.language === this.settings.masterLanguage)return this.settings?.closedShopText || "";
      else return this.settings?.closedShopTextTranslations?.find(tr => tr?.code === this.language)?.text || this.settings?.closedShopText;
    }
  
    _translateShortDescription = () => {
      if(this.language === this.settings.masterLanguage)return this.settings?.shortDescription || "";
      else return this.settings?.shortDescriptionTranslations?.find(tr => tr?.code === this.language)?.text || this.settings?.shortDescription;
    }
  
    _translateProductShortDescription = (item) => {
      if(this.language === this.settings.masterLanguage)return item?.shortDescription || "";
      else return item?.shortDescriptionTranslations?.find(tr => tr?.code === this.language)?.text || item?.shortDescription;
    }
  
    _translateCategoryName = (element) => {
      if(this.language === this.settings.masterLanguage)return element?.name || "";
      else return element.options.categoryNameTranslations?.find(tr => tr?.code === this.language)?.text || element.name;
    }


}

export default new FeathersStore()