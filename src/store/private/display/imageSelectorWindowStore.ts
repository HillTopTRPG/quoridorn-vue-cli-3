export default {
  state: {
    command: null,
    isDisplay: false,
    zIndex: 1,
    imageKey: null,
    imageTag: null,
    callback: null
  },
  actions: {},
  mutations: {},
  getters: {
    imageSelectorKey: (state: any) => state.imageKey,
    imageSelectorTag: (state: any) => state.imageTag,
    imageSelectorCallback: (state: any) => state.callback
  }
};
