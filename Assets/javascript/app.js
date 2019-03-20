var config = {
    apiKey: "AIzaSyD6MWygF7ZuEBmqyaEBItcabu6_8JNIo8k",
    authDomain: "rps-multi-game.firebaseapp.com",
    databaseURL: "https://rps-multi-game.firebaseio.com",
    projectId: "rps-multi-game",
    storageBucket: "rps-multi-game.appspot.com",
    messagingSenderId: "595897192937"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  let player1Wins = 0;
  let player1Loses = 0;
  let player1Ties = 0;
  let player2Wins = 0;
  let player2Loses = 0;
  let player2Ties = 0;

  let player1Selection = null;
  let player2Selection = null;

  let player1Name = "";
  let player2Name = "";

  let player1Choice = "";
  let player2Choice = "";

  database.ref("/players/").on('value', function(snapshot) {
      if(snapshot.child('player1').exists()) {
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
      }

      if (snapshot.child('player2').exists()) {
          
      }
  })