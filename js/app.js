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

        const rightValues = currentStates.map(state =>
            selectedCategory === 'abbreviations' ? state.abbr : state.capital
        );
        const shuffledRight = rightValues.sort(() => Math.random() - 0.5);

        currentStates.forEach(state => {
            const leftItem = document.createElement('div');
            leftItem.textContent = state.name;
            leftItem.addEventListener('click', handleItemClick);
            leftColumn.appendChild(leftItem);
        });

        shuffledRight.forEach(value => {
            const rightItem = document.createElement('div');
            rightItem.textContent = value;
            rightItem.addEventListener('click', handleItemClick);
            rightColumn.appendChild(rightItem);
        });

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

function handleItemClick() {
    if (firstSelection === null) {
        firstSelection = this;
        this.style.backgroundColor = '#d0d0d0';  // Gray it out
        return;
    }

    secondSelection = this;
    this.style.backgroundColor = '#d0d0d0';  // Gray this one out too
    checkMatch();
}

function checkMatch() {
    let leftItem, rightItem;

    if (firstSelection.parentElement === leftColumn) {
        leftItem = firstSelection;
        rightItem = secondSelection;
    } else {
        leftItem = secondSelection;
        rightItem = firstSelection;
    }

    const leftText = leftItem.textContent;
    const rightText = rightItem.textContent;
    const state = currentStates.find(s => s.name === leftText);

    let isCorrect = false;
    if (selectedCategory === 'abbreviations') {
        isCorrect = (rightText === state.abbr);
    } else {
        isCorrect = (rightText === state.capital);
    }

    if (isCorrect) {
        firstSelection.style.backgroundColor = '#90EE90';
        secondSelection.style.backgroundColor = '#90EE90';
        matchedPairs++;

        firstSelection = null;
        secondSelection = null;
        
    } else {
        firstSelection.style.backgroundColor = '#FFB6C1';
        secondSelection.style.backgroundColor = '#FFB6C1';
        wrongGuesses++;

        setTimeout(() => {
            firstSelection.style.backgroundColor = '#f0f0f0';
            secondSelection.style.backgroundColor = '#f0f0f0';
            firstSelection = null;
            secondSelection = null;
        }, 1000);
    }
}


/*----------- Event Listeners ----------*/

abbreviationsButton.addEventListener('click', handleAbbreviationsClick);
capitalsButton.addEventListener('click', handleCapitalsClick);
resetButton.addEventListener('click', init);

init();
