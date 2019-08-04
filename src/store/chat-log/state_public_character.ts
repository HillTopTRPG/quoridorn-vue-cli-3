export default {
  /** キャラクター */
  state: {
    list: []
  },
  actions: {},
  mutations: {
    initCharacter(state: any) {
      state.list = (window as any)!["actors"].filter(
        (actor: any) => actor.key.split("-")[0] === "character"
      );
    }
  },
  getters: {
    characterList: (state: any): any[] => state.list
  }
};
