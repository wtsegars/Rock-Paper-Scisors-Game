// Initialize Firebase
var config = {
    apiKey: "AIzaSyDETOOYGjmnF--QUGkzFfd6fR9EJsyESFQ",
    authDomain: "rps-game-1d5f9.firebaseapp.com",
    databaseURL: "https://rps-game-1d5f9.firebaseio.com",
    projectId: "rps-game-1d5f9",
    storageBucket: "rps-game-1d5f9.appspot.com",
    messagingSenderId: "304015985227"
};
firebase.initializeApp(config);

var database = firebase.database();

let player1Wins = 0;
let player1Loses = 0;
let player1Ties = 0;
let player2Wins = 0;
let player2Loses = 0;
let player2Ties = 0;

let player1 = null;
let player2 = null;

let player1Name = "";
let player2Name = "";

let player1Choice = "";
let player2Choice = "";
let yourPlayerName = "";
let turn = 1;

database.ref("/players/").on('value', function (snapshot) {
    if (snapshot.child('player1').exists()) {
        player1 = snapshot.val().player1;
        player1Name = player1.name;

        $('#playerOneName').text(player1Name);
        $('#player1Stats').html("Wins: " + player1Wins + "Loses: " + player1Loses + "Ties: " + player1Ties);
    }
    else {
        player1 = null;
        player1Name = "";

        $("#playerOneName").text("Waiting for Player 1...");
        $("#waitingNotice").html("");
        $("#player1Stats").html("Win: 0, Loss: 0, Tie: 0");
        database.ref('/outcome/').remove();
    }

    if (snapshot.child('player2').exists()) {
        player2 = snapshot.val().player2;
        player2Name = player2.name;

        $("#playerTwoName").text(player2Name);
        $("#player2Stats").html("Wins: " + player2Wins + "Loses: " + player2Loses + "Ties: " + player2Ties);
    }
    else {
        player2 = null;
        playerName = "";

        $("#playerTwoName").text("Waiting for Player 2...");
        $("#waitingNotice").html('');
        $("#player2Stats").html("Win: 0, Loss: 0, Tie: 0");
    }

    if (player1 && player2) {
        $("#playerPanel1").addClass("playerPanelTurn");
        $("#waitingNotice").html("Waiting for " + player1Name + "to choose.")
    }

    if (!player1 && !player2) {
        database.ref("/chat/").remove();
        database.ref("/turn/").remove();
        database.ref("/outcome/").remove();

        $("#chatDisplay").empty();
        $("#playerPanel1").removeClass("playerPanelTurn");
        $("#playerPanel2").removeClass("playerPanelTurn");
        $("#roundOutcome").html("Rock-Paper-Scissors");
        $("#waitingNotice").html("");
    }
});

database.ref("/players/").on("child_removed", function (snapshot) {
    var message = snapshot.val().name + "has left the game.";
    console.log(message);
    var chatKey = database.ref().child("/chat/").push().key;

    database.ref("/chat/" + chatKey).set(message);
});

database.ref("/chat/").on("child_added", function (snapshot) {
    var chatMessage = snapshot.val();
    var chatEntry = $("<div>").html(chatMessage);

    if (chatMessage.includes("disconnected")) {
        chatEntry.addClass("chatColorDisconnected");
    }
    else if (chatMessage.includes("joined")) {
        chatEntry.addClass("chatColorJoined");
    }
    else if (chatMessage.startsWith(yourPlayerName)) {
        chatEntry.addClass("chatColor1");
    }
    else {
        chatEntry.addClass("chatColor2");
    }
    $("#chatDisplay").append(chatEntry);
    $("#chatDisplay").scrollTop($("#chatDisplay")[0].scrollHeight);
});

database.ref("/turn/").on("value", function (snapshot) {
    if (snapshot.val() === 1) {
        turn = 1;

        if (player1 && player2) {
            $("#playerPanel1").addClass("playerPannelTurn");
            $("#playerPanel2").removeClass("playerPannelTurn");
            $("#waitingNotice").html("Waiting on " + player1Name + "to choose.");
        }
    }
    else if (snapshot.val() === 2) {
        turn = 2;

        if (player1 && player2) {
            $("#playerPanel1").removeClass("playerPanelTurn");
            $("#playerPanel2").addClass("playerPanelTurn");
            $("#waitingNotice").html("Waiting on " + player2Name + "to choose.");
        }
    }
});

database.ref("/outcome/").on("value", function (snapshot) {
    $("#roundOutsome").html(snapshot.val());
});

$("#add-name").on("click", function (event) {
    event.preventDefault();
    // console.log($("#name-input").val())
    if (($("#name-input").val() !== "") && !(player1 && player2)) {
        if (player1 === null) {
            yourPlayerName = $("#name-input").val();
            console.log(yourPlayerName)
            player1 = {
                name: yourPlayerName,
                win: 0,
                loss: 0,
                tie: 0,
                choice: ""
            };
            console.log(database.ref().child("/players/player1"))
            database.ref().child("/players/player1").set(player1);


            database.ref().child("/turn").set(1);

            database.ref().child("/players/player2").onDisconnect().remove();
        }
        else if ((player1 !== null) && (player2 === null)) {
            yourPlayerName = $("#name-input").val().trim();
            player2 = {
                name: yourPlayerName,
                win: 0,
                loss: 0,
                tie: 0,
                choice: ""
            };

            database.ref().child("/players/player2").set(player2);

            database.ref("/player/player2").onDisconnect().remove();
        }

        var msg = yourPlayerName + " has joined the game.";

        var chatKey = database.ref().child("/chat/").push().key;

        database.ref("/chat/" + chatKey).set(msg);

        $("#name-input").val("");
    }
});

$("#chat-send").on("click", function (event) {
    event.preventDefault();

    if ((yourPlayerName !== "") && ($("#chat-input").val().trim() !== "")) {
        var msg = yourPlayerName + ": " + $("#chat-input").val().trim();
        $("#chat-input").val("");

        var chatKey = database.ref().child("/child/").push().key;

        database.ref("/chat/" + chatKey).set(msg);
    }
});

$(".p1Option").on("click", function (event) {

    database.ref('players').once('value', function (sShot) {
        console.log(sShot.val())
        const player1 = sShot.val().player1
        const player2 = sShot.val().player2


        event.preventDefault();
        if (player1 && player2 && (yourPlayerName === player1.name) && (turn === 2)) {
            var choice = $(this).text().trim();
            console.log(choice)
            player1Choice = choice;
            database.ref().child("/players/player1/choice").set(choice);

            turn = 2;
            database.ref().child("/turn").set(2);
        }
    })
});

$(".p2Option").on("click", function (event) {
    event.preventDefault();
    if (player1 && player2 && (yourPlayerName === player2.name) && (turn === 2)) {
        var choice = $(this).text().trim();
        console.log(choice)
        player2Choice = choice;
        database.ref().child("/players/player2/choice").set(choice);

        vlsCompare();
    }
});

function vlsCompare() {
    if (player1.choice === "Volcano") {
        if (player2.choice === "Volcano") {
            database.ref().child("/outcome/").set("Tie.");
            database.ref().child("/players/player1/tie").set(player1.tie + 1);
            database.ref().child("/players/player2/tie").set(player2.tie + 1);
        }
        else if (player2.choice === "Lizard") {
            database.ref().child("/outcome/").set("Lizard beats volcano!");
            database.ref().child("/players/player1/loss").set(player1.loss + 1);
            database.ref().child("/players/player2/win").set(player2.win + 1);
        }
        else {
            database.ref().child("/outcome/").set("Volcano beats Spock!");
            database.ref().child("/players/player1/win").set(player1.win + 1);
            database.ref().child("/players/player2/loss").set(player2.loss + 1);
        }
    }
    else if (player1.choice === "Lizard") {
        if (player2.choice === "Volcano") {
            database.ref().child("/outcome/").set("Lizard beats volcano!");
            database.ref().child("/players/player1/win").set(player1.win + 1);
            database.ref().child("/players/player2/loss").set(player2.loss + 1);
        }
        else if (player2.choice === "Lizard") {
            database.ref().child("/outcome/").set("Tie.");
            database.ref().child("/players/player1/tie").set(player1.tie + 1);
            database.ref().child("/players/player2/tie").set(player2.tie + 1);
        }
        else {
            database.ref().child("/outcome/").set("Spock beats lizard!");
            database.ref().child("/players/player1/loss").set(player1.loss + 1);
            database.ref().child("/players/player2/win").set(player2.win + 1);
        }
    }
    else if (player1.choice === "Spock") {
        if (player2.choice === "Volcano") {
            database.ref().child("/outcome/").set("Volcano beats Spock!");
            database.ref().child("/players/player1/loss").set(player1.loss + 1);
            database.ref().chilf("/players/player2/win").set(player2.win + 1);
        }
        else if (player2.choice === "Lizard") {
            database.ref().child("/outcome/").set("Spock beats lizard!");
            database.ref().child("/players/player1/win").set(player1.win + 1);
            database.ref().child("/players/player2/loss").set(player2.loss + 1);
        }
        else {
            database.ref().child("/outcome/").set("Tie.");
            database.ref().child("/players/player1/tie").set(player1.tie + 1);
            database.ref().child("/players/player2/tie").set(player2.tie + 1);
        }
    }

    turn = 1;
    database.ref().child("/turn").set(1);
}