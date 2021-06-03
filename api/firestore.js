const admin = require('firebase-admin');
const serviceAccount = require('../conf/serviceAccountKey.json');
const db = admin.firestore();

async function initializeApp() {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
}
  
const getData = async () => {
    const snapshot = await db.collection('player').get();
    snapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
    });
  }


  module.exports = { getData, initializeApp};