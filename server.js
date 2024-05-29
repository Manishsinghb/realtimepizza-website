require('dotenv').config()
const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash');
const MongoDBStore = require('connect-mongo')
const passport = require('passport')
const Emitter = require('events')
//database connection


const url = 'mongodb://127.0.0.1:27017/pizza';
mongoose.connect(url, {
  useNewUrlParser: true,
 
  useUnifiedTopology: true

});

const connection = mongoose.connection;

// Event listener for successful connection
connection.once('open', () => {
  console.log('Database connected...');
});



// Event listener for connection errors
connection.on('error', (err) => {
  console.error('Connection failed:', err.message);
});



//session store
//let mongoStore = new MongoStore({
  //mongooseConnection:connection,
  //collection:'sessions'
//})
//event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter',eventEmitter)
//session config
app.use(session({
  secret:process.env.COOKIE_SECRET,
  resave:false,
  store:MongoDBStore.create({
    mongoUrl:'mongodb://127.0.0.1:27017/pizza'
  }),
  saveUninitialized:false,
  cookie:{maxAge:1000 * 60 * 60 *24}
}))
//passport config
const passportInit = require('./app/config/passport')
passportInit()
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
//Assets
app.use(express.static('public'))
app.use(express.urlencoded({extended:false}))
app.use(express.json())

// Global middleware
app.use((req,res,next) =>{
  res.locals.session = req.session
  res.locals.user = req.user
  next()
})

// set template engine
app.use(expressLayouts);



app.set('views', path.join(__dirname, '/resources/views'));

app.set('view engine', 'ejs');
require('./routes/web.js')(app);
const server = app.listen(PORT, () => {
               console.log(`listening on port ${PORT}`);
});

//socket.io
const io = require('socket.io')(server)
io.on('connection',(socket)=>{
  // join 
  console.log(socket.id)
  socket.on('join',(orderId)=>{
    
    socket.join(orderId)
  })
})

eventEmitter.on('orderUpdated',(data)=>{
   io.to(`order_${data.id}`).emit('orderUpdated',data)
})
eventEmitter.on('orderPlaced',(data) =>{
  io.to('adminRoom').emit('orderPlaced',data)
})
