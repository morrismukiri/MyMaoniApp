 cordova build --release android

 jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore 'D:\Dev\keys\cromemedia_release.keystore' 'D:\Dev\MyMaoniApp\platforms\android\build\outputs\apk\android-release-unsigned.apk' cromemedia

  zipalign -f -v 4 .\platforms\android\build\outputs\apk\android-release-unsigned.apk com.mymaoni.app.apk
