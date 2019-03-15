const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendNotification = functions.database.ref('/temperatura').onWrite((event) => {
  // Pegue o valor atual do que foi gravado no Realtime Database.
  const temperatura = event.data.val();

  // Notification details.
  const payload = {
    notification: {
      title: 'Ta pegando fogo bicho!!!',
      body: `${temperatura}`,
      sound: 'default',
      //clickAction: 'fcm.ACTION.HELLO',
      // badge: '1'
    },
    data: {
      extra: 'extra_data',
    },
  };
// Defina a mensagem como alta prioridade e expire após 24 horas.
  const options = {
    collapseKey: 'temp',
    contentAvailable: true,
    priority: 'high',
    timeToLive: 60 * 60 * 24,
  };

  if(temperatura > 20) {
    // Envie uma mensagem para dispositivos inscritos no tópico fornecido.
    const topic = 'minhatemperaturaiot'
    return admin.messaging().sendToTopic(topic, payload, options)
      .then((response) => {
        console.log('Successfully sent message:', response);
      }); 
  }
});


