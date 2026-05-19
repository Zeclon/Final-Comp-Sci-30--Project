// Main File
var allCards = [];

function getCardImagePath(color, number) {
    if (color === "Yellow") {
        return "Images/frontSide/Yellow/Y_" + number + ".png";
    }
    if (color === "Green") {
        return "Images/frontSide/Green/G_" + number + ".png";
    }
    return null;
}

function createDeck() {
    var deck = [];
    var colors = ["Yellow", "Green"];
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var cardId = 1;

    for (var i = 0; i < colors.length; i++) {
        var color = colors[i];
        for (var j = 0; j < numbers.length; j++) {
            var number = numbers[j];
            var image = getCardImagePath(color, number);
            deck.push(new Card(color, color, number, "deck", cardId, image));
            cardId = cardId + 1;
        }
    }

    allCards = deck;
    return deck;
} // end createDeck function

function shuffleDeck(deck) {
    if (deck === null || deck === undefined) {
        return deck;
    }
    if (deck.length === 0 || deck.length === 1) {
        return deck;
    }

    return deck.sort(function() {
        return Math.random() - 0.5;
    });
} // end shuffleDeck function

function dealCards(deck) {
    if (deck === null || deck === undefined) {
        return;
    }
    if (deck.length === 0) {
        return;
    }

    var cardIndex = 0;

    // Deal the player's Blitz pile (10 cards)
    for (var i = 0; i < 10; i++) {
        var card = deck[cardIndex];
        gamePiles.player.blitz.addCard(card);
        cardIndex = cardIndex + 1;
    }

    // Deal the player's Wood pile (3 cards)
    for (var j = 0; j < 3; j++) {
        var card2 = deck[cardIndex];
        gamePiles.player.wood.addCard(card2);
        cardIndex = cardIndex + 1;
    }

    // Deal the player's Post piles (1 card each)
    for (var k = 0; k < 3; k++) {
        var card3 = deck[cardIndex];
        gamePiles.player.posts[k].addCard(card3);
        cardIndex = cardIndex + 1;
    }

    // Remaining cards stay in the player's hand pile
    for (var m = cardIndex; m < deck.length; m++) {
        var card4 = deck[m];
        gamePiles.player.hand.addCard(card4);
    }

    showPlayerHand();
    showPlayerBlitz();
    showPlayerPosts();
    showCentralPiles();
} // end dealCards function

function canPlayCard(card, pile) {
    if (card === null || card === undefined) {
        return false;
    }
    if (pile === null || pile === undefined) {
        return false;
    }

    if (pile.type !== "central") {
        return false;
    }

    if (pile.isEmpty()) {
        return card.num === 1;
    }

    var topCard = pile.getTopCard();
    if (topCard === null || topCard === undefined) {
        return false;
    }

    return topCard.color === card.color && card.num === topCard.num + 1;
} // end canPlayCard function

function moveCard(card, fromPile, toPile) {
    if (canPlayCard(card, toPile) === false) {
        return false;
    }

    var removedCard = fromPile.removeTopCard();
    if (removedCard === null || removedCard === undefined) {
        return false;
    }

    toPile.addCard(card);
    showPlayerHand();
    showPlayerBlitz();
    showPlayerPosts();
    showCentralPiles();
    return true;
} // end moveCard function

function setupGame() {
    gamePiles = new GamePiles();
    setupGamePiles(); 
    var deck = createDeck();  // shuffle and distribute cards
    shuffleDeck(deck);
    dealCards(deck);
} // end setupGame function

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function showPlayerHand() {
    var handElement = document.getElementById("player-hand");
    if (handElement === null || handElement === undefined) {
        return;
    }

    clearElement(handElement);
    var handPile = gamePiles.player.hand;
    if (handPile === null || handPile === undefined) {
        return;
    }

    for (var i = 0; i < handPile.cards.length; i++) {
        var card = handPile.cards[i];
        var cardElement = card.display();
        cardElement.style.position = "relative";
        cardElement.style.left = "0";
        cardElement.style.top = "0";
        handElement.appendChild(cardElement);
    }
}

function showPlayerBlitz() {
    var blitzElement = document.getElementById("player-blitz");
    if (blitzElement === null || blitzElement === undefined) {
        return;
    }

    clearElement(blitzElement);
    var blitzPile = gamePiles.player.blitz;
    if (blitzPile === null || blitzPile === undefined) {
        return;
    }

    for (var i = 0; i < blitzPile.cards.length; i++) {
        var card = blitzPile.cards[i];
        var cardElement = card.display();
        cardElement.style.position = "relative";
        cardElement.style.left = "0";
        cardElement.style.top = "0";
        blitzElement.appendChild(cardElement);
    }
}

function showPlayerPosts() {
    var playerArea = document.getElementById("player-area");
    if (playerArea === null || playerArea === undefined) {
        return;
    }

    var postElements = playerArea.getElementsByClassName("post-pile");
    for (var i = 0; i < postElements.length && i < gamePiles.player.posts.length; i++) {
        var postElement = postElements[i];
        clearElement(postElement);

        var postPile = gamePiles.player.posts[i];
        if (postPile === null || postPile === undefined) {
            continue;
        }

        if (postPile.isEmpty() === false) {
            var topCard = postPile.getTopCard();
            if (topCard !== null && topCard !== undefined) {
                var cardElement = topCard.display();
                cardElement.style.position = "relative";
                cardElement.style.left = "0";
                cardElement.style.top = "0";
                postElement.appendChild(cardElement);
            }
        }
    }
}

function showCentralPiles() {
    var centralArea = document.getElementById("central-piles");
    if (centralArea === null || centralArea === undefined) {
        return;
    }

    var centralElements = centralArea.getElementsByClassName("central-pile");
    for (var i = 0; i < centralElements.length && i < gamePiles.central.length; i++) {
        var centralElement = centralElements[i];
        clearElement(centralElement);

        var centralPile = gamePiles.central[i];
        if (centralPile === null || centralPile === undefined) {
            continue;
        }

        if (centralPile.isEmpty() === false) {
            var topCard = centralPile.getTopCard();
            if (topCard !== null && topCard !== undefined) {
                var cardElement = topCard.display();
                cardElement.style.position = "relative";
                cardElement.style.left = "0";
                cardElement.style.top = "0";
                centralElement.appendChild(cardElement);
            }
        }
    }
}

var startButton = document.getElementById("start-game-btn");
if (startButton !== null && startButton !== undefined) {
    startButton.addEventListener("click", setupGame);
}

class Card {
    constructor(design, color, num, type, id, image) {
        this.design = design;
        this.color = color;
        this.num = num;
        this.type = type;
        this.id = id;
        if (image === null || image === undefined) {
            this.image = null;
        } else {
            this.image = image;
        }

        this.w = 60;
        this.h = 90;
        this.x = 0;
        this.y = 0;
    } // constructor

    display() {
        var cardElement = document.createElement("div");
        cardElement.className = "card";

        if (this.image !== null && this.image !== undefined) {
            cardElement.style.backgroundImage = "url('" + this.image + "')";
            cardElement.style.backgroundSize = "cover";
            cardElement.style.backgroundPosition = "center";
            cardElement.textContent = "";
        } else {
            cardElement.textContent = this.design + " " + this.color + " " + this.num;
        }

        cardElement.style.left = this.x + "px";
        cardElement.style.top = this.y + "px";

        return cardElement;
    } // display


} // end Card class
class Pile {
    constructor(type, x, y) {
        this.type = type;  // e.g. central, post
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
        this.central = [];    
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

var gamePiles = new GamePiles();

function setupGamePiles() {
    for (var i = 0; i < 4; i++) {
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
    for (var i = 0; i < 3; i++) {
        var botArea = new BotArea();
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