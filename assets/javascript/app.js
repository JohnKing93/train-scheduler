// Initialize Firebase
var config = {
    apiKey: "AIzaSyCgSiQdtwlCgaVo_5CgzINaYVxwWbpseSo",
    authDomain: "train-scheduler-73a27.firebaseapp.com",
    databaseURL: "https://train-scheduler-73a27.firebaseio.com",
    projectId: "train-scheduler-73a27",
    storageBucket: "train-scheduler-73a27.appspot.com",
    messagingSenderId: "172546480678"
};
firebase.initializeApp(config);

// Initial variables
var database = firebase.database();
var trainName = "";
var destination = "";
var firstTrainTime = 0;
var frequency = 0;

// Populate data from Firebase

// Handle button click
$("#add-train").on("click", function(event) {
    event.preventDefault();
    console.log(event);

    // Get inputs
    trainName = $("#input-train-name").val().trim();
    destination = $("#input-destination").val().trim();
    firstTrainTime = $("#input-first-train-time").val().trim();
    frequency = $("#input-frequency").val().trim();
    console.log(trainName);

    // Create object
    var newTrain = {
        storedTrainName: trainName,
        storedDestination: destination,
        storedFirstTrainTime: firstTrainTime,
        storedFrequency: frequency
    }
    console.log(newTrain);

    // Push to Firebase
    database.ref().push(newTrain);

    // Display sucess modal

    // Clear form
    $("#input-train-name").val("");
    $("input-destination").val("");
    $("input-first-train-time").val("");
    $("input-frequency").val("");
});

database.ref().on("child_added", function(childSnapshot) {

    // Get outputs
    trainName = childSnapshot.val().storedTrainName;
    destination = childSnapshot.val().storedDestination;
    firstTrainTime = childSnapshot.val().storedFirstTrainTime;
    frequency = childSnapshot.val().storedFrequency;

    // Calculate minutes away and next arrival
        var firstTrainTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
        var currentTime = moment();
        var difference = moment().diff(moment(firstTrainTimeConverted), "minutes");
        var remainder = difference % frequency;
        var minutesAway = frequency - remainder;
        var nextArrival = moment().add(minutesAway, "minutes");
        var nextArrivalFormatted = moment(nextArrival).format("HH:MM A");

    // Create table entry
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(nextArrivalFormatted),
        $("<td>").text(minutesAway)
    );

    $("#train-schedule-table > tbody").append(newRow);
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});