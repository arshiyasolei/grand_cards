var c;
var ctx
window.onload = function() {

    c = document.getElementById("main_canvas_view");

    ctx = c.getContext("2d");
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    for (i = 1; i < 6; i++) {
        card(10 * (i * 14), 10, 100, 300);
    }
}

function card(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.stroke();
}
