export default {
  /** プレイヤー */
  state: {
    list: []
  },
  actions: {},
  mutations: {},
  getters: {
    playerList: (state: any): any[] => state.list,
    getPlayer: (state: any, getters: any, rootState: any, rootGetters: any) => (
      peerId: string
    ): any => {
      const member = rootGetters.members.filter(
        (member: any) => member.peerId === peerId
      )[0];
      if (!member) return null;
      return rootGetters.getObj(member.playerKey);
    }
  }
};
