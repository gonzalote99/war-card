let deckId;
const newDeckBtn = document.getElementById('new-deck');
const drawBtn = document.getElementById('draw');
const cardsEl = document.getElementById('cards');
const computerScoreEl =  document.getElementById('computer');
const myScoreEl = document.getElementById('me');
const remainingEl = document.getElementById('remaining');

const statusEl = document.getElementById('status');
const possibleVals = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "JACK", "QUEEN", "KING", "ACE"];
let computerScore = 0;
let myScore = 0;
let remainingCards = 52;

function assessValue(arr) {
  const val1 = possibleVals.indexOf(arr[0].value)
  const val2 = possibleVals.indexOf(arr[1].value)
  return {
    'card1Val' : val1,
    'card2Val' : val2
  };
}

function updateStatus(cardVals) {
const {card1Val, card2Val} = cardVals;
if(card1Val === card2Val) {
  statusEl.textContent = 'war';
} else {
  statusEl.textContent = card1Val > card2Val ? 'computer win' : 'you win';
}
}


function updateScore(cardVals) {
  const {card1Val, card2Val} = cardVals;
  card1Val > card2Val ? computerScore++ : myScore++;
  computerScoreEl.textContent = `computer: ${computerScore}`;
  myScoreEl.textContent = `me: ${myScore}`;

}

function updateRemaining(data) {
  remainingCards = data.remaining;
  remainingEl.textContent = `remaining cards ${remainingCards}`;

}


function finalStatus() {
  statusEl.textContent = computerScore > myScore ? 'computer won' : 'you win';
}



function disableButtons() {
  drawBtn.disable = true;
  newDeckBtn.disable = true;
  finalStatus();
}

function processCards(data) {
  const cardVals = assessValue(data.cards);
  updateScore(cardVals);
  cardsEl.children[0].innerHTML = `<img src=${data.cards[0].image}>`;
  cardsEl.children[1].innerHTML = `<img src=${data.cards[1].image}>`;
  updateStatus(cardVals);
  updateRemaining(data);
}

async function fetchDeck() {
  const res = await fetch('https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/');
  const data = await res.json();
  deckId = data.deck_id;
  updateRemaining(data);
}

async function fetchCards() {
if(deckId) {
  const res = await fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`);
  const data = await res.json();
  processCards(data)
} else {
  alert('new deck first')
}
}

newDeckBtn.addEventListener('click', fetchDeck);
drawBtn.addEventListener('click', () => {
  remainingCards > 0 ? fetchCards() : disableButtons();
});







