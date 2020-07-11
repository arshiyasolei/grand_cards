const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.use(express.static(__dirname + '/'));

//probably needs an ai too
class player {
    constructor(arr) {
      this.cards = arr;
    }

  }
//Representing a Stack/list of cards with shuffling in the backend
class card_stack {
    constructor() {
      this.cards = [];
      //goal to create all images as objects
        let card_types = ["clubs","diamonds","spades","hearts"];
        let aceme = ["A","J","K","Q"];
        for (let card_t of card_types){
            for (let i = 2; i < 11; i ++){
                //Get image here
                let tempi = i;
                tempi.toString;
                //console.log("assets/png/" + tempi + "_of_" + card_t + ".png")
                let res = [null,i,card_t,null,null]
                this.cards.push(res)
            }
            for (let i of aceme){
                //Get image here
                let tempi = i;
                let res = [null,i,card_t,null,null]
                this.cards.push(res)
            }
    }

    }
    shuffle() {
        //https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
  }

let cards_left = new card_stack();
cards_left.shuffle()
let player_count = 2;
let players = []
for (let i = 1; i <= player_count; i++) {
    player_cards = []
    for (let idx = 0; idx < 7; idx++) {
        player_cards.push(cards_left.cards.pop())
    }
    players.push(new player(player_cards))
}

//let back_img = new Image("145.2", "204");
//back_img.src = "assets/png/back_dark" + ".png";

//top card on stack
let top_card = [cards_left.cards.pop()]

let over_valid_card = [1]

let whos_turn;
console.log(top_card)

app.get('/', function(req, res) {
    res.render('index.ejs');
});


let user_arr = []
io.sockets.on('connection', function(socket) {
    var room = io.sockets.adapter.rooms['game room'];
    
    if (!room || room.length < 3){
    socket.join('game room');
    room = io.sockets.adapter.rooms['game room'];
    
    socket.on('username', function(username) {
        socket.username = username;
       
        if (room.length == 2){
            socket.emit('player_num',1)
            console.log(Object.keys(room.sockets),user_arr)
            if (Object.keys(room.sockets)[0] == user_arr[0][1]){
                user_arr.push([username,Object.keys(room.sockets)[1]])
            } else {
                user_arr.push([username,Object.keys(room.sockets)[0]])
            }
            whos_turn = 0
            io.to(user_arr[1][1]).emit('turn', whos_turn);
            io.to(user_arr[1][1]).emit('give player cards', players[1],cards_left[cards_left.length-1],top_card[0]);
        } else {
            socket.emit('player_num',0)
            
            user_arr.push([username,Object.keys(room.sockets)[0]])
            whos_turn = 1;

            io.to(user_arr[0][1]).emit('turn', whos_turn);
            io.to(user_arr[0][1]).emit('give player cards', players[0],cards_left[cards_left.length-1],top_card[0]);
        }
        console.log("connection!");
        
        io.emit('is_online', '🔵 <i>' + socket.username + ' joined the chat..</i>');
    });

    socket.on('disconnect', function(username) {
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
    })

    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });
    
    //card logic
    console.log(room)

    //needs to hide the extra stack + other player cards
    //generate other player cards on their side
    //pass around content via strings (or arrays)
    socket.on('player move', function(move) {
        //update the given player and then emit to the other one
        
        if (move.username == user_arr[0][0]) {
            console.log("player1 fired")
            let i = move.i
            cards_left.cards.push(top_card[0])
            top_card[0] = players[0].cards[i]
            //removes card from player sta∂ck
            players[0].cards.splice(i, 1)
            //whos_turn = 1;
            move = {
                username: user_arr[1][0],
                top_card: top_card[0],
                cards_left: cards_left.cards[cards_left.cards.length-1]
            }
            io.to(user_arr[1][1]).emit('player move', move);
            io.to(user_arr[1][1]).emit('turn', 1);
            io.to(user_arr[0][1]).emit('turn', 0);
        } else {
            console.log("player2 fired")
            let i = move.i
            cards_left.cards.push(top_card[0])
            top_card[0] = players[1].cards[i]
            console.log(top_card[0])
            //removes card from player sta∂ck
            players[1].cards.splice(i, 1)
            //whos_turn = 1;
            move = {
                username: user_arr[0][0],
                top_card: top_card[0],
                cards_left: cards_left.cards[cards_left.cards.length-1]
            }
            io.to(user_arr[0][1]).emit('player move', move);
            io.to(user_arr[0][1]).emit('turn', 1);
            io.to(user_arr[1][1]).emit('turn', 0);
        }
        if (players[1].cards.length == 0){
            io.emit('game over', "player 2 won");
        } else if (players[0].cards.length == 0){
            io.emit('game over', "player 1 won");
        }
        cards_left.shuffle()
        //io.emit('player1 moves', move);
    });
    console.log("I am listening to add cards now")
    socket.on('player add card', function(move) {
        console.log(user_arr[0][0],move.username)
        if (move.username == user_arr[0][0]) {
            //check if cards_left is 0
            move.new_card = cards_left.cards.pop()
            players[0].cards.push(move.new_card)
            io.to(user_arr[0][1]).emit('player add card', move);
        } else {
            move.new_card = cards_left.cards.pop()
            players[1].cards.push(move.new_card)
            io.to(user_arr[1][1]).emit('player add card', move);
        }
        //io.emit('player2 moves', move);
    });
    socket.on('player update add card', function(move) {
        if (move.username == user_arr[0][0]) {
            //check if cards_left is 0
            //move.new_card = cards_left.cards.pop()
            io.to(user_arr[1][1]).emit('player update add card', cards_left.cards.length);
        } else {
            //cards_left.cards.length.new_card = cards_left.cards.pop()
            io.to(user_arr[0][1]).emit('player update add card', cards_left.cards.length);
        }
        //io.emit('player2 moves', move);
    });



    }

});

const server = http.listen(8080, function() {
    console.log('listening on *:8080');
});