@echo off
chcp 65001 > nul
title Publicar CORAL en GitHub Pages - jjedi90
color 0B
cls
echo ======================================================================
echo    🧜‍♀️ CORAL — Publicador Automatico a GitHub Pages
echo    Autor: jjedi90
echo ======================================================================
echo.
echo 1. Asegúrate de haber creado el repositorio en:
echo    👉 https://github.com/new
echo    - Nombre del repositorio: coral
echo    - Tipo: Public
echo.
echo Si ya lo creaste, presiona cualquier tecla para subir el proyecto...
pause > nul
echo.
echo [1/3] Configurando enlace con GitHub (https://github.com/jjedi90/coral.git)...
git remote remove origin 2>nul
git remote add origin https://github.com/jjedi90/coral.git

echo [2/3] Subiendo rama main a GitHub...
git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ======================================================================
    echo    🎉 ¡FELICITACIONES!
    echo    El juego fue subido a GitHub con éxito.
    echo.
    echo    En unos minutos estará disponible mundialmente en:
    echo    👉 https://jjedi90.github.io/coral/
    echo ======================================================================
) else (
    echo.
    echo [!] Hubo un error o se solicitaron credenciales de GitHub.
    echo     Verifica que el repositorio 'coral' exista en tu cuenta 'jjedi90'.
)
echo.
pause
