import card_stack from "./card_stack.mjs"
import express from 'express';
import http from 'http';
import SocketIO from 'socket.io';
const port = "8080"
let app = express();
let server = http.Server(app);
let io = new SocketIO(server);
app.use(express.static('views'));
app.use(express.static('front_end_scripts'));
app.use("/assets",express.static('assets'));
//probably needs an ai too
class player {
    constructor(arr) {
      this.cards = arr;
    }
  }
//Representing a Stack/list of cards with shuffling in the backend
console.log(card_stack)
function game_start(events_functions,socket,roomid){
    let cards_left = new card_stack();
    console.log(cards_left)
    cards_left.shuffle()
    let player_count = 2;
    let players = []
    for (let i = 1; i <= player_count; i++) {
        let player_cards = []
        for (let idx = 0; idx < 7; idx++) {
            player_cards.push(cards_left.cards.pop())
        }
        players.push(new player(player_cards))
    }
    //let back_img = new Image("145.2", "204");
    //back_img.src = "assets/png/back_dark" + ".png";
    //top card on stack
    let top_card = [cards_left.cards.pop()]
    let whos_turn = 1;

    return (another_event_functions,s,r) => {
        //gives cards to player 1
        events_functions(socket,roomid,cards_left,top_card,players);
        io.to(user_arr[roomid][0][1]).emit('turn', whos_turn);
        io.to(user_arr[roomid][0][1]).emit('give player cards', players[0],cards_left[cards_left.length-1],top_card[0]);
        //gives cards to player 2
        another_event_functions(s,r,cards_left,top_card,players);
        whos_turn = 0;
        io.to(user_arr[roomid][1][1]).emit('turn', whos_turn);
        io.to(user_arr[roomid][1][1]).emit('give player cards', players[1],cards_left[cards_left.length-1],top_card[0]);
    
    }
    
}
//console.log(top_card)

app.get('/', function(req, res) {
    res.render('index.ejs');
});

function game_events(socket,roomid,cards_left,top_card,players){
    //needs to hide the extra stack + other player cards
    //generate other player cards on their side
    //pass around content via strings (or arrays)
    // player move: [function(move)]
    socket.on('player move', function(move) {
        //update the given player and then emit to the other one
        
        if (move.username == user_arr[roomid][0][0]) {
            console.log("player1 fired")
            let i = move.i
            cards_left.cards.push(top_card[0])
            top_card[0] = players[0].cards[i]
            //removes card from player sta∂ck
            players[0].cards.splice(i, 1)
            //whos_turn = 1;
            move = {
                username: user_arr[roomid][1][0],
                top_card: top_card[0],
                cards_left: cards_left.cards[cards_left.cards.length-1]
            }
            io.to(user_arr[roomid][1][1]).emit('player move', move);
            io.to(user_arr[roomid][1][1]).emit('turn', 1);
            io.to(user_arr[roomid][0][1]).emit('turn', 0);
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
                username: user_arr[roomid][0][0],
                top_card: top_card[0],
                cards_left: cards_left.cards[cards_left.cards.length-1]
            }
            io.to(user_arr[roomid][0][1]).emit('player move', move);
            io.to(user_arr[roomid][0][1]).emit('turn', 1);
            io.to(user_arr[roomid][1][1]).emit('turn', 0);
        }
        if (players[1].cards.length == 0){
            io.in(roomid).emit('game over', user_arr[roomid][1][0] + " won");
        } else if (players[0].cards.length == 0){
            io.in(roomid).emit('game over', user_arr[roomid][0][0] + " won");
        }
        cards_left.shuffle()
        //io.emit('player1 moves', move);
    });
    //console.log("I am listening to add cards now")
    socket.on('player add card', function(move) {
        console.log(user_arr[roomid][0][0],move.username)
        if (move.username == user_arr[roomid][0][0]) {
            //check if cards_left is 0
            console.log(cards_left.cards.length)
            if (cards_left.cards.length > 0){
                move.new_card = cards_left.cards.pop()
                move.cards_l_len = cards_left.cards.length
                players[0].cards.push(move.new_card)
            } else {
                move.new_card = undefined
            }
            io.to(user_arr[roomid][0][1]).emit('player add card', move);
        } else {
            if (cards_left.cards.length > 0){
                move.new_card = cards_left.cards.pop()
                move.cards_l_len = cards_left.cards.length
                players[1].cards.push(move.new_card)
            } else {
                move.new_card = undefined
            }
            io.to(user_arr[roomid][1][1]).emit('player add card', move);
        }
        //io.emit('player2 moves', move);
    });
    socket.on('player update add card', function(move) {
        if (move.username == user_arr[roomid][0][0]) {
            //check if cards_left is 0
            //move.new_card = cards_left.cards.pop()
            io.to(user_arr[roomid][1][1]).emit('player update add card', cards_left.cards.length);
        } else {
            //cards_left.cards.length.new_card = cards_left.cards.pop()
            io.to(user_arr[roomid][0][1]).emit('player update add card', cards_left.cards.length);
        }
        //io.emit('player2 moves', move);
    });
    //when socket disconnects
    socket.on("disconnect", function (){
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
        
        io.in(roomid).emit('player disconnect', "hi");
        //deletes the game room and user array of that room
        delete user_arr[roomid]
        delete games_arr[roomid]
    });
}

let user_arr = {}
let games_arr = {}

io.sockets.on('connection', function(socket) {
    
    //console.log(socket)
    socket.on('username', function(username) {
        socket.username = username;
        console.log("connection!");
        io.emit('is_online', '🔵 <i>' + socket.username + ' joined the chat..</i>');
    });

    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

    socket.on('create and join room', function(username,roomid) {
        let room = io.sockets.adapter.rooms[roomid];
        console.log(room)
        if (room && room.sockets){
            for (let delete_me of Object.keys(room.sockets) ){
                io.sockets.connected[delete_me].disconnect()
            }
         }
        socket.join(roomid);
        console.log(room)
        room = io.sockets.adapter.rooms[roomid];
        //console.log(user_arr[roomid],room.sockets)
        user_arr[roomid] = []
        delete games_arr[roomid]
        user_arr[roomid].push([username,Object.keys(room.sockets)[0]])
        //whos_turn = 1;
        console.log(user_arr[roomid],room.sockets)
        if (!(roomid in games_arr)){
            games_arr[roomid] = game_start( game_events,socket,roomid )
        }
        
    });
    socket.on('join room', function(username,roomid) {

        let room = io.sockets.adapter.rooms[roomid];
        if (room && Object.keys(room.sockets).length == 1 && username === user_arr[roomid][0][0]){
            //don't join
            socket.disconnect()
        }
        //console.log(room.sockets,room.sockets.length,"is this getting called")
        else if (room && Object.keys(room.sockets).length == 1){
            socket.join(roomid);
            console.log(room.sockets)
            console.log(user_arr[roomid],games_arr[roomid])
            //console.log(Object.keys(room.sockets),user_arr)
            if (Object.keys(room.sockets)[0] == user_arr[roomid][0][1]){
                user_arr[roomid].push([username,Object.keys(room.sockets)[1]])
            } else {
                user_arr[roomid].push([username,Object.keys(room.sockets)[0]])
            }
            //whos_turn = 0
            console.log(room.sockets)
            console.log(user_arr[roomid],games_arr[roomid])
            games_arr[roomid](game_events,socket,roomid)
            //game_events(socket,roomid)
        }

    });

});

server.listen(port, () => {
    console.log('[INFO] Listening on *:' + port);
});