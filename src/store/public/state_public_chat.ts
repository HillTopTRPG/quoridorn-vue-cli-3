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
          name: "SYSTEM",
          from: "SYSTEM",
          target: "groupTargetTab-0",
          text: "こちらデモ版です。",
          color: "color-SYSTEM",
          statusName: "◆",
          isDiceBot: false,
          type: 1
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
     * ルームメンバの入力中状態の変化
     * @param state
     * @param key
     * @param add
     */
    inputPeerId(
      this: any,
      state: any,
      { key, add }: { key: string; add: number }
    ) {
      // プロパティが無ければ、リアクティブになる形式で登録をする
      if (!state.inputting[key]) {
        this._vm.$set(state.inputting, key, 0);
      }
      // 値の足し込み
      state.inputting[key] += add;
    }
  },
  getters: {
    chatLogs: (state: any): any[] => state.logs,
    chatTabList: (state: any): any[] => state.tab.list,
    inputting: (state: any): any => state.inputting,
    groupTargetTab: (state: any): any => state.groupTargetTab,
    groupTargetTabList: (state: any): any => state.groupTargetTab.list,
    getChatColor: (
      state: any,
      getters: any,
      rootState: any,
      rootGetters: any
    ) => (actorKey: string) => {
      const actor = rootGetters.getAllActors.filter(
        (actor: any) => actor.key === actorKey
      )[0];
      if (!actor) return "black";
      if (actor.fontColorType === "0") {
        const owner = rootGetters.getObj(actor.owner);
        window.console.log(owner);
        return owner.fontColor;
      }
      return actor.fontColor;
    },
    diceBotMessageText: (state: any) => state.diceBotMessage.message,
    diceBotMessageView: (state: any) => state.diceBotMessage.isView,
    isChatTabVertical: (state: any) => state.tab.isVertical,
    colorMap: (state: any, getters: any, rootState: any, rootGetters: any) => {
      const resultObj: any = {};
      resultObj[rootGetters.systemLog.colorKey] = rootGetters.systemLog.color;
      rootGetters.characterList.forEach((c: any) => {
        resultObj[`color-${c.key}`] = rootGetters.getChatColor(c.key);
      });
      rootGetters.playerList.forEach((p: any) => {
        resultObj[`color-${p.key}`] = p.fontColor;
      });
      window.console.log(JSON.stringify(resultObj, null, "    "));
      return resultObj;
    }
  }
};
