window.onload = function() {
  // get canvas related references
   let canvas =document.getElementById("main_canvas_view");
   let ctx=canvas.getContext("2d");

  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  let cards_left = new card_stack(function (x) {ctx.drawImage(x,0,-0)});
  cards_left.shuffle()
  let player_count = 2;
  let players = []
  for (let i = 1; i <= player_count;i++){
      player_cards = []
      for (let idx = 0; idx < 7; idx++){
        player_cards.push(cards_left.cards.pop())
      }
      players.push(new player(player_cards))
  }

  let back_img = new Image("145.2","204");
  back_img.src = "assets/png/back_dark" + ".png";

  //pick first
  //load all images
  setTimeout(() => {
    draw(ctx,players,back_img,cards_left.cards.length);
  }, 400);
    // listen for mouse events
  let over_valid_card = [0]
  canvas.onmousedown = mouse_down(ctx,canvas,over_valid_card);
  canvas.onmouseup = mouse_up(ctx,canvas,over_valid_card);
  canvas.onmousemove = mouse_move(ctx,canvas);

  //draw(ctx,players);

}
//check to see if any cards are selected
function mouse_down(){
  return function (e) {
  
  };
}
//if mouse up happens when a card was selected,
//and the play was valid, remove card from player stack!
function mouse_up(){
  return function (e) {
  
  };
}
//might be used in the future
function mouse_move(){
  return function (e) {
  
  };

}
//wind conditions function
function check_win(players) {
  
}
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x+r, y);
  this.arcTo(x+w, y,   x+w, y+h, r);
  this.arcTo(x+w, y+h, x,   y+h, r);
  this.arcTo(x,   y+h, x,   y,   r);
  this.arcTo(x,   y,   x+w, y,   r);
  this.closePath();
  return this;
}
// redraw the scene
function draw(ctx,players,back_img,cards_left_len,current_top) {
  console.log(players.length)
  ctx.clearRect(0, 0, ctx.canvas.width , ctx.canvas.height );
if (cards_left_len > 0){
    //draw the back cover for the rest
    console.log("I tried")
    let temp_width = ctx.canvas.width/2-back_img.width
    ctx.drawImage(back_img,temp_width,ctx.canvas.height/2-back_img.height/2,back_img.width,back_img.height);
    if (current_top){
    ctx.drawImage(current_top,temp_width + back_img.width + 10,ctx.canvas.height/2-current_top.height/2,current_top.width,back_img.height);
    }
}
  //draw card in the middle and "sta∂ck"
  let y = 0
  for(let i=0;i<players.length;i++){
    // decide if the shape is a rect or circle
    // (it's a rect if it has a width property)
    let g = 30
    let cards_width = (players[i].cards.length-1)*50 + 145.2
    if (players[i].cards.length == 1){
      cards_width = 145.2
    }
    g = (ctx.canvas.width - cards_width) / 2
    for (let vals of players[i].cards){
      //document.getElementById("body").appendChild(vals[0])
      ctx.fillStyle = "white"
      ctx.strokeStyle= "black"
      ctx.lineWidth = 2;
      ctx.roundRect(g,27-y,vals[0].width,vals[0].height,10).stroke()
      ctx.drawImage(vals[0],g,27-y,vals[0].width,vals[0].height);
      g += 50
    }
    y = 27
    ctx.translate(0,ctx.canvas.height - 250)
  }
  ctx.translate(0,0);
}



