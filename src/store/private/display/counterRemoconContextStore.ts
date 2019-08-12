export default {
  state: {
    command: null,
    isDisplay: false,
    x: 0,
    y: 0,
    remoconKey: null
  },
  actions: {},
  mutations: {},
  getters: {
    remoconContextKey: (state: any) => state.remoconKey
  }
};
