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
  companyData = {};
  language = "el";
  invoiceType ="alp";
  masterLanguage = "el";
  loggedInUser = {};
  demoMode = true;
  demoModeToggled = false;
  isTablet = true;
  bleId = "";
  bleDisconnected = true;
  nativePos = false;
 
  currentVersion = "1.0.9";

  constructor(){
    makeObservable(this,  {     
      isAuthenticated: observable,
      user: observable, 
      newVersion: observable, 
      companyData: observable,
      language: observable,    
      invoiceType: observable,      
      loggedInUser: observable,
      currentVersion: observable,
      demoMode: observable,
      demoModeToggled: observable,
      isTablet: observable,
      nativePos: observable,
      bleId: observable,
      bleDisconnected: observable,
      setIsAuthenticated: action,
      setUser: action,
      setObservables: action,
      setCompanyData: action,
      setLoggedInUser: action,
      setLanguage: action, 
      setInvoiceType: action, 
      setNewVersion: action,
      setDemoMode: action,
      setDemoModeToggled: action,
      setIsTablet: action,
      setNativePos: action,
      setBleId: action,
      setBleDisconnected: action
    })
  } 
  
  setCompanyData = data => {   
    this.companyData = data;
  }

  setLoggedInUser = data => {   
    this.loggedInUser = data;
  }
  
  setIsAuthenticated = value => {
    this.isAuthenticated = value;
  }

  setUser = value => {
    this.user = value;
  }  

  setLanguage = value => {
    this.language = value;
  }

  setDemoMode = value => {
    this.demoMode = value;
  }

  setDemoModeToggled = value => {
    this.demoModeToggled = value;
  }

  setIsTablet = value => {
    this.isTablet = value;
  }  

  setInvoiceType = value => {
    this.invoiceType = value;
  }

  setNewVersion = val => {      
    this.newVersion = val;
  }

  setNativePos = value => {
    this.nativePos = value;
  }

  setBleId = value => {
    this.bleId = value;
  }

  setBleDisconnected = value => {
    this.bleDisconnected = value;
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
        this.setLoggedInUser(user);
        user && (this.setIsAuthenticated(true));    
      }catch(error){       
        console.log(error)
      }
  } 
 
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
  }

  
    getAccessToken = async() => {
      return await this.app.get('authentication');
    }   

    postToMyData = async(payload) => {      
      return await this.app
        .service('mydata')
        .create(payload); 
    }  
    
    postToMyDataPayment = async(payload, params, terminal = 'VIVA') => { 
      Object.assign(params, {userId: this.loggedInUser._id})     
      return await this.app
        .service(terminal === 'MYPOS' ? 'mellon' : 'pos')
        .create(payload, {query: params}); 
    }

    async getPaymentStatus(sessionId, terminal = 'VIVA', mellonApiKey = null){ 
      let params = {userId: this.loggedInUser._id};
      if(mellonApiKey)Object.assign(params, {mellonApiKey})        
      return await this.app
        .service(terminal === 'MYPOS' ? 'mellon' : 'pos')
        .get(sessionId, {query: params}); 
    }
  
    async deletePaymentSession(sessionId, params){    
      Object.assign(params, {userId: this.loggedInUser._id})  
      return await this.app
        .service('pos')
        .remove(sessionId, {query: params}); 
    }

    patchUser = async(payload) => {      
      return await this.app
        .service('users')
        .patch(this.loggedInUser._id, payload);
    }

    getUser = async() => {      
      return await this.app
        .service('users')
        .get(this.loggedInUser._id);
    }

    createSoap = async(afm) => {
      return await this.app      
      .service('soap')    
      .create({afm});
    }

    createLogEntry = async (payload) => {      
      return await this.app
        .service('errorlogs')
        .create(payload); 
    }

    translate = (lang, textEL, textEN) => {
      return (this.language === lang) && textEL ?  textEL : (textEN ? textEN : textEL)
    }

    _translate = (textEL, textTR) => {
      if(this.language === this.masterLanguage)return textEL;
      else return textTR ? textTR : textEL;
    }
  
    _translateName = (item) => {
      if(this.language === this.masterLanguage)return item?.name || "";
      else return item?.nameTranslations?.find(tr => tr?.code === this.language)?.text || item?.name;
    }
  
    _translateTitle = (item) => {
      if(this.language === this.masterLanguage)return item?.title || "";
      else return item?.titleTranslations?.find(tr => tr?.code === this.language)?.text || item?.title;
    }  
  

}

export default new FeathersStore()