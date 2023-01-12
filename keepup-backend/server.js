require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static('public'))
app.use(express.json());
app.use(cors());

// Database configurations
DATABASE_URL = /*process.env.DATABASE_URL ||*/ 'mongodb+srv://keepup:shrikrishnagovind@keepup.8ayoexy.mongodb.net/KeepUp?retryWrites=true&w=majority';
mongoose.set("strictQuery", false);
mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connection successful"))
.catch(console.log)

// importing route functions
const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');
const NotesRouter = require('./routes/notes');
const UserRouter = require('./routes/getUser');

// different routes
app.get('/', (req, res) => res.send("Welcome to KeepUp API"));
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/user', UserRouter);
app.use('/note', NotesRouter);

app.listen(PORT, console.log(`listening on http://127.0.0.1:${PORT}`));