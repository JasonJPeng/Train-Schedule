// var config = {
//     apiKey: "AIzaSyCj5JeMq2QuA9kkuwstHKQ20xVHVGtQqv8",
//     authDomain: "timesheet-5adbc.firebaseapp.com",
//     databaseURL: "https://timesheet-5adbc.firebaseio.com",
//     projectId: "timesheet-5adbc",
//     storageBucket: "",
//     messagingSenderId: "284853915879",
//     appId: "1:284853915879:web:09e07a9fd0802425"
//   };
  

  var config = {
    apiKey: "AIzaSyBBparPPy4hPHCO4ZcSTtmOdr_YEa4hWQY",
    authDomain: "scheduler-d71bb.firebaseapp.com",
    databaseURL: "https://scheduler-d71bb.firebaseio.com",
    projectId: "scheduler-d71bb",
    storageBucket: "",
    messagingSenderId: "336509679287",
    appId: "1:336509679287:web:cd6a7878e66e790f"
  };

  firebase.initializeApp(config);
  
      // Create a variable to reference the database
  var database = firebase.database();
  
function clearSubmit () {
    $("#dest").val("");
    $("#trainName").val("");
    $("#freq").val("");
    $("#firstTime").val("");

    $("#go").attr("firebase-key", "");
    $("#go").val("Add a Schedule")  ;    

    $(".infoRow").css("animation-name", "").css("background-color", "");
}


$(document).ready(function() { //  Beginning of jQuery

    console.log(database);
    clearSubmit();

    // **** click a submit button***
    //
    
 
    // $("#go").on("click", function(event) {
    $(document).submit("#go", function(event) {
    //  $(document).on("submit", "#go", function(event){    
        event.preventDefault();

        var fKey = $("#go").attr("firebase-key");
        console.log("key=>", fKey);
        if (fKey !== "") {  // Update function  
           // delete the key and reset the button
           
        //    $("#go").attr("firebase-key", "");
        //    $("#go").val("Add a Schedule")  ;    
           database.ref().child(fKey).remove();           
           $(`#${fKey}`).empty();            
        }
        
        database.ref().push({
            trainName: $("#trainName").val().trim(),
            dest: $("#dest").val().trim(),
            firstTime: $("#firstTime").val().trim(),
            freq: $("#freq").val().trim() 
        })    
        location.reload();
        clearSubmit();
    }) // End of submit

  // clear the form  
  $("#clear").on("click", function () {
      clearSubmit();
  })

  // click to delete the schedule
    $(document).on("click", ".icon-img", function () {    
    
       var keyValue = $(this).attr("firebase-key");
       console.log(keyValue);
       database.ref().child(keyValue).remove();

    //    remove the row 
       $(`#${keyValue}`).empty();
    })  

    // Update a schedule 
    $(document).on("click", ".icon-img-update", function () {
        var keyValue = $(this).attr("firebase-key");
        $("#trainName").val($(this).attr("firebase-trainName"));
        $("#dest").val($(this).attr("firebase-dest"));
        $("#freq").val($(this).attr("firebase-freq"));
        $(".infoRow").css("animation-name", "").css("background-color", "");
        $(`#${keyValue}`).css("animation-name", "blinker")
                         .css("background-color", "blanchedalmond");
        $("#firstTime").val($(this).attr("firebase-firstTime"));
        $("#go").attr("firebase-key", keyValue);
        $("#go").val("Update This Schedule");     
    })

    // database.ref().on("child_added", function (snapshot){
    database.ref().orderByChild("dest").on("child_added", function (snapshot){
        console.log("===>" , snapshot.key);
        var info = snapshot.val();
        var nowTime = new Date();
        //1.  min as current time in min.
        var min = nowTime.getHours()*60 + nowTime.getMinutes();

        // 2. min0 starting time of the train
        var arrayTime = info.firstTime.split(":");
        var min0 = parseInt(arrayTime[0]) * 60 + parseInt(arrayTime[1]);

        if (min < min0) {
            min = min +24*60;
        }

        //3. difference bewteen min min0  =>  nextTrain in min.
        var nextTrain = info.freq - (  (min - min0) % info.freq) ;
        
        //4 min + nextTime  makes suer not greater than 24*60
        var nextTime = min + nextTrain;
        if (nextTime > 24*60) {
            nextTime -= 24*60;
        }
// add fireBase Key to image firebase-key
        var img = $('<img class="icon-img">').attr("src", "images/trash.png");
        img.attr("firebase-key", snapshot.key);
        
// also save the starting time -- firstTime in firebase-time
        var imgUpdate = $('<img class="icon-img-update">').attr("src", "images/update.png");
        imgUpdate.attr("firebase-key", snapshot.key);
        imgUpdate.attr("firebase-dest", info.dest);
        imgUpdate.attr("firebase-freq", info.freq);
        imgUpdate.attr("firebase-trainName", info.trainName);
        imgUpdate.attr("firebase-firstTime", info.firstTime);

        
        var newRow = $("<tr>").append(
                 $("<td>").text(info.trainName),
                 $("<td>").text(info.dest),
                 $("<td>").text(info.freq),
                 $("<td>").text(parseInt(nextTime/60).toString().padStart(2, "0") + ":" + 
                                (nextTime % 60).toString().padStart(2, "0")),
                 $("<td>").text(nextTrain),
                 $("<td>").append(imgUpdate, img)
        ) // end of tr        
        
        // use database key as ID
        newRow.attr("id", snapshot.key);
        newRow.addClass("infoRow");
        

        $("#display").append(newRow);
    
    }) // end of reading database



})