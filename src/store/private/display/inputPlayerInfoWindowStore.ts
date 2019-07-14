export default {
  state: {
    command: null,
    isDisplay: false,
    zIndex: 1,
    playerName: "",
    playerPassword: "",
    playerType: "",
    fontColor: "",
    resolve: null
  },
  actions: {},
  mutations: {},
  getters: {
    volatileRoomName: (state: any) => state.roomName,
    volatilePlayerName: (state: any) => state.playerName,
    volatilePlayerPassword: (state: any) => state.playerPassword,
    volatilePlayerType: (state: any) => state.playerType,
    volatileFontColor: (state: any) => state.fontColor,
    volatileResolve: (state: any) => state.resolve
  }
};
