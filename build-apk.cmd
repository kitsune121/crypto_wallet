@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

echo ========================================
echo  Cryptera — build Android APK
echo ========================================
echo.
echo IMPORTANT: Fully quit Astrill VPN first.
echo Astrill injects ASProxy64.dll and crashes Java/Gradle.
echo.
pause

rem --- Locate JDK 17+ ---
set "JAVA_HOME="
if exist "%ProgramFiles%\Eclipse Adoptium\jdk-17*" (
  for /d %%D in ("%ProgramFiles%\Eclipse Adoptium\jdk-17*") do set "JAVA_HOME=%%~fD"
)
if not defined JAVA_HOME if exist "%ProgramFiles%\Microsoft\jdk-17*" (
  for /d %%D in ("%ProgramFiles%\Microsoft\jdk-17*") do set "JAVA_HOME=%%~fD"
)
if not defined JAVA_HOME if defined JAVA_HOME_OVERRIDE set "JAVA_HOME=%JAVA_HOME_OVERRIDE%"

if not defined JAVA_HOME (
  echo ERROR: JDK 17 not found.
  echo Install Temurin 17 or Microsoft OpenJDK 17, then re-run.
  echo Or set JAVA_HOME_OVERRIDE to your JDK folder.
  exit /b 1
)

rem --- Android SDK ---
if not defined ANDROID_HOME set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
if not defined ANDROID_SDK_ROOT set "ANDROID_SDK_ROOT=%ANDROID_HOME%"

if not exist "%ANDROID_HOME%\platform-tools" (
  echo ERROR: Android SDK not found at:
  echo   %ANDROID_HOME%
  echo Install Android Studio or command-line tools, then re-run.
  exit /b 1
)

set "PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\cmdline-tools\latest\bin;%ANDROID_HOME%\platform-tools;%PATH%"
set "GRADLE_USER_HOME=%USERPROFILE%\.gradle"

echo JAVA_HOME=%JAVA_HOME%
echo ANDROID_HOME=%ANDROID_HOME%
"%JAVA_HOME%\bin\java.exe" -version
echo.

rem --- Point Gradle at the SDK ---
> "android\local.properties" echo sdk.dir=%ANDROID_HOME:\=\\%

echo [1/3] Building web assets + Capacitor sync...
call npm run build:mobile
if errorlevel 1 (
  echo ERROR: npm build / cap sync failed.
  exit /b 1
)

echo.
echo [2/3] Assembling debug APK with Gradle...
pushd android
call gradlew.bat assembleDebug --no-daemon
set "ERR=!errorlevel!"
popd
if not "!ERR!"=="0" (
  echo.
  echo ERROR: Gradle failed ^(exit !ERR!^).
  echo If you see ASProxy64 / EXCEPTION_ILLEGAL_INSTRUCTION:
  echo   Quit Astrill completely, then run this file again.
  exit /b 1
)

echo.
echo [3/3] Copying APK to deliverables\...
if not exist "deliverables" mkdir "deliverables"
set "APK_SRC=android\app\build\outputs\apk\debug\app-debug.apk"
if not exist "%APK_SRC%" (
  echo ERROR: APK not found at %APK_SRC%
  exit /b 1
)
copy /Y "%APK_SRC%" "deliverables\Cryptera-1.0.0-debug.apk" >nul

echo.
echo ========================================
echo  DONE
echo  %CD%\deliverables\Cryptera-1.0.0-debug.apk
echo ========================================
explorer /select,"%CD%\deliverables\Cryptera-1.0.0-debug.apk"
exit /b 0
