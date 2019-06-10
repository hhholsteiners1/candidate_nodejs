var express = require("express");
var path = require("path");

/*
* Initialize database
*/
var loki = require("./db/loki.js");
loki.init();


var app = express();
var PORT = 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "notes.html"));
});

app.get("/assets/js/index.js", function(req, res) {
  res.sendFile(path.join(__dirname, "/assets/js/index.js"));
});


// Get all notes 
app.get("/api/notes", function(req, res) {
    console.log("/api/notes");
    
    var db = loki.getDatabase();
    const posts = db.getCollection('posts');
    const comments = db.getCollection('comments');
    const users = db.getCollection('users');

    console.log(users.data);

    
   //console.log(posts.data);
   //console.log(comments.data);
   res.json({"notes": posts.data, "comments": comments.data, "users":users.data});

  });
  
  // Save a new notes
  app.post("/api/notes", function(req, res) {
     var db = loki.getDatabase();
     console.log(req.body.title);
     console.log(req.body.note);
    const posts = db.getCollection('posts');
    id = loki.getNextId();

    const users = db.getCollection('users');
    var resultset = users.find({"username":req.body.user});
    console.log(resultset[0].id)
    posts.insert({"userId": resultset[0].id,
    "id": id,
    "title": req.body.title,
    "note":req.body.note});
    console.log("Inserted Note");
    res.json({"userId": resultset[0].id,
    "id": id,
    "title": req.body.title,
    "note":req.body.note});
    });
  

   // Delete a note 
   app.delete("/api/notes/:noteId", function(req, res) {
    
    var db = loki.getDatabase();
    const posts = db.getCollection('posts');
    

                    console.log(req.params.noteId);
                    var resultset = posts.get(req.params.noteId);
                    console.log(resultset);

                    if (resultset) {
                        posts.remove(resultset);
                    }
                    db.saveDatabase();
                    res.json(resultset);

  });


   // Delete a comment 
   app.delete("/api/comments/:commentId", function(req, res) {
    
    var db = loki.getDatabase();
    const comments = db.getCollection('comments');
    

                    console.log(req.params.commentId);
                    var resultset = comments.get(req.params.commentId);
                    console.log(resultset);

                    if (resultset) {
                        comments.remove(resultset);
                    }
                    db.saveDatabase();
                    res.json(resultset);

  });




   // Save a new User
  app.post("/api/user", function(req, res) {
     var db = loki.getDatabase();
     console.log(req.body.name);
     console.log(req.body.username);
     console.log(req.body.useremail);
    const users = db.getCollection('users');
    id = loki.getNextUserId();
    users.insert({
    "id": id,
    "name": req.body.name,
    "username": req.body.username,
    "email": req.body.useremail,
    "address": {
      "street": "Kulas Light",
      "city": "Gwenborough",
      "zipcode": "92998-3874",
      "geo": {
        "lat": "-37.3159",
        "lng": "81.1496"
      }
    },
    "phoneNumbers": ["1-770-736-8031 x56442", "1-771-736-8032"],
    "website": "hildegard.org"
  });
    res.json({
    "id": id,
    "name": req.body.name,
    "username": req.body.username,
    "email": req.body.useremail,
    "address": {
      "street": "Kulas Light",
      "city": "Gwenborough",
      "zipcode": "92998-3874",
      "geo": {
        "lat": "-37.3159",
        "lng": "81.1496"
      }
    },
    "phoneNumbers": ["1-770-736-8031 x56442", "1-771-736-8032"],
    "website": "hildegard.org"
  });

 });
  


app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});

