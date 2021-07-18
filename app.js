const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const path=require('path');
var session=require('express-session');
const flash=require('connect-flash');
const cookieParser=require('cookie-parser');

const app = express();
const url="mongodb+srv://akhila:w76HsipHYG6q1qah@cluster0.ii9if.mongodb.net/instaclone"



mongoose.connect(url, {useNewUrlParser: true,useUnifiedTopology: true})
mongoose.connection.on('connected',()=>{console.log("connected to mongodb")});
mongoose.connection.on('error',(err)=>{console.log("error",err)});

mongoose.set('useFindAndModify', false);

app.use(express.json());
app.use(session({
    secret:'secret',
    cookie:{maxAge:60000},
    resave:false,
    saveUninitialized:false
}))
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(flash())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());



app.use(express.static(path.join(__dirname,'public/css')));
app.use(express.static(path.join(__dirname,'public/js')));
app.use(express.static(path.join(__dirname,'public/photos')));
app.use(express.static(path.join(__dirname,'public/css/profile.css')));


require('./models/user');
require('./models/post');
require('./models/conversation');
require('./models/message');
app.use(require('./routes/auth'));
app.use(require('./routes/user'));
app.use(require('./routes/post'));
app.use(require('./routes/message'));
app.use(require('./routes/conversation'));






port=process.env.PORT ||7000

server=app.listen(port);


const io = require("socket.io")(server)

//listen on every connection
io.on('connection', (socket) => {
	console.log('New user connected')})

	
