// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'bcdice-js/lib/preload-dicebots'
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

/**
 * Store
 */
export default {
  // privateデータは、データ保存時に public.room.members に含める
  state: {
    /** 接続情報 */
    self: {
      peerId: null,
      peerIdWait: null,
      playerKey: null,

      cards: []
    },

    /** 設定(private) */
    setting: {
      standImage: true, // 立ち絵を表示するか
      dice: true, // ダイスを表示するか
      cutIn: true, // カットインを表示するか
      standImageAutoResize: true // 立ち絵のサイズを自動調節する
    },

    /** チャット */
    chat: {
      tab: [
        {
          key: "chatTab-0",
          isActive: true,
          isHover: false,
          unRead: 0,
          order: 0
        }
      ]
    },

    /** マップ */
    map: {
      angle: {
        total: 0
      },
      wheel: 0
    },

    /** 操作履歴 */
    historyList: [],

    /** 子画面 */
    display: {
      unSupportWindow: {
        command: null,
        isDisplay: false,
        zIndex: 1,
        title: "default"
      },
      chatWindow: { command: null, isDisplay: false, zIndex: 1 },
      initiativeWindow: { command: null, isDisplay: false, zIndex: 1 },
      resourceWindow: { command: null, isDisplay: false, zIndex: 1 },
      chatPaletteWindow: { command: null, isDisplay: false, zIndex: 1 },
      counterRemoConWindow: { command: null, isDisplay: false, zIndex: 1 },
      functionListWindow: { command: null, isDisplay: false, zIndex: 1 },
      addMapMaskWindow: { command: null, isDisplay: false, zIndex: 1 },
      editMapMaskWindow: {
        command: null,
        isDisplay: false,
        zIndex: 1,
        key: -1
      },
      devLogWindow: { command: null, isDisplay: false, zIndex: 1 },
      publicMemoWindow: { command: null, isDisplay: false, zIndex: 1, key: -1 },
      secretDiceWindow: { command: null, isDisplay: false, zIndex: 1 },
      addCharacterSettingWindow: { command: null, isDisplay: false, zIndex: 1 },
      addCharacterWindow: {
        command: null,
        isDisplay: false,
        doResetPosition: false,
        zIndex: 1,
        name: "",
        size: 1,
        useImageList: "",
        isHide: false,
        url: "",
        text: "",
        useImageIndex: 0,
        currentImageTag: "",
        isContinuous: false,
        continuousNum: 1
      },
      roomInfoWindow: { command: null, isDisplay: false, zIndex: 1 },
      dropImageWindow: {
        command: null,
        isDisplay: false,
        zIndex: 1,
        imageDataList: null
      },
      dropZipWindow: {
        command: null,
        isDisplay: false,
        zIndex: 1,
        zipList: null
      },
      inviteLinkWindow: { command: null, isDisplay: false, zIndex: 1 },
      selectPeerWindow: { command: null, isDisplay: false, zIndex: 1 },
      confirmLoadRoomWindow: {
        command: null,
        isDisplay: false,
        zIndex: 1,
        importData: null
      },
      addChitWindow: { command: null, isDisplay: false, zIndex: 1 },
      editChitWindow: { command: null, isDisplay: false, zIndex: 1, key: -1 },
      editMapWindow: { command: null, isDisplay: false, zIndex: 1 },
      editCharacterWindow: {
        command: null,
        isDisplay: false,
        zIndex: 1,
        key: -1
      },
      settingBGMWindow: {
        command: null,
        isDisplay: false,
        doResetPosition: false,
        zIndex: 1,
        // テーブル形式用データここから
        widthList: [30, 30, 30, 112, 53, 25, 30, 40],
        selectLineKey: null,
        hoverDevIndex: -1,
        movingIndex: -1,
        startX: -1,
        startLeftWidth: -1,
        startRightWidth: -1
        // テーブル形式用データここまで
      },
      jukeboxWindow: {
        command: null,
        isDisplay: false,
        zIndex: 1,
        masterMute: false,
        masterVolume: 0.5
      },
      editBGMWindow: { command: null, isDisplay: false, zIndex: 1, key: -1 },
      addBGMWindow: { command: null, isDisplay: false, zIndex: 1 },
      versionWindow: { command: null, isDisplay: false, zIndex: 1 },
      settingChatTabWindow: { command: null, isDisplay: false, zIndex: 1 },
      settingChatFontWindow: { command: null, isDisplay: false, zIndex: 1 },
      welcomeWindow: { command: null, isDisplay: false, zIndex: 1 },
      settingChatTargetTabWindow: {
        command: null,
        isDisplay: false,
        zIndex: 1,
        windowSize: { w: 537, h: 300 },
        // テーブル形式用データここから
        widthList: [25, 80, 80, 253, 58], // 500
        selectLineKey: null,
        hoverDevIndex: -1,
        movingIndex: -1,
        startX: -1,
        startLeftWidth: -1,
        startRightWidth: -1
        // テーブル形式用データここまで
      },
      editGroupChatWindow: {
        command: null,
        isDisplay: false,
        zIndex: 1,
        windowSize: { w: 237, h: 400 },
        key: null,
        // テーブル形式用データここから
        widthList: [25, 174], // 200
        selectLineKey: null,
        hoverDevIndex: -1,
        movingIndex: -1,
        startX: -1,
        startLeftWidth: -1,
        startRightWidth: -1
        // テーブル形式用データここまで
      },
      playerBoxWindow: { command: null, isDisplay: false, zIndex: 1 },
      mapMaskContext: { command: null, isDisplay: false, key: -1, x: 0, y: 0 },
      characterContext: {
        command: null,
        isDisplay: false,
        key: -1,
        x: 0,
        y: 0
      },
      gameTableContext: { command: null, isDisplay: false, x: 0, y: 0 },
      chitContext: { command: null, isDisplay: false, x: 0, y: 0, key: -1 },
      cardContext: { command: null, isDisplay: false, x: 0, y: 0, key: -1 },
      inputPlayerInfoWindow: {
        command: null,
        isDisplay: false,
        zIndex: 1,
        playerName: "",
        playerPassword: "",
        playerType: "",
        fontColor: "",
        resolve: null
      }
    }
  } /* end of state */,
  actions: {
    /**
     * 画面の配置を初期化する
     */
    doResetWindowLocate() {
      // TODO 実装
      alert("未実装の機能です。");
    },

    /**
     * 指定されたプロパティパスの子画面を開く
     * @param dispatch
     * @param state
     * @param getters
     * @param property
     */
    windowOpen(
      {
        dispatch,
        state,
        getters
      }: { dispatch: Function; state: any; getters: any },
      property: string
    ) {
      const windowObj = getters.getStateValue(property);
      windowObj.command = { command: !windowObj.isDisplay ? "open" : "reset" };
      windowObj.isDisplay = true;
      dispatch("windowActive", { property: property, isClose: false });
    },

    /**
     * 指定されたプロパティパスの子画面を閉じる
     * @param dispatch
     * @param state
     * @param getters
     * @param property
     */
    windowClose(
      {
        dispatch,
        state,
        getters
      }: { dispatch: Function; state: any; getters: any },
      property: string
    ) {
      const windowObj = getters.getStateValue(property);
      windowObj.command = { command: "close" };
      windowObj.isDisplay = false;
      dispatch("windowActive", { property: property, isClose: true });
    },

    /**
     * 指定されたプロパティパスの子画面をアクティブにする
     * @param state
     * @param getters
     * @param property
     */
    windowActive(
      { state }: { state: any },
      { property, isClose }: { property: string; isClose: boolean }
    ) {
      const splits = property.split(".");
      const dispName = splits[splits.length - 1];
      // window.console.log(`windowActive => ${ dispName }`);

      // displayの表示済みの画面を表示順ソートしたプロパティのリスト（指定のもの含まない）
      const propList = Object.entries(state.display)
        .map(([key, value]) => ({ key, value }))
        .filter((obj: any) => {
          if (obj.key === dispName) return false;
          if (!obj.value) return false;
          return obj.value.isDisplay;
        })
        .sort((val1: any, val2: any) => {
          if (val1.value.zIndex < val2.value.zIndex) return -1;
          if (val1.value.zIndex > val2.value.zIndex) return 1;
          return 0;
        })
        .map((obj: any) => obj.key);

      // 指定以外の画面のz-indexを順番に再設定
      propList.forEach((propName: string, index: number) => {
        if (isClose && index === propList.length - 1) {
          state.display[propName].zIndex = index + 100001;
        } else {
          state.display[propName].zIndex = index + 1;
        }
      });

      // 指定された画面のz-indexを最大に設定（モーダルスクリーンより手前にする）
      if (!isClose) state.display[dispName].zIndex = propList.length + 100001;
    },

    /**
     * チャットのタブを選択したことをデータに反映する
     * @param commit
     * @param key
     * @returns {*}
     */
    chatTabSelect: ({ commit }: { commit: Function }, key: string) =>
      commit("chatTabSelect", key)
  } /* end of actions */,
  mutations: {
    updatePeerId: (
      state: any,
      { peerId, isWait }: { peerId: string; isWait: boolean }
    ) => {
      if (!isWait) state.self.peerId = peerId;
      else state.self.peerIdWait = peerId;
    },

    /**
     * チャットのタブを選択したことをデータに反映する
     * @param state
     * @param key
     */
    chatTabSelect(state: any, key: string) {
      const tabList = state.chat.tab;
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
    masterMute: (state: any) => state.display.jukeboxWindow.masterMute,
    masterVolume: (state: any) => state.display.jukeboxWindow.masterVolume,
    fontColor: (state: any) => state.self.color,
    playerKey: (state: any) => state.self.playerKey,
    peerId: (state: any): Function => (isWait: boolean) =>
      !isWait ? state.self.peerId : state.self.peerIdWait,
    angle: (state: any) => state.map.angle,
    wheel: (state: any) => state.map.wheel,
    // TODO デプロイするとこれ動かない！なんでぇ！！！
    getWindowParam: (state: any) => (windowName: string): any =>
      state.display[windowName],
    volatileRoomName: (state: any) =>
      state.display.inputPlayerInfoWindow.roomName,
    volatilePlayerName: (state: any) =>
      state.display.inputPlayerInfoWindow.playerName,
    volatilePlayerPassword: (state: any) =>
      state.display.inputPlayerInfoWindow.playerPassword,
    volatilePlayerType: (state: any) =>
      state.display.inputPlayerInfoWindow.playerType,
    volatileFontColor: (state: any) =>
      state.display.inputPlayerInfoWindow.fontColor,
    volatileResolve: (state: any) =>
      state.display.inputPlayerInfoWindow.resolve,
    historyList: (state: any) => state.historyList,
    chatTabsOption: (state: any): any[] => state.chat.tab
  }
};
