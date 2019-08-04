export default {
  /** プレイヤー */
  state: {
    list: []
  },
  actions: {},
  mutations: {
    initPlayer(state: any) {
      state.list = (window as any)!["actors"].filter(
        (actor: any) => actor.key.split("-")[0] === "player"
      );
    }
  },
  getters: {
    playerList: (state: any): any[] => state.list
  }
};
