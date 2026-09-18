@echo off
chcp 65001 > nul
title Publicar CORAL en GitHub Pages - jjedi90
color 0B
cls
echo ======================================================================
echo    🧜‍♀️ CORAL — Publicador Automatico a GitHub Pages
echo    Autor: jjedi90
echo    Repositorio: https://github.com/valenciajedison90-gif/coral.git
echo ======================================================================
echo.
echo Presiona cualquier tecla para sincronizar y subir a GitHub...
pause > nul
echo.
echo [1/2] Verificando enlace remoto con GitHub...
git remote remove origin 2>nul
git remote add origin https://github.com/valenciajedison90-gif/coral.git

echo [2/2] Subiendo rama main a GitHub...
git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ======================================================================
    echo    🎉 ¡FELICITACIONES!
    echo    El juego fue subido a GitHub con éxito.
    echo.
    echo    En unos minutos estará disponible mundialmente en:
    echo    👉 https://valenciajedison90-gif.github.io/coral/
    echo ======================================================================
) else (
    echo.
    echo [!] Hubo un detalle al subir los archivos o se requieren credenciales.
)
echo.
pause
