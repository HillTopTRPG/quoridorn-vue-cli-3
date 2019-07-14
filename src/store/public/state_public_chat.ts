export default {
  /** チャット */
  state: {
    /** チャットのタブ */
    tab: {
      list: [{ key: "chatTab-0", name: "メイン" }],
      maxKey: 0,
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
      ],
      maxKey: 0
    },

    /** チャットのリスト */
    logs: {
      "chatTab-0": [
        {
          owner: "SYSTEM",
          viewHtml:
            '<span style="color: red;"><b>SYSTEM</b>：こちらデモ版です。</span>'
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
  actions: {},
  mutations: {},
  getters: {
    chatLogs: (state: any): any[] => state.logs,
    inputting: (state: any): any => state.inputting,
    groupTargetTab: (state: any): any => state.groupTargetTab,
    groupTargetTabList: (state: any): any => state.groupTargetTab.list,
    getChatColor: (
      state: any,
      getters: any,
      rootState: any,
      rootGetters: any
    ) => (actorKey: string) => {
      const actor = rootGetters.getSelfActors.filter(
        (actor: any) => actor.key === actorKey
      )[0];
      if (!actor) return "black";
      if (actor.fontColorType === "0")
        return rootGetters.getSelfActors[0].color;
      return actor.fontColor;
    },
    diceBotMessageText: (state: any) => state.diceBotMessage.message,
    diceBotMessageView: (state: any) => state.diceBotMessage.isView,
    isChatTabVertical: (state: any) => state.tab.isVertical
  }
};
