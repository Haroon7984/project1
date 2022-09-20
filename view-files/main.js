const db = require("C:/Users/LEGION/Desktop/log/database");
const userModel = require("C:/Users/LEGION/Desktop/log/database/models/users");
const todoModel = require("C:/Users/LEGION/Desktop/log/database/models/todos");

//const mongodb = require('mongodb');

//const MongoClient = mongodb.MongoClient;

//const url = "mongodb+srv://app:1234567890@cluster0.spzpu.mongodb.net/todoDb?retryWrites=true&w=majority"


//const client = new MongoClient(url);

// Database Name
//const dbName = 'myOwnToDoList';

//var dbInstance = null;

/* client.connect().then(function()
{
  console.log("db is on");
  dbInstance = client.db(dbName);
}) */

db.start()


const express = require('express')
const fs = require('fs')
const app = express();
const port = 3000




const multer  = require('multer')

const storage = multer.diskStorage({ 
  destination: function (req, file, cb) 
  {
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb)
  {
    cb(null, Date.now()+".jpg");
  }
})

var upload = multer({ storage: storage })

var session = require('express-session');

app.set('view engine', 'ejs');
app.set("views","view-files")


app.use(express.static("public"))
app.use(express.static("uploads"))

// to parse json data
app.use(express.json())

// to parse form data
app.use(express.urlencoded())

app.use(session({
  secret: 'keyboard cat',
  saveUninitialized: true,
  resave: false
}))

app.get("/", function(req, res)
{
  //autrisation

  // user is logged in
  // show home
  // else show login

  if(req.session.isLoggedIn)
  {

    readTodos(req.session.user._id, function(todos)
    {
      res.render("C:/Users/LEGION/Desktop/log/view-files/home.ejs",{ data: todos, user: req.session.user });
    })

  }
  else
  {
    res.redirect("C:/Users/LEGION/Desktop/log/public/login.html")
  }
})

app.get("/img", function(req, res)
{
  res.sendFile(__dirname+"/uploads/515cee47c6596fbde188bc2771f5a49e");
})

app.post("/signup", upload.array("profile", 10) ,function(req, res)
{
  var username = req.body.username;
  var password = req.body.password;
  var file = req.files;

 
      var user = { username:username, password:password, profilePic: file.path }

      writeUsers(user, function()
      {
        res.redirect("/")
      })
  
})


app.post("/login", function(req, res)
{
  var username =  req.body.username;
  var password = req.body.password;

  readUser(username, password, function( user)
  {
    
    
      if(user)
      {

        req.session.isLoggedIn = true;
        req.session.user = user

        res.status(200);
        res.end("login success");
      }
      else
      {
        res.status(404);
        res.end("login failed");
      }
    
  });

 

})

app.get("/logout", function(req, res)
{
  req.session.destroy();
  res.end();
})


app.post("/todo", function(req, res)
{
  
  var todo = {
    text: req.body.todo,
    createdAt: Date.now(),
    createdBy: req.session.user._id
  }

  saveTodos(todo, function()
  {
    res.redirect("/");
  })
  
})

app.post("/todo/read/:title", function(req, res)
{
  var title = req.params.title;

  updateTodo(title, function()
  {
    res.redirect("/");
  })

})


app.post("/todo/delete/:id", function(req, res)
{
  var id = req.params.id;

  deleteTodo(id, function()
  {
    res.redirect("/");
  })

})



app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})


function readUser( username, password, callback )
{

  /* const collection = dbInstance.collection('users');

  collection.find({ username: username, password: password }).toArray().then(function(users)
  {
    callback( users);
  }) */

  userModel.findOne({ username: username, password: password })
  .then(function(users)
  {
    console.log(users)
    callback(users)
  })


}


function writeUsers( user, callback )
{
  /* const userInstance = new userModel(user);

  userInstance.save(function(err)
  {
    console.log(err)

    callback();
  })  */

  userModel.create(user, function(err)
  {
    console.log(err)
    callback();
  });
  

}



function readTodos(user_id, callback)
{
  todoModel.find({ createdBy: user_id }, function(err, todos)
  {
    callback(todos);
  })
}


function saveTodos(data, callback)
{
  todoModel.create(data, function(err, todos)
  {
    callback();
  })

}

function updateTodo(title,callback)
{
  const collection = dbInstance.collection('todoList');

  collection.updateOne({ text: title }, { $set: { isRead: true } })
  .then(function()
  {
    callback();
  })
}


function deleteTodo(todo_id, callback)
{
  todoModel.deleteOne({ _id: todo_id }, function(err)
  {
    callback();
  })
}