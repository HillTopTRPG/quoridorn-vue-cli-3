import jukeboxWindowStore from "@/store/private/display/jukeboxWindowStore";
import inputPlayerInfoWindowStore from "@/store/private/display/inputPlayerInfoWindowStore";
import dropZipWindowStore from "@/store/private/display/dropZipWindowStore";
import imageSelectorWindowStore from "@/store/private/display/imageSelectorWindowStore";
import chitContextStore from "@/store/private/display/chitContextStore";
import mapMaskContextStore from "@/store/private/display/mapMaskContextStore";
import characterContextStore from "@/store/private/display/characterContextStore";
import counterRemoconContextStore from "@/store/private/display/counterRemoconContextStore";
import counterRemoconEditorWindowStore from "@/store/private/display/counterRemoconEditorWindowStore";
import dropImageWindowStore from "@/store/private/display/dropImageWindowStore";
import resourceWindowStore from "@/store/private/display/resourceWindowStore";
import chatPaletteSettingWindowStore from "@/store/private/display/chatPaletteSettingWindowStore";
import chatPaletteWindowStore from "@/store/private/display/chatPaletteWindowStore";
import counterRemoconWindowStore from "@/store/private/display/counterRemoconWindowStore";
import addMapMaskWindowStore from "@/store/private/display/addMapMaskWindowStore";
import devLogWindowStore from "@/store/private/display/devLogWindowStore";
import secretDiceWindowStore from "@/store/private/display/secretDiceWindowStore";
import addCharacterSettingWindowStore from "@/store/private/display/addCharacterSettingWindowStore";
import roomInfoWindowStore from "@/store/private/display/roomInfoWindowStore";
import addChitWindowStore from "@/store/private/display/addChitWindowStore";
import editMapWindowStore from "@/store/private/display/editMapWindowStore";
import addBGMWindowStore from "@/store/private/display/addBGMWindowStore";
import versionWindowStore from "@/store/private/display/versionWindowStore";
import settingChatTabWindowStore from "@/store/private/display/settingChatTabWindowStore";
import welcomeWindowStore from "@/store/private/display/welcomeWindowStore";
import playerBoxWindowStore from "@/store/private/display/playerBoxWindowStore";
import standImageSettingWindowStore from "@/store/private/display/standImageSettingWindowStore";
import addDiceSymbolWindowStore from "@/store/private/display/addDiceSymbolWindowStore";
import fileUploaderWindowStore from "@/store/private/display/fileUploaderWindowStore";
import editMapMaskWindowStore from "@/store/private/display/editMapMaskWindowStore";
import editCharacterWindowStore from "@/store/private/display/editCharacterWindowStore";
import editChitWindowStore from "@/store/private/display/editChitWindowStore";
import editBGMWindowStore from "@/store/private/display/editBGMWindowStore";
import imageViewWindowStore from "@/store/private/display/imageViewWindowStore";
import editCustomDiceBotTableWindowStore from "@/store/private/display/editCustomDiceBotTableWindowStore";
import selectNewOwnerWindowStore from "@/store/private/display/selectNewOwnerWindowStore";
import editChatPaletteWindowStore from "@/store/private/display/editChatPaletteWindowStore";
import importChatPaletteWindowStore from "@/store/private/display/importChatPaletteWindowStore";
import chatWindowStore from "@/store/private/display/chatWindowStore";
import addCharacterWindowStore from "@/store/private/display/addCharacterWindowStore";
import settingBGMWindowStore from "@/store/private/display/settingBGMWindowStore";
import settingChatTargetTabWindowStore from "@/store/private/display/settingChatTargetTabWindowStore";
import editGroupChatWindowStore from "@/store/private/display/editGroupChatWindowStore";
import gameTableContextStore from "@/store/private/display/gameTableContextStore";
import cardContextStore from "@/store/private/display/cardContextStore";
import initiativeWindowStore from "@/store/private/display/initiativeWindowStore";
import initiativeSettingWindowStore from "@/store/private/display/initiativeSettingWindowStore";
import publicMemoWindowStore from "@/store/private/display/publicMemoWindowStore";
import publicMemoContextStore from "@/store/private/display/publicMemoContextStore";
import diceSymbolContextStore from "@/store/private/display/diceSymbolContextStore";
import customDiceBotTableWindowStore from "@/store/private/display/customDiceBotTableWindowStore";
import unSupportWindowStore from "@/store/private/display/unSupportWindowStore";
import importBGMWindowStore from "@/store/private/display/importBGMWindowStore";

export default {
  modules: {
    addBGMWindow: addBGMWindowStore,
    addCharacterSettingWindow: addCharacterSettingWindowStore,
    addCharacterWindow: addCharacterWindowStore,
    addChitWindow: addChitWindowStore,
    addDiceSymbolWindow: addDiceSymbolWindowStore,
    addMapMaskWindow: addMapMaskWindowStore,
    cardContext: cardContextStore,
    characterContext: characterContextStore,
    chatPaletteWindow: chatPaletteWindowStore,
    chatPaletteSettingWindow: chatPaletteSettingWindowStore,
    chatWindow: chatWindowStore,
    chitContext: chitContextStore,
    counterRemoconContext: counterRemoconContextStore,
    counterRemoconEditorWindow: counterRemoconEditorWindowStore,
    counterRemoconWindow: counterRemoconWindowStore,
    customDiceBotTableWindow: customDiceBotTableWindowStore,
    devLogWindow: devLogWindowStore,
    diceSymbolContext: diceSymbolContextStore,
    dropImageWindow: dropImageWindowStore,
    dropZipWindow: dropZipWindowStore,
    editBGMWindow: editBGMWindowStore,
    editCharacterWindow: editCharacterWindowStore,
    editChatPaletteWindow: editChatPaletteWindowStore,
    editChitWindow: editChitWindowStore,
    editCustomDiceBotTableWindow: editCustomDiceBotTableWindowStore,
    editGroupChatWindow: editGroupChatWindowStore,
    editMapMaskWindow: editMapMaskWindowStore,
    editMapWindow: editMapWindowStore,
    fileUploaderWindow: fileUploaderWindowStore,
    gameTableContext: gameTableContextStore,
    imageSelectorWindow: imageSelectorWindowStore,
    imageViewWindow: imageViewWindowStore,
    importChatPaletteWindow: importChatPaletteWindowStore,
    initiativeSettingWindow: initiativeSettingWindowStore,
    initiativeWindow: initiativeWindowStore,
    inputPlayerInfoWindow: inputPlayerInfoWindowStore,
    jukeboxWindow: jukeboxWindowStore,
    mapMaskContext: mapMaskContextStore,
    playerBoxWindow: playerBoxWindowStore,
    publicMemoContext: publicMemoContextStore,
    publicMemoWindow: publicMemoWindowStore,
    resourceWindow: resourceWindowStore,
    roomInfoWindow: roomInfoWindowStore,
    secretDiceWindow: secretDiceWindowStore,
    selectNewOwnerWindow: selectNewOwnerWindowStore,
    settingBGMWindow: settingBGMWindowStore,
    importBGMWindow: importBGMWindowStore,
    settingChatTabWindow: settingChatTabWindowStore,
    settingChatTargetTabWindow: settingChatTargetTabWindowStore,
    standImageSettingWindow: standImageSettingWindowStore,
    versionWindow: versionWindowStore,
    welcomeWindow: welcomeWindowStore,
    unSupportWindow: unSupportWindowStore
  },
  state: {},
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
     * @param rootGetters
     * @param property
     */
    windowOpen(
      { dispatch, rootGetters }: { dispatch: Function; rootGetters: any },
      property: string
    ) {
      const windowObj = rootGetters.getStateValue(property);
      windowObj.command = { command: !windowObj.isDisplay ? "open" : "reset" };
      windowObj.isDisplay = true;
      dispatch("windowActive", { property: property, isClose: false });
    },

    /**
     * 指定されたプロパティパスの子画面を閉じる
     * @param dispatch
     * @param state
     * @param rootGetters
     * @param property
     */
    windowClose(
      { dispatch, rootGetters }: { dispatch: Function; rootGetters: any },
      property: string
    ) {
      const windowObj = rootGetters.getStateValue(property);
      windowObj.command = { command: "close" };
      windowObj.isDisplay = false;
      dispatch("windowActive", { property: property, isClose: true });
    },

    /**
     * 指定されたプロパティパスの子画面をアクティブにする
     * @param rootState
     * @param property
     * @param isClose
     */
    windowActive(
      { rootState }: { rootState: any },
      { property, isClose }: { property: string; isClose: boolean }
    ) {
      const splits = property.split(".");
      const dispName = splits[splits.length - 1];
      // window.console.log(`windowActive => ${ dispName }`);

      // displayの表示済みの画面を表示順ソートしたプロパティのリスト（指定のもの含まない）
      const propList = Object.entries(rootState.private.display)
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
          rootState.private.display[propName].zIndex = index + 100001;
        } else {
          rootState.private.display[propName].zIndex = index + 1;
        }
      });

      // 指定された画面のz-indexを最大に設定（モーダルスクリーンより手前にする）
      if (!isClose)
        rootState.private.display[dispName].zIndex = propList.length + 100001;
    }
  },
  mutations: {},
  getters: {
    // TODO デプロイするとこれ動かない！なんでぇ！！！
    getWindowParam: (state: any) => (windowName: string): any =>
      state[windowName],
    display: (state: any) => state
  }
};
