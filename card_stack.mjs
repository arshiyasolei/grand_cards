/*
Card stack class that maintains the deck of cards. 
*/
export default class card_stack {
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
