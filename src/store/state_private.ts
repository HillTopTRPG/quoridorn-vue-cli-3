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
      playerKey: null,
      currentChatKey: "",

      playerName: "",
      playerType: "",
      password: "",
      color: "black",
      cards: []
    },

    /** 設定(private) */
    setting: {
      standImage: true, // 立ち絵を表示するか
      dice: true, // ダイスを表示するか
      cutIn: true, // カットインを表示するか
      standImageAutoResize: true // 立ち絵のサイズを自動調節する
    },

    /** マップ */
    map: {
      angle: {
        total: 0
      },
      wheel: 0
    },

    /** 操作履歴 */
    history: [],

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
      createRoomWindow: { command: null, isDisplay: false, zIndex: 1 },
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
        playerType: ""
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
    }
  } /* end of actions */,
  mutations: {
    // /**
    //  * プレイヤーを追加する
    //  * @param state
    //  * @returns { *[] }
    //  */
    // addPlayerWidth: (state) => {
    //   const widthList = state.display.settingChatTargetTabWindow.widthList
    //   const maxWidth = state.display.settingChatTargetTabWindow.windowSize.w - 54
    //   const fixWidth = widthList[0] + widthList[1] + widthList[2] + widthList[3] + 4
    //   let itemWidth = 50
    //   const itemNum = widthList.length - 4
    //   const itemTotalWidth = (itemWidth + 1) * itemNum
    //   const contentsWidth = fixWidth + itemTotalWidth
    //   let marginWidth = 0
    //   if (contentsWidth <= maxWidth) {
    //     marginWidth = maxWidth - contentsWidth
    //   } else {
    //     marginWidth = 0
    //     itemWidth = (maxWidth - fixWidth) / itemNum - 1
    //   }
    //   const newArr = [
    //     widthList[0],
    //     widthList[1],
    //     widthList[2],
    //     widthList[3]
    //   ]
    //   for (let i = 0; i < itemNum; i++) {
    //     newArr.push(itemWidth)
    //   }
    //   newArr.push(marginWidth)
    //   window.console.log('#=#=#=#=#', newArr.join(','))
    //   state.display.settingChatTargetTabWindow.widthList = newArr
    // }
  },
  getters: {
    masterMute: (state: any) => state.display.jukeboxWindow.masterMute,
    masterVolume: (state: any) => state.display.jukeboxWindow.masterVolume,
    fontColor: (state: any) => state.self.color,
    playerKey: (state: any) => state.self.playerKey,
    playerName: (state: any) => state.self.playerName,
    playerPassword: (state: any) => state.self.password,
    playerType: (state: any) => state.self.playerType,
    currentChatKey: (state: any) => state.self.currentChatKey,
    peerId: (state: any) => state.self.peerId,
    angle: (state: any) => state.map.angle,
    wheel: (state: any) => state.map.wheel,
    getWindowParam: (state: any) => (windowName: any): any =>
      state.display[windowName]
  }
};
