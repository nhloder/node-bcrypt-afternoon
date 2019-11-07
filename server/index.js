require('dotenv').config();
const express = require('express');
const massive = require('massive');
const session = require('express-session');
const authCtrl = require('./controllers/authController.js');
const trCtrl = require('./controllers/treasureController.js');
const auth = require('./middleware/authMiddleware');
const PORT = 4000
const { SESSION_SECRET, CONNECTION_STRING} = process.env;

const app = express()

// TOP LEVEL MIDDLEWARE
app.use(express.json())

app.use(session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false
}))

massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
})
// ENDPOINTS \\
app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);

app.get('/api/treasure/dragon', trCtrl.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly, trCtrl.getUserTreasure);
app.post('/api/treasure/user', auth.usersOnly, trCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, trCtrl.getAllTreasure)


app.listen(PORT, () => console.log(`${PORT} STAND READY.`))