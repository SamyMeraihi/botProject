require('dotenv').config();

var builder = require('botbuilder');
var restify = require('restify');

var server = restify.createServer();
server.listen(process.env.PORT || 3978, function() {
    console.log("Serveur démarré");
});

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});


// Listen for messages from users
server.post('/api/messages', connector.listen());


var inMemoryStorage = new builder.MemoryBotStorage();
var bot = new builder.UniversalBot(connector,[

    // 1er dialogue
    function(session) {
        session.beginDialog('greetings', session.userData.profile)
    },

    // 2ème dialogue
    function(session, results) {
        session.userData.profile = results.response;
        session.send(`Hello ${session.userData.profile.name} :) !`);
        session.beginDialog('menu', session.userData.profile)
    },

]).set('storage', inMemoryStorage);



// Création d'un dialogue "greetings"
bot.dialog('greetings', [
    // Etape 1
    function(session, args, next) {

        session.dialogData.profile = args || {};

        // Si le nom n'existe pas
        if(!session.dialogData.profile.name) {
            // On lui demande son nom
            builder.Prompts.text(session, 'Bonjour, je suis un bot RATP. Quel est votre nom ?'); 
        } else {
            next();
        }     
    },

    // Etape 2
    function(session, results) {
        if(results.response) {
            // On stocke le nom dans une variable
            session.dialogData.profile.name = results.response;
        }
        session.endDialogWithResult({ response: session.dialogData.profile });
    }
]);

const menuItems1 = {
    "A quelle heure passe le prochain bus ?": {
        item: "horaireBuS"
    },
    "Ou puis-je acheter un titre de transport ?": {
        item: "titreTransport"
    },
    "La grève va t'elle durer encore longtemps ?": {
        item: "greve"
    }
};


const menuItems2 = {
    "Oui s'il vous plait !": {
        item: "horaireBuS"
    },
    "Non merci, ça ira.": {
        item: "auRevoir"
    }
};


// Création d'un dialogue "Menu"
bot.dialog('menu', [

    // Etape 1
    function(session) {
        builder.Prompts.choice(session, 
            "Que voulez vous savoir ?",
            menuItems1,
           { listStyle: 3}
        ); 
    },

    // Etape 2
    function(session, results) {
        var choice = results.response.entity;
        session.beginDialog(menuItems1[choice].item);
    }

]);

// Création d'un dialogue "horaireBuS"
bot.dialog('horaireBuS', [
    function(session) {
        
        // On récupère la date du jour
        var currentdate = new Date(); 
        var hour = currentdate.getHours();  
        var minutes = currentdate.getMinutes(); 
        
        var reponse = "";
        
        if(hour <= 5 || hour >= 22) {
            reponse = "Il n'y a plus de bus entre 22h et 5h. Le premier bus de la journée passe à 6h05.";
        } else {
            pluriel = "";
            nextBusMinutes = 0;
            
            if(minutes <= 30) {
                nextBusMinutes = 30 - minute;
                if(nextBusMinutes != 1) {
                    pluriel = "s";
                }
            } else {
                nextBusMinutes = 60 - minutes;
                if(60 - minutes != 1) {
                    pluriel = "s";
                }
            }
            
            reponse = "Le prochain bus passe dans "+nextBusMinutes+" minute"+pluriel+".";
        }
        
        
        session.send(reponse);
    }
]);

bot.dialog('titreTransport', [
    function(session) {
        session.send('Vous pouvez acheter un titre de transport dans le bus lui-même. Toutefois, les forfaits ne sont disponibles d\'aux gichets de certaines stations. Plus d\'infos sur "www.ratp.fr".');
    }
]);


// Dialogue grève
bot.dialog('greve', [
    
    // Etape 1
    function(session) {
        builder.Prompts.choice(session, 
            "Hélas ! Cependant les bus sont moins affectés que les métros et rer. Souhaitez-vous connaitre les horaires du prochain bus ?",
            menuItems2,
           { listStyle: 3}
        ); 
    },
    
    // Etape 2
    function(session, results) {
        var choice = results.response.entity;
        session.beginDialog(menuItems2[choice].item);
    }
]);


// Dialogue auRevoir
bot.dialog('auRevoir', [
    function(session) {
        session.send(`D\'accord. Bonne journée ${session.userData.profile.name}. Nous vous souhaitons un bon voyage !`);
    }
]);