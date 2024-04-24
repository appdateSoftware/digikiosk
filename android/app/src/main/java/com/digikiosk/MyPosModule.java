package com.digikiosk;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.mypos.glasssdk.Currency;
import com.mypos.glasssdk.MyPOSAPI;
import com.mypos.glasssdk.MyPOSPayment;
import com.mypos.glasssdk.MyPOSRefund;
import com.mypos.glasssdk.MyPOSUtil;
import com.mypos.glasssdk.MyPOSVoid;
import com.mypos.glasssdk.ReferenceType;
import com.mypos.glasssdk.TransactionProcessingResult;
import android.app.Activity;
import android.content.Intent;

import java.util.Map;
import java.util.HashMap;
import java.util.UUID;

public class MyPosModule extends ReactContextBaseJavaModule {
    private static final int VOID_REQUEST_CODE = 4;
    private Promise mPosPromise;
    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
        @Override
        public  void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            // The same request code as when calling MyPOSAPI.openPaymentActivity
            if ((requestCode == 1) || (requestCode == VOID_REQUEST_CODE) || (requestCode == 2)) {
                System.out.println(data);
                // The transaction was processed, handle the response
                if (resultCode == Activity.RESULT_OK) {
                    // Something went wrong in the Payment core app and the result couldn't be returned properly
                    if ( data == null) {
                        mPosPromise.reject("Transaction cancelled");
                        return;
                    }
                    int transactionResult = data.getIntExtra("status", TransactionProcessingResult.TRANSACTION_FAILED);
                    // TODO: handle each transaction response accordingly
                    if (transactionResult == TransactionProcessingResult.TRANSACTION_SUCCESS) {
                        // Transaction is successful
                        mPosPromise.resolve("Payment transaction has completed. Result: " + transactionResult);
                    }else if(transactionResult == TransactionProcessingResult.TRANSACTION_FAILED){
                        mPosPromise.resolve("Payment transaction failed. Result: " + transactionResult);
                    }else if(transactionResult == TransactionProcessingResult.TRANSACTION_CANCELED){
                        mPosPromise.resolve("Payment transaction canceled. Result: " + transactionResult);
                    }else if(transactionResult == TransactionProcessingResult.TRANSACTION_DECLINED){
                        mPosPromise.resolve("Payment transaction declined. Result: " + transactionResult);
                    }else if(transactionResult == TransactionProcessingResult.INVALID_AMOUNT){
                        mPosPromise.resolve("Payment transaction has Invalid Amount. Result: " + transactionResult);
                    }else if(transactionResult == TransactionProcessingResult.DEVICE_NOT_ACTIVATED){
                        mPosPromise.resolve("The device is not activated. Result: " + transactionResult);
                    }else if(transactionResult == TransactionProcessingResult.INVALID_CURRENCY){
                        mPosPromise.resolve("Payment transaction failed due to Invalid Currency. Result: " + transactionResult);
                    }else if(transactionResult == TransactionProcessingResult.NO_DATA_FOUND){
                        mPosPromise.resolve("Payment transaction cancelled. No data found. Result: " + transactionResult);
                    }else if(transactionResult == TransactionProcessingResult.COMMUNICATION_ERROR){
                        mPosPromise.resolve("Payment transaction cancelled. Communication error. Result: " + transactionResult);
                    }else if(transactionResult == TransactionProcessingResult.INVALID_E_RECEIPT_CREDENTIAL){
                        mPosPromise.resolve("Failed. Invalid e Receipt credential. Result: " + transactionResult);
                    }
                } else {
                    // The user canceled the transaction
                    mPosPromise.resolve("Transaction canceled");
                }
            }

        }
    };
    MyPosModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(mActivityEventListener);
    }
    public String getName() {
        return "MyPosModule";
    }

   
    @ReactMethod
     public void makeMyPosPayment(Double amount, boolean tippingEnabled,  Double tip, String operator, String order, final  Promise promise) {
        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            promise.reject("E_ACTIVITY_DOES_NOT_EXIST", "Activity doesn't exist");
            return;
        }

        mPosPromise = promise;

        // Build the payment call
        MyPOSPayment payment = MyPOSPayment.builder()
                // Mandatory parameters
                .productAmount(amount)
                .currency(Currency.EUR)
                // Foreign transaction ID. Maximum length: 128 characters
                .foreignTransactionId(UUID.randomUUID().toString())
                // Optional parameters
                // Enable tipping mode
                .tippingModeEnabled(tippingEnabled)
                .tipAmount(tip)
                // Operator code. Maximum length: 4 characters
                .operatorCode(operator)
                // Reference number. Maximum length: 50 alpha numeric characters
                .reference(order, ReferenceType.REFERENCE_NUMBER)
                // Set print receipt mode
                .printMerchantReceipt(MyPOSUtil.RECEIPT_ON)
                .printCustomerReceipt(MyPOSUtil.RECEIPT_ON)
                .build();

        // If you want to initiate a moto transaction:
        //payment.setMotoTransaction(true)

        // Or you want to initiate a giftcard transaction:
        //      payment.setGiftCardTransaction(true)
        // Start the transaction
            MyPOSAPI.openPaymentActivity(currentActivity, payment, 1, true);
    }

    @ReactMethod
    public void makeMyPosVoidPayment(final  Promise promise){

        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            promise.reject("E_ACTIVITY_DOES_NOT_EXIST", "Activity doesn't exist");
            return;
        }

        mPosPromise = promise;

        MyPOSVoid voidEx = MyPOSVoid.builder()
                .STAN(27)
                .authCode("VIS-SIM")
                .dateTime("180129123753")
                //.voidLastTransactionFlag(true) // this may void last transaction initialized by this terminal
                .build();

        // Start the void transaction
        MyPOSAPI.openVoidActivity(currentActivity, voidEx, VOID_REQUEST_CODE, true);

    }

    @ReactMethod
    public void makeMyPosRefund(Double amount, final  Promise promise){

        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            promise.reject("E_ACTIVITY_DOES_NOT_EXIST", "Activity doesn't exist");
            return;
        }

        mPosPromise = promise;

        MyPOSRefund refund = MyPOSRefund.builder()
                // Mandatoy parameters
                .refundAmount(amount)
                .currency(Currency.EUR)
                .foreignTransactionId(UUID.randomUUID().toString())
                // Set receipt mode if printer is paired
                .printMerchantReceipt(MyPOSUtil.RECEIPT_ON) // possible options RECEIPT_ON, RECEIPT_OFF
                .printCustomerReceipt(MyPOSUtil.RECEIPT_ON) // possible options RECEIPT_ON, RECEIPT_OFF, RECEIPT_AFTER_CONFIRMATION,
                // RECEIPT_E_RECEIPT
                //set email or phone e-receipt receiver, works with customer receipt configuration RECEIPT_E_RECEIPT or
                // RECEIPT_AFTER_CONFIRMATION
               // .ereceiptreceiver("examplename@example.com")
                .build();

// Start the transaction
        MyPOSAPI.openRefundActivity(currentActivity, refund, 2);

    }

}
