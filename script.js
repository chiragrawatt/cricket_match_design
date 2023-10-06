var CricketPlayer = /** @class */ (function () {
    function CricketPlayer() {
        this.score = [];
        this.totalScore = 0;
    }
    CricketPlayer.prototype.hit = function () {
        var runs = Math.floor(Math.random() * 7);
        this.score.push(runs);
        this.totalScore += runs;
        return runs;
    };
    return CricketPlayer;
}());
var CricketTeam = /** @class */ (function () {
    function CricketTeam() {
        this.players = [];
        for (var i = 0; i < 10; i++) {
            this.players.push(new CricketPlayer());
        }
        this.activePlayer = 0;
        this.teamScore = 0;
    }
    CricketTeam.prototype.highestScorer = function () {
        var idx = 0;
        for (var i = 1; i < 10; i++) {
            if (this.players[i].totalScore > this.players[idx].totalScore) {
                idx = i;
            }
        }
        return idx;
    };
    CricketTeam.prototype.nextPlayer = function () {
        this.activePlayer++;
        return this.activePlayer < 10;
    };
    CricketTeam.prototype.playBall = function () {
        if (this.isAllOut()) {
            return 0;
        }
        var runs = this.players[this.activePlayer].hit();
        this.teamScore += runs;
        return runs;
    };
    CricketTeam.prototype.isAllOut = function () {
        return this.activePlayer > 9;
    };
    return CricketTeam;
}());
//Function to create table rows using DOM
function createTable(tableId) {
    var table = document.getElementById(tableId);
    for (var i = 0; i < 10; i++) {
        var row_1 = document.createElement('tr');
        row_1.setAttribute("id", i.toString());
        var player = document.createElement('th');
        player.innerHTML = "PLAYER" + (i + 1);
        row_1.appendChild(player);
        for (var j = 0; j < 7; j++) {
            var scoreCell = document.createElement('td');
            scoreCell.setAttribute("id", j.toString());
            row_1.appendChild(scoreCell);
        }
        table === null || table === void 0 ? void 0 : table.appendChild(row_1);
    }
}
//Function to refresh table
function refreshTable(table) {
    for (var i = 0; i < table.length; i++) {
        for (var j = 0; j < table[i].length; j++) {
            table[i][j].innerHTML = "";
        }
    }
}
//Function to fetch table cells using DOM
function getTableMatrix(tableId) {
    var table = [];
    var rows = document.querySelectorAll("#".concat(tableId, " tr"));
    for (var i = 0; i < rows.length; i++) {
        var cols = rows[i].querySelectorAll("td");
        table.push(cols);
    }
    return table;
}
createTable("team1-table");
createTable("team2-table");
function getResult() {
    var winnerTeam = team1.teamScore > team2.teamScore ? "TEAM 1" : "TEAM 2";
    var manOfTheMatch = team1.players[team1.highestScorer()].totalScore > team2.players[team2.highestScorer()].totalScore ? "PLAYER ".concat((team1.highestScorer() + 1), " TEAM 1") : "PLAYER ".concat((team2.highestScorer() + 1), " TEAM 2");
    var runDifference = Math.abs(team1.teamScore - team2.teamScore);
    return { winnerTeam: winnerTeam, manOfTheMatch: manOfTheMatch, runDifference: runDifference };
}
function disableElement(el) {
    el.setAttribute("disabled", "");
}
function enableElement(el) {
    el.removeAttribute("disabled");
}
function hideElement(el) {
    el === null || el === void 0 ? void 0 : el.style.display = "none";
}
function showElement(el) {
    el === null || el === void 0 ? void 0 : el.style.display = "contents";
}
var team1;
var team2;
var innings;
var row;
var col;
var sec;
var timer;
//Initialzing elements using DOM
var table1 = getTableMatrix("team1-table");
var table2 = getTableMatrix("team2-table");
var teamOneScore = document.getElementById("team1-score");
var teamTwoScore = document.getElementById("team2-score");
var hitButton1 = document.getElementById("hit1");
var hitButton2 = document.getElementById("hit2");
var startButton = document.getElementById("start");
var resultButton = document.getElementById("result");
var teamResult = document.getElementById("winner-display");
var motmResult = document.getElementById("motm-display");
var timeDisplay = document.getElementById("timer");
function startCountDown() {
    timer = setInterval(function () {
        sec--;
        timeDisplay === null || timeDisplay === void 0 ? void 0 : timeDisplay.innerHTML = sec.toString();
        if (sec == 0) {
            endInnings();
        }
    }, 1000);
}
function setTimer() {
    sec = 60;
    timeDisplay === null || timeDisplay === void 0 ? void 0 : timeDisplay.innerHTML = sec.toString();
    clearInterval(timer);
    startCountDown();
}
function resetButtons() {
    disableElement(hitButton1);
    disableElement(hitButton2);
    disableElement(resultButton);
    startButton === null || startButton === void 0 ? void 0 : startButton.textContent = "START";
    enableElement(startButton);
}
function resetGame() {
    refreshTable(table1);
    refreshTable(table2);
    teamOneScore === null || teamOneScore === void 0 ? void 0 : teamOneScore.innerHTML = "0";
    teamTwoScore === null || teamTwoScore === void 0 ? void 0 : teamTwoScore.innerHTML = "0";
    teamResult.innerHTML = "";
    motmResult.innerHTML = "";
    resetButtons();
    team1 = new CricketTeam();
    team2 = new CricketTeam();
    innings = 1;
}
function startGame() {
    resetGame();
    startInnings();
}
function startInnings() {
    row = 0;
    col = 0;
    setTimer();
    disableElement(startButton);
    if (innings == 1) {
        enableElement(hitButton1);
    }
    else if (innings == 2) {
        enableElement(hitButton2);
    }
    else {
        startGame();
    }
}
function endInnings() {
    resetButtons();
    clearInterval(timer);
    innings++;
    if (innings == 3) {
        enableElement(resultButton);
        startButton === null || startButton === void 0 ? void 0 : startButton.textContent = "RESTART";
    }
}
function playBall(team, table, scoreBoard) {
    var run = team.playBall();
    scoreBoard === null || scoreBoard === void 0 ? void 0 : scoreBoard.innerHTML = team.teamScore;
    if (run === 0) {
        table[row][col].innerHTML = "W";
    }
    else {
        table[row][col].innerHTML = run.toString();
    }
    table[row][table[row].length - 1].innerHTML = team.players[team.activePlayer].totalScore.toString();
    col++;
    if (run === 0 || col === 6) {
        row++;
        col = 0;
        if (!team.nextPlayer()) {
            endInnings();
        }
    }
}
function startButtonListener() {
    disableElement(startButton);
    startInnings();
}
function hitOneListener() {
    playBall(team1, table1, teamOneScore);
}
function hitTwoListener() {
    playBall(team2, table2, teamTwoScore);
}
function generateResult() {
    var result = getResult();
    teamResult === null || teamResult === void 0 ? void 0 : teamResult.innerHTML = "".concat(result.winnerTeam, " won by ").concat(result.runDifference, " runs");
    motmResult === null || motmResult === void 0 ? void 0 : motmResult.innerHTML = "Man of the match is ".concat(result.manOfTheMatch);
}
resetButtons();
