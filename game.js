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

  // listen for mouse events
  setTimeout(() => {
    draw(ctx,players);
  }, 400);
  canvas.onmousedown = mouse_down(ctx,canvas);
  canvas.onmouseup = mouse_up(ctx,canvas);
  canvas.onmousemove = mouse_move(ctx,canvas);

  //draw(ctx,players);

}

function mouse_down(){
  return function (e) {
  
  };
}

function mouse_up(){
  return function (e) {
  
  };
}

function mouse_move(){
  return function (e) {
  
  };

}

// redraw the scene
function draw(ctx,players) {
  console.log(players.length)
  //ctx.clearRect(0, 0, ctx.canvas.width , ctx.canvas.height );
  // redraw each shape in the shapes[] array
  let y = 0
  for(let i=0;i<players.length;i++){
    // decide if the shape is a rect or circle
    // (it's a rect if it has a width property)
    let g = 30
    console.log(players[i].cards.length)
    for (let vals of players[i].cards){
      //document.getElementById("body").appendChild(vals[0])
      ctx.fillStyle = "white"
      
      ctx.fillRect(g, 27-y, 222, 323);
      ctx.drawImage(vals[0],g,27-y);
      g += 50
    }
    y = 27
    ctx.translate(0,ctx.canvas.height - 250)
  }
  ctx.translate(0,0);
}



