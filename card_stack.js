//Representing a Stack/list of cards with shuffling
class card_stack {
    constructor() {
      this.cards = [];
      //goal to create all images as objects
        let card_types = ["clubs","diamonds","spades","hearts"];
        let aceme = ["A","J","K","Q"];
        for (let card_t of card_types){
            console.log(card_t)
            for (let i = 2; i < 11; i ++){
                //Get image here
                let img = new Image();
                let tempi = i;
                tempi.toString;
                img.onload = function () {
                    console.log("finally loaded")
                }
                img.src = "assets/png/" +card_t + "_" +tempi + ".png";
                //console.log("assets/png/" + tempi + "_of_" + card_t + ".png")
                let res = [img,i,card_t]
                this.cards.push(res)
            }
            for (let i of aceme){
                //Get image here
                let tempi = i;
                let img = new Image();
                img.onload = function () {
                    console.log("finally loaded")
                }
                img.src = "assets/png/" +card_t + "_" +tempi + ".png";
                let res = [img,i,card_t]
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