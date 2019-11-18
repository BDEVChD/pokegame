import { SSL_OP_TLS_ROLLBACK_BUG } from "constants"


//THIS IS MY STATE

var gameState = {
    userPokemon: '',
    rivalPokemon: '',
    pokemonDB: [
        {
            name: 'charmander',
            type: 'fire',
            hp: 39,
            attack: 52,
            defense: 43,
            level: 1,
            img: 'http://www.smogon.com/dex/media/sprites/xy/charmander.gif'
        },
        {
            name: 'bulbasaur',
            type: 'fire',
            hp: 45,
            attack: 49,
            defense: 49,
            level: 1,
            img: 'http://www.smogon.com/dex/media/sprites/xy/bulbasaur.gif'
        },
        {
            name: 'squirtle',
            type: 'water',
            hp: 44,
            attack: 48,
            defense: 65,
            level: 1,
            img: 'http://www.smogon.com/dex/media/sprites/xy/squirtle.gif'
        },


    ],
    elements: {

        pokemonsEl: document.querySelector('.select-screen').querySelectorAll('.character'),
        battleScreenEl: document.getElementById('battle-screen'),
        attackBtnsEl: document.getElementById('battle-screen').querySelectorAll('.attack')

    },

    init: function(){

console.log(gameState.elements.attackBtnsEl)

//this is the initial loop
var i = 0;
while (i < gameState.elements.pokemonsEl.length) {
    //add function to all characters on screen select
    gameState.elements.pokemonsEl[i].onclick = function () {
        //current pokemons name found in dataset.pokemon
        var pokemonName = this.dataset.pokemon
        //these are the images for elements on the battle screen
        var player1Img = document.querySelector('.player1').getElementsByTagName('img')
        var player2Img = document.querySelector('.player2').getElementsByTagName('img')
        //we save the current pokemon
        gameState.userPokemon = pokemonName
        //cpu will pick a pokemon
        gameState.cpuPick();

        //change screen to the battle scene

        gameState.elements.battleScreenEl.classList.toggle('active')

        //select data from current user pokemon
        gameState.currentPokemon = gameState.pokemonDB.filter(function (pokemon) {
            return pokemon.name == gameState.userPokemon
        });

        player1Img[0].src = gameState.currentPokemon[0].img
        //select data from current cpu (rival) pokemon
        gameState.currentRivalPokemon = gameState.pokemonDB.filter(function (pokemon) {
            return pokemon.name == gameState.rivalPokemon
        });

        player2Img[0].src = gameState.currentRivalPokemon[0].img;

        // This is the current user blow and cpu pokemon initial health level

        gameState.currentPokemon[0].health =gameState.calculateInitialHealth(gameState.currentPokemon);
        gameState.currentPokemon[0].originalhealth =gameState.calculateInitialHealth(gameState.currentPokemon);
        gameState.currentRivalPokemon[0].health =gameState.calculateInitialHealth(gameState.currentRivalPokemon);
        gameState.currentRivalPokemon[0].originalhealth =gameState.calculateInitialHealth(gameState.currentRivalPokemon);

        console.log(gameState)


    }
    i++
}

var a = 0
while (a < gameState.elements.attackBtnsEl.length) {
    gameState.elements.attackBtnsEl[a].onclick = function () {
        var attackName = this.dataset.attack
        gameState.currentUserAttack = attackName

        gameState.play(attackName, gameState.cpuAttack());
        };
    a++;
    }

},


cpuAttack: function () {
    var attacks = ['rock', 'paper', 'scissors'];

    return attacks[gameState.randomNumber(0, 3)];
},

 calculateInitialHealth: function (user) {

    return ((0.20 * Math.sqrt(user[0].level)) * user[0].defense) * user[0].hp;
},

attackMove: function (attack, level, stack, critical, enemy, attacker) {
    console.log(enemy.name + ' before ' + enemy.health);
    var attackAmount = ((attack * level) * (stack + critical)) / 7;
    enemy.health = enemy.health - attackAmount;

    var userHP = document.querySelector('.player1').querySelector('.stats').querySelector('.health').querySelector('.health-bar').querySelector('.inside')

    var cpuHP = document.querySelector('.player2').querySelector('.stats').querySelector('.health').querySelector('.health-bar').querySelector('.inside')
    if (enemy.owner == 'user'){
        var minusPercent = ((enemy.health *100) / enemy.originalhealth)
        userHP.style.width = ((minusPercent < 0) ? 0 : minusPercent) + '%'

    }
    else {
        var minusPercent = ((enemy.health *100) / enemy.originalhealth)
        cpuHP.style.width = ((minusPercent < 0) ? 0 : minusPercent) + '%'

    }
    gameState.checkWinner(enemy, attacker);
    console.log(enemy.name + ' after: ' + enemy.health);
},

checkWinner: function (enemy, attacker) {
    if (enemy.health <= 0) {
        console.log('hey there winnnORR' + attacker.name);
    }

},


    randomNumber: function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
},

    cpuPick: function () {
        do {
            gameState.rivalPokemon = gameState.elements.pokemonsEl[gameState.randomNumber(0, 3)].dataset.pokemon;
            console.log('looping ' + gameState.rivalPokemon)
        }
        while (gameState.userPokemon == gameState.rivalPokemon)

  
},

    play: function (userAttack, cpuAttack) {
    var currentPokemon = gameState.currentPokemon[0];
    var currentRivalPokemon = gameState.currentRivalPokemon[0];

    currentPokemon.owner = 'user'
    currentRivalPokemon.owner = 'cpu'

    switch (userAttack) {
        case 'rock':
            if (cpuAttack == 'paper') {
                if (currentRivalPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
                    gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, .5, currentRivalPokemon, currentRivalPokemon)

                    if (currentRivalPokemon.health >= 1) {
                        gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, 2, currentPokemon, currentRivalPokemon)
                        console.log('we lose, since paper drapes over rock')

                    }
                }
                //Notice that enemy is the final parameter, the CPU, then the opposite below


            }
            if (cpuAttack == 'rock') {
                if (currentRivalPokemon.health >= 1 && currentRivalPokemon.health >= 1) {

                    gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, 1, currentRivalPokemon, currentPokemon)
                    if (currentRivalPokemon.health >= 1) {

                        gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, 1, currentPokemon, currentRivalPokemon)
                        console.log('a Draw!')
                    }
                }

            }
            if (cpuAttack == 'scissors') {
                if (currentRivalPokemon.health >= 1 && currentRivalPokemon.health >= 1) {

                    gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, 2, currentRivalPokemon, currentPokemon)
                    if (currentRivalPokemon.health >= 1) {
                        gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, .5, currentPokemon, currentRivalPokemon)
                        console.log('we win, since rock squashes scissors')

                    }
                }
            }

            break;

        case 'paper':
            if (cpuAttack == 'paper') {
                if (currentRivalPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
                    gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, 1, currentRivalPokemon, currentPokemon)
                    if (currentRivalPokemon.health >= 1) {
                        gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, 1, currentPokemon, currentRivalPokemon)
                        console.log('a Draw')

                    }


                }


            }
            if (cpuAttack == 'rock') {
                if (currentRivalPokemon.health >= 1 && currentRivalPokemon.health >= 1) {

                    gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, 2, currentRivalPokemon, currentPokemon)
                    if (currentRivalPokemon.health >= 1) {

                        gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, .5, currentPokemon, currentRivalPokemon)
                        console.log('we win, paper wraps rock')
                    }

                }

            }
            if (cpuAttack == 'scissors') {
                if (currentRivalPokemon.health >= 1 && currentRivalPokemon.health >= 1) {

                    gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, .5, currentRivalPokemon, currentPokemon)
                    if (currentRivalPokemon.health >= 1) {
                        gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, 2, currentPokemon, currentRivalPokemon)
                        console.log('we lose, scissors dun cut us')
                    }

                }

            }

            break;

        case 'scissors':
            if (cpuAttack == 'paper') {
                if (currentRivalPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
                    gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, 2, currentRivalPokemon, currentPokemon)
                    if (currentRivalPokemon.health >= 1) {

                        gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, .5, currentPokemon, currentRivalPokemon)
                        console.log('we cut that shit up and then win')
                    }

                }

            }
            if (cpuAttack == 'rock') {
                if (currentRivalPokemon.health >= 1 && currentRivalPokemon.health >= 1) {

                    gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, .5, currentRivalPokemon, currentPokemon)
                    if (currentRivalPokemon.health >= 1) {
                        gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, 2, currentPokemon, currentRivalPokemon)
                        console.log('we lose, since rock smashed us to pieces')
                    }

                }

            }
            if (cpuAttack == 'scissors') {
                if (currentRivalPokemon.health >= 1 && currentRivalPokemon.health >= 1) {

                    gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, 1, currentRivalPokemon, currentPokemon)
                    if (currentRivalPokemon.health >= 1) {
                        gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, 1, currentPokemon, currentRivalPokemon)
                        console.log('a Draw')

                    }

                }

            }

            break;

        }
    }

};

gameState.init()



