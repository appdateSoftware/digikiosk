package com.digikiosk;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ActivityEventListener;

import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableNativeMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import android.app.Activity;
import android.content.pm.PackageManager;

import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;

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

//import android.content.SharedPreferences;
import android.util.Log;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.util.Base64;

import com.ctk.sdk.PosApiHelper;
//import com.ctk.sdk.Print;
//import com.ctk.sdk.PrintInitException;
//import com.ctk.keypad.EMVCOHelper;

import com.digikiosk.service.MyService;

import com.facebook.react.bridge.ReadableArray;
//import android.graphics.Bitmap;
//import android.graphics.BitmapFactory;
//import android.graphics.Color;
//import androidmads.library.qrgenearator.QRGContents;
//import androidmads.library.qrgenearator.QRGEncoder;



public class CiontekModule extends ReactContextBaseJavaModule {
//  SharedPreferences.Editor editor;
  //  SharedPreferences preferences;
  //  SharedPreferences sp;
    Context mContext;
    private final ReactApplicationContext reactContext;
    private boolean m_bThreadFinished = true;
    private int RESULT_CODE = 0;
    private int cycle_num = 0;

    private int BatteryV;
    private int voltage_level;
    private int emv;

    final int PRINT_TEST = 0;
    final int PRINT_UNICODE = 1;

    int ret = -1;

    PosApiHelper posApiHelper = PosApiHelper.getInstance();
   // Print print = new Print();
   // EMVCOHelper emvcoHelper = EMVCOHelper.getInstance();

    public CiontekModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "CiontekModule";
    }

    /*

    @ReactMethod
    public void sampleMethod(String stringArgument, int numberArgument, Callback callback) {
        // TODO: Implement some actually useful functionality
        callback.invoke("Received numberArgument: " + numberArgument + " stringArgument: " + stringArgument);
    }
        */

    public class BatteryReceiver extends BroadcastReceiver {
        public void onReceive(Context context, Intent intent) {
            voltage_level = intent.getExtras().getInt("level");
            BatteryV = intent.getIntExtra("voltage", 0);
        }
    }

    // private static final String DISABLE_FUNCTION_LAUNCH_ACTION =
    // "android.intent.action.DISABLE_FUNCTION_LAUNCH";
    // private void disableFunctionLaunch(boolean state) {
    // Intent disablePowerKeyIntent = new Intent(DISABLE_FUNCTION_LAUNCH_ACTION);
    // if (state) {
    // disablePowerKeyIntent.putExtra("state", true);
    // } else {
    // disablePowerKeyIntent.putExtra("state", false);
    // }
    // sendBroadcast(disablePowerKeyIntent);
    // }

    ServiceConnection serviceConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            MyService.MyBinder binder = (MyService.MyBinder) service;
            MyService myService = binder.getService();

            myService.setCallback(new MyService.CallBackPrintStatus() {
                @Override
                public void printStatusChange(String strStatus) {
                    // SendMsg(strStatus);
                }
            });

        }

        @Override
        public void onServiceDisconnected(ComponentName name) {

        }
    };
/*
    @ReactMethod
    public void  printQR(final String content) {
      //  int emv = emvcoHelper.AdapterUartBaud();
      //  Log.v("Ciontek", "emv init: " + emv);

        new Thread(new Runnable() {
            @Override
            public void run() {
                posApiHelper.SysLogSwitch(1);
                Log.v("Ciontek", "Prepare ...");

                try {
                    ret = posApiHelper.PrintInit();
                } catch (PrintInitException e) {
                    e.printStackTrace();
                }
                Log.v("Ciontek", "ret init: " + ret);

                posApiHelper.PrintSetGray(1);

                ret = posApiHelper.PrintCheckStatus();
                if (ret == -1) {
                    RESULT_CODE = -1;
                    return;
                } else if (ret == -2) {
                    RESULT_CODE = -1;
                    return;
                } else if (ret == -3) {
                    RESULT_CODE = -1;
                    return;
                } else {
                    RESULT_CODE = 0;
                }
                Log.v("Ciontek", "ret check status: " + ret + ", result_code: " + RESULT_CODE);

                posApiHelper.PrintSetFont((byte) 24, (byte) 24, (byte) 0x00);
                Log.v("Ciontek", "ret set font: " + ret);

                posApiHelper.PrintStr(" \n");
            //    posApiHelper.PrintQrCode_Cut(content, 360, 360, BarcodeFormat.QR_CODE);

          //      Print.Lib_PrnSetAlign(0);

                ret = posApiHelper.PrintStart();
                // ret = print.Lib_PrnStart();
                Log.v("Ciontek", "ret print start: " + ret);
            }
        }).start();
    }
        */

    @ReactMethod
    public void printText(final String text) {
     //   int emv = emvcoHelper.AdapterUartBaud();
     //   Log.v("Ciontek", "emv init: " + emv);

        new Thread(new Runnable() {
            @Override
            public void run() {
                posApiHelper.SysLogSwitch(1);
                Log.v("Ciontek", "Prepare ...");

             //   try {
                    ret = posApiHelper.PrintInit();
            //    } catch (PrintInitException e) {
             //       e.printStackTrace();
            //    }
                Log.v("Ciontek", "ret init: " + ret);

                posApiHelper.PrintSetGray(1);

                ret = posApiHelper.PrintCheckStatus();
                if (ret == -1) {
                    RESULT_CODE = -1;
                    return;
                } else if (ret == -2) {
                    RESULT_CODE = -1;
                    return;
                } else if (ret == -3) {
                    RESULT_CODE = -1;
                    return;
                } else {
                    RESULT_CODE = 0;
                }
                Log.v("Ciontek", "ret check status: " + ret + ", result_code: " + RESULT_CODE);

                posApiHelper.PrintSetFont((byte) 24, (byte) 24, (byte) 0x00);
                Log.v("Ciontek", "ret set font: " + ret);

                posApiHelper.PrintStr(" \n");
                posApiHelper.PrintStr(text);
                posApiHelper.PrintStr(" \n");
                posApiHelper.PrintStr(" \n");
                posApiHelper.PrintStr(" \n");

                ret = posApiHelper.PrintStart();
                // ret = print.Lib_PrnStart();
                Log.v("Ciontek", "ret print start: " + ret);
            }
        }).start();
    }


    @ReactMethod
    public void printCustomReceipt(
        ReadableArray titleArray, 
        ReadableArray dateArray, 
        ReadableArray itemsArray, 
        ReadableArray totalsArray, 
        String footerStr, String qrCode,
        ReadableArray footerArray,
        ReadableArray vatAnalysisArr, final  Promise promise
    ){      

      
          
    
    Thread thread = new Thread(new Runnable() {
            @Override
            public void run() {

           //     Bitmap qrBitmap;
           //     QRGEncoder qrgEncoder;
       
           //     qrgEncoder = new QRGEncoder(qrCode, null, QRGContents.Type.TEXT, 160);
           //     qrgEncoder.setColorBlack(Color.BLACK);
           //     qrgEncoder.setColorWhite(Color.WHITE);      
           //     qrBitmap = qrgEncoder.getBitmap(0);

                posApiHelper.SysLogSwitch(1);
                Log.v("Ciontek", "Prepare ...");

             //   try {
                    ret = posApiHelper.PrintInit();
            //    } catch (PrintInitException e) {
             //       e.printStackTrace();
            //    }
                Log.v("Ciontek", "ret init: " + ret);

                posApiHelper.PrintSetGray(5);

                ret = posApiHelper.PrintCheckStatus();
                if (ret == -1) {
                    RESULT_CODE = -1;
                    return;
                } else if (ret == -2) {
                    RESULT_CODE = -1;
                    return;
                } else if (ret == -3) {
                    RESULT_CODE = -1;
                    return;
                } else {
                    RESULT_CODE = 0;
                }
                Log.v("Ciontek", "ret check status: " + ret + ", result_code: " + RESULT_CODE);

                posApiHelper.PrintSetFont((byte) 24, (byte) 24, (byte) 0x00);
                Log.v("Ciontek", "ret set font: " + ret);

        
        posApiHelper.PrintStr(titleArray.getString(0));

        posApiHelper.PrintSetBold(1);
        posApiHelper.PrintStr(titleArray.getString(1));
        posApiHelper.PrintSetBold(0);


        posApiHelper.PrintSetFont((byte) 16, (byte) 16, (byte) 0x00);
        for (int i = 2; i < titleArray.size(); i++){
            posApiHelper.PrintStr(titleArray.getString(i));            
        }
        posApiHelper.PrintSetFont((byte) 24, (byte) 24, (byte) 0x00);

        for (int i = 0; i < dateArray.size(); i++) {
            posApiHelper.PrintStr(dateArray.getString(i));              
        }

        for (int i = 0; i < itemsArray.size(); i++) {
            posApiHelper.PrintStr(itemsArray.getString(i));              
        }

        posApiHelper.PrintSetFont((byte) 16, (byte) 16, (byte) 0x00);
        for (int i = 0; i < vatAnalysisArr.size(); i++) {
            posApiHelper.PrintStr(vatAnalysisArr.getString(i));
        }
        posApiHelper.PrintSetFont((byte) 24, (byte) 24, (byte) 0x00);

        for (int i = 0; i < totalsArray.size(); i++) {
            posApiHelper.PrintStr(totalsArray.getString(i));               
        }
        posApiHelper.PrintSetFont((byte) 16, (byte) 16, (byte) 0x00);
        posApiHelper.PrintStr(footerStr);   
        
   //     posApiHelper.PrintBmp(qrBitmap);

           posApiHelper.PrintQrCode_Cut(qrCode.toString(), 260, 260, "QR_CODE");

         
     posApiHelper.PrintSetFont((byte) 24, (byte) 24, (byte) 0x00);



        for (int i = 0; i < footerArray.size(); i++) {
            posApiHelper.PrintStr(footerArray.getString(i));              
        }        
        posApiHelper.PrintStr(" \n");
        posApiHelper.PrintStr(" \n");
        posApiHelper.PrintStr(" \n");
        posApiHelper.PrintStr(" \n");


            
                ret = posApiHelper.PrintStart();
                // ret = print.Lib_PrnStart();
                Log.v("Ciontek", "ret print start: " + ret);

            }         

        });  
        
        thread.start();
        
        try{
            thread.join();        
            promise.resolve("Printed");
        }catch(InterruptedException e){
            Log.v("InterruptedException", "Error");
            promise.resolve("Rejected");
        }

    }


    @ReactMethod
    public void printAccounting(
        ReadableArray titleArray, 
        ReadableArray vatSectionsArr, 
        ReadableArray bodyArr, 
        final  Promise promise
    ){         
    
    Thread thread = new Thread(new Runnable() {
            @Override
            public void run() {

           //     Bitmap qrBitmap;
           //     QRGEncoder qrgEncoder;
       
           //     qrgEncoder = new QRGEncoder(qrCode, null, QRGContents.Type.TEXT, 160);
           //     qrgEncoder.setColorBlack(Color.BLACK);
           //     qrgEncoder.setColorWhite(Color.WHITE);      
           //     qrBitmap = qrgEncoder.getBitmap(0);

                posApiHelper.SysLogSwitch(1);
                Log.v("Ciontek", "Prepare ...");

             //   try {
                    ret = posApiHelper.PrintInit();
            //    } catch (PrintInitException e) {
             //       e.printStackTrace();
            //    }
                Log.v("Ciontek", "ret init: " + ret);

                posApiHelper.PrintSetGray(5);

                ret = posApiHelper.PrintCheckStatus();
                if (ret == -1) {
                    RESULT_CODE = -1;
                    return;
                } else if (ret == -2) {
                    RESULT_CODE = -1;
                    return;
                } else if (ret == -3) {
                    RESULT_CODE = -1;
                    return;
                } else {
                    RESULT_CODE = 0;
                }
                Log.v("Ciontek", "ret check status: " + ret + ", result_code: " + RESULT_CODE);

                posApiHelper.PrintSetFont((byte) 24, (byte) 24, (byte) 0x00);
                Log.v("Ciontek", "ret set font: " + ret);

        
        posApiHelper.PrintSetBold(1);
        for (int i = 0; i < titleArray.size(); i++){
            posApiHelper.PrintStr(titleArray.getString(i));            
        }        
        posApiHelper.PrintSetBold(0);        

        for (int i = 0; i < vatSectionsArr.size(); i++) {
            posApiHelper.PrintStr(vatSectionsArr.getString(i));              
        }

        for (int i = 0; i < bodyArr.size(); i++) {
            posApiHelper.PrintStr(bodyArr.getString(i));              
        }
               
        posApiHelper.PrintStr(" \n");
        posApiHelper.PrintStr(" \n");
        posApiHelper.PrintStr(" \n");
        posApiHelper.PrintStr(" \n");
            
                ret = posApiHelper.PrintStart();
                // ret = print.Lib_PrnStart();
                Log.v("Ciontek", "ret print start: " + ret);

            }         

        });  
        
        thread.start();
        
        try{
            thread.join();        
            promise.resolve("Printed");
        }catch(InterruptedException e){
            Log.v("InterruptedException", "Error");
            promise.resolve("Rejected");
        }

    }
/*
    @ReactMethod
    public void testPrintPic(final String base64encodeStr) {
        // Log.v("Ciontek", "bitmap: " + base64encodeStr);
    //    int emv = emvcoHelper.AdapterUartBaud();
     //   Log.v("Ciontek", "emv init: " + emv);

        new Thread(new Runnable() {
            @Override
            public void run() {
                posApiHelper.SysLogSwitch(1);
                Log.v("Ciontek", "Prepare ...");

                try {
                    ret = posApiHelper.PrintInit();
                } catch (PrintInitException e) {
                    e.printStackTrace();
                }
                Log.v("Ciontek", "ret init: " + ret);

                posApiHelper.PrintSetGray(1);

                ret = posApiHelper.PrintCheckStatus();
                if (ret == -1) {
                    RESULT_CODE = -1;
                    return;
                } else if (ret == -2) {
                    RESULT_CODE = -1;
                    return;
                } else if (ret == -3) {
                    RESULT_CODE = -1;
                    return;
                } else {
                    RESULT_CODE = 0;
                }
                Log.v("Ciontek", "ret check status: " + ret + ", result_code: " + RESULT_CODE);

                posApiHelper.PrintSetFont((byte) 24, (byte) 24, (byte) 0x00);
                Log.v("Ciontek", "ret set font: " + ret);

                final long start_BmpD = System.currentTimeMillis();
                byte[] bytes = Base64.decode(base64encodeStr, Base64.DEFAULT);
                Bitmap mBitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.length);
                final long end_BmpD = System.currentTimeMillis();
                final long decodetime = end_BmpD - start_BmpD;
                final long start_PrintBmp = System.currentTimeMillis();

                Log.v("Ciontek", "bitmap image: " + mBitmap);

                ret = posApiHelper.PrintBmp(mBitmap);
                posApiHelper.PrintStr("                                         \n");
                Log.v("Ciontek", "ret bmp: " + ret);
                if (ret == 0) {
                    posApiHelper.PrintStr("\n\n\n");
                    posApiHelper.PrintStr("                                         \n");
                    posApiHelper.PrintStr("                                         \n");

                    ret = posApiHelper.PrintStart();
                } else {
                    RESULT_CODE = -1;
                }

                ret = posApiHelper.PrintStart();
                // ret = print.Lib_PrnStart();
                Log.v("Ciontek", "ret print start: " + ret);
            }
        }).start();
    }

    */

    @ReactMethod
    public void testPrint() {
        // PosApiHelper.getInstance().SysLogSwitch(1);
    //    int emv = emvcoHelper.AdapterUartBaud();
    //    Log.v("Ciontek", "emv init: " + emv);

        new Thread(new Runnable() {
            @Override
            public void run() {
                posApiHelper.SysLogSwitch(1);
                Log.v("Ciontek", "Prepare ...");

           //     try {
                    ret = posApiHelper.PrintInit();
           //     } catch (PrintInitException e) {
            //        e.printStackTrace();
           //     }
                Log.v("Ciontek", "ret init: " + ret);

                posApiHelper.PrintSetGray(1);

                ret = posApiHelper.PrintCheckStatus();
                if (ret == -1) {
                    RESULT_CODE = -1;
                    return;
                } else if (ret == -2) {
                    RESULT_CODE = -1;
                    return;
                } else if (ret == -3) {
                    RESULT_CODE = -1;
                    return;
                } else {
                    RESULT_CODE = 0;
                }
                Log.v("Ciontek", "ret check status: " + ret + ", result_code: " + RESULT_CODE);

                posApiHelper.PrintSetFont((byte) 24, (byte) 24, (byte) 0x00);
                Log.v("Ciontek", "ret set font: " + ret);

                posApiHelper.PrintStr("中文:你好，好久不见。\n");
                posApiHelper.PrintStr("英语:Hello, Long time no see   ￡ ：2089.22\n");
                posApiHelper.PrintStr("意大利语Italian :Ciao, non CI vediamo da Molto Tempo.\n");
                posApiHelper.PrintStr("西班牙语:España, ¡Hola! Cuánto tiempo sin verte!\n");
                posApiHelper.PrintStr("Arabic:");// 阿拉伯语
                posApiHelper.PrintStr("قل مرحبا عند مقابلتك");// 阿拉伯语
                posApiHelper.PrintStr("الفبای فارسی گروه سی‌ودوگانهٔ");// 阿拉伯语
                posApiHelper.PrintStr("سی‌ودوگانهٔ");
                posApiHelper.PrintStr("حروف الفبا یا حروف هجای فارسی می‌گویند");
                posApiHelper.PrintStr(" \n");
                posApiHelper.PrintStr(" \n");
                posApiHelper.PrintStr(" \n");
                posApiHelper.PrintStr(" \n");
                posApiHelper.PrintStr(" \n");

                ret = posApiHelper.PrintStart();
                // ret = print.Lib_PrnStart();
                Log.v("Ciontek", "ret print start: " + ret);
            }
        }).start();
        // Thread myThread = new Thread() {
        // public void run() {
        // Log.v("Ciontek", "Prepare ...");

        // ret = posApiHelper.PrintInit(2, 24, 24, 0);
        // // checkRet(ret, "ret PrintInit");

        // Log.v("Ciontek", "ret init: " + ret);
        // ret = posApiHelper.PrintSetFont((byte) 24, (byte) 24, (byte) 0x00);
        // // checkRet(ret, "ret PrintSetFont");
        // Log.v("Ciontek", "ret set font: " + ret);

        // posApiHelper.PrintStr("中文:你好，好久不见。\n");
        // posApiHelper.PrintStr("英语:Hello, Long time no see ￡ ：2089.22\n");
        // posApiHelper.PrintStr("意大利语Italian :Ciao, non CI vediamo da Molto Tempo.\n");
        // posApiHelper.PrintStr("西班牙语:España, ¡Hola! Cuánto tiempo sin verte!\n");
        // posApiHelper.PrintStr("Arabic:");
        // posApiHelper.PrintStr("قل مرحبا عند مقابلتك");
        // posApiHelper.PrintStr("الفبای فارسی گروه سی‌ودوگانهٔ");
        // posApiHelper.PrintStr("سی‌ودوگانهٔ");
        // posApiHelper.PrintStr("حروف الفبا یا حروف هجای فارسی می‌گویند");
        // posApiHelper.PrintStr("الفبای فارسی گروه سی‌ودوگانهٔ حروف (اَشکال نوشتاری) در
        // خط فارسی است که نمایندهٔ نگاشتن (همخوان‌ها یا صامت‌ها) در زبان فارسی است و");
        // posApiHelper.PrintStr("است که نمایندهٔ نگاشتن (همخوان‌ها یا صامت‌ها) در زبان
        // فارسی است و");
        // posApiHelper.PrintStr("泰语:สวัสดีครับไม่เจอกันนานเลยนะ!\n");
        // posApiHelper.PrintStr("法语:Bonjour! Ça fait longtemps!\n");
        // posApiHelper.PrintStr(" \n");
        // posApiHelper.PrintStr(" \n");

        // ret = posApiHelper.PrintStart();
        // // checkRet(ret, "ret PrintStart");
        // Log.v("Ciontek", "ret print start: " + ret);

        // }

        // };
        // myThread.start();

    }

    /*

    @ReactMethod
    public void checkPrinterStatus(Callback cb) {
        try {
   //         emv = emvcoHelper.AdapterUartBaud();
            ret = posApiHelper.PrintCheckStatus();

            cb.invoke(ret);
        } catch (Exception e) {
            ret = -1;
            cb.invoke(ret);
        }
    }

    private void checkRet(int ret, String message) {
        if (ret < 0) {
        //    Toast.makeText(mContext, message + " : " + ret, Toast.LENGTH_SHORT).show();
        }
    }

    */

}
