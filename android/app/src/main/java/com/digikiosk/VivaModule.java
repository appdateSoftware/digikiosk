package com.digikiosk;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableNativeMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.content.ComponentName;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.content.Context;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.io.BufferedReader;
import java.lang.StringBuilder;
import java.io.IOException;

import java.util.Map;
import java.util.HashMap;
import java.util.UUID;

public class VivaModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
  private static final int VOID_REQUEST_CODE = 4;
  private Promise vivaPromise;  
  Context context;

  private final void returnPromise(String content){
   
  //  if ((requestCode == 1) || (requestCode == VOID_REQUEST_CODE) || (requestCode == 2)) {      
    WritableMap returnMap = new WritableNativeMap();
    
    Uri data = Uri.parse(content);
    // Something went wrong in the Payment core app and the result couldn't be returned properly
    if ( data == null) {
      vivaPromise.reject("Transaction cancelled");
      return;
    }

    if (data.getQueryParameter("status") == "success") {                   
      returnMap.putString("myResponse", "Payment transaction has completed. Result: " + data.getQueryParameter("status"));

      returnMap.putString("status", data.getQueryParameter("status"));
      returnMap.putString("message", data.getQueryParameter("message"));
      returnMap.putString("action", data.getQueryParameter("action"));

      returnMap.putString("clientTransactionId", data.getQueryParameter("clientTransactionId"));
      returnMap.putString("amount", data.getQueryParameter("amount"));
      returnMap.putString("tipAmount", data.getQueryParameter("tipAmount"));
      returnMap.putString("verificationMethod", data.getQueryParameter("verificationMethod"));
      returnMap.putString("rrn", data.getQueryParameter("rrn"));
      returnMap.putString("cardType", data.getQueryParameter("cardType"));        
      returnMap.putString("accountNumber", data.getQueryParameter("accountNumber"));
      returnMap.putString("referenceNumber", data.getQueryParameter("referenceNumber"));
      returnMap.putString("authorisationCode", data.getQueryParameter("authorisationCode"));
      returnMap.putString("tid", data.getQueryParameter("tid"));

      returnMap.putString("aadeTransactionId", data.getQueryParameter("aadeTransactionId"));

      returnMap.putString("orderCode", data.getQueryParameter("orderCode"));
      returnMap.putString("shortOrderCode", data.getQueryParameter("shortOrderCode"));        
      returnMap.putString("installments", data.getQueryParameter("installments"));
      returnMap.putString("transactionDate", data.getQueryParameter("transactionDate"));
      returnMap.putString("transactionId", data.getQueryParameter("transactionId"));
      returnMap.putString("paymentMethod", data.getQueryParameter("paymentMethod"));
      returnMap.putString("ISV_amount", data.getQueryParameter("ISV_amount"));
      returnMap.putString("ISV_clientId", data.getQueryParameter("ISV_clientId"));
      returnMap.putString("ISV_clientSecret", data.getQueryParameter("ISV_clientSecret"));
      returnMap.putString("sourceCode", data.getQueryParameter("sourceCode"));        
      returnMap.putString("ISV_sourceCode", data.getQueryParameter("ISV_sourceCode"));

      returnMap.putString("aid", data.getQueryParameter("aid"));
      returnMap.putString("vatNumber", data.getQueryParameter("vatNumber"));
      returnMap.putString("address", data.getQueryParameter("address"));
      returnMap.putString("businessDescription", data.getQueryParameter("businessDescription"));
      returnMap.putBoolean("printLogoOnMerchantReceipt", data.getBooleanQueryParameter("printLogoOnMerchantReceipt", false));
      returnMap.putString("merchantReceiptPAN", data.getQueryParameter("merchantReceiptPAN"));
      returnMap.putString("cardholderReceiptPAN", data.getQueryParameter("cardholderReceiptPAN"));

      returnMap.putString("transactionReceiptAcquirerZone", data.getQueryParameter("transactionReceiptAcquirerZone"));
      returnMap.putString("cardholderReceiptText", data.getQueryParameter("cardholderReceiptText"));
      returnMap.putString("merchantReceiptText", data.getQueryParameter("merchantReceiptText"));
      returnMap.putString("cardholderName", data.getQueryParameter("cardholderName"));
      returnMap.putString("cardExpirationDate", data.getQueryParameter("cardExpirationDate"));
      returnMap.putString("cardholderNameExpirationDateFlags", data.getQueryParameter("cardholderNameExpirationDateFlags"));
      returnMap.putString("needsSignature", data.getQueryParameter("needsSignature"));
      returnMap.putString("addQRCode", data.getQueryParameter("addQRCode"));
      returnMap.putString("terminalSerialNumber", data.getQueryParameter("terminalSerialNumber"));
      returnMap.putString("currency", data.getQueryParameter("currency"));
      returnMap.putString("errorText", data.getQueryParameter("errorText"));
      returnMap.putString("applicationVersion", data.getQueryParameter("applicationVersion"));
      returnMap.putString("oldBalance", data.getQueryParameter("oldBalance"));
      returnMap.putString("newBalance", data.getQueryParameter("newBalance"));
      returnMap.putString("entryMode", data.getQueryParameter("entryMode"));

      returnMap.putString("loyaltyMerchant", data.getQueryParameter("loyaltyMerchant"));
      returnMap.putString("loyaltyTerminal", data.getQueryParameter("loyaltyTerminal"));
      returnMap.putString("loyaltyPacketNo", data.getQueryParameter("loyaltyPacketNo"));
      returnMap.putString("loyaltyTransactionNo", data.getQueryParameter("loyaltyTransactionNo"));
      returnMap.putString("loyaltyPaymentAmount", data.getQueryParameter("loyaltyPaymentAmount"));
      returnMap.putString("loyaltyRedemptionAmount", data.getQueryParameter("loyaltyRedemptionAmount"));
      returnMap.putString("loyaltyFinalAmount", data.getQueryParameter("loyaltyFinalAmount"));
      returnMap.putString("loyaltyPointsCollected", data.getQueryParameter("loyaltyPointsCollected"));
      returnMap.putString("loyaltyPointsRedeemed", data.getQueryParameter("loyaltyPointsRedeemed"));
      returnMap.putString("loyaltyPointsPrevBalance", data.getQueryParameter("loyaltyPointsPrevBalance"));
      returnMap.putString("loyaltyPointsNewBalance", data.getQueryParameter("loyaltyPointsNewBalance"));
      returnMap.putString("loyaltyExtraMessage", data.getQueryParameter("loyaltyExtraMessage"));
      returnMap.putString("loyaltyProgramId", data.getQueryParameter("loyaltyProgramId"));
      returnMap.putString("loyaltyLogoUrl", data.getQueryParameter("loyaltyLogoUrl"));
     
      vivaPromise.resolve(returnMap);
    }else if(data.getQueryParameter("status") == "fail"){
      returnMap.putString("myResponse", "Payment transaction failed. Result: " + data.getQueryParameter("message"));
      vivaPromise.resolve(returnMap);   
    }else{
      returnMap.putString("myResponse", "Payment transaction general failure. Result: " + data.getQueryParameter("message"));
      vivaPromise.resolve(returnMap);
    }
  };  

  VivaModule(ReactApplicationContext reactContext) {
      super(reactContext);
      this.context = reactContext.getApplicationContext();
      reactContext.addLifecycleEventListener(this);
  }
  public String getName() {
      return "VivaModule";
  }

  @Override
    public void onHostResume() {
      
      if(vivaPromise != null){      
      StringBuilder stringBuilder = new StringBuilder(); 
      try {
        FileInputStream fis = this.context.openFileInput("vivauridigi");
        InputStreamReader inputStreamReader =
          new InputStreamReader(fis, StandardCharsets.UTF_8);
        
        BufferedReader reader = new BufferedReader(inputStreamReader);
          String line = reader.readLine();
          while (line != null) {
              stringBuilder.append(line).append('\n');
              line = reader.readLine();
          }
        } catch (IOException e) {
            vivaPromise.resolve(e.toString());
        } finally {
            String contents = stringBuilder.toString();
            vivaPromise.resolve(contents);
          //  this.returnPromise(contents);
        }        
      };
    }
    
    @Override
    public void onHostPause() {
    }

    @Override
    public void onHostDestroy() {
    }
  
  @ReactMethod
  public void makeVivaNativePayment(String amount, String clientTransactionId,  
  String tip, String signatureData, String signature, String isv,
  String isvAmount, String clientId, String clientSecret, String merchantSourceCode, final  Promise promise) {

    Activity currentActivity = getCurrentActivity();

    //---> Multi POS          

  //  String[] aliases = new String[] {"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n"};
    PackageManager pm = currentActivity.getPackageManager();

    /*
    for ( String str: aliases){
      if(!str.equals(suffix)){
        ComponentName compName = new ComponentName(this.context, "com.bringfood_db_android.ReportActivity" + str);
        pm.setComponentEnabledSetting(
          compName,
          PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
          PackageManager.DONT_KILL_APP);
      }
         
    }
     */
   //All aliases are by default disabled

    ComponentName compName = new ComponentName(this.context, "com.bringfood_db_android.ReportActivity" + suffix);
    pm.setComponentEnabledSetting(
      compName,
      PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
      PackageManager.DONT_KILL_APP);

 //<------

    if (currentActivity == null) {
        promise.reject("E_ACTIVITY_DOES_NOT_EXIST", "Activity doesn't exist");
        return;
    }

    vivaPromise = promise;
    
    String config = "";
    String noIsvConfig =   "vivapayclient://pay/v1"
        + "?appId=com.bringfood_db_android"
        + "&action=sale"
        + "&clientTransactionId=" + clientTransactionId
        + "&amount=" + amount
        + "&tipAmount=" + tip
        + "&show_receipt=true"
        + "&show_transaction_result=true"
        + "&show_rating=true"
        + "&paymentMethod=CardPresent"
        + "&callback=digicallbackscheme://result"
        + "&saleToAcquirerData=eyJhcHBsaWNhdGlvbkluZm8iOnsiZXh0ZXJuYWxQbGF0Zm9ybSI6eyJuYW1lIjoidGhlIG5hbWUgb2YgdGhlIEVycCB2ZW5kb3IncyBzb2Z0d2FyZSIsInZlcnNpb24iOiJ0aGUgdmVyc2lvbiBvZiB0aGUgc29mdHdhcmUiLCJpbnRlZ3JhdG9yIjoidGhlIEVycCB2ZW5kb3IncyBuYW1lIn19fQ=="
        + "&aadeProviderId=111"
        + "&aadeProviderSignatureData=" + signatureData
        + "&aadeProviderSignature=" + signature
        + "&protocol=int_default";

    if(new String(isv).equals(new String("ISV_ENABLED"))){
      String isvConfig =  
       "&ISV_amount=" + isvAmount
      + "&ISV_clientId=" + clientId
      + "&ISV_clientSecret=" + clientSecret
      + "&ISV_sourceCode=Default"
      + "&ISV_currencyCode=978"
    //  + "&ISV_customerTrns=ItemDescription"
    //  + "&ISV_clientTransactionId=12345678901234567890123456789012"
    //  + "&ISV_merchantId=1234567890"
      + "&ISV_merchantSourceCode=" + merchantSourceCode;
      config = noIsvConfig + isvConfig;
    }else{
      config = noIsvConfig;
    }
     
    Intent payIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(
      config
    ));

    payIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

    payIntent.addFlags(Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS);
    currentActivity.startActivity(payIntent); 
  }
}
