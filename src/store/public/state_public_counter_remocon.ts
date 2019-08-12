export default {
  /** カウンターリモコン */
  state: {
    list: [
      {
        key: "counterRemocon-0",
        buttonName: "万能",
        target: "",
        counterName: "",
        modifyType: "2",
        modifyValue: "",
        message: "{0}の{1}を{2}した{4}",
        exampleText: "[選択キャラ]の[選択項目]を0した（[選択項目]：3->3）"
      }
    ],
    maxKey: 0
  },
  actions: {},
  mutations: {},
  getters: {
    publicCounterRemocon: (state: any) => state,
    publicCounterRemoconList: (state: any) => state.list
  }
};
