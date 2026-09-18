@echo off
title CORAL — La Gran Aventura Submarina
echo ========================================================
echo   Iniciando CORAL — La Gran Aventura Submarina...
echo ========================================================
echo.
echo Abriendo en tu navegador...
start "" http://localhost:8080
echo.
echo Presiona Ctrl+C en esta ventana cuando desees cerrar el juego.
echo.
python -m http.server 8080
pause
