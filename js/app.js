
/*-------------- Constants -------------*/
const MAX_WRONG_GUESSES = 3;
const TIMER_START = 15;
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
const instructionsPopup = document.getElementById('instructions-popup');
const closePopupButton = document.getElementById('close-popup');
const helpButton = document.getElementById('help-button');




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
    timeRemaining = 15;

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
        errorsDisplay.textContent = `Wrong Answers: ${wrongGuesses}/${MAX_WRONG_GUESSES}`;

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

function closeInstructions() {
    instructionsPopup.style.display = 'none';
}

function openInstructions() {
    instructionsPopup.style.display = 'flex';
}



/*----------- Event Listeners ----------*/

abbreviationsButton.addEventListener('click', handleAbbreviationsClick);
capitalsButton.addEventListener('click', handleCapitalsClick);
resetButton.addEventListener('click', init);
closePopupButton.addEventListener('click', closeInstructions);
helpButton.addEventListener('click', openInstructions);


init();
