package com.izavit;

import android.os.Bundle;
//import android.app.Activity;
import org.apache.cordova.*;
import android.view.Menu;

public class Izavit extends DroidGap {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.setIntegerProperty("splashscreen", R.drawable.splash);
        super.loadUrl("file:///android_asset/www/iZavit.htm",20000);//Allow max 20 seconds for app to become ready
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.activity_main, menu);
        return true;
    }
}
