Pour travailler sur le cours de ChatBot :

Un bot est un webservice ! 

On va utiliser :
- Node.js
- BotFramework
- Visual Studio Code

On va créer un petit bot simple pour voir à quoi ça ressemble :

Ouvrir GitBash dans le dossier de notre projet
npm init (pour démarrer un projet node.js)
code (pour ouvrir le dossier avec Visual Studio Code)

Dans Visual Studio Code :
- Menu "Afficher" => "Terminal Integré" (pour ouvrir un terminal intégré dans l'IDE !)
npm install botbuilder --save (pour installer la librairie BotBuilder)
npm install restify --save (pour installer Restify)
npm install nodemon --save (pour pas avoir à couper/relancer le process restify à chaque modification du fichier :/...)
Créer un fichier "app.js" dans la racine du projet, au meme niveau que "package.json"
On écrit dans le fichier "app.js" : 

node app.js (pour lancer le fichier)
On doit avoir "ChatConnector: message received"
Ouvrir Bot Framework Emulator et cliquez sur connecter et le 1er lien puis valider
Parler au bot et observer la réponse.
