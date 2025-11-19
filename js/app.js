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
4. Start 10-second timer
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
const TIMER_START = 20;
const PAIRS_PER_GAME = 5;


/*---------- Variables (state) ---------*/
let allStates = [
    { name: "Alabama", abbr: "AL", capital: "Montgomery" },
    { name: "Alaska", abbr: "AK", capital: "Juneau" },
    { name: "Arizona", abbr: "AZ", capital: "Phoenix" },
    { name: "Arkansas", abbr: "AR", capital: "Little Rock" },
    { name: "California", abbr: "CA", capital: "Sacramento" },
    { name: "Colorado", abbr: "CO", capital: "Denver" },
    { name: "Connecticut", abbr: "CT", capital: "Hartford" },
    { name: "Delaware", abbr: "DE", capital: "Dover" },
    { name: "Florida", abbr: "FL", capital: "Tallahassee" },
    { name: "Georgia", abbr: "GA", capital: "Atlanta" },
    { name: "Hawaii", abbr: "HI", capital: "Honolulu" },
    { name: "Idaho", abbr: "ID", capital: "Boise" },
    { name: "Illinois", abbr: "IL", capital: "Springfield" },
    { name: "Indiana", abbr: "IN", capital: "Indianapolis" },
    { name: "Iowa", abbr: "IA", capital: "Des Moines" },
    { name: "Kansas", abbr: "KS", capital: "Topeka" },
    { name: "Kentucky", abbr: "KY", capital: "Frankfort" },
    { name: "Louisiana", abbr: "LA", capital: "Baton Rouge" },
    { name: "Maine", abbr: "ME", capital: "Augusta" },
    { name: "Maryland", abbr: "MD", capital: "Annapolis" },
    { name: "Massachusetts", abbr: "MA", capital: "Boston" },
    { name: "Michigan", abbr: "MI", capital: "Lansing" },
    { name: "Minnesota", abbr: "MN", capital: "Saint Paul" },
    { name: "Mississippi", abbr: "MS", capital: "Jackson" },
    { name: "Missouri", abbr: "MO", capital: "Jefferson City" },
    { name: "Montana", abbr: "MT", capital: "Helena" },
    { name: "Nebraska", abbr: "NE", capital: "Lincoln" },
    { name: "Nevada", abbr: "NV", capital: "Carson City" },
    { name: "New Hampshire", abbr: "NH", capital: "Concord" },
    { name: "New Jersey", abbr: "NJ", capital: "Trenton" },
    { name: "New Mexico", abbr: "NM", capital: "Santa Fe" },
    { name: "New York", abbr: "NY", capital: "Albany" },
    { name: "North Carolina", abbr: "NC", capital: "Raleigh" },
    { name: "North Dakota", abbr: "ND", capital: "Bismarck" },
    { name: "Ohio", abbr: "OH", capital: "Columbus" },
    { name: "Oklahoma", abbr: "OK", capital: "Oklahoma City" },
    { name: "Oregon", abbr: "OR", capital: "Salem" },
    { name: "Pennsylvania", abbr: "PA", capital: "Harrisburg" },
    { name: "Rhode Island", abbr: "RI", capital: "Providence" },
    { name: "South Carolina", abbr: "SC", capital: "Columbia" },
    { name: "South Dakota", abbr: "SD", capital: "Pierre" },
    { name: "Tennessee", abbr: "TN", capital: "Nashville" },
    { name: "Texas", abbr: "TX", capital: "Austin" },
    { name: "Utah", abbr: "UT", capital: "Salt Lake City" },
    { name: "Vermont", abbr: "VT", capital: "Montpelier" },
    { name: "Virginia", abbr: "VA", capital: "Richmond" },
    { name: "Washington", abbr: "WA", capital: "Olympia" },
    { name: "West Virginia", abbr: "WV", capital: "Charleston" },
    { name: "Wisconsin", abbr: "WI", capital: "Madison" },
    { name: "Wyoming", abbr: "WY", capital: "Cheyenne" }
]


let selectedCategory;
let currentStates;
let firstSelection;
let secondSelection;
let matchedPairs;
let wrongGuesses;
let timeRemaining;
let timerInterval;

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
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    selectedCategory = null;
    currentStates = [];
    firstSelection = null;
    secondSelection = null;
    matchedPairs = 0;
    wrongGuesses = 0;
    timeRemaining = 20;

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

        timer.textContent = `Time: ${timeRemaining}`;
        errorsDisplay.textContent = `Wrong: ${wrongGuesses}/${MAX_WRONG_GUESSES}`;


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

        if (matchedPairs === 5) {
            resultsMessage.textContent = '🎉 ⭐ You Win! ⭐ 🎉';
            confetti({ shapes: ['star'] });

        } else if (timeRemaining === 0) {
            resultsMessage.textContent = "⏰ Time's Up!!! ⏰";

        } else if (wrongGuesses === 3) {
            resultsMessage.textContent = '❌ ❌ ❌ Too Many Errors! ❌ ❌ ❌';
        }
    }
}




function handleAbbreviationsClick() {
    selectedCategory = 'abbreviations';
    currentStates = getRandomStates(5);
    startTimer();
    render();
}

function handleCapitalsClick() {
    selectedCategory = 'capitals';
    currentStates = getRandomStates(5);
    startTimer();
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

        if (matchedPairs === 5) {
            clearInterval(timerInterval);
            setTimeout(() => {
                render();
            }, 500);
        }


    } else {
        firstSelection.style.backgroundColor = '#FFB6C1';
        secondSelection.style.backgroundColor = '#FFB6C1';
        wrongGuesses++;
        errorsDisplay.textContent = `Wrong: ${wrongGuesses}/${MAX_WRONG_GUESSES}`;

        if (wrongGuesses === 3) {
            clearInterval(timerInterval);
            setTimeout(() => {
                render();
            }, 1000);
            return;
        }

        setTimeout(() => {
            firstSelection.style.backgroundColor = '#f0f0f0';
            secondSelection.style.backgroundColor = '#f0f0f0';
            firstSelection = null;
            secondSelection = null;
        }, 1000);
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeRemaining--;
        timer.textContent = `Time: ${timeRemaining}`;

        if (timeRemaining === 0) {
            clearInterval(timerInterval);
            render();
        }
    }, 1000);
}



/*----------- Event Listeners ----------*/

abbreviationsButton.addEventListener('click', handleAbbreviationsClick);
capitalsButton.addEventListener('click', handleCapitalsClick);
resetButton.addEventListener('click', init);

init();
