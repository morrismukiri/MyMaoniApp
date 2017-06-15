 cordova build --release android
  jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore HelloWorld-release-unsigned.apk minecogroup

  zipalign -v 4 HelloWorld-release-unsigned.apk HelloWorld.apk