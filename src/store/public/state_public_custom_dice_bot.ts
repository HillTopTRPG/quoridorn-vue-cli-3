export default {
  /** カスタムダイスボット */
  state: {
    list: [],
    maxKey: -1,
    roomSysList: []
  },
  actions: {},
  mutations: {},
  getters: {
    customDiceBotList: (state: any) => state.list,
    customDiceBotRoomSysList: (state: any) => state.roomSysList
  }
};
