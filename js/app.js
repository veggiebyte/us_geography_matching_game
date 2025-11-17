/*-- PSEUDOCODE - US GEOGRAPHY MATCHING GAME --*/
/*
MVP - US GEOGRAPHY MATCHING GAME

DATA:
- 50 states array
- Selected category
- Timer: 30 seconds
- Max wrong guesses: 3

FLOW:
1. Choose category (abbreviations/capitals)
2. Randomly pick 5 states from 50
3. Display 5 pairs (left: states, right: shuffled answers)
4. Start 30-second timer
5. Player clicks to match
6. If correct: mark matched
7. If wrong: increment error counter
8. Win: All 5 matched before time ends
9. Lose: Timer = 0 OR 3 wrong guesses
10. Play Again: reset with new random 5

WIN: Match all 5 pairs within 30 seconds
LOSE: Time out OR 3 errors
*/


/*-------------- Constants -------------*/
const MAX_WRONG_GUESSES = 3;
const TIMER_START = 30;
const PAIRS_PER_GAME = 5;


/*---------- Variables (state) ---------*/
let allStates = [
    { name: "California", abbr: "CA", capital: "Sacramento" },
    { name: "Texas", abbr: "TX", capital: "Austin" },
    { name: "Florida", abbr: "FL", capital: "Tallahassee" },
    { name: "New York", abbr: "NY", capital: "Albany" },
    { name: "Illinois", abbr: "IL", capital: "Springfield" },
    { name: "Ohio", abbr: "OH", capital: "Columbus" },
    { name: "Georgia", abbr: "GA", capital: "Atlanta" },
    { name: "Michigan", abbr: "MI", capital: "Lansing" },
    { name: "Arizona", abbr: "AZ", capital: "Phoenix" },
    { name: "Nevada", abbr: "NV", capital: "Carson City" }
]


let selectedCategory;
let currentStates;
let firstSelection;
let secondSelection;
let matchedPairs;
let wrongGuesses;
let timeRemaining;

/*----- Cached Element References  -----*/

const categoryScreen = document.getElementById('category-screen');
const gameBoard = document.getElementById('game-board');
const resultsScreen = document.getElementById('results-screen');
const abbreviationsButton = document.getElementById('abbreviations')
const capitalsButton = document.getElementById('capitals')
const timer = document.getElementById('timer')
const resetButton = document.getElementById('play-again')
const errorsDisplay = document.getElementById('errors');
const resultsMessage = document.getElementById('results-message');
const leftColumn = document.getElementById('left-column');
const rightColumn = document.getElementById('right-column');




/*-------------- Functions -------------*/
function init() {
    selectedCategory = null;
    currentStates = [];
    firstSelection = null;
    secondSelection = null;
    matchedPairs = 0;
    wrongGuesses = 0;
    timeRemaining = 30;

    render();
}

function render() {
    if (selectedCategory === null) {
        categoryScreen.style.display = 'block';
        gameBoard.style.display = 'none';
        resultsScreen.style.display = 'none';
    } else if (selectedCategory !== null && matchedPairs < 5 && wrongGuesses < 3 && timeRemaining > 0) {
        categoryScreen.style.display = 'none';
        gameBoard.style.display = 'block';
        resultsScreen.style.display = 'none';

        leftColumn.innerHTML = '';
        rightColumn.innerHTML = '';

        currentStates.forEach(state => {
            const leftItem = document.createElement('div');
            leftItem.textContent = state.name;
            leftColumn.appendChild(leftItem);


            const rightItem = document.createElement('div');
            if (selectedCategory === 'abbreviations') {
                rightItem.textContent = state.abbr;

            } else {
                rightItem.textContent = state.capital;

            }
            rightColumn.appendChild(rightItem);

        })

    } else {
        categoryScreen.style.display = 'none';
        gameBoard.style.display = 'none';
        resultsScreen.style.display = 'block';
    }


}

function handleAbbreviationsClick() {
    selectedCategory = 'abbreviations';
    currentStates = getRandomStates(5);
    render();
}

function handleCapitalsClick() {
    selectedCategory = 'capitals';
    currentStates = getRandomStates(5);
    render();
}

function getRandomStates(num) {
    const shuffled = allStates.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, num);
}

/*----------- Event Listeners ----------*/

abbreviationsButton.addEventListener('click', handleAbbreviationsClick);
capitalsButton.addEventListener('click', handleCapitalsClick);
resetButton.addEventListener('click', init);


init();
