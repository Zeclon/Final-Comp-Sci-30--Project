// Main File
let allCards = [];
let allPiles = [];

function createDeck() {
    const allDesigns = [];
    const allColors = ["Red", "Blue", "Green", "Yellow"];
    const allNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const allTypes = ["Boy", "Girl"];
} // end createDeck function

function shuffleDeck(deck) {

} // end shuffleDeck function

function dealCards() {
    if (button === "Start Game") {

    }
} // end dealCards function

function canPlayCard(card, pile) {

} // end canPlayCard function

function moveCard(card, fromPile, toPile) {

} // end moveCard function

function setupGame() {
    setupGamePiles();  // Create all the Pile objects first
    const deck = createDeck();  // shuffle and distribute cards
    shuffleDeck(deck);
    dealCards(deck);
} // end setupGame function

class Card {
    constructor(design, color, num, type, id) {
        this.design = design;
        this.color = color;
        this.num = num;
        this.type = type;
        this.id = id;

        this.w = 60;
        this.h = 90;
        this.x = 0;
        this.y = 0;
    } // constructor

    display() {
        const cardElement = document.createElement("div");
        cardElement.className = "card";
        
        cardElement.textContent  = "" + this.design + " " + this.color + " " + this.num + " " + this.type;
        cardElement.style.left = this.x + "px";
        cardElement.style.top = this.y + "px";

        return cardElement;
    } // display


} // end Card class
class Pile {
    constructor() {
        this.type = this.type;  // e.g. central, post
        this.cards = [];
        this.x = this.x;
        this.y = this.y;
        this.w = 70;
        this.h = 100;
    } // constructor

    addCard(card) {
        this.cards.push(card);
        card.x = this.x;
        card.y = this.y + (this.cards.length - 1) * 5;
    }

    removeTopCard() {
        return this.cards.pop();
    }

    getTopCard() {
        return this.cards[this.cards.length - 1];
    }

    isEmpty() {
        return this.cards.length === 0;
    }
} // end Pile class

class GamePiles {
    constructor() {
        this.central = [];    // will hold 28 Pile objects
        this.player = new PlayerArea();
        this.bots = [];       // will hold 3 bot objects
    } // constructor

    getCentralPile(num) {
        return this.central[num];
    }
    
    getPlayerBlitz() {
        return this.player.blitz;
    }
    
    getPlayerPost(num) {
        return this.player.posts[num];
    }
    
    getBotPiles(botNum) {
        return this.bots[botNum];
    }
} // end GamePiles class

class PlayerArea {
    constructor() {
        this.blitz = null;      // will hold 1 Pile object
        this.posts = [];        // will hold 3 Pile objects
        this.wood = null;       // will hold 1 Pile object
        this.hand = null;       // will hold 1 Pile object
    }
} // end PlayerArea class
class BotArea {
    constructor() {
        this.blitz = null;      // will hold 1 Pile object
        this.posts = [];        // will hold 3 Pile objects
        this.wood = null;       // will hold 1 Pile object
    }
} // end BotArea class

let gamePiles = new GamePiles();

function setupGamePiles() {
    for (let i = 0; i < 28; i++) {
        gamePiles.central.push(new Pile('central', 0, 0));
    }
    
    // Player Piles
    gamePiles.player.blitz = new Pile('blitz', 0, 0);
    gamePiles.player.posts = [
        new Pile('post', 0, 0),
        new Pile('post', 0, 0),
        new Pile('post', 0, 0)
    ];
    gamePiles.player.wood = new Pile('wood', 0, 0);
    gamePiles.player.hand = new Pile('hand', 0, 0);

    // Bot Piles
    for (let i = 0; i < 3; i++) {
        const botArea = new BotArea();
        botArea.blitz = new Pile('blitz', 0, 0);
        botArea.posts = [
            new Pile('post', 0, 0),
            new Pile('post', 0, 0),
            new Pile('post', 0, 0)
        ];
        botArea.wood = new Pile('wood', 0, 0);
        gamePiles.bots.push(botArea);
    }
} 