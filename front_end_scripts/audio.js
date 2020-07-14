let audio = new Audio("/assets/music.mp3",70);

//audio.play()
audio.ended = () => {audio.time = 0; audio.play()}
document.getElementById("play").onclick = () => audio.play()
function change_and_play(){
    console.log(document.getElementById("play").src)

    //audio.time = 0
    audio.play()
    document.getElementById("play").src = "/assets/pause.png"

}
