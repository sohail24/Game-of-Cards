
let blackJackGameDetails  =  {
    "You" : {"div" : "#your-box-card-holder", "score" : 0, "score-span": "your-result"},
    "Dealer" : {"div": "#dealer-box-card-holder", "score" : 0 , "score-span": "dealer-result"},
    "Cards" : ['2','3','4','5','6','7','8','9','10','A','J','K','Q'],
    "CardsMap": {'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'J':10,'K':10,'Q':10, 'A': [1,10]} ,
    "wins": 0,
    "losses": 0,
    "draws": 0,
    "isStand" : false,
    "isHumanClickedHit": false
}

const you = blackJackGameDetails["You"];
const dealer = blackJackGameDetails["Dealer"];
const cards = blackJackGameDetails["Cards"];

const hitSound = new Audio("static/sounds/swish.m4a");
const winSound = new Audio("static/sounds/cash.mp3");
const lossSound = new Audio("static/sounds/aww.mp3");

document.querySelector("#hit").addEventListener('click', blackJackGame);
document.querySelector("#deal").addEventListener('click', clearCards)
document.querySelector("#stand").addEventListener('click',dealerLogic);


function blackJackGame(){
    if(blackJackGameDetails['isStand'] === false ){
        let card = randomCard();
        // console.log(card);
        addCards(card,you);
        addScores(card,you);
        // console.log(you["score"]);
        showScores(you);
    }  
    blackJackGameDetails['isHumanClickedHit'] = true;
}

function addCards(card,player){
    if(player["score"] <= 21){
        let cardImage = document.createElement("img");
        cardImage.src = 'static/images/'+card+'.png';
        cardImage.style.height = "150px";
        cardImage.style.width = "90x";
        document.querySelector(player["div"]).appendChild(cardImage);
        hitSound.play();
    }

    document.querySelector("#blackjack-result").textContent = "Let's Play";
    document.querySelector("#blackjack-result").style.color = "darkred  ";
}

function randomCard(){
    return cards[Math.floor(Math.random()*13)];
}

function clearCards(){
    if(blackJackGameDetails['isStand'] == true){
        let winner = computeWinner();
        showResult(winner);
    
        let yourCards = document.querySelector("#your-box-card-holder").querySelectorAll("img");
        let dealerCards = document.querySelector("#dealer-box-card-holder").querySelectorAll("img");
        
        for(let i=0; i<yourCards.length; i++){
            yourCards[i].remove();
        }
    
        for(let i=0; i<dealerCards.length; i++){
            dealerCards[i].remove();
        }
        
        you["score"] = 0;
        dealer["score"] = 0;
        document.getElementById(you["score-span"]).textContent  = 0;
        document.getElementById(you["score-span"]).style.color  = "black";
    
        document.getElementById(dealer["score-span"]).textContent  = 0;
        document.getElementById(dealer["score-span"]).style.color  = "black";
        
        blackJackGameDetails['isHumanClickedHit'] = false;
    }
}

function addScores(card,player){
    if(player["score"] <= 21){
        if(card === 'A')
        {
            // console.log(blackJackGameDetails["CardsMap"][card][1]);
            if(player["score"] + 10 > 21)    
                player["score"] += blackJackGameDetails["CardsMap"][card][0];
            else   
            player["score"] += blackJackGameDetails["CardsMap"][card][1];
        }
        else{
            player["score"] += blackJackGameDetails["CardsMap"][card];
        }
        console.log(player["score"]);
    
    }
}

function showScores(player){
    // console.log(player["score"]);
    // console.log(player["score-span"]);
     if(player["score"] > 21){
        document.getElementById(player["score-span"]).textContent  = "Busted";
        document.getElementById(player["score-span"]).style.color  = "red";
        // document.getElementById(dealer["score-span"]).textContent  = "";
    }

    else{
        document.getElementById(player["score-span"]).textContent = player["score"];
    }
}

function sleep (ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

async function dealerLogic(){
    blackJackGameDetails['isStand'] = true;
    
    if(blackJackGameDetails['isHumanClickedHit'] === true){
        while(blackJackGameDetails['Dealer']['score'] < 17 && blackJackGameDetails['isStand']){
            let card = randomCard();
            addCards(card,dealer);
            addScores(card,dealer); 
            showScores(dealer);
            await sleep(1000);
        }
    }
}

function computeWinner(){

    let winner;
    let yourScore = you["score"];
    let dealerScore = dealer["score"];
    
    
    blackJackGameDetails['isStand'] = false;

    if(yourScore <=21){
        //conditon: higher score than dealer or when dealer busts you are winner
        if(yourScore > dealerScore || dealerScore > 21){
            console.log("You Won!!!");
            winner = you;
            blackJackGameDetails["wins"]++;
        }

        else if(yourScore < dealerScore){
            console.log("You Lost!!");
            winner = dealer;
            blackJackGameDetails["losses"]++;
        }

        else if (yourScore === dealerScore){
            console.log("It's a Draw!!");
            blackJackGameDetails["draws"]++;
        }
    }
    
    //condition: when user busts but dealer doesnt bust
    else if (yourScore > 21 && dealerScore <= 21){
        console.log("You Lost!!");
        winner = dealer;
        blackJackGameDetails["losses"]++;
    }

    //condition: when you and the dealer busts
    else if( yourScore > 21 && dealerScore > 21){
        console.log("It's a Draw!!");
        blackJackGameDetails["draws"]++;
    }
    
    return winner;
}

function showResult(winner){
    let message, messageColor;
    document.querySelector("#wins").textContent = blackJackGameDetails["wins"];
    document.querySelector("#losses").textContent = blackJackGameDetails["losses"];
    document.querySelector("#draws").textContent = blackJackGameDetails["draws"];
    
    if(winner === you){
        message = "You Won!!";
        messageColor = "green";
        winSound.play();
    }

    else if (winner == dealer){
        message = "You Lost!!";
        messageColor = "red";
        lossSound.play();    
    }

    else{
        message = "It's a Draw";
        messageColor  = "black";
    }

    document.querySelector("#blackjack-result").textContent = message;
    document.querySelector("#blackjack-result").style.color = messageColor;
}