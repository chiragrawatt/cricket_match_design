class CricketPlayer {
    score: Array<number>;
    totalScore: number;

    constructor() {
        this.score = [];
        this.totalScore = 0;
    }

    hit() : number {
        let runs =  Math.floor(Math.random() * 7);
        this.score.push(runs);
        this.totalScore += runs;
        return runs;
    }
}

class CricketTeam {
    players : Array<CricketPlayer>;
    activePlayer: number;
    teamScore: number;

    constructor() {
        this.players = [];
        for(let i=0; i<10; i++) {
            this.players.push(new CricketPlayer());
        }
        this.activePlayer = 0;
        this.teamScore = 0;
    }

    highestScorer() : number {
        let idx = 0;
        for(let i=1; i<10; i++) {
            if(this.players[i].totalScore > this.players[idx].totalScore) {
                idx = i;
            }
        }
        return idx;
    }

    nextPlayer() : boolean {
        this.activePlayer++;
        return this.activePlayer < 10;
    }

    playBall() : number {
        if(this.isAllOut()) {
            return 0;
        }

        let runs =  this.players[this.activePlayer].hit();
        this.teamScore += runs;
        return runs;
    }

    isAllOut() : boolean {
        return this.activePlayer > 9;
    }
}

//Function to create table rows using DOM
function createTable(tableId: string) {
    let table = document.getElementById(tableId);

    for (let i = 0; i < 10; i++) {
        let row = document.createElement('tr');
        row.setAttribute("id", i.toString());
        let player = document.createElement('th');
        player.innerHTML = "PLAYER" + (i + 1);
        row.appendChild(player);

        for (let j = 0; j < 7; j++) {
            let scoreCell = document.createElement('td');
            scoreCell.setAttribute("id", j.toString());
            row.appendChild(scoreCell);
        }
        table?.appendChild(row);
    }
}

//Function to refresh table
function refreshTable(table: Array<NodeList>) {
    for(let i=0; i<table.length;i++) {
        for(let j=0; j<table[i].length; j++) {
            (table[i][j] as HTMLElement).innerHTML = "";
        }
    }
}

//Function to fetch table cells using DOM
function getTableMatrix(tableId) : Array<NodeList> {
    let table : Array<NodeList> = [];
    let rows = document.querySelectorAll(`#${tableId} tr`);

    for(let i=0; i<rows.length; i++) {
        let cols = rows[i].querySelectorAll("td");
        table.push(cols);
    }

    return table
}

createTable("team1-table")
createTable("team2-table")

function getResult() {
    let winnerTeam : string = team1.teamScore > team2.teamScore ? "TEAM 1" : "TEAM 2";
    let manOfTheMatch : string = team1.players[team1.highestScorer()].totalScore > team2.players[team2.highestScorer()].totalScore ? `PLAYER ${(team1.highestScorer()+1)} TEAM 1` : `PLAYER ${(team2.highestScorer()+1)} TEAM 2`;
    let runDifference : number = Math.abs(team1.teamScore - team2.teamScore);

    return {winnerTeam, manOfTheMatch, runDifference};
}

function disableElement(el: HTMLElement) {
    el.setAttribute("disabled", "");
}

function enableElement(el: HTMLElement) {
    el.removeAttribute("disabled");
}

function hideElement(el: HTMLElement) {
    el.style.display = "none";
}

function showElement(el: HTMLElement) {
    el.style.display = "contents";
}


let team1 : CricketTeam;
let team2 : CricketTeam;
let innings : number;
let row: number;
let col: number;
let sec : number;
let timer : number;

//Initialzing elements using DOM
const table1 : Array<NodeList> = getTableMatrix("team1-table");
const table2 : Array<NodeList> = getTableMatrix("team2-table");
const teamOneScore : HTMLHeadingElement = document.getElementById("team1-score") as HTMLHeadingElement;
const teamTwoScore : HTMLHeadingElement = document.getElementById("team2-score") as HTMLHeadingElement;
const hitButton1 : HTMLButtonElement = document.getElementById("hit1") as HTMLButtonElement;
const hitButton2 : HTMLButtonElement = document.getElementById("hit2") as HTMLButtonElement;
const startButton : HTMLButtonElement = document.getElementById("start") as HTMLButtonElement;
const resultButton : HTMLButtonElement = document.getElementById("result") as HTMLButtonElement;
const teamResult : HTMLHeadingElement = document.getElementById("winner-display") as HTMLHeadingElement;
const motmResult : HTMLHeadingElement = document.getElementById("motm-display") as HTMLHeadingElement;
const timeDisplay : HTMLHeadingElement = document.getElementById("timer") as HTMLHeadingElement;

function startCountDown() {
    timer = setInterval(() => {
        sec--;
        timeDisplay.innerHTML = sec.toString();
        if(sec==0) {
            endInnings();
        }
    }
    , 1000)
}

function setTimer() {
    sec = 60;
    timeDisplay.innerHTML = sec.toString();
    clearInterval(timer);
    startCountDown();
}



function resetButtons() {
    disableElement(hitButton1);
    disableElement(hitButton2);
    disableElement(resultButton);
    startButton.textContent = "START";
    enableElement(startButton)
}

function resetGame() {
    refreshTable(table1);
    refreshTable(table2);
    teamOneScore.innerHTML = "0";
    teamTwoScore.innerHTML = "0";
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
    row=0;
    col=0;
    setTimer();
    disableElement(startButton);
    if(innings==1) {
        enableElement(hitButton1);
    } else if(innings==2) {
        enableElement(hitButton2);
    } else {
        startGame();
    }
}

function endInnings() {
    resetButtons();
    clearInterval(timer);
    innings++;
    if(innings==3) {
        enableElement(resultButton);
        startButton.textContent = "RESTART";
    }
}

function playBall(team: CricketTeam, table: Array<NodeList>, scoreBoard: HTMLElement) {
    let run = team.playBall();

    scoreBoard.innerHTML = team.teamScore.toString();

    if(run === 0) {
        (table[row][col] as HTMLElement).innerHTML = "W";
    } else {
        (table[row][col]  as HTMLElement).innerHTML = run.toString();
    }

    (table[row][table[row].length-1]  as HTMLElement).innerHTML= team.players[team.activePlayer].totalScore.toString();

    col++;

    if(run===0 || col===6) {
        row++;
        col=0;
        if(!team.nextPlayer()) {
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
    let result = getResult();
    teamResult.innerHTML = `${result.winnerTeam} won by ${result.runDifference} runs`;
    motmResult.innerHTML = `Man of the match is ${result.manOfTheMatch}`;
}

resetButtons();
