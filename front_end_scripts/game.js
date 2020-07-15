var socket
var username
var all_cards
var my_turn
window.onload = function () {
  let first_connection_time = 0;
  console.log(document.location.origin + ":8080")
  socket = io.connect(document.location.origin);
  all_cards = new card_stack()
  // submit text message without reload/refresh the page
  $('form').submit(function (e) {
    e.preventDefault(); // prevents page reloading
    socket.emit('chat_message', $('#txt').val());
    $('#txt').val('');
    return false;
  });
  // append the chat text message
  let first_time = true
  socket.on('chat_message', function (msg) {
    $('#messages').append($('<li>').html(msg));
    let container = document.getElementById("messages")
    console.log(container.clientHeight,container.scrollHeight,container.scrollTop)
    if (first_time) {
      container.scrollTop = 200;
      console.log(container.scrollTop)
      first_time = false;
    } else if (container.clientHeight <= container.scrollHeight) {
      console.log("I got triggered")
      container.scrollTop = container.scrollHeight;
    }
  });

  socket.on('turn', function (t) {
    my_turn = t;
    console.log("turn called!")
    if (my_turn == 1){
      //plays audio telling it is your turn
      window.speechSynthesis.speak(new SpeechSynthesisUtterance("your turn"));
    }
    if (first_connection_time == 0){
      game(ctx, canvas, over_valid_card, players, cards_left, over_valid_card, back_img,top_card);
    }
    first_connection_time += 1
  });

  // append text if someone is online
  socket.on('is_online', function (username) {
    $('#messages').append($('<li>').html(username));
  });
  let players = [34,44]
  let back_img = new Image("145.2", "204");
  back_img.src = "assets/png/back_dark" + ".png";
  // ask username
  username = prompt('Please tell me your name');
  let choice = prompt("are you creating a room? enter 1 for yes and anything else for no")
  if (choice === "1"){
    let room = prompt("what room are you creating?")
    socket.emit("create and join room",username,room)
  } else {
    let room = prompt("what room are you joining?")
    socket.emit("join room",username,room)
  }
  socket.emit('username', username);

  let cards_left = []
  let top_card = [1]
  socket.on('give player cards', function (playere,give_card,top_cards) {
    players[1] = playere;
    cards_left.push(give_card);
    console.log(top_cards)
    let top_img = new Image("145.2","204");
    top_img.src = "assets/png/" + top_cards[2] + "_" + top_cards[1] + ".png";
    top_card[0] = top_cards;
    top_card[0][0] = top_img;
    let player_count = 2;

    for (let idx = 0; idx < 7; idx++) {
      let img = new Image("145.2","204");
      img.src = "assets/png/" +players[1].cards[idx][2] + "_" + players[1].cards[idx][1] + ".png";
      players[1].cards[idx][0] = img;
    
    }
    players[0] = new player([])
    for (let idx = 0; idx < 7; idx++) {
      console.log(players[0])
      players[0].cards.push([back_img,null,null,null,null])
      
    }
    console.log(players)
  });
  
  // get canvas related references
  let canvas = document.getElementById("main_canvas_view");
  let ctx = canvas.getContext("2d");

  //loads the "how to play" modal
  modal_on_load()

  //width of canvas
  ctx.canvas.width = canvas.parentElement.clientWidth
  ctx.canvas.height = canvas.parentElement.clientHeight
  //sets the height of scroll of the chat area
  document.getElementsByClassName("right").height = canvas.parentElement.clientHeight

  //pick first
  //load all images
  // listen for mouse events
  let over_valid_card = [1]
  var whos_turn;

  socket.on('player add card', function (arr) {
    let move = {
      username: username,
    }
    if (arr.username == move.username){
      console.log(arr.new_card , "new card MOVE")
      if (arr.new_card){
        socket.emit('player update add card', move);
        //console.log("card added to me!",arr.new_card);
        //console.log(all_cards.cards["assets/png/" + arr.new_card[2] + "_" + arr.new_card[1] + ".png"])
        arr.new_card[0] = all_cards.cards["assets/png/" + arr.new_card[2] + "_" + arr.new_card[1] + ".png"]
        players[over_valid_card[0]].cards.push(arr.new_card)
        if (arr.cards_l_len == 0){
          console.log("length dependent one got triggered")
          cards_left.pop()
        }
        draw(ctx, players, back_img, cards_left.length, top_card);
      } else {
        socket.emit('player update add card', move);
        console.log("why do I need this")
        //cards_left.pop()
        draw(ctx, players, back_img, cards_left.length, top_card);
      }
    } else {
      //update player 2 hands view
      //whos_turn = arr.whos_turn
      //top_card[0] = arr.top_card
      //cards_left[0] = arr.cards_left
    }
  });
  socket.on('player update add card',function (newlen){
    if (newlen == 0){
      //if the new length isn't 0, the update
      if (cards_left.length != 0){
        cards_left.pop()
      }
  }
  
    //push one two the other hand
    players[0].cards.push([back_img,null,null,null,null])
    //animate other player hand
    //animate_in_line(ctx, canvas, over_valid_card, players, back_img, cards_left, top_card,card_to_animate)
    draw(ctx, players, back_img, cards_left.length, top_card);
  });

  socket.on('player move', function (arr) {
    let move = {
      username: username,
    }
    if (arr.username == move.username){
      //socket.emit('player move', move);
      //whos_turn = arr.whos_turn
      //players[over_valid_card[0]].cards.push(arr.top_card)
      console.log("I got fired")
      top_card[0] = arr.top_card
      
      cards_left[0] = arr.cards_left
      arr.top_card[0] = all_cards.cards["assets/png/" + arr.top_card[2] + "_" + arr.top_card[1] + ".png"]
      players[0].cards.pop()
      //arr.new_card[0] = all_cards.cards["assets/png/" + arr.new_card[2] + "_" + arr.new_card[1] + ".png"]
      draw(ctx, players, back_img, cards_left.length, top_card);
    } else {
      //whos_turn = arr.whos_turn
      //top_card[0] = arr.top_card
      //cards_left[0] = arr.cards_left
      //update player 2 hands view
    }
  });
  socket.on('game over', function(status) {
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(status));
    alert(status)
    window.location.reload(true); 
    //reset game
    //io.to(user_arr[0][1]).emit('give player cards', move);
});

  socket.on('player disconnect', function(status) {

    alert(status + " The other player disconnected!")
    window.location.reload(true); 
    //reset game
    //io.to(user_arr[0][1]).emit('give player cards', move);
});
  //starts the game!
  console.log(top_card)

  //resize canvas and the whole window
  window.addEventListener('resize', () => {
    ctx.canvas.width = canvas.parentElement.clientWidth
    ctx.canvas.height = canvas.parentElement.clientHeight
    if (first_connection_time != 0){
      draw(ctx, players, back_img, cards_left.length, top_card);
    }
  });
}

function game(ctx, canvas, over_valid_card, players, cards_left, over_valid_card, back_img,top_card) {

  setTimeout(() => {
    draw(ctx, players, back_img, cards_left.length, top_card);
  }, 880);

  canvas.onmousedown = mouse_down(ctx, canvas, over_valid_card, players, back_img, cards_left, top_card);
  canvas.onmouseup = mouse_up(ctx, canvas, over_valid_card, players, back_img, cards_left, top_card);
  canvas.onmousemove = mouse_move(ctx, canvas, over_valid_card, players, back_img, cards_left, top_card);

}
//adds card to the hands of whoever that is waiting to play
function add_extra_to_hand(ctx, canvas, over_valid_card, players, back_img, cards_left, top_card) {
  return function () {
    if (cards_left.cards.length > 0) {
      //console.log(cards_left.cards[cards_left.cards.length-1])
      let move = {
        username: username,
      }
      socket.emit('player add card', move);
      socket.on('player add card', function (arr) {
        
        players[over_valid_card[0]].cards.push(arr)
      });
      //players[over_valid_card[0]].cards.push(cards_left.cards.pop())
    }
  };
}
//check to see if any cards are selected
function mouse_down(ctx, canvas, over_valid_card, players, back_img, cards_left, top_card) {
  return function (e) {

  };
}
//parametric equations for path finding
function vector_equation_point(x_point,y_point,top_img_pointx,top_img_pointy,increment){

  return {
    0: x_point + increment*(top_img_pointx - x_point),
    1: y_point + increment*(top_img_pointy - y_point)
  };
}
//move selected card in a line
function animate_in_line(ctx, canvas, over_valid_card, players, back_img, cards_left, top_card,card_to_animate) {
  
  //elegent equation for doing this
  let current_top = top_card
  let cards_left_len = cards_left.length
  let x_point = card_to_animate[3]
  let y_point = card_to_animate[5]
  let top_img_pointx = ctx.canvas.width / 2 - back_img.width + current_top[0][0].width + 30
  let top_img_pointy = ctx.canvas.height / 2 - back_img.height / 2
  let increment_x = 0
  console.log(x_point,y_point,top_img_pointx,top_img_pointy)
  function draw_line_move_animation() {

    console.log("animation drawing!")
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    let temp_width = ctx.canvas.width / 2 - back_img.width
    if (cards_left_len > 0) {
      //draw the back cover for the rest
      ctx.drawImage(back_img, temp_width, ctx.canvas.height / 2 - back_img.height / 2, back_img.width, back_img.height);
    }
    if (current_top) {
      ctx.drawImage(current_top[0][0], temp_width + current_top[0][0].width + 30, ctx.canvas.height / 2 - current_top[0][0].height / 2, current_top[0][0].width, current_top[0][0].height);
    }
    
    temp_points = vector_equation_point(x_point,y_point,top_img_pointx,top_img_pointy,increment_x)
    
    new_x_point = Math.round(temp_points[0])
    new_y_point = Math.round(temp_points[1])
    increment_x += 0.1
    console.log(new_x_point,new_y_point,top_img_pointx,top_img_pointy)
    ctx.drawImage(card_to_animate[0],new_x_point,new_y_point,current_top[0][0].width, current_top[0][0].height)
    ctx.save()
    //draw card in the middle and "sta∂ck"
    let y = 0
    let y_shift_down = 0;
    for (let i = 0; i < players.length; i++) {
      // decide if the shape is a rect or circle
      // (it's a rect if it has a width property)
      let g = 30
      let card_distance_factor = 27
      let cards_width = (players[i].cards.length - 1) * card_distance_factor + 145.2
      if (players[i].cards.length == 1) {
        cards_width = 145.2
      }
      g = (ctx.canvas.width - cards_width) / 2
      for (let vals = 0; vals < players[i].cards.length; vals++) {
        //document.getElementById("body").appendChild(vals[0])
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        players[i].cards[vals][4] = g + card_distance_factor
        if (players[i].cards.length == 1 || players[i].cards.length - 1 == vals) {
          players[i].cards[vals][4] = g + players[i].cards[vals][0].width
        }
        players[i].cards[vals][3] = g
        players[i].cards[vals][5] = 27 - y + y_shift_down
        players[i].cards[vals][6] = (27 - y) + players[i].cards[vals][0].height + y_shift_down

        ctx.roundRect(g, 27 - y + y_shift_down, players[i].cards[vals][0].width, players[i].cards[vals][0].height, 10).stroke()
        ctx.drawImage(players[i].cards[vals][0], g, 27 - y + y_shift_down, players[i].cards[vals][0].width, players[i].cards[vals][0].height);
        g += card_distance_factor
      }
      y = 27
      y_shift_down = ctx.canvas.height - 250

    }
    //when we reach the dectination, stop animation
    
    if (  (Math.round(new_x_point) != top_img_pointx) && (Math.round(new_y_point) != top_img_pointy) ) {
      window.requestAnimationFrame(draw_line_move_animation);
    } else {
    draw(ctx, players, back_img, cards_left.length, top_card);
    }
  }
  window.requestAnimationFrame(draw_line_move_animation);
  
}
//if mouse up happens when a card was selected,
//and the play was valid, remove card from player stack!
function mouse_up(ctx, canvas, over_valid_card, players, back_img, cards_left, top_card) {
  return function (e) {
    if (my_turn){
      let m = get_mouse_position(canvas, e)
      mouse_x = m[0];
      mouse_y = m[1];
      back_img_rangey = ctx.canvas.height / 2 - back_img.height / 2;
      back_img_rangex = ctx.canvas.width / 2 - back_img.width

      if ((back_img_rangex < mouse_x && mouse_x < back_img_rangex + back_img.width) && (back_img_rangey < mouse_y && mouse_y < back_img_rangey + back_img.height)) {
        console.log("in the zone of adding pile",username)
        let move = {
          username: username
        }
        if (cards_left.length > 0){
          socket.emit('player add card', move);
          console.log("yes the length is more")
        } else {
          //socket.emit('player add card', move);
          //cards_left = []
        }
        //add_extra_to_hand(ctx, canvas, over_valid_card, players, back_img, cards_left, top_card)();
      }
      if (check_card_nodraw_needed(players, over_valid_card, cards_left, top_card, ctx, canvas, back_img)) {
        for (let i = 0; i < players[over_valid_card[0]].cards.length; i++) {

          if (players[over_valid_card[0]].cards[i][3] < mouse_x && mouse_x < players[over_valid_card[0]].cards[i][4]) {
            if (players[over_valid_card[0]].cards[i][5] < mouse_y && mouse_y < players[over_valid_card[0]].cards[i][6]) {
              
              let player_card_val = players[over_valid_card[0]].cards[i][1]
              let player_card_type = players[over_valid_card[0]].cards[i][2]
              
              if (top_card[0][1] == player_card_val || top_card[0][2] == player_card_type) {
                //add to the top
                //cards_left.cards.push(top_card[0])
                let move = {
                  username: username,
                  new_top_card: players[over_valid_card[0]].cards[i],
                  i: i
                }
                socket.emit('player move', move);
                //animates the top card movement
                animate_in_line(ctx, canvas, over_valid_card, players, back_img, cards_left, top_card,players[over_valid_card[0]].cards[i]) 
                //cards_left.cards.push(top_card[0])
                top_card[0] = players[over_valid_card[0]].cards[i]
                //removes card from player sta∂ck
                players[over_valid_card[0]].cards.splice(i, 1)

                cards_left[0] = back_img
                console.log(cards_left.length)
                //console.log(players[over_valid_card[0]].cards)
                //draw(ctx, players, back_img, cards_left.length, top_card);
                break;
              }
            }
          }
        }

        //check_win(players, temp)
      } else {
        console.log("add cards from the other pile!")
        //for something else
      }
      //draw(ctx, players, back_img, cards_left.length, top_card);
      //console.log(top_card[0][1])
    }
  };
}
//might be used in the future
function mouse_move(ctx, canvas, over_valid_card, players, back_img, cards_left, top_card) {
  return function (e) {

  };

}
//gets the coordinates of mouse
function get_mouse_position(canvas, evt) {
  let rect = canvas.getBoundingClientRect();
  return {
    0: event.clientX - rect.left,
    1: event.clientY - rect.top
  };
}

//checks if there is a draw that's needed
function check_card_nodraw_needed(players, over_valid_card, cards_left, top_card, ctx, canvas, back_img) {

  let draw_needed = 1;
  for (let i = 0; i < players[over_valid_card[0]].cards.length; i++) {
    let player_card_val = players[over_valid_card[0]].cards[i][1]
    let player_card_type = players[over_valid_card[0]].cards[i][2]
    if (top_card[0][1] == player_card_val || top_card[0][2] == player_card_type) {
      draw_needed = 0
      return true;
    }
  }
  console.log("extra cards!")
  /*
  //Used for AI in the future
  while (draw_needed) {
    console.log("we looping")
    for (let i = 0; i < players[over_valid_card[0]].cards.length; i++) {
      let player_card_val = players[over_valid_card[0]].cards[i][1]
      let player_card_type = players[over_valid_card[0]].cards[i][2]
      
      if (top_card[0][1] == player_card_val || top_card[0][2] == player_card_type) {
        //add to the top
        console.log(player_card_val)
        console.log(top_card[0][1])
        console.log(player_card_type)
        console.log(top_card[0][2])
        cards_left.cards.push(top_card[0])
        top_card[0] = players[over_valid_card[0]].cards[i]
        players[over_valid_card[0]].cards.splice(i, 1)
        if (over_valid_card[0] == 1) {
          over_valid_card[0] = 0;
        } else {
          over_valid_card[0] = 1;
        }
        draw_needed = 0
        break;
      }
    }
    if (draw_needed && cards_left.cards.length == 0) {
      over_valid_card[0].toString
      alert("player " + over_valid_card[0] + " LOST!")
      break;
    } else if (draw_needed) {
      players[over_valid_card[0]].cards.push(cards_left.cards.pop())
    }
    
  }
  */
  draw(ctx, players, back_img, cards_left.length, top_card);
  return false;
}
//wind conditions function
function check_win(players, over_valid_card) {

  for (let i = 0; i < players.length; i++) {
    if (players[i].cards.length == 0) {
      i.toString()
      alert("player_" + i + " WON")
      socket.emit('game over', "game over!");
      return true
    }
  }

}

//used for drawing round rectangles
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
  this.closePath();
  return this;
}
// redraw the scene
function draw(ctx, players, back_img, cards_left_len, current_top) {

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.beginPath();
  let temp_width = ctx.canvas.width / 2 - back_img.width
  if (cards_left_len > 0) {
    //draw the back cover for the rest
    ctx.drawImage(back_img, temp_width, ctx.canvas.height / 2 - back_img.height / 2, back_img.width, back_img.height);

  }
  if (current_top) {
    console.log(current_top)
    ctx.drawImage(current_top[0][0], temp_width + current_top[0][0].width + 30, ctx.canvas.height / 2 - current_top[0][0].height / 2, current_top[0][0].width, current_top[0][0].height);

  }
  ctx.save()
  //draw card in the middle and "sta∂ck"
  let y = 0
  let y_shift_down = 0;
  for (let i = 0; i < players.length; i++) {
    // decide if the shape is a rect or circle
    // (it's a rect if it has a width property)
    let g = 30
    let card_distance_factor = 27
    let cards_width = (players[i].cards.length - 1) * card_distance_factor + 145.2
    if (players[i].cards.length == 1) {
      cards_width = 145.2
    }
    g = (ctx.canvas.width - cards_width) / 2
    for (let vals = 0; vals < players[i].cards.length; vals++) {
      //document.getElementById("body").appendChild(vals[0])
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      players[i].cards[vals][4] = g + card_distance_factor
      if (players[i].cards.length == 1 || players[i].cards.length - 1 == vals) {
        console.log(players[i].cards[vals][0],vals,players[0])
        players[i].cards[vals][4] = g + players[i].cards[vals][0].width
      }
  
      players[i].cards[vals][3] = g
      players[i].cards[vals][5] = 27 - y + y_shift_down
      players[i].cards[vals][6] = (27 - y) + players[i].cards[vals][0].height + y_shift_down

      ctx.roundRect(g, 27 - y + y_shift_down, players[i].cards[vals][0].width, players[i].cards[vals][0].height, 10).stroke()
      ctx.drawImage(players[i].cards[vals][0], g, 27 - y + y_shift_down, players[i].cards[vals][0].width, players[i].cards[vals][0].height);
      g += card_distance_factor
    }
    y = 27
    y_shift_down = ctx.canvas.height - 250

  }

}