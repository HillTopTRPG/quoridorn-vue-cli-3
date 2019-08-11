export default {
  /** チャット */
  state: {
    /** チャットのタブ */
    tab: {
      list: [
        { key: "chatTab-0", name: "統合", isTotal: true },
        { key: "chatTab-1", name: "メイン", isTotal: false }
      ],
      maxKey: 1,
      isVertical: false,
      isViewTime: false,
      isViewTotalTab: false
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
    logs: [
      {
        owner: "Quoridorn",
        name: "Quoridorn",
        from: "Quoridorn",
        tab: "chatTab-1",
        target: "groupTargetTab-0",
        text: "ようこそQuoridornへ！",
        color: "color-Quoridorn",
        statusName: "◆",
        isDiceBot: false,
        type: 1
      }
    ],

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
    },

    /** ========================================================================
     * チャットタブ追加処理
     */
    deleteChatLog: (
      { dispatch }: { dispatch: Function }
    ): string => {
      return dispatch("sendNoticeOperation", {
        value: {},
        method: "doDeleteChatLog"
      });
    },
    doDeleteChatLog: (
      { state }: { state: any }
    ) => {
      state.logs.splice(0, state.logs.length);
      state.logs.push({
        owner: "Quoridorn",
        name: "Quoridorn",
        from: "Quoridorn",
        tab: "chatTab-1",
        target: "groupTargetTab-0",
        text: "チャットログを初期化しました。",
        color: "color-Quoridorn",
        statusName: "◆",
        isDiceBot: false,
        type: 1
      });
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
      const actor = rootGetters.getObj(actorKey);
      if (!actor) return "black";
      return actor.fontColorType === "0"
        ? rootGetters.getObj(actor.owner).fontColor
        : actor.fontColor;
    },
    diceBotMessageText: (state: any) => state.diceBotMessage.message,
    diceBotMessageView: (state: any) => state.diceBotMessage.isView,
    isChatTabVertical: (state: any) => state.tab.isVertical,
    isViewTime: (state: any) => state.tab.isViewTime,
    isViewTotalTab: (state: any) => state.tab.isViewTotalTab,
    colorMap: (state: any, getters: any, rootState: any, rootGetters: any) => {
      const resultObj: any = {};
      resultObj[rootGetters.systemLog.colorKey] = rootGetters.systemLog.color;
      rootGetters.characterList.forEach((c: any) => {
        resultObj[`color-${c.key}`] = rootGetters.getChatColor(c.key);
      });
      rootGetters.playerList.forEach((p: any) => {
        resultObj[`color-${p.key}`] = p.fontColor;
      });
      // window.console.log(JSON.stringify(resultObj, null, "    "));
      return resultObj;
    },
    chatLogList: (
      state: any,
      getters: any,
      rootState: any,
      rootGetters: any
    ) => {
      const activeChatTab = rootGetters.getObj(rootGetters.activeChatTab);
      return rootGetters.chatLogs.filter((log: any) => {
        if (!activeChatTab) return false;
        if (!activeChatTab.isTotal && log.tab !== activeChatTab.key)
          return false;
        if (log.type !== 1) return false;
        if (log.owner === rootGetters.playerKey) return true;
        if (!log.target) return true;
        if (log.target === "groupTargetTab-0") return true;
        const kind = log.target.split("-")[0];
        if (kind === "groupTargetTab") {
          const target = getters.getObj(log.target);
          if (!target.isSecret) return true;
          if (target.isAll) return true;
          const findIndex = target.group.findIndex((g: string) => {
            const kind = g.split("-")[0];
            if (kind === "player") {
              if (g === rootGetters.playerKey) return true;
            } else if (kind === "character") {
              if (getters.getObj(g).owner === rootGetters.playerKey)
                return true;
            }
            return false;
          });
          return findIndex > -1;
        } else if (kind === "player") {
          return log.target === rootGetters.playerKey;
        } else {
          const target = getters.getObj(log.target);
          return target.owner === rootGetters.playerKey;
        }
      });
    },
    groupTargetTabListFiltered: (
      state: any,
      getters: any,
      rootState: any,
      rootGetters: any
    ) => {
      const playerKey: string = rootGetters.playerKey;
      const fieldCharacters: any[] = rootGetters.getMapObjectList({
        kind: "character",
        place: "field",
        playerKey
      });
      return getters.groupTargetTabList.filter((gtt: any) => {
        if (gtt.isAll) return true;
        if (gtt.group.findIndex((g: string) => g === playerKey) >= 0)
          return true;
        if (
          gtt.group.findIndex(
            (g: string) =>
              fieldCharacters.findIndex((c: any) => c.key === g) >= 0
          ) >= 0
        )
          return true;
        return false;
      });
    },
    createInputtingMsg: (
      state: any,
      getters: any,
      rootState: any,
      rootGetters: any
    ) => (name: string) => `${rootGetters.getViewName(name)}が入力中...`,
    chatTargetList: (
      state: any,
      getters: any,
      rootState: any,
      rootGetters: any
    ) => {
      const playerKey: string = rootGetters.playerKey;
      const fieldCharacters: any[] = rootGetters.getMapObjectList({
        kind: "character",
        place: "field",
        playerKey
      });
      return [
        ...rootGetters.groupTargetTabListFiltered,
        ...rootGetters.playerList,
        ...fieldCharacters
      ];
    }
  }
};
