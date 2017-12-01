$("#label").html("Press Play!");

// Create the play button which starts the game when clicked
// Change content-view to display the play button
var playButton = $("<div>");
playButton.text("Play!")
playButton.attr("id", "play-button");
playButton.attr("class", "bg-info text-white mx-auto text-center p-4");
$("#content-view").html(playButton);

var easyButton = $("<div>");
easyButton.text("Easy");
easyButton.attr("id", "easy-button");
easyButton.attr("class", "difficulty bg-info text-white text-center p-4");
easyButton.attr("data-name", "easy");
easyButton.attr("onclick", "APIcall(this)");

var mediumButton = $("<div>");
mediumButton.text("Medium");
mediumButton.attr("id", "medium-button");
mediumButton.attr("class", "difficulty bg-info text-white text-center p-4");
mediumButton.attr("data-name", "medium");
mediumButton.attr("onclick", "APIcall(this)");

var hardButton = $("<div>");
hardButton.text("Hard");
hardButton.attr("id", "hard-button");
hardButton.attr("class", "difficulty bg-info text-white text-center p-4");
hardButton.attr("data-name", "hard");
hardButton.attr("onclick", "APIcall(this)");

// Set the onclick listener for the playButton
$("#play-button").on("click", function() {

	// Change the label to prompt user for which difficulty to play
	$("#label").html("Choose your difficulty");

	// Change the content-view to display the choices for difficulties
	$("#content-view").empty();
	$("#content-view").append(easyButton);
	$("#content-view").append(mediumButton);
	$("#content-view").append(hardButton);

});

var questions = [];
var questionIndex = 0;
var currentAnswer;
var correct = 0;
var timeout;

//prevents the clock from being sped up unnecessarily
var clockRunning = false;

var stopwatch = {

  time: 30,

  reset: function() {

    stopwatch.time = 30;
    clearTimeout(timeout);

    // DONE: Change the "display" div to "00:00."
    $("#display").text("30");
    $("#display").removeClass("text-danger animated shake infinite");
  },
  start: function() {

    // DONE: Use setInterval to start the count here and set the clock to running.
    if (!clockRunning) {
        intervalId = setInterval(stopwatch.count, 1000);
        clockRunning = true;
    }

    timeout = setTimeout(showAnswer, 1000 * 30);
  },
  stop: function() {

    // DONE: Use clearInterval to stop the count here and set the clock to not be running.
    clearInterval(intervalId);
    clockRunning = false;
  },
  count: function() {

    // DONE: increment time by 1, remember we cant use "this" here.
    stopwatch.time--;

    // DONE: Get the current time, pass that into the stopwatch.timeConverter function,
    //       and save the result in a variable.
    var converted = stopwatch.timeConverter(stopwatch.time);

    // DONE: Use the variable we just created to show the converted time in the "display" div.
    $("#display").text(converted);
    if(stopwatch.time === 10) {
    	$("#display").addClass("text-danger animated shake infinite");
    }
    $("#progress").attr("style", "width:" + Math.floor(stopwatch.time/30 * 100) + "%");
    $("#progress").attr("aria-valuenow", Math.floor(stopwatch.time/30 * 100));
  },
  timeConverter: function(t) {

    var seconds = t;

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    return seconds;
  }
};

function APIcall(button) {
	// Build the URL to query the DB
	var queryURL = "https://opentdb.com/api.php?amount=5&category=27&type=multiple&difficulty=" + $(button).attr("data-name");

	// AJAX call
	$.ajax({
		url: queryURL,
		method: "GET"
	}).done(function(response) {
		console.log(response);
		questions = response.results;
		//console.log(questions);
		showQuestion(questions[questionIndex]);
	});
}

function showAnswer() {
	stopwatch.stop();
	clearTimeout(timeout);
	var currentQuestions = $(".question");

	// Reveal the correct answer
	for(var i = 0; i < currentQuestions.length; i++) {
		if(currentQuestions[i].textContent === currentAnswer) {
			$(currentQuestions[i]).addClass("bg-success");
		}
	}

	// Remove onclick listeners to prevent user from clicking an answer
	// since the answer has been revealed
	for(var i = 0; i < currentQuestions.length; i++) {
		$(currentQuestions[i]).attr("onclick", "");
	}
	
	// Wait 3 seconds before showing next question
	timeout = setTimeout(function() {
		showQuestion(questions[questionIndex])
	}, 1000* 3);

}

function checkAnswer(obj) {
	stopwatch.stop();
	clearTimeout(timeout);
	var isCorrect = false;
	var currentQuestions = $(".question");

	// Compare the values of the div clicked and the answer
	if($(obj).text() === currentAnswer) {
		// Show that user is correct
		$(obj).addClass("bg-success");
		// Increment the counter of user's correct answers
		correct++;
	} else {
		// Show that user is wrong
		$(obj).addClass("bg-danger");
		// Reveal the answer
		for(var i = 0; i < currentQuestions.length; i++) {
			if(currentQuestions[i].textContent === currentAnswer) {
				$(currentQuestions[i]).addClass("bg-success");
			}
		}
	}

	// Remove onclick listeners to prevent user from clicking an answer
	// since the answer has been revealed
	for(var i = 0; i < currentQuestions.length; i++) {
		$(currentQuestions[i]).attr("onclick", "");
	}
	
	// Wait 3 seconds before showing next question
	timeout = setTimeout(function() {
		showQuestion(questions[questionIndex])
	}, 1000* 3);
}

function showQuestion(obj) {
	questionIndex++;
	// Once all questions have been exhausted, end the current game
	// and show the user their results
	if(questionIndex > questions.length) {
		showResults();
		return;
	}

	// Change the label to the question
	$("#label").html(obj.question);

	// Store the possible choices for answers
	var answers = shuffleAnswers(obj);
	currentAnswer = obj.correct_answer;

	// Empty the contents of content-view
	$("#content-view").empty();

	// Display a Timer
	$("#content-view").append("<p>Time Remaining</p>");
	$("#content-view").append("<div id='display' class='mb-3'>30</div>");

	// Progress bar timer
	var str = '<div class="progress mb-5">';
  	str += '<div id="progress" class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>';
	str += '</div>';
	$("#content-view").append(str);

	// Change to content-view to display the questions	
	$("#content-view").append("<div class='question py-3' onclick='checkAnswer(this)'>" + answers[0] + "</div>");
	$("#content-view").append("<div class='question py-3' onclick='checkAnswer(this)'>" + answers[1] + "</div>");
	$("#content-view").append("<div class='question py-3' onclick='checkAnswer(this)'>" + answers[2] + "</div>");
	$("#content-view").append("<div class='question py-3' onclick='checkAnswer(this)'>" + answers[3] + "</div>");

	// Start timer
	stopwatch.reset();
	stopwatch.start();
}

function restart() {
	// Change the label to prompt user for which difficulty to play
	$("#label").html("Choose your difficulty");

	// Change the content-view to display the choices for difficulties
	$("#content-view").empty();
	$("#content-view").append(easyButton);
	$("#content-view").append(mediumButton);
	$("#content-view").append(hardButton);
}

function showResults() {
	$("#label").html("Your Results");

	// Set the result message
	var msg = "You got " + correct + " out of 5 correct!";
	if(correct >= 3) {
		msg += "<br>Good job!";
	} else {
		msg += "<br>Better luck next time!";
	}
	$("#content-view").empty();
	$("#content-view").html(msg);

	// Button to start a new game
	playButton.text("Play Again");
	playButton.addClass("mt-4");
	playButton.attr("onclick", "restart()");

	// Reset the counters
	correct = 0;
	questionIndex = 0;
	clearTimeout(timeout);

	$("#content-view").append(playButton);
}

function shuffleAnswers(obj) {
	// Combines the correct answer and incorrect answers into one array
	var allAnswers = obj.incorrect_answers;
	allAnswers.push(obj.correct_answer);

	// Shuffle the array
	shuffle(allAnswers);

	// Return the shuffled array
	return allAnswers;
}

function shuffle (array) {
  var i = 0
  var j = 0
  var temp = null

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}