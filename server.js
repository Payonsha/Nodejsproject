var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var http = require('http');

app.set('port', port);

//Create HTTP server
var server = http.createServer(app);

var subjects = require('./routes/subjects');
var questions = require('./routes/questions');

var configDB = require('./config/database.js');

// MONGODB connection
mongoose.connect(configDB.url, function(err){
    if(err){
        console.log(err);
    }else{
        console.log("Connected to mongodb!");
    }
});

var Dsc = require('./models/discussionsmodel.js');


var userSchema = mongoose.Schema({
    local            : {
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);

/*
// Discussion Schema
var DscSchema = mongoose.Schema({
    dsc: String,
    discussionID: String
});
*/

// Questions Schema
var QstSchema = mongoose.Schema({
    qst: String,
    questionID: String
});

// Reply Schema
var replySchema = mongoose.Schema({
    reply: String,
    questionid: String
});

// Discussion model
//var Dsc = mongoose.model('Discussion', DscSchema);


// Question model
var Qst = mongoose.model('Question', QstSchema);

// Reply model
var Reply = mongoose.model('replie', replySchema);

// Sockets
var io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket){
    
//Query discussions
Dsc.find({}, function(err, docs){
    if(err) throw err;
    console.log(docs);
        socket.emit('load old dscs', docs);
});
    
//Recieving new discussion from client
socket.on('send discussion', function(data){
    console.log("server received a discussion");
            
//Inserting in mongodb
var newDsc = new Dsc({dsc: data.dsc, discussionID: data.discussionID});
newDsc.save(function(err){
if(err) throw err;
        
//Send discussions to ALL clients
io.sockets.emit('new discussion', data);
	});
});

//Query questions
Qst.find({}, function(err, docsQuestions){
    console.log(docsQuestions);
    if(err) throw err;
    socket.emit('load old qsts', docsQuestions);
});
    
//Receiving new question from client
socket.on('send question', function(data){
    console.log("server received a question");
        
//Inserting in mongodb
var newQst = new Qst({qst: data.qst, questionID: data.questionID});
newQst.save(function(err){
if(err) throw err;
        
//Send question to ALL clients
io.sockets.emit('new question', data);
	});
});

//Recieving reply from client
socket.on('send reply', function(data){
    console.log("server received a reply");
    var questionID = data.questionid.substring(9,20);
        
//Inserting in mongodb
var newReply = new Reply({reply: data.reply, questionid: questionID});
newReply.save(function(err){
if(err) throw err;
        
//Send reply to ALL clients
io.sockets.emit('new reply', data);
	});
});
});

require('./config/passport')(passport);

app.use(morgan('dev')); 
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  	extended: true
}));
app.use(express.static(__dirname + '/public'));

app.use('/questions', questions);
app.use('/subjects', subjects);

app.set('view engine', 'ejs');
app.set('view engine', 'jade');

app.use(session({secret: 'webtech', 
  	saveUninitialized: true,
  	resave: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./routes/login')(app, passport);

server.listen(port);
console.log('Poort: ' + port);