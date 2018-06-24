/*
 * Create a list that holds all of your cards
 */

const cards = ["fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-bolt", "fa fa-cube", "fa fa-leaf", "fa fa-bicycle", "fa fa-bomb", 
"fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-bolt", "fa fa-cube", "fa fa-leaf", "fa fa-bicycle", "fa fa-bomb"];

const deck = document.querySelector('.deck');

let clockOff = true; // toggle clock counting, turn it to false after first click
let toggled = [];
let moves = 0; // moves counter
let stars = 3; // stars counter
let time = 0; // time counter
let displayminutes = '00';
let displayseconds = '00';
let clockId; // refer to the clock ID
let matches = 0; // how many matches to decide finish or not

//shuffle the cards on the deck
function shuffleDeck() {
  const shuffledCards = shuffle(cards);
  deck.innerHTML = ''; // remove all the previous child before appending new child
  for (shuffledCard of shuffledCards) {
    var newShuffledCard = document.createElement('li');
    newShuffledCard.className = 'card';
    newShuffledCard.innerHTML = '<i class="'+ shuffledCard + '"></i>';
    deck.appendChild(newShuffledCard);
  }
}
shuffleDeck();


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */


//while toggle two cards, it will check match, check star and add one move.
deck.addEventListener('click', event => {
  const clickTarget = event.target;
  if (clickTarget.classList.contains('card') && toggled.length < 2 && !toggled.includes(clickTarget)) {
       toggleCard(clickTarget);
       addToggleCard(clickTarget);
       if (toggled.length === 2) {
      // console.log ("2 cards!");
      // console.log (toggled);
       checkMatch(clickTarget);
       addMove();
       checkStar();
       }
          if (clockOff) {
            startClock();
            clockOff = false;
          }
      }
  
//end game after all cards are matched. Timer is stopped. It pops up an alert to ask whether restart the game or not.
  if(checkFinish()) { 
    stopClock();
    if(confirm("Congratulation!! You have used " + moves + " moves in " + displayminutes + " minutes and " + displayseconds + " seconds with " + stars + " out of 3 stars rating. Do you want to play again?")) {
     restart();
      };
  }
  }); 



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


function restart() {
  if(confirm("Are you sure to restart?")) {
    matches = 0; // reset matches counter
    shuffleDeck();
    stopClock();
    clockOff = true;

    moves = 0; // reset moves counter
    const movesText = document.querySelector('.moves');
    movesText.innerText = moves;   
    stars = 3; // reset stars counter
    const starList = document.querySelectorAll('.stars li');

    for (star of starList) {
      star.style.display = 'inline';
    }

    time = 0; //  reset time counter
    const clock = document.querySelector('.clock');
    clock.innerText = '00:00';
  };

}

//flip to open the card and show the card
function toggleCard(clickTarget) {
    clickTarget.classList.toggle('open');
    clickTarget.classList.toggle('show');
}

//record toggled cards 
function addToggleCard(clickTarget) {
    toggled.push(clickTarget);
    //console.log(toggled);
}

//after open the card, it checks whether the cards are matched. If not, it will close the card.
function checkMatch() {
    if (
    toggled[0].firstElementChild.className === toggled[1].firstElementChild.className
    ) {
          toggled[0].classList.toggle('match');
          toggled[1].classList.toggle('match');
          toggled = [];
          matches++;
          //console.log('Match!');
    } else {
           //console.log("Not match!");
           setTimeout( () => {
           toggleCard(toggled[0]);
           toggleCard(toggled[1]);
           toggled = []; 
           }, 800);
  }
}

//check whether 8 pairs of cards are matched
function checkFinish() {
  //console.log(matches);
  if (matches === 8) {
    return true; 
  } else {
    return false;
  }
}

//while click on 2 cards, it adds one move
function addMove() {
  moves++ ;
  const movesText = document.querySelector('.moves');
  movesText.innerText = moves;
  //console.log(moves);
}

//if moves are more then 25, it displays 2 stars; if moves are more than 35, it displays only 1 star. 
function checkStar(){
  if (moves === 20 || moves === 30) {
    stars --;
    hideStar();
    //console.log(stars);
  }
}

//hide the star while running the ckeckStar function
function hideStar() {
  const starList = document.querySelectorAll('.stars li');
  for (star of starList) {
    if (star.style.display !== 'none') {
    star.style.display = 'none';
    break;
    }
  }
}

//start the timer after first click    
function startClock() {
  clockId = setInterval(() => {
    time++;
    displayTime()
  }, 1000);
}

//display the timer by minutes and seconds
function displayTime() {
  const clock = document.querySelector('.clock');
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  if (seconds < 10) {
    displayseconds = "0" + seconds;
  }
  else {
    displayseconds = seconds;
  }
  if (minutes < 10) {
    displayminutes = "0" + minutes;
  }
  else {
    displayminutes = minutes;
  }
  clock.innerHTML = displayminutes + ":" + displayseconds;
}   

//stop the timer
function stopClock() {
  clearInterval(clockId);
}


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
