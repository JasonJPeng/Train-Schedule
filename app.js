var config = {
    apiKey: "AIzaSyCj5JeMq2QuA9kkuwstHKQ20xVHVGtQqv8",
    authDomain: "timesheet-5adbc.firebaseapp.com",
    databaseURL: "https://timesheet-5adbc.firebaseio.com",
    projectId: "timesheet-5adbc",
    storageBucket: "",
    messagingSenderId: "284853915879",
    appId: "1:284853915879:web:09e07a9fd0802425"
  };
  
  firebase.initializeApp(config);
  
      // Create a variable to reference the database
  var database = firebase.database();
  

$(document).ready(function() { //  Beginning of jQuery

    console.log(database);

    $("form").submit(function(event) {
        event.preventDefault();
        
        database.ref().push({
            trainName: $("#trainName").val().trim(),
            dest: $("#dest").val().trim(),
            firstTime: $("#firstTime").val().trim(),
            freq: $("#freq").val().trim() 
        })    
    }) // End of submit

    database.ref().on("child_added", function (snapshot){
        var info = snapshot.val();
        var nowTime = new Date();
        var min = nowTime.getHours()*60 + nowTime.getMinutes();
        var arrayTime = info.firstTime.split(":");
        var min0 = parseInt(arrayTime[0]) * 60 + parseInt(arrayTime[1]);

        if (min < min0) {
            min = min +24*60;
        }
        var nextTrain = (min - min0) % info.freq;
        
        var nextTime = min + nextTrain;
        if (nextTime > 24*60) {
            nextTime -= 24*60;
        }



        
        $("#display").append($("<tr>").append(
                 $("<td>").text(info.trainName),
                 $("<td>").text(info.dest),
                 $("<td>").text(info.freq),
                 $("<td>").text(parseInt(nextTime/60) + ":" + (nextTime % 60)),
                 $("<td>").text(nextTrain)
        ) // end of tr 
        
        );  // end of id = diaply table

    
    }) // end of reading database



})