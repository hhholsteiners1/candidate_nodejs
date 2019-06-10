var $noteTitle = $(".note-title");
var $noteUser = $(".note-user");
var $noteText = $(".note-textarea");
var $saveNoteBtn = $(".save-note");
var $newNoteBtn = $(".new-note");
var $noteList = $(".list-container .list-group");
var $noteName = $(".note-name");
var $noteUsername = $(".note-username");
var $noteEmail = $(".note-email");
var $saveUserBtn = $(".create-user");

// Get the note data from the inputs, save it to the db and update the view
var handleNoteSave = function() {
  var newNote = {
    user:  $noteUser.val(),
    title: $noteTitle.val(),
    note: $noteText.val()
  };

  $.ajax({
    url: "/api/notes",
    data: newNote,
    method: "POST"
  }).then(function(data) {
    location.reload();
  });
};

// Delete the clicked note
var handleNoteDelete = function(event) {
  // Prevent the click listener for the list from being called when the button inside of it is clicked
  event.stopPropagation();

  var note = $(this)
    .parents(".list-group-item")
    .data();

  // Delete the note with the id of `note.id`
  // Render the active note
  $.ajax({
    url: "/api/notes/" + note.id,
    method: "DELETE"
  }).then(function() {
    location.reload();
  });
};

// Delete the clicked note
var handleCommentDelete = function(event) {
  // Prevent the click listener for the list from being called when the button inside of it is clicked
  event.stopPropagation();

  var comment = $(this)
    .parents(".list-group-comment-item")
    .data();

  // Delete the note with the id of `note.id`
  // Render the active note
  $.ajax({
    url: "/api/comments/" + comment.id,
    method: "DELETE"
  }).then(function() {
    location.reload();
  });
};

// Render the list of note titles
var renderNoteList = function(notes,comments, users) {

  //alert(users);
  $noteList.empty();

  var noteListItems = [];

  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];

    
    


    var userId = note.userId;
    var id = note.id;

   
    var user = users[userId-1];
    //alert(useName);

    var $li = $("<li class='list-group-item'>").data(note);
    var $titleDiv = $("<div>");
    var $titleSpan = $("<span class='font-weight-bold'>").text(note.title);
    var $delBtn = $(
      "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
    );

    var $userDiv = $("<div>");
    var $userSpan = $("<span class='font-weight-bold'>").text(user.name);
    var $userCloseDiv = $("</div>");

    var $noteP = $("<p class='mt-2'>").text(note.note);


   
   

   var commentsListItems = [];

   var $commentDiv = $("<div>");

   

   for(var j= 0 ; j < comments.length;j++) {
      if(comments[j].postId == id ) {
          var $cli = $("<li class='list-group-comment-item'>").data(comments[j]);
          var $name = $("<span class='font-weight-bold'>").text(comments[j].name);
          var $email = $("<span class='font-weight-bold'>").text(comments[j].email);
          var $body = $("<span class='font-weight-bold'>").text(comments[j].body);
          var $delCommentBtn = $(
            "<i class='fas fa-trash-alt float-right text-danger delete-comment'>"
           );
          $cli.append($name,[$delCommentBtn,"<br>",$email,"<br>",$body,"<br>"]);
          commentsListItems.push($cli);
      }
    }
    $commentDiv.append(commentsListItems);
    $commentDiv.on("click", ".delete-comment", handleCommentDelete);
    var $userCloseDiv = $("</div>");
    $commentDiv.append($userCloseDiv);

    $userDiv.append($userSpan, $userCloseDiv);

    $titleDiv.append($titleSpan, $delBtn);

    $li.append($userDiv,[$titleDiv, $noteP, $commentDiv]);
    noteListItems.push($li);
  }

  $noteList.append(noteListItems);
};

// Get notes from the db and render them to the sidebar
var getAndRenderNotes = function() {
  $.ajax({
    url: "/api/notes",
    method: "GET"
  }).then(function(data) {
    renderNoteList(data.notes,data.comments,data.users);
  });
};


// Get the note data from the inputs, save it to the db and update the view
var handleSaveUser = function() {
  var newUser = {
    name:  $noteName.val(),
    username: $noteUsername.val(),
    useremail: $noteEmail.val()
  };

  $.ajax({
    url: "/api/user",
    data: newUser,
    method: "POST"
  }).then(function(data) {
    location.reload();
  });
};
$saveUserBtn.on("click", handleSaveUser);


$saveNoteBtn.on("click", handleNoteSave);
$noteList.on("click", ".delete-note", handleNoteDelete);




// Gets and renders the initial list of notes
getAndRenderNotes();
