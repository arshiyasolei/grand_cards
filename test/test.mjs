import assert from "assert"
import card_stack from '../card_stack.mjs';
describe('server side card stack', function () {
  describe('#init card stack', function () {
    it('length of init card stack should be 52', function () {
        let temp_card_stack = new card_stack()
      assert.equal(temp_card_stack.cards.length, 52);
    });
  });
});