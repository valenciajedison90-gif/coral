@echo off
title Publicar CORAL en GitHub Pages - jjedi90
color 0B
cls
echo ======================================================================
echo    CORAL - Publicador a GitHub Pages
echo    Autor: jjedi90
echo    Repositorio: https://github.com/valenciajedison90-gif/coral.git
echo ======================================================================
echo.
echo Presiona una tecla para sincronizar y subir a GitHub...
pause
echo.
echo [1/2] Verificando enlace remoto...
git remote set-url origin https://github.com/valenciajedison90-gif/coral.git
if %ERRORLEVEL% neq 0 git remote add origin https://github.com/valenciajedison90-gif/coral.git
echo.
echo [2/2] Subiendo a GitHub...
git push -u origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo ======================================================================
    echo    TODO LISTO: Subido con exito a GitHub.
    echo    Tu enlace: https://valenciajedison90-gif.github.io/coral/
    echo ======================================================================
) else (
    echo [!] Si te solicito usuario y contrasena, asegurate de iniciar sesion.
)
echo.
pause
