 cordova build --release android

 jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore 'D:\Dev\keys\cromemedia_release.keystore' .platforms\android\build\outputs\apk\android-release-unsigned.apk cromemedia

 jarsigner -verbose  -sigalg SHA1WITHRSA -digestalg SHA1 -keystore 'D:\Dev\keys\Truck Weight\keyStore.jks' .platforms\android\build\outputs\apk\android-release-unsigned.apk mineco

  zipalign -f -v 4 .\platforms\android\build\outputs\apk\android-release-unsigned.apk com.mymaoni.app.apk
