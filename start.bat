@echo off
setlocal
set "PATH=C:\Users\florzyk\AppData\Local\Programs\gh\bin;C:\Users\florzyk\AppData\Local\Programs\git\cmd;C:\Users\florzyk\AppData\Local\Programs\nodejs;%PATH%"
cd /d "%~dp0"

:MENU
cls
echo ======================================================
echo           SLEEPMAXXING - BIOHACKING SLEEP OS
echo ======================================================
echo.
echo [1] Launch on iPhone (Expo Go with QR Code - Recommended)
echo [2] Launch in Browser on PC (Web mode)
echo [3] Build iOS .ipa on GitHub Actions (Free Mac Cloud)
echo [4] Check Expo / EAS Account status
echo [5] Exit
echo.
set /p choice="Select option (1-5, default 1): "

if "%choice%"=="" set choice=1

if "%choice%"=="1" (
    echo.
    echo Starting Metro Bundler...
    echo Scan the QR code using your iPhone Camera or the Expo Go app!
    call npx.cmd expo start --tunnel
    goto DONE
)

if "%choice%"=="2" (
    echo.
    echo Starting Web mode in browser...
    call npx.cmd expo start --web
    goto DONE
)

if "%choice%"=="3" (
    echo.
    echo ======================================================
    echo           GITHUB ACTIONS FREE MAC CLOUD BUILD
    echo ======================================================
    echo.
    echo 1. Connecting to GitHub...
    call gh.exe auth status
    if errorlevel 1 (
        echo.
        echo Please log in to GitHub in your browser:
        call gh.exe auth login --web -h github.com
    )
    echo.
    echo 2. Pushing code and triggering Mac Xcode build...
    call git.exe add .
    call git.exe commit -m "Trigger iOS build" 2>nul
    call gh.exe repo create sleepmaxxing-app --public --source=. --push 2>nul
    call git.exe push origin master 2>nul
    echo.
    echo ======================================================
    echo Build triggered! Check progress at:
    call gh.exe repo view --web
    echo ======================================================
    goto DONE
)

if "%choice%"=="4" (
    echo.
    call eas.cmd whoami
    goto DONE
)

if "%choice%"=="5" (
    exit /b 0
)

:DONE
echo.
echo ======================================================
echo Press any key to return to menu...
echo ======================================================
pause >nul
goto MENU
