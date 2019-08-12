export default {
  /** チャット */
  state: {
    tab: [
      {
        key: "chatTab-0",
        isActive: false,
        isHover: false,
        unRead: 0,
        order: 0
      },
      {
        key: "chatTab-1",
        isActive: true,
        isHover: false,
        unRead: 0,
        order: 1
      }
    ],
    secretDiceList: []
  },
  actions: {},
  mutations: {
    addSecretDice: (state: any, secretDiceObj: any) => {
      state.secretDiceList.push(secretDiceObj);
    },

    delSecretDice: (state: any, index: number) => {
      state.secretDiceList.splice(index, 1);
    },

    /**
     * チャットのタブを選択したことをデータに反映する
     * @param state
     * @param key
     */
    chatTabSelect(state: any, key: string) {
      const tabList = state.tab;
      tabList.forEach((tab: any, index: number) => {
        if (tab.key === key) {
          tab.isActive = true;
          tab.unRead = 0;
          tabList.splice(index, 1, tab);
        } else {
          if (tab.isActive) {
            tab.isActive = false;
            tabList.splice(index, 1, tab);
          }
        }
      });
    }
  },
  getters: {
    chatTabsOption: (state: any): any[] => state.tab,
    secretDiceList: (state: any) => state.secretDiceList
  }
};
