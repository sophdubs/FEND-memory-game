
//Declared variables;
const cardIcons = ['fa-cube', 'fa-cube',
                'fa-diamond', 'fa-diamond',
                'fa-paper-plane-o', 'fa-paper-plane-o',
                'fa-anchor', 'fa-anchor',
                'fa-bolt', 'fa-bolt',
                'fa-bicycle', 'fa-bicycle',
                'fa-leaf', 'fa-leaf',
                'fa-bomb', 'fa-bomb'
                ]
let moveCount;
let openCards = [];
let matchedCards = [];
const stars = document.querySelectorAll('.fa-star');
const restartButton = document.querySelector('.fa-repeat');
let starCount;
const child = document.createElement('span');
let myTimer;
const allCards = document.querySelector('.deck');
const TWO_STARS = 17;
const THREE_STARS = 31;
child.style.fontFamily = "Coda";



//Starts the game.
initGame();


//card HTML template with class card and data field.
//source: http://stackoverflow.com/a/2450976
function generateCard(card){
    return `<li class="card" data-card="${card}"><i class="fa ${card}"></i></li>`;
}

//shuffle function provided for this assignment.
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


//function that calls all the methods required to start the game.
function initGame(){
    moveCount = 0;
    setGameBoard();
    const cards = document.querySelectorAll('.card');
    cardListeners(cards);
    updateMoves();
    resetStars();
    setTimer();
}


//Creates the deck of cards and shuffles them and places them on the board.
function setGameBoard(){
    const deckOfCards = document.querySelector('.deck');
    const cardHTML = shuffle(cardIcons).map(function(card){
        return generateCard(card);
    });
    deckOfCards.innerHTML = cardHTML.join('');
}


//adds event listeners to each card.
function cardListeners(cards){
    cards.forEach(function(card){
        card.addEventListener('click', function(){
            if (openCards.length < 2){
                open(card);
                checkMoves();
                checkMatch();
            }
        });
    });
}


//checks if the two open cards are a match.
//if match: cards stay open and are moved to the matchedCards array.
//if no match: hide function is called to turn cards face down.
function checkMatch(){
    if (openCards.length === 2){
        if (openCards[0].dataset.card === openCards[1].dataset.card){
            openCards.forEach(function(card){
                match(card);
                matchedCards.push(card);
                if (matchedCards.length == 16){
                    win();
                }
            });
            openCards = [];
        } else {

            setTimeout(hide, 500);
        }
    }
}


//cards that have been matched will remove the open and show classes, and add the match class.
function match(card){
    card.classList.remove('show', 'open');
    card.classList.add('match');
}


//turns card face up if it is not already opened or matched
function open(card){
    if (!card.classList.contains('open') && !card.classList.contains('match')){
        openCards.push(card);
        card.classList.add('open', 'show');
        moveCount++;
        updateMoves();
    }
}


//hide the open cards if they are not a match.
//move the cards to the matchedCards if they are a match.
function hide(){
    openCards.forEach(function(card){
        card.classList.remove('show', 'open');
    });
    openCards = [];
}


//updates the number of moves made on the board.
function updateMoves(){
    const moves = document.querySelector('.moves');
    moves.innerText = moveCount;
}


//Checks how many moves have been made to assign proper star value.
//move star to update in update stars
function checkMoves(){
    if (moveCount == TWO_STARS){
        removeStars(0);
    } else if (moveCount == THREE_STARS){
        removeStars(1);
    }
}


//if too many moves have been made, stars are removed.
function removeStars(i){
    stars[i].style.display = 'none';
    starCount -=1;

}


//resets star moveCount to three.
function resetStars(){
    stars.forEach(function(star){
        star.style.display = 'block';
    });
    starCount = 3;
}


//Variable declarations for the modal pop-up when player wins.
const modal = document.getElementById('winModal');
const span = document.querySelector(".modal-footer");
const modalText = document.querySelector('.modal-body');
const modalChild = document.createElement('span');


//Restarts game if player clicks on "play again" when modal pops up.
span.onclick = function(){
    restartGame();
}


//declaring variables and setting event listeners
const closeBtn = document.querySelector('.closeBtn');
const playAgain = document.querySelector('.modal-footer');
playAgain.addEventListener('click', restartGame);
restartButton.addEventListener('click', restartGame);
closeBtn.addEventListener('click', closeModal);


//function to hide the modal
function closeModal(){
    modal.style.display = 'none';
}


//Once all cards are matched, player wins.
//A modal pops up giving the player their win time and star rating.
function win(){
    const endTime = calculateTime();
    modalText.appendChild(modalChild);
    if (starCount == 1){
        modalChild.innerText = ` Time to complete the puzzle was ${endTime} and you earned ${starCount} star!`;
    } else {
        modalChild.innerText = ` Time to complete the puzzle was ${endTime} and you earned ${starCount} stars!`;
    }
    clearInterval(myTimer);
    modal.style.display = "block";
}


//Code do execute if player resets the board or chooses to play again.
function restartGame(){
    clearInterval(myTimer);
    matchedCards = [];
    openCards = [];
    closeModal();
    initGame();
}


//EventListener for the timer (only listens for the first click)
function setTimer(){
    allCards.addEventListener('click', listenerFunction);
    const timer = document.querySelector('.fa-repeat');
    child.innerText = '  0:00';
    timer.appendChild(child);
}


//Starts the timer once a card on the board is clicked.
function listenerFunction(){
    secondsFromStart = 0;
    myTimer = setInterval(function(){
        currentTime = calculateTime();
        updateTime(currentTime);
    }, 1000);
    allCards.removeEventListener('click', listenerFunction);
}


//calculates the time (minutes:seconds) given the secondsFromStart.
function calculateTime(){
    secondsFromStart += 1;
    const minutes = Math.floor(secondsFromStart/60);
    let seconds = secondsFromStart % 60;
    if (seconds < 10){
        seconds = '  0' + seconds;
    }
    return '  ' + minutes + ':' + seconds;
}


//updates the time displayed on the timer
function updateTime(time){
    child.innerText = time;
}


