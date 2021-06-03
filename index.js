require('dotenv').config()
const admin = require('firebase-admin');
const firebase = require('firebase')
const serviceAccount = require('./conf/serviceAccountKey.json');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.APP_PORT;
var cons = require("consolidate")
var cookieParser = require('cookie-parser')
app.use(cookieParser())

app.engine("html", cons.swig)
app.set("view engine", "html")
app.set("views", "views")
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://turameldorf-ff5d9.firebaseapp.com"
  });
  
  const db = admin.firestore();
  const getData = async () => {
    const snapshot = await db.collection('player').orderBy('name').get();
    return snapshot.docs.map(doc => doc.data());
  }


  app.get("/liste", async (req, res) => {
    var cookie = req.cookies.loggedIn;
  if (cookie === undefined) {
    res.redirect("/");
  } else {
  const users = await getData();
   res.render("list", { data: users})
  }})

  app.get("/", async (req, res) => {
     res.render("login")
    })

  app.post("/login", (req, res) => {
    if(req.body.password == "handball" || req.body.password == "Handball") {
    let options = {
      maxAge: 1000 * 60 * 15, // would expire after 15 minutes
      httpOnly: true, // The cookie only accessible by the web server
  };
  res.cookie('loggedIn', '1', options) 
  res.redirect("/liste");
} else {
  res.redirect("/");
}
  });
  


  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
