@echo off
set "PATH=C:\Users\florzyk\AppData\Local\Programs\git\cmd;C:\Users\florzyk\AppData\Local\Programs\nodejs;%PATH%"
cd /d "%~dp0"

echo ======================================================
echo           SLEEPMAXXING - BIOHACKING SLEEP OS
echo ======================================================
echo.
echo [1] Launch for iPhone (Expo Go with QR Code)
echo [2] Launch in Browser on PC (Web mode)
echo [3] Build iOS .ipa (Device build)
echo [4] Build iOS (Simulator / Sideload build - No Apple account needed)
echo [5] Login / Check Expo Account
echo.
set /p choice="Select mode (1, 2, 3, 4, or 5, default 1): "

if "%choice%"=="2" (
    echo.
    echo Starting Web mode...
    npx expo start --web
) else if "%choice%"=="3" (
    echo.
    echo Starting EAS iOS Device Build (.ipa)...
    eas.cmd build --platform ios --profile preview
) else if "%choice%"=="4" (
    echo.
    echo Starting EAS iOS Simulator Build (No Apple credentials required)...
    eas.cmd build --platform ios --profile simulator
) else if "%choice%"=="5" (
    echo.
    echo Checking Expo Login...
    eas.cmd whoami
    eas.cmd login
) else (
    echo.
    echo Starting Metro Bundler...
    echo Scan the QR code using your iPhone Camera or the Expo Go app!
    npx expo start --tunnel
)

pause
