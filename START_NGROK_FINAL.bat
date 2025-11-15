@echo off
color 0A
title Real Estate CRM - Ngrok Tunnel (FINAL)

echo.
echo ========================================
echo   REAL ESTATE CRM - NGROK TUNNEL
echo ========================================
echo.

REM Kill any existing ngrok processes
taskkill /F /IM ngrok.exe >nul 2>&1

echo [1/3] Checking servers...
echo.

REM Check React server
netstat -ano | findstr ":3000" | findstr "LISTENING" >nul 2>&1
if %errorlevel%==0 (
    echo [OK] React server is running on port 3000
) else (
    echo [ERROR] React server is NOT running!
    echo Please start: npm start
    pause
    exit /b 1
)

REM Check Flask server  
netstat -ano | findstr ":5000" | findstr "LISTENING" >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Flask server is running on port 5000
) else (
    echo [WARNING] Flask server might not be running
)

echo.
echo [2/3] Finding ngrok...
echo.

REM Find ngrok
set NGROK_EXE=
if exist "C:\ngrok\ngrok.exe" set NGROK_EXE=C:\ngrok\ngrok.exe
if exist "%USERPROFILE%\Downloads\ngrok.exe" set NGROK_EXE=%USERPROFILE%\Downloads\ngrok.exe
if exist "%USERPROFILE%\Desktop\ngrok.exe" set NGROK_EXE=%USERPROFILE%\Desktop\ngrok.exe
if exist "%USERPROFILE%\ngrok.exe" set NGROK_EXE=%USERPROFILE%\ngrok.exe

if "%NGROK_EXE%"=="" (
    echo [ERROR] Cannot find ngrok.exe
    echo.
    set /p NGROK_PATH="Enter ngrok folder path: "
    if exist "%NGROK_PATH%\ngrok.exe" (
        set NGROK_EXE=%NGROK_PATH%\ngrok.exe
    ) else (
        echo [ERROR] ngrok.exe not found!
        pause
        exit /b 1
    )
)

echo [OK] Found: %NGROK_EXE%
echo.

REM Get directory
for %%F in ("%NGROK_EXE%") do set NGROK_DIR=%%~dpF
cd /d "%NGROK_DIR%"

echo [3/3] Starting ngrok tunnel...
echo.
echo ================================================
echo   COPY THIS URL AND SHARE WITH CLIENT:
echo ================================================
echo.
echo Look for the "Forwarding" line below:
echo   https://XXXXX.ngrok-free.app
echo.
echo Copy that URL and send to client with:
echo   Email: admin@realestate.com
echo   Password: admin123
echo.
echo ================================================
echo   IMPORTANT:
echo ================================================
echo   - KEEP THIS WINDOW OPEN during demo
echo   - Client may see ngrok warning (tell them to click "Visit Site")
echo   - If tunnel stops, just run this script again
echo   - You'll get a NEW URL each time
echo.
echo ================================================
echo   Starting tunnel now...
echo ================================================
echo.

"%NGROK_EXE%" http 3000 --host-header="localhost:3000" --log=stdout

echo.
echo Tunnel stopped.
pause



