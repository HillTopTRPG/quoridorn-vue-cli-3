import Vue from "vue";

export default {
  /** BGM */
  state: {
    list: [],
    maxKey: -1
  },
  actions: {
    /**
     * BGMをインポートする
     */
    importBgmList: (
      { dispatch }: { dispatch: Function; },
      payload: any
    ) => {
      dispatch("sendNoticeOperation", {
        value: payload,
        method: "doImportBgmList"
      });
    },
    doImportBgmList: (
      { state }: { state: any },
      { bgmList, addType }: { bgmList: any[]; addType: string }
    ) => {
      if (addType === "1") {
        // 上書き
        bgmList.forEach(
          (bgmObj: any, index: number) => (bgmObj.key = `bgm-${index}`)
        );
        state.list = bgmList;
        state.maxKey = bgmList.length;
      } else {
        // 追加
        bgmList.forEach((bgmObj: any, index: number) => {
          bgmObj.key = `bgm-${index + state.maxKey + 1}`;
          state.list.push(bgmObj);
        });
        // Array.prototype.push.apply(state.list, bgmList);
        state.maxKey += bgmList.length;
      }
    }
  },
  mutations: {},
  getters: {
    bgmList: (state: any) => state.list
  }
};
