import { useState, useEffect } from 'react';
import {commonEL} from "../locales/el/common";
import {commonEN} from "../locales/en/common"; 


const useTranslate = (language)=> {
   
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
    }
  },[language]);

  return source

}

export default useTranslate;