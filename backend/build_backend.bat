@echo off
echo ====================================
echo  Building Python Backend (Windows)
echo ====================================

cd /d "%~dp0"

python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found.
    pause
    exit /b 1
)

echo.
echo [1/3] Installing dependencies...
pip install -r requirements.txt --quiet
pip install pyinstaller --quiet

echo.
echo [2/3] Building executable with PyInstaller...
pyinstaller ^
    --onedir ^
    --name backend ^
    --distpath dist ^
    --workpath build_temp ^
    --specpath build_temp ^
    --add-data "%~dp0main.py;." ^
    --collect-all fastapi ^
    --collect-all uvicorn ^
    --collect-all starlette ^
    --collect-all PIL ^
    --collect-all numpy ^
    --collect-all anyio ^
    --collect-all multipart ^
    --hidden-import uvicorn.logging ^
    --hidden-import uvicorn.loops ^
    --hidden-import uvicorn.loops.auto ^
    --hidden-import uvicorn.protocols ^
    --hidden-import uvicorn.protocols.http ^
    --hidden-import uvicorn.protocols.http.auto ^
    --hidden-import uvicorn.protocols.websockets ^
    --hidden-import uvicorn.protocols.websockets.auto ^
    --hidden-import uvicorn.lifespan ^
    --hidden-import uvicorn.lifespan.on ^
    --exclude-module sklearn ^
    --exclude-module scipy ^
    --exclude-module pandas ^
    --exclude-module matplotlib ^
    --exclude-module tkinter ^
    --exclude-module PyQt5 ^
    --exclude-module wx ^
    --exclude-module unittest ^
    --noconfirm ^
    --clean ^
    main_runner.py

echo.
echo [3/3] Checking output...
if exist "dist\backend\backend.exe" (
    echo [OK] Backend built successfully!
    echo Output: %~dp0dist\backend\backend.exe
) else (
    echo [ERROR] Build failed.
    pause
    exit /b 1
)

echo.
echo ====================================
echo  Build Complete!
echo ====================================
pause