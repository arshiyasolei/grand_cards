window.onload = function () {
  // get canvas related references
  let canvas = document.getElementById("main_canvas_view");
  let ctx = canvas.getContext("2d");

  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  
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

  let back_img = new Image("145.2", "204");
  back_img.src = "assets/png/back_dark" + ".png";

  //pick first
  //load all images
  // listen for mouse events
  let over_valid_card = [1]
  game(ctx, canvas, over_valid_card, players, cards_left, over_valid_card, back_img);
  //draw(ctx,players);

}

function game(ctx, canvas, over_valid_card, players, cards_left, over_valid_card, back_img) {
  let top_card = [cards_left.cards.pop()]
  console.log(cards_left.cards)
  setTimeout(() => {

    draw(ctx, players, back_img, cards_left.cards.length, top_card);
  }, 400);

  canvas.onmousedown = mouse_down(ctx, canvas, over_valid_card, players, back_img, cards_left, top_card);
  canvas.onmouseup = mouse_up(ctx, canvas, over_valid_card, players, back_img, cards_left, top_card);
  canvas.onmousemove = mouse_move(ctx, canvas, over_valid_card, players, back_img, cards_left, top_card);

}
//adds card to the hands of whoever that is waiting to play
function add_extra_to_hand(ctx, canvas, over_valid_card, players, back_img, cards_left, top_card) {
  return function () {
    if (cards_left.cards.length > 0) {
      //console.log(cards_left.cards[cards_left.cards.length-1])
      players[over_valid_card[0]].cards.push(cards_left.cards.pop())
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
  let cards_left_len = cards_left.cards.length
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
    
    new_x_point = temp_points[0]
    new_y_point = temp_points[1]
    increment_x += 0.1
    //console.log(slope,new_x_point,new_y_point,top_img_pointx,top_img_pointy)
    ctx.drawImage(card_to_animate[0],new_x_point,new_y_point,current_top[0][0].width, current_top[0][0].height)
    ctx.save()
    //draw card in the middle and "sta∂ck"
    let y = 0
    let y_shift_down = 0;
    for (let i = 0; i < players.length; i++) {
      // decide if the shape is a rect or circle
      // (it's a rect if it has a width property)
      let g = 30

      let cards_width = (players[i].cards.length - 1) * 50 + 145.2
      if (players[i].cards.length == 1) {
        cards_width = 145.2
      }
      g = (ctx.canvas.width - cards_width) / 2
      for (let vals = 0; vals < players[i].cards.length; vals++) {
        //document.getElementById("body").appendChild(vals[0])
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        players[i].cards[vals][4] = g + 50
        if (players[i].cards.length == 1 || players[i].cards.length - 1 == vals) {
          players[i].cards[vals][4] = g + players[i].cards[vals][0].width
        }
        players[i].cards[vals][3] = g
        players[i].cards[vals][5] = 27 - y + y_shift_down
        players[i].cards[vals][6] = (27 - y) + players[i].cards[vals][0].height + y_shift_down

        ctx.roundRect(g, 27 - y + y_shift_down, players[i].cards[vals][0].width, players[i].cards[vals][0].height, 10).stroke()
        ctx.drawImage(players[i].cards[vals][0], g, 27 - y + y_shift_down, players[i].cards[vals][0].width, players[i].cards[vals][0].height);
        g += 50
      }
      y = 27
      y_shift_down = ctx.canvas.height - 250

    }
    //when we reach the dectination, stop animation
    
    if (  (new_x_point != top_img_pointx) && (new_y_point != top_img_pointy) ) {
      window.requestAnimationFrame(draw_line_move_animation);
    }

  }
  window.requestAnimationFrame(draw_line_move_animation);

}
//if mouse up happens when a card was selected,
//and the play was valid, remove card from player stack!
function mouse_up(ctx, canvas, over_valid_card, players, back_img, cards_left, top_card) {
  return function (e) {
    let m = get_mouse_position(canvas, e)
    mouse_x = m[0];
    mouse_y = m[1];
    back_img_rangey = ctx.canvas.height / 2 - back_img.height / 2;
    back_img_rangex = ctx.canvas.width / 2 - back_img.width
    if ((back_img_rangex < mouse_x && mouse_x < back_img_rangex + back_img.width) && (back_img_rangey < mouse_y && mouse_y < back_img_rangey + back_img.height)) {
      console.log("in the zone of adding pile")
      add_extra_to_hand(ctx, canvas, over_valid_card, players, back_img, cards_left, top_card)();
    }
    if (check_card_nodraw_needed(players, over_valid_card, cards_left, top_card, ctx, canvas, back_img)) {
      for (let i = 0; i < players[over_valid_card[0]].cards.length; i++) {

        if (players[over_valid_card[0]].cards[i][3] < mouse_x && mouse_x < players[over_valid_card[0]].cards[i][4]) {
          if (players[over_valid_card[0]].cards[i][5] < mouse_y && mouse_y < players[over_valid_card[0]].cards[i][6]) {
            let player_card_val = players[over_valid_card[0]].cards[i][1]
            let player_card_type = players[over_valid_card[0]].cards[i][2]
            if (top_card[0][1] == player_card_val || top_card[0][2] == player_card_type) {
              //add to the top

              cards_left.cards.push(top_card[0])

              //animates the top card movement
              animate_in_line(ctx, canvas, over_valid_card, players, back_img, cards_left, top_card,players[over_valid_card[0]].cards[i]) 
              //cards_left.cards.push(top_card[0])
              top_card[0] = players[over_valid_card[0]].cards[i]
              //removes card from player sta∂ck
              players[over_valid_card[0]].cards.splice(i, 1)
              //console.log(players[over_valid_card[0]].cards)
              if (over_valid_card[0] == 1) {
                over_valid_card[0] = 0;
              } else {
                over_valid_card[0] = 1;
              }
              break;
            }
          }
        }
      }

      temp = [0]
      if (over_valid_card[0] == 1) {
        temp[0] = 0;
      } else {
        temp[0] = 1;
      }
      check_win(players, temp)
    } else {
      console.log("add cards from the other pile!")
      //for something else
    }
    draw(ctx, players, back_img, cards_left.cards.length, top_card);
    console.log(top_card[0][1])

  };
}
//might be used in the future
function mouse_move(ctx, canvas, over_valid_card, players, back_img, cards_left, top_card) {
  return function (e) {

  };

}

function get_mouse_position(canvas, evt) {
  let rect = canvas.getBoundingClientRect();
  return {
    0: event.clientX - rect.left,
    1: event.clientY - rect.top
  };
}

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
  draw(ctx, players, back_img, cards_left.cards.length, top_card);
  return false;
}
//wind conditions function
function check_win(players, over_valid_card) {

  for (let i = 0; i < players.length; i++) {
    if (players[i].cards.length == 0) {
      i.toString()
      alert("player_" + i + " WON")
      return true
    }
  }

}

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

    let cards_width = (players[i].cards.length - 1) * 50 + 145.2
    if (players[i].cards.length == 1) {
      cards_width = 145.2

    }
    g = (ctx.canvas.width - cards_width) / 2
    for (let vals = 0; vals < players[i].cards.length; vals++) {
      //document.getElementById("body").appendChild(vals[0])
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      players[i].cards[vals][4] = g + 50
      if (players[i].cards.length == 1 || players[i].cards.length - 1 == vals) {
        players[i].cards[vals][4] = g + players[i].cards[vals][0].width
      }
  
      players[i].cards[vals][3] = g
      players[i].cards[vals][5] = 27 - y + y_shift_down
      players[i].cards[vals][6] = (27 - y) + players[i].cards[vals][0].height + y_shift_down

      ctx.roundRect(g, 27 - y + y_shift_down, players[i].cards[vals][0].width, players[i].cards[vals][0].height, 10).stroke()
      ctx.drawImage(players[i].cards[vals][0], g, 27 - y + y_shift_down, players[i].cards[vals][0].width, players[i].cards[vals][0].height);
      g += 50
    }
    y = 27
    y_shift_down = ctx.canvas.height - 250

  }


}