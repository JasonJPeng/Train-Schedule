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



        
        $("#display").append($("<tr>").append(
                 $("<td>").text(info.trainName),
                 $("<td>").text(info.dest),
                 $("<td>").text(info.freq),
                 $("<td>").text(parseInt(nextTime/60) + ":" + (nextTime % 60).toString().padStart(2, "0")),
                 $("<td>").text(nextTrain)
        ) // end of tr 
        
        );  // end of id = diaply table

    
    }) // end of reading database



})