import { useState, useEffect } from 'react';
import {commonEL} from "../locales/el/common";
import {commonEN} from "../locales/en/common";
import {commonDE} from "../locales/de/common";
import {commonES} from "../locales/es/common";
import {commonFR} from "../locales/fr/common";
import {commonIT} from "../locales/it/common";

const _useTranslate = (language)=> {
   
  const [source, setSource] = useState({})

  useEffect(()=> { 
    switch (language){
      case "el" : {
        setSource(commonEL);
        break;
      }
      case "en" : {
        setSource(commonEN);
        break;
      }
      case "de" : {
        setSource(commonDE);
        break;
      }
      case "es" : {
        setSource(commonES);
        break;
      }
      case "fr" : {
        setSource(commonFR);
        break;
      }
      case "it" : {
        setSource(commonIT);
        break;
      }
    }
  },[language]);

  return source

}

export default _useTranslate;