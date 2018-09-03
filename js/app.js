//Getting variables needed

const modal = document.querySelector('.modal'),
closeBtn = document.querySelector('.closeBtn'),
restartBtn = document.querySelector('.restart'),
moves = document.querySelector('.moves'),
playBtn = document.querySelector('button');
hoursContainer = document.querySelector("#hours"),
minutesContainer = document.querySelector("#minutes"),
secondsContainer = document.querySelector("#seconds");
stars = document.querySelector(".stars");

let move = 0,
firstClick = true,
hours,
minutes,
seconds,
time = 0,
frag = document.createDocumentFragment(),
timer,
openedCards = [],
matchedCards = [];
moves.innerHTML = '0';//sets moves to 0 from start
hoursContainer.innerHTML = '00';
minutesContainer.innerHTML = '00';
secondsContainer.innerHTML = '00';

/*
 * Create a list that holds all of your cards
 */
const icons = ["fa fa-diamond", "fa fa-diamond", "fa fa-paper-plane-o",
"fa fa-paper-plane-o", "fa fa-anchor", "fa fa-anchor", "fa fa-bolt",
"fa fa-bolt", "fa fa-cube", "fa fa-cube", "fa fa-leaf", "fa fa-leaf",
"fa fa-bicycle", "fa fa-bicycle", "fa fa-bomb","fa fa-bomb"];

/*
*Modal interactivity: Listeners for Modal
*/
//listen for close button
closeBtn.addEventListener('click', function closeModal(){
  modal.style.display = 'none';
});

//listen for outside click
window.addEventListener('click', function outsideClick(e){
  if (e.target === modal){
    modal.style.display = 'none';
  }
});

//listener for play button
playBtn.addEventListener('click', function() {
  modal.style.display = 'none';
});

//Listener for restart button
restartBtn.addEventListener('click', function restarting(){
  restart();
  gameLogic();
});

startGame();


/*
  *        Functions
*/

//Function to start the game
function startGame() {
  /*
   * Display the cards on the page
   *   - shuffle the list of cards using the provided "shuffle" method below
   *   - loop through each card and create its HTML
   *   - add each card's HTML to the page
   */
  shuffleCards();
  /*
  * set up the event listener for a card. If a card is clicked:
  *  - display the card's symbol (put this functionality in another function that you call from this one)
  *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
  *  - if the list already has another card, check to see if the two cards match
  *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
  *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
  *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
  *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
  */
  gameLogic();
}

//Function to create and shuffle cards
function shuffleCards() {
  const shuffledIcons = shuffle(icons);//shuffles the icons
  //const frag = document.createDocumentFragment();//creates a document fragment to boost performance
  for (let i = 0; i < shuffledIcons.length; i++) {
    const card = document.createElement('li');
    card.classList.add('card');
    card.innerHTML = `<i class = '${icons[i]}'><i/>`;
    frag.appendChild(card);//adds to the document fragment
  }
  const container = document.querySelector('.deck');
  container.appendChild(frag);//adds to the screen
}

//Function for game Logic
function gameLogic() {
  const cards = document.querySelectorAll('.card');//Gets all cards after it's been created the for loop above
  for (card of cards) {
    card.addEventListener('click', function flipCard(){
    if (firstClick) {
      setTimer();
      firstClick = false;
    }
    if (openedCards.length === 1){
      this.classList.add('open', 'show', 'disable');
      openedCards.push(this);


      const currentCard = this;
      const previousCard = openedCards[0];
      compareCards(currentCard, previousCard);//compare cards
      if (matchedCards.length === icons.length) {
        gameOver();
      }
      openedCards = [];
    }
    else {
      this.classList.add('open', 'show', 'disable');
      openedCards.push(this);
    }
  });
}}

//Function to compare cards
function compareCards(currentCard, previousCard) {
  if (currentCard.innerHTML === previousCard.innerHTML){
  currentCard.classList.add('match');
  previousCard.classList.add('match');
  matchedCards.push(currentCard, previousCard);

  openedCards = [];
  addMove();
  rating();
  }
  else {
    //delay 1000ms and run in order to show icon on second click
    setTimeout(function() {
      currentCard.classList.add('unmatch');
      previousCard.classList.add('unmatch');
      currentCard.classList.remove('open', 'show', 'disable');
      previousCard.classList.remove('open', 'show', 'disable');

      openedCards = [];
      addMove();
      rating();
      setTimeout(function() {
        removeClass('unmatch');
      },500);
    }, 1000);
  }
}

//Rating system
function rating() {
  while (stars.firstChild) {
    stars.removeChild(stars.firstChild);
  }
  if(move <= 15) {
    stars.innerHTML = '<i class="star fa fa-star"></i><i class="star fa fa-star"></i><i class="star fa fa-star"></i>';
    stars.style.color = 'green';
  }
  else if(15 < move < 30 ) {
    stars .innerHTML = '<i class="star fa fa-star"></i><i class="star fa fa-star"></i>';
    stars.style.color = 'yellow';
  }
  else {
    stars.innerHTML = '<i class="star fa fa-star"></i>';
    stars.style.color = 'red';
  }
}

//Function start timer
function setTimer() {
  timer = setInterval(function() {
    time++;
    calculateTime();
    secondsContainer.innerHTML = seconds;
		minutesContainer.innerHTML = minutes;
		hoursContainer.innerHTML = hours;
  }, 1000);
}
//Function to stop timer
function clearTimer() {
  clearInterval(timer);
}

function calculateTime() {
	hours = Math.floor(time / 60 / 60);
	minutes = Math.floor((time / 60) % 60);
	seconds = time % 60;
}

// Function for Moves
function addMove() {
  move++;
  moves.innerHTML = move;
}

//Function to restart game
function restart() {
  let cards = document.querySelectorAll('.card');
  const cardsLength = cards.length;
  for (let i = 0; i < cardsLength; i++) {
    cards[i].classList.remove('open', 'show', 'match', 'unmatch', 'disable');
    // Reset to default values
    matchedCards = [];
    openedCards = [];
    move = 0;
    moves.innerHTML = '0';
    clearTimer();
    hoursContainer.innerHTML = '00';
    minutesContainer.innerHTML = '00';
    secondsContainer.innerHTML = '00';
    let container = document.querySelector('.deck');
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    shuffleCards();
    time = 0;
    firstClick = true;
  }
}

//Function to remove class
function removeClass(className) {
  let cards = document.querySelectorAll('.card');
  const cardsLength = cards.length;
  for (let i = 0; i < cardsLength; i++) {
    cards[i].classList.remove(className);
  }
}

//function to end game
function gameOver() {
  clearTimer();
  modal.style.display = 'block';//displays the modal
  //Get all elements of modal
  const modalHeader = document.querySelector('h2');
  const modalBody = document.querySelector('.how-to');
  const playBtn = document.querySelector('button');
  const input = document.querySelector('#username');

//Change all Text content of modal elements
  modalHeader.textContent = 'Game Over';
  modalBody.textContent = 'Congratulations!! You won with ' + move + ' moves with ' + time + ' seconds and ';
  modalBody.style.fontSize = '1em';
  playBtn.textContent = 'Play again';
  playBtn.style.fontSize = '1em';
  playBtn.addEventListener('click', function playAgain() {
    modal.style.display = 'none';//Hides the modal
    time = 0;
    hoursContainer.innerHTML = '00';
    minutesContainer.innerHTML = '00';
    secondsContainer.innerHTML = '00';
    restart();
    gameLogic();
  });
  input.remove();
  playBtn.style.float = 'none';
  modalBody.style.float = 'none';
  }

//Function to shuffle cards
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
