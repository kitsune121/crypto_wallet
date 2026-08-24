@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

echo ========================================
echo  Cryptera — build Windows app ^(.exe^)
echo ========================================
echo.

where npm >nul 2>&1
if errorlevel 1 (
  echo ERROR: npm not found. Install Node.js, then re-run.
  exit /b 1
)

echo [1/2] Building web assets + Electron Windows packages...
call npm run build:win
if errorlevel 1 (
  echo ERROR: Windows build failed.
  exit /b 1
)

echo.
echo [2/2] Copying to deliverables\...
if not exist "deliverables" mkdir "deliverables"

if exist "release\Cryptera Setup *.exe" (
  for %%F in ("release\Cryptera Setup *.exe") do copy /Y "%%~fF" "deliverables\Cryptera-Setup-1.0.0.exe" >nul
)
if exist "release\Cryptera *.exe" (
  for %%F in ("release\Cryptera *.exe") do (
    echo %%~nxF | findstr /I /C:"Setup" >nul
    if errorlevel 1 copy /Y "%%~fF" "deliverables\Cryptera-1.0.0-portable.exe" >nul
  )
)

echo.
echo ========================================
echo  DONE — Windows app
echo ========================================
echo  Installer:  deliverables\Cryptera-Setup-1.0.0.exe
echo  Portable:   deliverables\Cryptera-1.0.0-portable.exe
echo  Also in:    release\
echo ========================================
if exist "deliverables\Cryptera-Setup-1.0.0.exe" (
  explorer /select,"%CD%\deliverables\Cryptera-Setup-1.0.0.exe"
)
exit /b 0
