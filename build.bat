@echo off
REM Configure Node.js path
set PATH=C:\Program Files\nodejs;%PATH%

REM Install dependencies
echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo Error: npm install failed
    pause
    exit /b 1
)

REM Build project
echo Building project...
call npm run build
if errorlevel 1 (
    echo Error: npm run build failed
    pause
    exit /b 1
)

echo Build complete!
pause
