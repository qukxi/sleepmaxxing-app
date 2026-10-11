@echo off
set "PATH=C:\Users\florzyk\AppData\Local\Programs\git\cmd;C:\Users\florzyk\AppData\Local\Programs\nodejs;%PATH%"
cd /d "%~dp0"

echo ======================================================
echo           SLEEPMAXXING - BIOHACKING SLEEP OS
echo ======================================================
echo.
echo [1] Launch for iPhone (Expo Go with QR Code)
echo [2] Launch in Browser on PC (Web mode)
echo [3] Build iOS standalone .ipa (EAS Cloud Build)
echo [4] Login / Register Expo Account
echo.
set /p choice="Select mode (1, 2, 3, or 4, default 1): "

if "%choice%"=="2" (
    echo.
    echo Starting Web mode...
    npx expo start --web
) else if "%choice%"=="3" (
    echo.
    echo Starting EAS iOS Build...
    eas.cmd build --platform ios --profile preview
) else if "%choice%"=="4" (
    echo.
    echo Opening Expo Login...
    eas.cmd login
) else (
    echo.
    echo Starting Metro Bundler...
    echo Scan the QR code using your iPhone Camera or the Expo Go app!
    npx expo start --tunnel
)

pause
