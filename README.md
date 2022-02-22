# File explorer
Explorateur de fichiers avec avec une interface sur navigateur WEB

## Installation
Après avoir cloné le repo aller dans le répertoire et taper la commande :

```bash
npm install
```
## Lancement du programme
```bash
node file-explorer.js [rep1 rep2 ...]
```
exemple
```bash
node file-explorer.js /Users . 
```
## Les librairies installées
express  
path   
crypto  
selenium-webdriver  

## Explication de la solution
Une solution en 4 fichiers :
1. FileExplorer.html    : c'est un modèle vide de notre interface utilisateur, il contient un tag #FileEplorer# qui sera remplacé par le serveur.
2. FileExplorer.css     : fichier de style(26) mettant en forme et en couleur l'arborescence dea fichiers.
3. FuncFileExplorer.js  : fichier de 5 fonctions javascript (niveau client) servant à interroger le serveur pour la lecture des répertoires et la mise en forme du "Tree" par manipulation du DOM.
4. file-explorer.js     : fichier javascript serveur de 4 fonctions principales permettant de lancer le navigateur, d'initier l'interface avec les répertoires de la ligne de commande et de répondre aux requêtes client.

### Principe de fonctionnement

