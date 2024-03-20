import {commonEL} from "../locales/el/common";
import {commonEN} from "../locales/en/common";
import {commonDE} from "../locales/de/common";
import {commonES} from "../locales/es/common";
import {commonFR} from "../locales/fr/common";
import {commonIT} from "../locales/it/common";

export const pickLanguageWord = (language, word) => {
    switch (language){
        case "el" : {
            return commonEL[`${word}`];
        }
        case "en" : {
            return commonEN[`${word}`];
        }
        case "de" : {
            return commonDE[`${word}`];
        }
        case "es" : {
            return commonES[`${word}`];
        }
        case "fr" : {
            return commonFR[`${word}`];
        }
        case "it" : {
            return commonIT[`${word}`];
        }
      }
}