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
### Une solution en 4 fichiers :
1. FileExplorer.html    : c'est un modèle vide de notre interface utilisateur, il contient un tag #FileEplorer# qui sera remplacé par le serveur.
2. FileExplorer.css     : fichier de style(26) mettant en forme et en couleur l'arborescence dea fichiers.
3. FuncFileExplorer.js  : fichier de 5 fonctions javascript (niveau client) servant à interroger le serveur pour la lecture des répertoires et la mise en forme du "Tree" par manipulation du DOM.
4. file-explorer.js     : fichier javascript serveur de 4 fonctions principales permettant de lancer le navigateur, d'initier l'interface avec les répertoires de la ligne de commande et de répondre aux requêtes client.

### Principe de fonctionnement :
Au lancement par node de file-explorer.js, le navigateur est tout d'abord lancer en maximisant sa taille et en utilisant selenium-webdriver. La première requête  appelle la fonction _/file-explorer_ qui utilise le patron _FileExplorer.html_ et crée les premières branches de l'arbre correspondant aux répertoires placés sur la ligne de commande. Les répertoires inexistants seront inactivés mais visible sur l'interface en couleur rouge avec une croix sur la gauche. A ce moment aucune lecture de répertoire n'est encore faite.  
  
Quand la page _FileExplorer.html_ est chargée, un "Timer" est déclenché pour appeler la fonction _refresh()_ qui permet de demander, toutes les 3 secondes, au serveur la mise à jour des répertoires visités.  
  
A ce niveau plus rien ne se passe et ce n'est que lorsque l'utilisateur clique pour développer les répertoires que leur contenu est chargé à partir du serveur voir la fonction cliente _getDir(dir, id, devDir)_ et celle serveur _/getDir_. Par souci d'efficacité et de simplicité du code il n'y a qu'un seul répertoire qui est chargé et inséré dans le DOM. Chaque répertoire visité est conservé dans un tableau pour pouvoir être rafraichi toutes les 3 secondes.  

Le rafraichissement des répertoires se fait comme on l'a déjà vu toutes les 3 secondes et utilise une empriente md5 pour savoir si le répertoire à eu des changements (ajout, suppression ou renommage de fichier), si c'est le cas son contenu est renvoyé au client sinon le md5 est renvoyé pour que le client pour lui indiquer que le répertoire n'a pas changé.  

#### Remarque :
Un répertoire TestExt contient un ensmble de fichier vide avec tous les  types d'extensions gérées au sein de l'interface avec les icones correspondantes. 

