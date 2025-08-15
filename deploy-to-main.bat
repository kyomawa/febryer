@echo off
echo Initialisation du repository Git...
git init

echo Ajout du remote origin...
git remote add origin https://github.com/kyomawa/febryer.git

echo Ajout de tous les fichiers...
git add .

echo Commit initial...
git commit -m "Version complete avec Next.js 15.4.6 et systeme de reservation"

echo Renommage de la branch en main...
git branch -M main

echo Push force vers main (remplace completement la branch)...
git push -f origin main

echo Termine ! La branch main a ete remplacee par votre version locale.
pause
