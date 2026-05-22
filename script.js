// Main File
var allCards = [];

function getCardImagePath(color, number) {
    if (color === "Yellow") {
        return "Images/frontSide/Yellow/Y_" + number + ".png";
    }
    if (color === "Green") {
        return "Images/frontSide/Green/G_" + number + ".png";
    }
    if (color === "Red") {
        return "Images/frontSide/Red/R_" + number + ".png";
    }
    if (color === "Blue") {
        return "Images/frontSide/Blue/B_" + number + ".png";
    }
    return null;
}

function createDeck() {
    var deck = [];
    var designs = ["Carriage", "Pail"];
    var colors = ["Yellow", "Green"];
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var cardId = 1;

    for (var i = 0; i < colors.length; i++) {
        var color = colors[i];
        var design = designs[i];
        for (var j = 0; j < numbers.length; j++) {
            var number = numbers[j];
            var image = getCardImagePath(color, number);
            deck.push(new Card(design, color, number, "girl", cardId, image));
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

    return deck.sort(
        function() {
            return Math.random() - 0.5;
        }
    );
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
    showPlayerWood();
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
        if (i === handPile.cards.length - 1) {
            cardElement.setAttribute("data-pile-type", "hand");
            cardElement.setAttribute("data-pile-index", 0);
            cardElement.setAttribute("data-card-id", card.id);
            cardElement.style.cursor = "pointer";
            cardElement.addEventListener("click", onCardClick);
        }
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

    if (blitzPile.isEmpty() === false) {
        var topCard = blitzPile.getTopCard();
        if (topCard !== null && topCard !== undefined) {
            var cardElement = topCard.display();
            cardElement.style.position = "relative";
            cardElement.style.left = "0";
            cardElement.style.top = "0";
            cardElement.setAttribute("data-pile-type", "blitz");
            cardElement.setAttribute("data-pile-index", 0);
            cardElement.setAttribute("data-card-id", topCard.id);
            cardElement.style.cursor = "pointer";
            cardElement.addEventListener("click", onCardClick);
            blitzElement.appendChild(cardElement);
        }
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
                cardElement.setAttribute("data-pile-type", "post");
                cardElement.setAttribute("data-pile-index", i);
                cardElement.setAttribute("data-card-id", topCard.id);
                cardElement.style.cursor = "pointer";
                cardElement.addEventListener("click", onCardClick);
                postElement.appendChild(cardElement);
            }
        }
    }
}

function showPlayerWood() {
    var woodElement = document.getElementById("player-wood");
    if (woodElement === null || woodElement === undefined) {
        return;
    }

    clearElement(woodElement);
    var woodPile = gamePiles.player.wood;
    if (woodPile === null || woodPile === undefined) {
        return;
    }

    if (woodPile.isEmpty() === false) {
        var topCard = woodPile.getTopCard();
        if (topCard !== null && topCard !== undefined) {
            var cardElement = topCard.display();
            cardElement.style.position = "relative";
            cardElement.style.left = "0";
            cardElement.style.top = "0";
            cardElement.setAttribute("data-pile-type", "wood");
            cardElement.setAttribute("data-pile-index", 0);
            cardElement.setAttribute("data-card-id", topCard.id);
            cardElement.style.cursor = "pointer";
            cardElement.addEventListener("click", onCardClick);
            woodElement.appendChild(cardElement);
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

function findCardInPile(pileType, pileIndex, cardId) {
    var pile = null;
    if (pileType === "hand") {
        pile = gamePiles.player.hand;
    } else if (pileType === "blitz") {
        pile = gamePiles.player.blitz;
    } else if (pileType === "wood") {
        pile = gamePiles.player.wood;
    } else if (pileType === "post") {
        pile = gamePiles.player.posts[pileIndex];
    }

    if (pile === null || pile === undefined) {
        return null;
    }

    for (var i = 0; i < pile.cards.length; i++) {
        var card = pile.cards[i];
        if (card !== null && card !== undefined && card.id === cardId) {
            return card;
        }
    }

    return null;
}

function getPileByType(pileType, pileIndex) {
    if (pileType === "hand") {
        return gamePiles.player.hand;
    }
    if (pileType === "blitz") {
        return gamePiles.player.blitz;
    }
    if (pileType === "wood") {
        return gamePiles.player.wood;
    }
    if (pileType === "post") {
        return gamePiles.player.posts[pileIndex];
    }
    return null;
}

function onCardClick(event) {
    var target = event.currentTarget;
    if (target === null || target === undefined) {
        return;
    }

    var pileType = target.getAttribute("data-pile-type");
    var pileIndex = Number(target.getAttribute("data-pile-index"));
    var cardId = Number(target.getAttribute("data-card-id"));
    if (isNaN(cardId)) {
        return;
    }

    var card = findCardInPile(pileType, pileIndex, cardId);
    if (card === null || card === undefined) {
        return;
    }

    var fromPile = getPileByType(pileType, pileIndex);
    if (fromPile === null || fromPile === undefined) {
        return;
    }

    for (var i = 0; i < gamePiles.central.length; i++) {
        var centralPile = gamePiles.central[i];
        if (canPlayCard(card, centralPile)) {
            moveCard(card, fromPile, centralPile);
            return;
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

        this.w = 70;
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

        cardElement.style.width = this.w + "px";
        cardElement.style.height = this.h + "px";
        cardElement.style.left = this.x + "px";
        cardElement.style.top = this.y + "px";

        return cardElement;
    } // display


} // end Card class
class Pile {
    constructor(type, x, y) {
        this.type = type;  // e.g. central, post
        this.cards = [];
        this.x = x;
        this.y = y;
        this.w = 70;
        this.h = 100;
    } // constructor

    addCard(card) {
        this.cards.push(card);
        card.x = this.x;
        card.y = this.y;
        // + (this.cards.length - 1) * 5
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
<<<<<<< HEAD
        this.wood = null;       // will hold 1 Pile object
        this.hand = null;       // will hold 1 Pile object
=======
        this.wood = [];       // will hold  Pile object
        this.hand = null;       // will hold 1 Pile object - OBSOLETEEEEEEEEEEEEEE
>>>>>>> 1d1e0fb2935965f07b8bc7ff33390acdee54063a
    }
} // end PlayerArea class
class BotArea {
    constructor() {
        this.blitz = null;      // will hold 1 Pile object
        this.posts = [];        // will hold 3 Pile objects
        this.wood = [];       // will hold 1 Pile object
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