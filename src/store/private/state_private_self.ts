export default {
  /** 接続情報 */
  state: {
    peerId: null,
    peerIdWait: null,
    playerKey: null,
    cards: []
  },
  actions: {},
  mutations: {
    updatePeerId: (
      state: any,
      { peerId, isWait }: { peerId: string; isWait: boolean }
    ) => {
      if (!isWait) state.peerId = peerId;
      else state.peerIdWait = peerId;
    },

    updatePlayerKey: (state: any, playerKey: string) => {
      // window.console.error(playerKey);
      state.playerKey = playerKey;
    }
  },
  getters: {
    playerKey: (state: any) => state.playerKey,
    peerId: (state: any): Function => (isWait: boolean) =>
      !isWait ? state.peerId : state.peerIdWait,
    isGameMaster: (
      state: any,
      getters: any,
      rootState: any,
      rootGetters: any
    ) => {
      const selfPlayer = rootGetters.getObj(state.playerKey);
      return selfPlayer ? selfPlayer.type === "GM" : false;
    }
  }
};
