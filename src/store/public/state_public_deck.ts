export default {
  /** デッキ */
  state: {
    cards: {
      list: [],
      maxKey: -1
    },
    name: null,
    back: null,
    width: 0,
    height: 0,
    author: null,
    title: null,
    refs: []
  },
  actions: {},
  mutations: {},
  getters: {
    deck: (state: any): any => state,
    deckCardList: (state: any): any[] => state.cards.list
  }
};
