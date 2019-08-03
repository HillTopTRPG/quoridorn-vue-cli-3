export default {
  /** チャット */
  state: {
    /** チャットのタブ */
    tab: {
      list: [{ key: "chatTab-0", name: "メイン" }],
      isVertical: false
    },

    /** グループチャットのタブ */
    groupTargetTab: {
      list: [
        {
          key: "groupTargetTab-0",
          isSecret: false,
          name: "全体",
          targetTab: null,
          isAll: true,
          group: []
        }
      ]
    },

    /** チャットのリスト */
    logs: {
      "chatTab-0": [
        {
          owner: "SYSTEM",
          from: "SYSTEM",
          target: "groupTargetTab-0",
          text: "こちらデモ版です。",
          color: "red",
          statusName: "◆",
          isDiceBot: false
        }
      ]
    },

    /** 入力中のルームメイトのpeerId一覧 */
    inputting: {},

    diceBotMessage: {
      isView: false,
      message: ""
    }
  },
  actions: {
    /**
     * NOTICE_INPUT
     * ルームメンバの入力中状態の通知
     * @param commit
     * @param key
     */
    noticeInput: (
      { commit }: { commit: Function },
      { key }: { key: string }
    ) => {
      // 即時入力カウントアップ
      commit("inputPeerId", { key: key, add: 1 });
      // 少し経ったらカウントダウン
      setTimeout(() => {
        commit("inputPeerId", { key: key, add: -1 });
      }, 400);
    }
  },
  mutations: {
    /**
     * チャットログを設定する
     * @param state
     * @param logs
     * @returns { *[] }
     */
    setChatLogs: (state: any, logs: any) => {
      state.logs = logs;
    },
    /**
     * チャットタブを設定する
     * @param state
     * @param chatTabs
     * @returns { *[] }
     */
    setChatTabs: (state: any, chatTabs: any[]) => {
      state.tab.list = chatTabs;
    },
    /**
     * グループチャットタブを設定する
     * @param state
     * @param groupTargetTabList
     * @returns { *[] }
     */
    setGroupTargetTabList: (state: any, groupTargetTabList: any[]) => {
      state.groupTargetTab.list = groupTargetTabList;
    },
    setChatTabVertical: (state: any, isVertical: boolean) =>
      (state.tab.isVertical = isVertical)
  },
  getters: {
    chatLogs: (state: any): any[] => state.logs,
    chatTabList: (state: any): any[] => state.tab.list,
    groupTargetTabList: (state: any): any => state.groupTargetTab.list,
    isChatTabVertical: (state: any) => state.tab.isVertical
  }
};
