export default {
  state: {
    command: null,
    isDisplay: false,
    zIndex: 1,
    zipList: null,
    isRoomCreate: false
  },
  actions: {},
  mutations: {},
  getters: {
    dropZipList: (state: any) => state.zipList,
    dropZipRoomCreate: (state: any) => state.isRoomCreate
  }
};
