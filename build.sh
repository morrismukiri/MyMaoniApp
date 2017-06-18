 cordova build --release android
 jarsigner -verbose  -sigalg SHA1WITHRSA -digestalg SHA1 -keystore 'D:\Dev\keys\Truck Weight\keyStore.jks' .\platforms\and
roid\build\outputs\apk\android-release-unsigned.apk mineco

  zipalign -v 4 .\platforms\android\build\outputs\apk\android-release-unsigned.apk com.mymaoni.app.apk
