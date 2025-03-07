package com.digikiosk;

import androidx.appcompat.app.AppCompatActivity;
import android.content.Intent;
import android.app.Activity;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import 	java.io.FileOutputStream;
import android.content.Context;
import java.io.IOException;
public class ReportActivity extends AppCompatActivity {
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		Intent i = getIntent();

		Uri data = i.getData();
		if (data != null){
			String filename = "vivauridigi";
			String fileContents = data.toString();
			Context context = getApplicationContext();
			try (FileOutputStream fos = context.openFileOutput(filename, Context.MODE_PRIVATE)) {
					fos.write(fileContents.getBytes());
			}catch (IOException e) {
				// Error occurred when opening raw file for reading.
			}
			finish();
		}			
	}

	@Override
	protected void onNewIntent(Intent intent) {
		super.onNewIntent(intent);
	}    
}
