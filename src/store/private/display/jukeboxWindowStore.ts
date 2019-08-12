export default {
  state: {
    command: null,
    isDisplay: false,
    zIndex: 1,
    masterMute: false,
    masterVolume: 0.5
  },
  actions: {},
  mutations: {},
  getters: {
    masterMute: (state: any) => state.masterMute,
    masterVolume: (state: any) => state.masterVolume
  }
};
