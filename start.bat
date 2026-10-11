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
echo [4] Download latest .ipa for Sideloadly
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
    echo 1. Checking GitHub authentication...
    call gh.exe auth status
    if errorlevel 1 (
        echo.
        echo Please log in to GitHub in your browser:
        call gh.exe auth login --web -h github.com
    )
    echo.
    echo 2. Pushing changes to GitHub master...
    call git.exe add .
    call git.exe commit -m "Update iOS configuration for build" 2>nul
    call git.exe push origin master
    if errorlevel 1 (
        echo.
        echo [ERROR] Git push failed. Please check your internet or git credentials.
        goto DONE
    )
    echo.
    echo 3. Mac Xcode build is running on GitHub Actions!
    echo Opening repository Actions page in your browser...
    call gh.exe run list --limit 1
    call gh.exe browse --runs 2>nul
    goto DONE
)

if "%choice%"=="4" (
    echo.
    echo ======================================================
    echo       DOWNLOADING LATEST DEVICE IPA ARTIFACT
    echo ======================================================
    echo.
    if exist sleepmaxxing.ipa del /f /q sleepmaxxing.ipa
    call gh.exe run download --name sleepmaxxing-device-ipa --dir .
    if exist sleepmaxxing.ipa (
        echo.
        echo [SUCCESS] sleepmaxxing.ipa downloaded successfully!
        echo Opening file in Windows Explorer...
        explorer.exe /select,sleepmaxxing.ipa
    ) else (
        echo.
        echo [ERROR] Could not download IPA. Please make sure the build is completed in GitHub Actions.
    )
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
