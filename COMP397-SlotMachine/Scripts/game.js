//Source File Name: game.js
//Author/Deveoloper: Tim Chiu - 300652823
//Last Modified by: Tim Chiu
//Date Last Motified: 27/2/15

var Button = (function () {
    function Button(path, x, y) {
        this._x = x;
        this._y = y;
        this._image = new createjs.Bitmap(path);
        this._image.x = this._x;
        this._image.y = this._y;

        this._image.addEventListener("mouseover", this._buttonOver);
        this._image.addEventListener("mouseout", this._buttonOut);
    }

    // Public Properties
    Button.prototype.setX = function (x) {
        this._x = x;
    };

    Button.prototype.getX = function () {
        return this._x;
    };

    Button.prototype.setY = function (y) {
        this._y = y;
    };

    Button.prototype.getY = function () {
        return this._y;
    };

    Button.prototype.getImage = function () {
        return this._image;
    };

    // Private Event Handlers
    Button.prototype._buttonOut = function (event) {
        event.currentTarget.alpha = 1; // 100% Alpha
    };

    Button.prototype._buttonOver = function (event) {
        event.currentTarget.alpha = 0.5;
    };
    return Button;
})();

// Variables
var canvas;
var stage;

var tiles = [];

var reelContainers = [];
var NUM_REELS = 3;

var playerMoney = 1000;
var winnings = 0;
var jackpot = 9999; //Win all the money!

var betAmount = 0;


var spinResult;
var fruits = "";
var winRatio = 0;
var grapes = 0;
var lemons = 0;
var oranges = 0;
var cherries = 0;
var bars = 0;
var bells = 0;
var sevens = 0;
var blanks = 0;
var game;

var background;
var spinButton;
var betTen;
var betMax;
var resetButton;
var powerButton;
var jackpotText;
var winningText;
var betText;
var moneyText;

// Functions
function init() {
    canvas = document.getElementById("canvas");
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver(20); // Turn on Mouse Over events
    createjs.Ticker.setFPS(60); // Set the frame rate to 60 fps
    createjs.Ticker.addEventListener("tick", gameLoop);
    main();
}

// Gameloop
function gameLoop() {
    stage.update();
}

//Utility function to reset all fruit tallies
function resetFruitTally() {
    grapes = 0;
    lemons = 0;
    oranges = 0;
    cherries = 0;
    bars = 0;
    bells = 0;
    sevens = 0;
    blanks = 0;
}

/* Utility function to reset the player stats */
function resetButton() {
    playerMoney = 1000;
    winnings = 0;
    jackpot = 5000;
    turn = 0;
    playerMoney = 0;
    winNumber = 0;
    lossNumber = 0;
    winRatio = 0;
}

/* Utility function to check if a value falls within a range of bounds */
function checkRange(value, lowerBounds, upperBounds) {
    if (value >= lowerBounds && value <= upperBounds) {
        return value;
    } else {
        return !value;
    }
}

/* When this function is called it determines the betLine results.
e.g. Bar - Orange - Banana */
function Reels() {
    var betLine = [" ", " ", " "];
    var outCome = [0, 0, 0];

    for (var spin = 0; spin < 3; spin++) {
        outCome[spin] = Math.floor((Math.random() * 65) + 1);
        switch (outCome[spin]) {
            case checkRange(outCome[spin], 1, 27):
                betLine[spin] = "blank";
                blanks++;
                break;
            case checkRange(outCome[spin], 28, 37):
                betLine[spin] = "grapes";
                grapes++;
                break;
            case checkRange(outCome[spin], 38, 46):
                betLine[spin] = "banana";
                lemons++;
                break;
            case checkRange(outCome[spin], 47, 54):
                betLine[spin] = "orange";
                oranges++;
                break;
            case checkRange(outCome[spin], 55, 59):
                betLine[spin] = "cherry";
                cherries++;
                break;
            case checkRange(outCome[spin], 60, 62):
                betLine[spin] = "bar";
                bars++;
                break;
            case checkRange(outCome[spin], 63, 64):
                betLine[spin] = "bell";
                bells++;
                break;
            case checkRange(outCome[spin], 65, 65):
                betLine[spin] = "seven";
                sevens++;
                break;
        }
    }
    return betLine;
}

/* This function calculates the player's winnings, if any */
function determineWinnings() {
    if (blanks == 0) {
        if (grapes == 3) {
            winnings = betAmount * 10;
        } else if (lemons == 3) {
            winnings = betAmount * 20;
        } else if (oranges == 3) {
            winnings = betAmount * 30;
        } else if (cherries == 3) {
            winnings = betAmount * 40;
        } else if (bars == 3) {
            winnings = betAmount * 50;
        } else if (bells == 3) {
            winnings = betAmount * 75;
        } else if (sevens == 3) {
            winnings = betAmount * 100;
        } else if (grapes == 2) {
            winnings = betAmount * 2;
        } else if (lemons == 2) {
            winnings = betAmount * 2;
        } else if (oranges == 2) {
            winnings = betAmount * 3;
        } else if (cherries == 2) {
            winnings = betAmount * 4;
        } else if (bars == 2) {
            winnings = betAmount * 5;
        } else if (bells == 2) {
            winnings = betAmount * 10;
        } else if (sevens == 2) {
            winnings = betAmount * 20;
        } else {
            winnings = betAmount * 1;
        }

        if (sevens == 1) {
            winnings = betAmount * 5;
        }
        winNumber++;
        winningText.text = "Winnings: " + winnings.toString();
    } else {
        lossNumber++;
    }
}

function spinButtonClicked() {
    if (betAmount < 0) {

    }
    if (betAmount > 0) {
        spinResult = Reels();
        fruits = spinResult[0] + " - " + spinResult[1] + " - " + spinResult[2];

        for (var index = 0; index < NUM_REELS; index++) {
            reelContainers[index].removeAllChildren();
            tiles[index] = new createjs.Bitmap("assets/images/" + spinResult[index] + ".png");
            reelContainers[index].addChild(tiles[index]);
        }
    }
}

function betTen() {
    if (betAmount + 10 < 50) {
        playerMoney -= 10;
        betAmount += 10;
        moneyText.text = "Money Left: " + playerMoney.toString();
        betAmountText.text = "Current Bet: " + betAmount.toString();
    }
}

function betMax() {
    if (betAmount + 100 <= 100) {
        playerMoney -= 100;
        betAmount += 100;
        moneyText.text = "Money Left: " + playerMoney.toString();
        betText.text = "Current Bet: " + betAmount.toString();
    }
}

function createUI() {
    background = new createjs.Bitmap("assets/images/background.png");
    game.addChild(background); // Add the background to the game container

    for (var index = 0; index < NUM_REELS; index++) {
        reelContainers[index] = new createjs.Container();
        game.addChild(reelContainers[index]);
    }
    reelContainers[0].x = 105;
    reelContainers[0].y = 290;
    reelContainers[1].x = 245;
    reelContainers[1].y = 290;
    reelContainers[2].x = 385;
    reelContainers[2].y = 290;

    // Spin Button
    spinButton = new Button("assets/images/spinButton.png", 450, 540);
    game.addChild(spinButton.getImage());

    // Spin Button Event Listeners
    spinButton.getImage().addEventListener("click", spinButtonClicked);

    // Bet Ten Button
    betTen = new Button("assets/images/betTenButton.png", 270, 570);
    game.addChild(betTen.getImage());
    betTen.getImage().addEventListener("click", betTen);

    // Bet Max Button
    betMaxButton = new Button("assets/images/betMaxButton.png", 150, 570);
    game.addChild(betMaxButton.getImage());
    betMaxButton.getImage().addEventListener("click", betMax);

    // Reset Button
    resetButton = new Button("assets/images/resetButton.png", 30, 570);
    game.addChild(resetButton.getImage());
    resetButton.getImage().addEventListener("click", resetButton);

    // Label 1
    betTen = new createjs.Bitmap("assets/images/labelBox.png");
    betTen.x = 30;
    betTen.y = 520;
    game.addChild(betTen);

    // Label 2
    betMax = new createjs.Bitmap("assets/images/labelBox.png");
    betMax.x = 150;
    betMax.y = 520;
    game.addChild(betMax);

    // Label 3
    betMax = new createjs.Bitmap("assets/images/labelBox.png");
    betMax.x = 270;
    betMax.y = 520;
    game.addChild(betMax);

    //Current Bet Text
    betText = new createjs.Text("Current Bet: " + betAmount.toString(), "Arial", "#FFFFFF");
    betText.x = 40;
    betText.y = 530;
    game.addChild(betText);

    //Money Text
    moneyText = new createjs.Text("Money Left: " + playerMoney.toString(), "Arial", "#FFFFFF");
    moneyText.x = 160;
    moneyText.y = 530;
    game.addChild(moneyText);

    //Winning text
    winningText = new createjs.Text("Winnings: " + winnings.toString(), "Arial", "#FFFFFF");
    winningText.x = 280;
    winningText.y = 530;
    game.addChild(winningText);
}

function main() {
    game = new createjs.Container(); // Instantiates the Game Container

    createUI(); //Creates User Interface

    stage.addChild(game); // Adds the Game Container to the Stage
}
