export default {
  /** キャラクタープロパティ */
  state: {
    round: 0,
    roundPlayerKey: "",
    propertyList: [],
    rowStr: ""
  },
  actions: {},
  mutations: {},
  getters: {
    round: (state: any) => state.round,
    roundPlayerKey: (state: any) => state.roundPlayerKey,
    propertyList: (state: any) => state.propertyList,
    rowStr: (state: any) => state.rowStr
  }
};
