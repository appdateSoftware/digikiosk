export default class Validators {
  
    static validateEmail(email) {
      let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
      //TODO: Add more robust validation
      if (EMAIL_REGEXP.test(email)){
        return true;
      }
      return false;
    }
  
    static validatePassword(password) {
      //TODO: Add more robust validation
      if (password.length > 0) {
        return true;
      }
      return false;
    }

    static validatePhone(tel) {
      //TODO: Add more robust validation
      if (tel.length === 10 && !isNaN(tel)) {
        return true;
      }
      return false;
    }
  }