// Main File
var allCards = [];
var draggedCardInfo = null;
var gameOver = false;
var easyMode = true;
var botTimers = [];
var selectedDesign = null;
var selectedDifficulty = 'beginner';
var availableDesigns = ["Pail", "Pump", "Carriage", "Plow", "Ferret", "Dog", "Crow", "Cat"];
var botDeckDesigns = [];
var cumulativeScores = {
    player: 0,
    bots: [0, 0, 0]
};
var tournamentOver = false;
var tournamentStats = [];

function getCardImagePath(color, number) {
    if (color === "Yellow") {
        return "Images/frontSide/Yellow/Y_" + number + ".png";
    }
    if (color === "Green") {
        if (number === 2) return "Images/frontSide/Green/G_2 .png";
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

function getCardBackImagePath(design) {
    if (design === "Pail") return "Images/backSide/back_pail_Y.png";
    if (design === "Pump") return "Images/backSide/back_pump_G.png";
    if (design === "Carriage") return "Images/backSide/back_carriage_R.png";
    if (design === "Plow") return "Images/backSide/back_plow_B.png";
    if (design === "Ferret") return "Images/backSide/YellowFerret.png";
    if (design === "Dog") return "Images/backSide/BlueDog.png";
    if (design === "Crow") return "Images/backSide/GreenCrow.png";
    if (design === "Cat") return "Images/backSide/RedCat.png";

    if (design === "Yellow") return "Images/backSide/back_pail_Y.png";
    if (design === "Green") return "Images/backSide/back_pump_G.png";
    if (design === "Red") return "Images/backSide/back_carriage_R.png";
    if (design === "Blue") return "Images/backSide/back_plow_B.png";

    return null;
}

function getDesignForColor(color) {
    if (color === "Yellow") return "Pail";
    if (color === "Green") return "Pump";
    if (color === "Red") return "Carriage";
    if (color === "Blue") return "Plow";
    return "Pail";
}

function createDeck(deckDesign) {
    var deck = [];
    var colors = ["Yellow", "Green", "Red", "Blue"];
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var cardId = 1;

    for (var i = 0; i < colors.length; i++) {
        var color = colors[i];
        var design = deckDesign || getDesignForColor(color);
        for (var j = 0; j < numbers.length; j++) {
            var number = numbers[j];
            var image = getCardImagePath(color, number);
            if (color === "Yellow" || color === "Green")  {
                deck.push(new Card(design, color, number, "girl", cardId, image));
            } else if (color === "Blue" || color === "Red") {
                deck.push(new Card(design, color, number, "boy", cardId, image));
            }
            cardId = cardId + 1;
        }
    }

    allCards = deck;
    return deck;
} // end createDeck function

function createHighCardDeck(deckDesign) {
    // For advanced mode 
    var deck = [];
    var colors = ["Yellow", "Green", "Red", "Blue"];
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var cardId = 1;

    for (var i = 0; i < colors.length; i++) {
        var color = colors[i];
        var design = deckDesign || getDesignForColor(color);
        for (var j = 0; j < numbers.length; j++) {
            var number = numbers[j];
            var image = getCardImagePath(color, number);
            if (color === "Yellow" || color === "Green")  {
                deck.push(new Card(design, color, number, "girl", cardId, image));
            } else if (color === "Blue" || color === "Red") {
                deck.push(new Card(design, color, number, "boy", cardId, image));
            }
            cardId = cardId + 1;
        }
    }

    allCards = deck;
    return deck;
}

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

    if (selectedDifficulty === 'advanced') {
        // Advanced mode: 
        var highCards = [];
        var lowCards = [];
        for (var hc = 0; hc < deck.length; hc++) {
            if (deck[hc].num >= 5) highCards.push(deck[hc]);
            else lowCards.push(deck[hc]);
        }

        highCards = shuffleDeck(highCards);
        lowCards = shuffleDeck(lowCards);

        for (var p = 0; p < 3; p++) {
            var cardToGive = null;
            if (highCards.length > 0) cardToGive = highCards.pop();
            else if (lowCards.length > 0) cardToGive = lowCards.pop();
            if (cardToGive) gamePiles.player.posts[p].addCard(cardToGive);
        }

        var blitzArr = [];
        for (var i = 0; i < 9; i++) {
            var c = null;
            if (lowCards.length > 0) c = lowCards.pop();
            else if (highCards.length > 0) c = highCards.pop();
            if (c) blitzArr.push(c);
        }
        // 10th card 
        var tenth = null;
        if (highCards.length > 0) tenth = highCards.pop();
        else if (lowCards.length > 0) tenth = lowCards.pop();
        if (tenth) blitzArr.push(tenth);

        for (var bi = 0; bi < blitzArr.length; bi++) {
            gamePiles.player.blitz.addCard(blitzArr[bi]);
        }

        while (lowCards.length > 0) gamePiles.player.hand.addCard(lowCards.pop());
        while (highCards.length > 0) gamePiles.player.hand.addCard(highCards.pop());
    } else {
        // Beginner and Intermediate:
        var cardIndex = 0;

        // Deal the player's Blitz pile 
        for (var i = 0; i < 10; i++) {
            var card = deck[cardIndex];
            gamePiles.player.blitz.addCard(card);
            cardIndex = cardIndex + 1;
            console.log(card);
        }

        // Deal the player's Post piles 
        for (var k = 0; k < 3; k++) {
            var card3 = deck[cardIndex];
            gamePiles.player.posts[k].addCard(card3);
            cardIndex = cardIndex + 1;
            console.log(card3);
        }

        // Remaining cards 
        for (var m = cardIndex; m < deck.length; m++) {
            var card4 = deck[m];
            gamePiles.player.hand.addCard(card4);
            cardIndex = cardIndex + 1;
            console.log(card4);
        }
    }

    showPlayerHand();
    showPlayerWood();
    showPlayerBlitz();
    showPlayerPosts();
    showCentralPiles();

    
    for (var b = 0; b < gamePiles.bots.length; b++) {
        var botDesign = botDeckDesigns[b] || availableDesigns[b];
        var botDeck = createDeck(botDesign);
        shuffleDeck(botDeck);
        var bi = 0;
      
        for (var x = 0; x < 10 && bi < botDeck.length; x++) {
            gamePiles.bots[b].blitz.addCard(botDeck[bi++]);
        }
       
        for (var y = 0; y < 3 && bi < botDeck.length; y++) {
            gamePiles.bots[b].posts[y].addCard(botDeck[bi++]);
        }
      
        while (bi < botDeck.length) {
            gamePiles.bots[b].hand.addCard(botDeck[bi++]);
        }
        
        showBotArea(b);
    }

    setTimeout(setupBotsAI, 2200);
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
    if (gameOver) return false;
    if (canPlayCard(card, toPile) === false) {
        return false;
    }

    if (fromPile === null || fromPile === undefined) return false;

    var removed = null;
    for (var i = fromPile.cards.length - 1; i >= 0; i--) {
        if (fromPile.cards[i] && fromPile.cards[i].id === card.id) {
            removed = fromPile.cards.splice(i, 1)[0];
            break;
        }
    }

    if (removed === null || removed === undefined) {
        return false;
    }
   
    var prevTop = toPile.getTopCard();
    var willFlipAndFaceDown = false;
    if (prevTop && prevTop.num === 9 && removed.num === 10 && toPile.type === 'central') {
        willFlipAndFaceDown = true;
        removed.faceDown = true;
    }

    toPile.addCard(removed);
    showPlayerHand();
    showPlayerBlitz();
    showPlayerPosts();
    showPlayerWood();
    showCentralPiles();

    if (willFlipAndFaceDown) {
        try {
            var centralIndex = -1;
            for (var ci = 0; ci < gamePiles.central.length; ci++) {
                if (gamePiles.central[ci] === toPile) { centralIndex = ci; break; }
            }
            if (centralIndex >= 0) {
                var centralEls = document.querySelectorAll('#central-piles .central-pile');
                var targetEl = centralEls && centralEls[centralIndex] ? centralEls[centralIndex] : null;
                if (targetEl) {
                    targetEl.classList.add('flip-animate');
                    var onEnd = function() { targetEl.classList.remove('flip-animate'); targetEl.removeEventListener('animationend', onEnd); };
                    targetEl.addEventListener('animationend', onEnd);
                }
            }
        } catch (e) {}
    }

    for (var bi = 0; bi < gamePiles.bots.length; bi++) {
        var bArea = gamePiles.bots[bi];
        if (bArea) showBotArea(bi);
    }
    checkForBlitzWinner();
    return true;
} // end moveCard function

function moveHandCardsToWood() {
    if (gameOver) return;
    var handPile = gamePiles.player.hand;
    var woodPile = gamePiles.player.wood;
    if (handPile === null || handPile === undefined || handPile.isEmpty()) {
        return;
    }
    for (var i = 0; i < 3 && !handPile.isEmpty(); i++) {
        var card = handPile.removeTopCard();
        if (card !== null && card !== undefined) {
            woodPile.addCard(card);
        }
    }
    showPlayerHand();
    showPlayerWood();
}

function onHandPileClick(event) {
    if (gameOver) return;
    moveHandCardsToWood();
}

function onWoodClick(event) {
    if (gameOver) return;
    var handPile = gamePiles.player.hand;
    var woodPile = gamePiles.player.wood;
    if (handPile === null || woodPile === null) return;

  
    if (!handPile.isEmpty()) return;
    if (woodPile.isEmpty()) return;

    var woodElement = document.getElementById('player-wood');
    if (woodElement) {
        var onAnimEnd = function() {
            while (!woodPile.isEmpty()) {
                var c = woodPile.removeTopCard();
                if (c !== null && c !== undefined) {
                    handPile.addCard(c);
                }
            }
            showPlayerHand();
            showPlayerWood();
            woodElement.classList.remove('flip-animate');
            woodElement.removeEventListener('animationend', onAnimEnd);
        };
        woodElement.addEventListener('animationend', onAnimEnd);
        woodElement.classList.add('flip-animate');
    } else {
        while (!woodPile.isEmpty()) {
            var c2 = woodPile.removeTopCard();
            if (c2 !== null && c2 !== undefined) {
                handPile.addCard(c2);
            }
        }
        showPlayerHand();
        showPlayerWood();
    }
}

function setupGame() {
    clearAllBotTimers();
    hideResultScreen();
    gameOver = false;
    gamePiles = new GamePiles();
    setupGamePiles();
    if (!selectedDesign) {
        selectedDesign = availableDesigns[0];
    }
    botDeckDesigns = availableDesigns.filter(function(design) {
        return design !== selectedDesign;
    });
    shuffleDeck(botDeckDesigns);
    var deck = createDeck(selectedDesign);  // shuffle and distribute cards
    shuffleDeck(deck);
    dealCards(deck);
    setupDragAndDrop();
    updateSelectedDesignLabel();
} // end setupGame function

function calculateScores() {
    var centralCounts = {
        player: 0,
        bots: [0, 0, 0]
    };

    for (var ci = 0; ci < gamePiles.central.length; ci++) {
        var pile = gamePiles.central[ci];
        if (!pile || pile.isEmpty()) continue;
        for (var pi = 0; pi < pile.cards.length; pi++) {
            var card = pile.cards[pi];
            if (!card) continue;
            if (card.design === selectedDesign) {
                centralCounts.player += 1;
            } else {
                for (var bi = 0; bi < botDeckDesigns.length; bi++) {
                    if (card.design === botDeckDesigns[bi]) {
                        centralCounts.bots[bi] += 1;
                        break;
                    }
                }
            }
        }
    }

    var scores = [];
    var playerBlitzLeft = gamePiles.player.blitz.cards.length;
    var playerScore = centralCounts.player - playerBlitzLeft * 2;
    scores.push({
        name: 'You',
        centerCount: centralCounts.player,
        blitzLeft: playerBlitzLeft,
        score: playerScore,
        cumulativeScore: cumulativeScores.player + playerScore
    });

    for (var bi = 0; bi < gamePiles.bots.length; bi++) {
        var botBlitzLeft = gamePiles.bots[bi].blitz.cards.length;
        var botScore = centralCounts.bots[bi] - botBlitzLeft * 2;
        scores.push({
            name: 'Bot ' + (bi + 1),
            centerCount: centralCounts.bots[bi],
            blitzLeft: botBlitzLeft,
            score: botScore,
            cumulativeScore: cumulativeScores.bots[bi] + botScore
        });
    }
    
    // Store stats for this round
    var roundStats = {
        player: { centerPlaced: centralCounts.player, blitzLeft: playerBlitzLeft },
        bots: []
    };
    for (var bi = 0; bi < gamePiles.bots.length; bi++) {
        roundStats.bots.push({
            centerPlaced: centralCounts.bots[bi],
            blitzLeft: gamePiles.bots[bi].blitz.cards.length
        });
    }
    scores.roundStats = roundStats;
    
    return scores;
}

function showResultScreen(resultType, winnerName, scores) {
    var screen = document.getElementById('result-screen');
    if (!screen) return;
    screen.classList.remove('hidden');
    screen.dataset.resultType = resultType;
    screen.classList.remove('result-win', 'result-lose');
    if (resultType === 'win') {
        screen.classList.add('result-win');
    } else {
        screen.classList.add('result-lose');
    }
    
    var title = document.getElementById('result-title');
    var subtitle = document.getElementById('result-subtitle');
    var scoreList = document.getElementById('result-scores');
    var nextRoundBtn = document.getElementById('next-round-btn');
    
    if (title) {
        title.textContent = resultType === 'win' ? 'You Won This Round!' : 'You Lost This Round';
    }
    if (subtitle) {
        subtitle.textContent = 'Winner: ' + winnerName;
    }
    if (scoreList) {
        scoreList.innerHTML = '';
        scores.forEach(function(entry) {
            var row = document.createElement('div');
            row.className = 'result-score-row';
            row.innerHTML = '<strong>' + entry.name + '</strong>: ' + entry.score + ' pts ' +
                '(+' + entry.centerCount + ' center, -' + (entry.blitzLeft * 2) + ' blitz) | ' +
                'Total: <strong>' + entry.cumulativeScore + '</strong>';
            scoreList.appendChild(row);
        });
    }
    
    var winner = checkTournamentWinner(scores);
    if (winner) {
        setTimeout(function() {
            showFinalWinnerScreen(winner, scores);
        }, 3000);
    } else {
        if (nextRoundBtn) {
            nextRoundBtn.style.display = 'block';
        }
    }
}

function showFinalWinnerScreen(winner, scores) {
    hideResultScreen();
    var screen = document.getElementById('final-winner-screen');
    if (!screen) return;
    screen.classList.remove('hidden', 'result-win', 'result-lose');

    if (winner.name === 'You') {
        screen.classList.add('result-win');
    } else {
        screen.classList.add('result-lose');
    }
    
    var title = document.getElementById('final-winner-title');
    var scoreList = document.getElementById('final-winner-scores');
    var statsBtn = document.getElementById('view-stats-btn');
    
    if (title) {
        title.textContent = winner.name + ' Won the Tournament!';
    }
    if (scoreList) {
        scoreList.innerHTML = '';
        scores.forEach(function(entry) {
            var row = document.createElement('div');
            row.className = 'result-score-row';
            row.innerHTML = '<strong>' + entry.name + '</strong>: <strong>' + entry.cumulativeScore + ' pts</strong>';
            scoreList.appendChild(row);
        });
    }
    
 
    if (statsBtn) {
        statsBtn.style.display = 'block';
        statsBtn.onclick = showStatsScreen;
    }
}

function hideFinalWinnerScreen() {
    var screen = document.getElementById('final-winner-screen');
    if (screen) {
        screen.classList.add('hidden');
    }
}

function showStatsScreen() {
    var screen = document.getElementById('stats-screen');
    if (!screen) return;
    screen.classList.remove('hidden');
    
    var statsList = document.getElementById('tournament-stats-list');
    if (!statsList) return;
    statsList.innerHTML = '';
    
    // Create headers
    var headerRow = document.createElement('div');
    headerRow.className = 'stats-header-row';
    headerRow.innerHTML = '<div class="stats-col"><strong>Round</strong></div>' +
                          '<div class="stats-col"><strong>Player</strong></div>' +
                          '<div class="stats-col"><strong>Center Cards</strong></div>' +
                          '<div class="stats-col"><strong>Blitz Left</strong></div>' +
                          '<div class="stats-col"><strong>Bot 1</strong></div>' +
                          '<div class="stats-col"><strong>Center Cards</strong></div>' +
                          '<div class="stats-col"><strong>Blitz Left</strong></div>' +
                          '<div class="stats-col"><strong>Bot 2</strong></div>' +
                          '<div class="stats-col"><strong>Center Cards</strong></div>' +
                          '<div class="stats-col"><strong>Blitz Left</strong></div>' +
                          '<div class="stats-col"><strong>Bot 3</strong></div>' +
                          '<div class="stats-col"><strong>Center Cards</strong></div>' +
                          '<div class="stats-col"><strong>Blitz Left</strong></div>';
    statsList.appendChild(headerRow);
    
    // Add each round's stats
    for (var roundIdx = 0; roundIdx < tournamentStats.length; roundIdx++) {
        var roundData = tournamentStats[roundIdx];
        var row = document.createElement('div');
        row.className = 'stats-data-row';
        var html = '<div class="stats-col">' + (roundIdx + 1) + '</div>' +
                   '<div class="stats-col">You</div>' +
                   '<div class="stats-col">' + roundData.player.centerPlaced + '</div>' +
                   '<div class="stats-col">' + roundData.player.blitzLeft + '</div>';
        
        for (var bi = 0; bi < roundData.bots.length; bi++) {
            html += '<div class="stats-col">Bot ' + (bi + 1) + '</div>' +
                    '<div class="stats-col">' + roundData.bots[bi].centerPlaced + '</div>' +
                    '<div class="stats-col">' + roundData.bots[bi].blitzLeft + '</div>';
        }
        
        row.innerHTML = html;
        statsList.appendChild(row);
    }
}

function hideStatsScreen() {
    var screen = document.getElementById('stats-screen');
    if (screen) {
        screen.classList.add('hidden');
    }
}

function checkTournamentWinner(scores) {
    for (var i = 0; i < scores.length; i++) {
        if (scores[i].cumulativeScore >= 75) {
            return scores[i];
        }
    }
    return null;
}

function hideResultScreen() {
    var screen = document.getElementById('result-screen');
    if (!screen) return;
    screen.classList.add('hidden');
    var nextRoundBtn = document.getElementById('next-round-btn');
    if (nextRoundBtn) {
        nextRoundBtn.style.display = 'none';
    }
}

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
        var backImagePath = getCardBackImagePath(card.backDesign || card.color);
        if (backImagePath !== null) {
            cardElement.style.backgroundImage = "url('" + backImagePath + "')";
            cardElement.style.backgroundSize = "cover";
            cardElement.style.backgroundPosition = "center";
            cardElement.textContent = "";
        }
        cardElement.style.position = "absolute";
        cardElement.style.left = "0";
        cardElement.style.top = "0";
        cardElement.style.zIndex = i;
        handElement.appendChild(cardElement);
    }
    handElement.style.cursor = handPile.isEmpty() ? "default" : "pointer";
    handElement.removeEventListener("click", onHandPileClick);
    if (!handPile.isEmpty()) {
        handElement.addEventListener("click", onHandPileClick);
    }
}

function setupDragAndDrop() {
    var centralArea = document.getElementById("central-piles");
    if (centralArea === null || centralArea === undefined) {
        return;
    }

    var centralElements = centralArea.getElementsByClassName("central-pile");
    for (var i = 0; i < centralElements.length; i++) {
        var centralElement = centralElements[i];
        centralElement.setAttribute("data-pile-index", i);
        centralElement.addEventListener("dragover", onCentralPileDragOver);
        centralElement.addEventListener("dragleave", onCentralPileDragLeave);
        centralElement.addEventListener("drop", onCentralPileDrop);
    }

    var playerPostElements = document.querySelectorAll("#player-area .post-pile");
    for (var j = 0; j < playerPostElements.length; j++) {
        var postElement = playerPostElements[j];
        postElement.setAttribute("data-pile-index", j);
        postElement.addEventListener("dragover", onPostPileDragOver);
        postElement.addEventListener("dragleave", onPostPileDragLeave);
        postElement.addEventListener("drop", onPostPileDrop);
    }


}

function animateCardMove(sourceElement, targetElement, cb) {
    if (!sourceElement || !targetElement) {
        if (typeof cb === 'function') cb();
        return;
    }

    var sourceRect = sourceElement.getBoundingClientRect();
    var targetRect = targetElement.getBoundingClientRect();
    var clone = sourceElement.cloneNode(true);
    clone.classList.add('moving-card');
    clone.style.position = 'fixed';
    clone.style.left = sourceRect.left + 'px';
    clone.style.top = sourceRect.top + 'px';
    clone.style.width = sourceRect.width + 'px';
    clone.style.height = sourceRect.height + 'px';
    clone.style.margin = '0';
    clone.style.pointerEvents = 'none';
    clone.style.zIndex = 9999;
    clone.style.transform = 'translate(0, 0) scale(1)';
    clone.style.opacity = '1';
    document.body.appendChild(clone);


    var onCloneArrive = function() {
        // bounce target
        targetElement.classList.add('target-bounce');
        var onAnim = function() {
            targetElement.classList.remove('target-bounce');
            targetElement.removeEventListener('animationend', onAnim);
        };
        targetElement.addEventListener('animationend', onAnim);

        // remove clone
        if (clone.parentNode) clone.parentNode.removeChild(clone);
        if (typeof cb === 'function') cb();
    };

    requestAnimationFrame(function() {
        var deltaX = targetRect.left + (targetRect.width - sourceRect.width) / 2 - sourceRect.left;
        var deltaY = targetRect.top + (targetRect.height - sourceRect.height) / 2 - sourceRect.top;
        
        clone.style.transform = 'translate(' + deltaX + 'px, ' + deltaY + 'px) scale(0.96)';
        clone.style.opacity = '0.9';
    });

    
    var arrived = false;
    var arrivalHandler = function() {
        if (arrived) return;
        arrived = true;
        clone.removeEventListener('transitionend', arrivalHandler);
        onCloneArrive();
    };
    clone.addEventListener('transitionend', arrivalHandler);
    
    setTimeout(function() { if (!arrived) arrivalHandler(); }, 500);
}

function clearAllBotTimers() {
    botTimers.forEach(function(id) { clearTimeout(id); });
    botTimers = [];
}

function declareWinner(winner) {
    if (gameOver) return;
    gameOver = true;
    clearAllBotTimers();
    var scores = calculateScores();
    for (var i = 0; i < scores.length; i++) {
        if (i === 0) {
            cumulativeScores.player = scores[i].cumulativeScore;
        } else {
            cumulativeScores.bots[i - 1] = scores[i].cumulativeScore;
        }
    }
    
    // Store round stats in tournament stats
    if (scores.roundStats) {
        tournamentStats.push(scores.roundStats);
    }
    
    var resultType = winner === 'You' ? 'win' : 'lose';
    setTimeout(function() {
        showResultScreen(resultType, winner + ' reached Blitz', scores);
    }, 50);
}

function checkForBlitzWinner() {
    if (gameOver) return;
    if (gamePiles.player.blitz.isEmpty()) {
        declareWinner('You');
        return;
    }
    for (var i = 0; i < gamePiles.bots.length; i++) {
        if (gamePiles.bots[i].blitz.isEmpty()) {
            declareWinner('Bot ' + (i + 1));
            return;
        }
    }
}

function scheduleBotTick(botIndex) {
    if (gameOver) return;
    
    var baseDelay, variance;
    if (selectedDifficulty === 'beginner') {
        baseDelay = 2400;
        variance = 1000;
    } else if (selectedDifficulty === 'intermediate') {
        baseDelay = 1900;
        variance = 1000;
    } else {
        // advanced
        baseDelay = 1900;
        variance = 1000;
    }
    var delay = baseDelay + Math.floor(Math.random() * variance);
    botTimers[botIndex] = setTimeout(function() { botTick(botIndex); }, delay);
}

function setupBotsAI() {
    clearAllBotTimers();
    for (var b = 0; b < gamePiles.bots.length; b++) {
        scheduleBotTick(b);
    }
}

function botTick(botIndex) {
    if (gameOver) return;
    var botArea = gamePiles.bots[botIndex];
    if (!botArea) return;

    
    if (botArea.hand.isEmpty() && !botArea.wood.isEmpty()) {
        while (!botArea.wood.isEmpty()) {
            var c = botArea.wood.removeTopCard();
            botArea.hand.addCard(c);
        }
        showBotArea(botIndex);
        scheduleBotTick(botIndex);
        return;
    }

    var pileCandidates = [];
    if (!botArea.blitz.isEmpty()) pileCandidates.push({pile: botArea.blitz, type: 'blitz'});
    for (var p = 0; p < botArea.posts.length; p++) if (!botArea.posts[p].isEmpty()) pileCandidates.push({pile: botArea.posts[p], type: 'post', index: p});
    if (!botArea.wood.isEmpty()) pileCandidates.push({pile: botArea.wood, type: 'wood'});
    if (!botArea.hand.isEmpty()) pileCandidates.push({pile: botArea.hand, type: 'hand'});

    var botEl = document.getElementById('bot-' + (botIndex + 1));

    for (var i = 0; i < pileCandidates.length; i++) {
        var pinfo = pileCandidates[i];
        var pile = pinfo.pile;
        var ptype = pinfo.type;
        var card = pile.getTopCard();
        if (!card) continue;
       
        for (var cidx = 0; cidx < gamePiles.central.length; cidx++) {
            var central = gamePiles.central[cidx];
            if (canPlayCard(card, central)) {
                var sourceEl = null;
                if (botEl) {
                    if (ptype === 'blitz') sourceEl = botEl.querySelector('.bot-blitz') ? botEl.querySelector('.bot-blitz').firstElementChild : null;
                    else if (ptype === 'wood') sourceEl = botEl.querySelector('.wood-pile') ? botEl.querySelector('.wood-pile').firstElementChild : null;
                    else if (ptype === 'hand') {
                        var h = botEl.querySelector('.hand-pile');
                        sourceEl = h ? h.lastElementChild : null;
                    } else if (ptype === 'post') {
                        var postEls = botEl.querySelectorAll('.post-pile');
                        if (postEls && postEls.length > 0 && typeof pinfo.index === 'number') {
                            var pEl = postEls[pinfo.index];
                            sourceEl = pEl ? pEl.firstElementChild : null;
                        }
                    }
                }

                var centralEls = document.querySelectorAll('#central-piles .central-pile');
                var targetEl = centralEls && centralEls[cidx] ? centralEls[cidx] : null;

                var doBotMove = function() {
                    moveCard(card, pile, central);
                    showBotArea(botIndex);
                    scheduleBotTick(botIndex);
                };

                if (sourceEl && targetEl) {
                    animateCardMove(sourceEl, targetEl, function() {
                        doBotMove();
                    });
                } else {
                    doBotMove();
                }

                return; 
            }
        }
    }

   
    if (!botArea.blitz.isEmpty()) {
        var blitzCard = botArea.blitz.getTopCard();
        for (var postIndex = 0; postIndex < botArea.posts.length; postIndex++) {
            if (botArea.posts[postIndex].isEmpty() && canMoveCardToPost(blitzCard, botArea.blitz, botArea.posts[postIndex])) {
                (function(postIdx, cardId) {
                   
                    setTimeout(function() {
                        if (gameOver) return;
                        if (!botArea.blitz.isEmpty() && botArea.blitz.getTopCard().id === cardId && botArea.posts[postIdx].isEmpty()) {
                            botArea.posts[postIdx].addCard(botArea.blitz.removeTopCard());
                            showBotArea(botIndex);
                            checkForBlitzWinner();
                        }
                        scheduleBotTick(botIndex);
                    }, 1800 + Math.floor(Math.random() * 1100));
                })(postIndex, blitzCard.id);
                return;
            }
        }
    }

   
    if (!botArea.hand.isEmpty()) {
        for (var j = 0; j < 3 && !botArea.hand.isEmpty(); j++) {
            var cardToWood = botArea.hand.removeTopCard();
            if (cardToWood) {
                botArea.wood.addCard(cardToWood);
            }
        }
        showBotArea(botIndex);
    }

    scheduleBotTick(botIndex);
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
            cardElement.style.cursor = "grab";
            cardElement.draggable = true;
            cardElement.addEventListener("dragstart", onCardDragStart);
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
        postElement.setAttribute("data-pile-index", i);
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
                cardElement.style.cursor = "grab";
                cardElement.draggable = true;
                cardElement.addEventListener("dragstart", onCardDragStart);
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
            cardElement.style.cursor = "grab";
            cardElement.draggable = true;
            cardElement.addEventListener("dragstart", onCardDragStart);
            woodElement.appendChild(cardElement);
        }
    }

    woodElement.removeEventListener('click', onWoodClick);
    woodElement.addEventListener('click', onWoodClick);
}

function showBotArea(botIndex) {
    var bot = document.getElementById('bot-' + (botIndex + 1));
    if (!bot) return;

    var botBlitzEl = bot.querySelector('.bot-blitz');
    var botPostRow = bot.querySelector('.pile-row');
    var botWoodEl = bot.querySelector('.wood-pile');
    var botHandEl = bot.querySelector('.hand-pile');

    // Blitz
    if (botBlitzEl) {
        clearElement(botBlitzEl);
        var blitzPile = gamePiles.bots[botIndex].blitz;
        if (!blitzPile.isEmpty()) {
            var top = blitzPile.getTopCard();
            if (top) {
                var el = top.display();
                
                el.style.cursor = 'default';
                botBlitzEl.appendChild(el);
            }
        }
    }

    // Posts
    if (botPostRow) {
     
        var postEls = botPostRow.getElementsByClassName('post-pile');
        for (var i = 0; i < postEls.length && i < gamePiles.bots[botIndex].posts.length; i++) {
            var pEl = postEls[i];
            clearElement(pEl);
            var pPile = gamePiles.bots[botIndex].posts[i];
            if (!pPile.isEmpty()) {
                var top = pPile.getTopCard();
                if (top) {
                    var el = top.display();
                    el.style.cursor = 'default';
                    pEl.appendChild(el);
                }
            }
        }
    }

    // Wood
    if (botWoodEl) {
        clearElement(botWoodEl);
        var wPile = gamePiles.bots[botIndex].wood;
        if (!wPile.isEmpty()) {
            var top = wPile.getTopCard();
            if (top) {
                var el = top.display();
                el.style.cursor = 'default';
                botWoodEl.appendChild(el);
            }
        }
    }

    // Hand
    if (botHandEl) {
        clearElement(botHandEl);
        var hPile = gamePiles.bots[botIndex].hand;
        if (!hPile.isEmpty()) {
            botHandEl.style.position = 'relative';
            botHandEl.style.width = '70px';
            botHandEl.style.height = '100px';
            for (var j = 0; j < hPile.cards.length; j++) {
                var card = hPile.cards[j];
                var el = card.display();
                var back = getCardBackImagePath(card.backDesign || card.color);
                if (back) {
                    el.style.backgroundImage = "url('" + back + "')";
                    el.style.backgroundSize = 'cover';
                    el.style.backgroundPosition = 'center';
                    el.textContent = '';
                }
                el.style.position = 'absolute';
                el.style.left = '0';
                el.style.top = '0';
                el.style.zIndex = j;
                el.style.cursor = 'default';
                botHandEl.appendChild(el);
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
        centralElement.setAttribute("data-pile-index", i);

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

function onCardDragStart(event) {
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

    draggedCardInfo = {
        pileType: pileType,
        pileIndex: pileIndex,
        cardId: cardId,
        sourceElement: event.currentTarget
    };

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", JSON.stringify(draggedCardInfo));
}

function onCentralPileDragOver(event) {
    event.preventDefault();
    var target = event.currentTarget;
    if (target === null || target === undefined) {
        return;
    }

    var pileIndex = Number(target.getAttribute("data-pile-index"));
    if (isNaN(pileIndex)) {
        return;
    }

    if (draggedCardInfo === null) {
        return;
    }

    var card = findCardInPile(draggedCardInfo.pileType, draggedCardInfo.pileIndex, draggedCardInfo.cardId);
    var centralPile = gamePiles.central[pileIndex];
    if (card !== null && card !== undefined && canPlayCard(card, centralPile)) {
        event.dataTransfer.dropEffect = "move";
        target.classList.add("drag-over");
    } else {
        event.dataTransfer.dropEffect = "none";
        target.classList.remove("drag-over");
    }
}

function onCentralPileDragLeave(event) {
    var target = event.currentTarget;
    if (target !== null && target !== undefined) {
        target.classList.remove("drag-over");
    }
}

function onCentralPileDrop(event) {
    if (gameOver) return;
    event.preventDefault();
    var target = event.currentTarget;
    if (target === null || target === undefined) {
        return;
    }

    target.classList.remove("drag-over");

    var pileIndex = Number(target.getAttribute("data-pile-index"));
    if (isNaN(pileIndex)) {
        return;
    }

    var cardData = null;
    try {
        var rawData = event.dataTransfer.getData("text/plain");
        if (rawData) {
            cardData = JSON.parse(rawData);
        }
    } catch (e) {
        cardData = draggedCardInfo;
    }

    if (cardData === null || cardData === undefined) {
        cardData = draggedCardInfo;
    }

    if (cardData === null || cardData === undefined) {
        return;
    }

    var card = findCardInPile(cardData.pileType, cardData.pileIndex, cardData.cardId);
    var fromPile = getPileByType(cardData.pileType, cardData.pileIndex);
    var toPile = gamePiles.central[pileIndex];

    if (card === null || card === undefined || fromPile === null || fromPile === undefined || toPile === null || toPile === undefined) {
        return;
    }

    var sourceElement = draggedCardInfo && draggedCardInfo.sourceElement ? draggedCardInfo.sourceElement : null;
    if (sourceElement) {
        animateCardMove(sourceElement, target, function() {
            moveCard(card, fromPile, toPile);
        });
    } else {
        moveCard(card, fromPile, toPile);
    }
    draggedCardInfo = null;
}

function canMoveCardToPost(card, fromPile, postPile) {
    if (card === null || card === undefined) {
        return false;
    }
    if (fromPile === null || fromPile === undefined) {
        return false;
    }
    if (postPile === null || postPile === undefined) {
        return false;
    }

    return fromPile.type === "blitz" && postPile.type === "post" && postPile.isEmpty();
}

function onPostPileDragOver(event) {
    event.preventDefault();
    var target = event.currentTarget;
    if (target === null || target === undefined) {
        return;
    }

    var pileIndex = Number(target.getAttribute("data-pile-index"));
    if (isNaN(pileIndex)) {
        return;
    }

    if (draggedCardInfo === null) {
        return;
    }

    var card = findCardInPile(draggedCardInfo.pileType, draggedCardInfo.pileIndex, draggedCardInfo.cardId);
    var postPile = gamePiles.player.posts[pileIndex];
    if (card !== null && card !== undefined && canMoveCardToPost(card, getPileByType(draggedCardInfo.pileType, draggedCardInfo.pileIndex), postPile)) {
        event.dataTransfer.dropEffect = "move";
        target.classList.add("drag-over");
    } else {
        event.dataTransfer.dropEffect = "none";
        target.classList.remove("drag-over");
    }
}

function onPostPileDragLeave(event) {
    var target = event.currentTarget;
    if (target !== null && target !== undefined) {
        target.classList.remove("drag-over");
    }
}

function onPostPileDrop(event) {
    if (gameOver) return;
    event.preventDefault();
    var target = event.currentTarget;
    if (target === null || target === undefined) {
        return;
    }

    target.classList.remove("drag-over");

    var pileIndex = Number(target.getAttribute("data-pile-index"));
    if (isNaN(pileIndex)) {
        return;
    }

    var cardData = null;
    try {
        var rawData = event.dataTransfer.getData("text/plain");
        if (rawData) {
            cardData = JSON.parse(rawData);
        }
    } catch (e) {
        cardData = draggedCardInfo;
    }

    if (cardData === null || cardData === undefined) {
        cardData = draggedCardInfo;
    }

    if (cardData === null || cardData === undefined) {
        return;
    }

    var card = findCardInPile(cardData.pileType, cardData.pileIndex, cardData.cardId);
    var fromPile = getPileByType(cardData.pileType, cardData.pileIndex);
    var toPile = gamePiles.player.posts[pileIndex];

    if (card === null || card === undefined || fromPile === null || fromPile === undefined || toPile === null || toPile === undefined) {
        return;
    }

    if (canMoveCardToPost(card, fromPile, toPile)) {
        var sourceElement = draggedCardInfo && draggedCardInfo.sourceElement ? draggedCardInfo.sourceElement : null;
        var doMoveToPost = function() {
            fromPile.removeTopCard();
            toPile.addCard(card);
            showPlayerBlitz();
            showPlayerPosts();
            checkForBlitzWinner();
        };
        if (sourceElement) {
            animateCardMove(sourceElement, target, doMoveToPost);
        } else {
            doMoveToPost();
        }
    }

    draggedCardInfo = null;
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
    if (gameOver) return;
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

function updateSelectedDesignLabel() {
    var label = document.getElementById('selected-design-label');
    if (label) {
        if (selectedDesign) {
            label.textContent = 'Selected Design: ' + selectedDesign;
        } else {
            label.textContent = 'Pick a design to start';
        }
    }
}

function setDesignSelection(design) {
    selectedDesign = design;
    botDeckDesigns = availableDesigns.filter(function(d) {
        return d !== design;
    });
    var screen = document.getElementById('design-screen');
    if (screen) {
        screen.classList.add('hidden');
    }
    // Show difficulty screen instead
    var diffScreen = document.getElementById('difficulty-screen');
    if (diffScreen) {
        diffScreen.classList.remove('hidden');
    }
    updateSelectedDesignLabel();
}

function initDesignSelection() {
    var startButtonEl = document.getElementById('start-game-btn');
    if (startButtonEl) {
        startButtonEl.disabled = true;
    }
    updateSelectedDesignLabel();
    var optionElements = document.querySelectorAll('.design-option');
    optionElements.forEach(function(option) {
        option.addEventListener('click', function() {
            var design = option.getAttribute('data-design');
            if (design) {
                setDesignSelection(design);
            }
        });
    });
}

initDesignSelection();

var difficultyOptions = document.querySelectorAll('.difficulty-option');
difficultyOptions.forEach(function(option) {
    option.addEventListener('click', function() {
        var difficulty = option.getAttribute('data-difficulty');
        if (difficulty) {
            selectedDifficulty = difficulty;
            var diffScreen = document.getElementById('difficulty-screen');
            if (diffScreen) {
                diffScreen.classList.add('hidden');
            }
            setupGame();
        }
    });
});

var playAgainButton = document.getElementById('play-again-btn');
if (playAgainButton !== null && playAgainButton !== undefined) {
    playAgainButton.addEventListener('click', function() {
        cumulativeScores = { player: 0, bots: [0, 0, 0] };
        tournamentStats = [];
        selectedDesign = null;
        selectedDifficulty = 'beginner';
        hideFinalWinnerScreen();
        hideResultScreen();
        var designScreen = document.getElementById('design-screen');
        if (designScreen) {
            designScreen.classList.remove('hidden');
        }
        var diffScreen = document.getElementById('difficulty-screen');
        if (diffScreen) {
            diffScreen.classList.add('hidden');
        }
    });
}

var nextRoundButton = document.getElementById('next-round-btn');
if (nextRoundButton !== null && nextRoundButton !== undefined) {
    nextRoundButton.addEventListener('click', function() {
        hideResultScreen();
        setupGame();
    });
}

var restartTournamentButton = document.getElementById('restart-tournament-btn');
if (restartTournamentButton !== null && restartTournamentButton !== undefined) {
    restartTournamentButton.addEventListener('click', function() {
        cumulativeScores = { player: 0, bots: [0, 0, 0] };
        tournamentStats = [];
        selectedDesign = null;
        selectedDifficulty = 'beginner';
        hideFinalWinnerScreen();
        hideStatsScreen();
        var designScreen = document.getElementById('design-screen');
        if (designScreen) {
            designScreen.classList.remove('hidden');
        }
        var diffScreen = document.getElementById('difficulty-screen');
        if (diffScreen) {
            diffScreen.classList.add('hidden');
        }
    });
}

var viewStatsButton = document.getElementById('view-stats-btn');
if (viewStatsButton !== null && viewStatsButton !== undefined) {
    viewStatsButton.addEventListener('click', showStatsScreen);
}

var backFromStatsButton = document.getElementById('back-from-stats-btn');
if (backFromStatsButton !== null && backFromStatsButton !== undefined) {
    backFromStatsButton.addEventListener('click', hideStatsScreen);
}

class Card {
    constructor(design, color, num, type, id, image) {
        this.design = design;
        this.backDesign = design;
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
        this.faceDown = false;
    } // constructor

    display() {
        var cardElement = document.createElement("div");
        cardElement.className = "card";

        if (this.faceDown) {
            var back = getCardBackImagePath(this.backDesign || this.color);
            if (back) {
                cardElement.style.backgroundImage = "url('" + back + "')";
                cardElement.style.backgroundSize = "cover";
                cardElement.style.backgroundPosition = "center";
                cardElement.textContent = "";
            } else {
                cardElement.textContent = this.design + " " + this.color + " " + this.num;
            }
        } else if (this.image !== null && this.image !== undefined) {
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
        this.x = x;
        this.y = y;
        this.w = 70;
        this.h = 100;
    } // constructor

    addCard(card) {
        this.cards.push(card);
        card.x = this.x;
        card.y = this.y;
        
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
        this.bots = [];      
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
        this.blitz = null;      
        this.posts = [];        
        this.wood = null;       
        this.hand = null;       
    }
} // end PlayerArea class
class BotArea {
    constructor() {
        this.blitz = null;      
        this.posts = [];       
        this.wood = [];       
    }
} // end BotArea class

var gamePiles = new GamePiles();

function setupGamePiles() {
    for (var i = 0; i < 21; i++) {
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
        botArea.hand = new Pile('hand', 0, 0);
        gamePiles.bots.push(botArea);
    }
} 