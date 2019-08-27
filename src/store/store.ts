import Vue from "vue";
import Vuex from "vuex";
import statePrivate from "./state_private";
import statePublic from "./state_public";
import stateSetting from "./state_setting";
import actionFile from "./action_file";
import actionPeer from "./action_peer";
import actionOperation from "./action_operation";
import actionSaveChat from "./action_save_chat";
import yaml from "js-yaml";
import moment from "moment";
import { onMount } from "./action_onMount";
import {
  Dice,
  DiceInfo,
  DiceSystem,
  Locate,
  Matrix,
  Volatile,
  VolatileDice,
  VolatileMapAngleInfo,
  VolatileMapMoveInfo,
  VolatileMapMoveObjInfo,
  VolatileMapRollObjInfo,
  VolatileMouse
} from "@/store/Type_Volatile";

const CryptoJS = require("crypto-js");

type Dispatch = (target: string, payload?: any) => Promise<any>;
type Commit = (target: string, payload?: any) => any;

const state: Volatile = {
  // 以下は揮発性データ（操作中の一時的な記憶領域として使うだけなので、保存データには含めない）
  mouse: { x: 0, y: 0, drag: { from: { x: 0, y: 0 }, move: { x: 0, y: 0 } } },

  self: { webRtcPeer: null, webRtcPeerWait: null },

  param: {
    roomName: null,
    roomPassword: null,
    playerName: null,
    playerPassword: null,
    playerType: null,
    system: null
  },

  room: {
    webRtcRoom: null,
    webRtcRoomWait: null,
    isExist: false,
    isJoined: false
  },

  chat: {
    activeChatTab: "chatTab-1",
    hoverChatTab: "",
    actorKey: "",
    diceSystemList: []
  },

  map: {
    grid: { c: 0, r: 0 },
    mouse: {
      onScreen: { x: 0, y: 0 },
      onTable: { x: 0, y: 0 },
      onCanvas: { x: 0, y: 0 }
    },
    isDraggingLeft: false,
    isMouseDownRight: false,
    isDraggingRight: false,
    isOverEvent: false,
    move: {
      from: { x: 0, y: 0 },
      total: { x: 0, y: 0 },
      dragging: { x: 0, y: 0 }
    },
    moveObj: {
      isMoving: false,
      key: ""
    },
    rollObj: {
      isRolling: false,
      key: ""
    },
    angle: {
      dragging: 0,
      dragStart: 0
    }
  },

  deck: {
    viewMode: "normal",
    hoverIndex: -1,
    hoverKey: "",
    command: null,
    isReverse: false
  },

  dice: {},

  volatileSaveData: {
    players: []
  },

  mode: {
    isModal: true,
    isLoading: 0,
    isWait: false
  }
};

Vue.use(Vuex);

/**
 * Store
 * @type {Store}
 */
export default new Vuex.Store({
  modules: {
    private: statePrivate,
    public: statePublic,
    setting: stateSetting,
    actionFile,
    actionPeer,
    actionOperation,
    actionSaveChat
  },
  state,
  // @ts-ignore
  actions: {
    /**
     * =================================================================================================================
     * 起動時の最初の処理
     * @param dispatch
     * @param state
     * @param rootState
     * @param rootGetters
     * @param commit
     */
    onMount,

    /**
     * =================================================================================================================
     * ルームメンバがいる場合は部屋主に対して処理の通知を出し、そうでない場合はこの場で処理を実行する
     * @param state
     * @param isStart
     */
    loading({ state }: { state: Volatile }, isStart: boolean) {
      // window.console.error(`loading ${state.mode.isLoading} ${isStart ? "+1" : "-1"}`);
      state.mode.isLoading += isStart ? 1 : -1;
    },

    /**
     * =================================================================================================================
     * ルームメンバがいる場合は部屋主に対して処理の通知を出し、そうでない場合はこの場で処理を実行する
     * @param dispatch
     * @param rootGetters
     * @param method
     * @param value
     */
    sendNoticeOperation(
      { dispatch, rootGetters }: { dispatch: Dispatch; rootGetters: any },
      { method, value }: { method: string; value: any }
    ) {
      const isWait = rootGetters.isWait;
      if (rootGetters.members[0]) {
        value.ownerPeerId = rootGetters.peerId(isWait);
        const isMaster =
          rootGetters.members[0].peerId === rootGetters.peerId(isWait);
        if (isMaster) {
          value.processTime = parseInt(moment().format("YYYYMMDDHHmmss"), 0);
        }
        dispatch("sendRoomData", {
          type: isMaster ? "DO_METHOD" : "NOTICE_OPERATION",
          value: value,
          method: method,
          isWait: isWait
        }).then();
        if (isMaster) return dispatch(method, value);
        return null;
      } else {
        value.ownerPeerId = null;
        return dispatch(method, value);
      }
    },

    /**
     * =================================================================================================================
     * 指定されたプロパティパスの値を反転させる
     * @param dispatch
     * @param getters
     * @param commit
     * @param payload
     * @returns {*}
     */
    reverseProperty: async (
      { dispatch, getters }: { dispatch: Dispatch; getters: any },
      payload: any
    ) => {
      const target = getters.getStateValue(payload.property);
      if (typeof target === "boolean") {
        await dispatch("sendNoticeOperation", {
          value: payload,
          method: "doReverseProperty"
        });
      } else {
        // payload.property = `${payload.property}.isDisplay`;
        payload.value = !target.isDisplay;
        if (!target.isDisplay) {
          await dispatch("windowOpen", payload.property);
        } else {
          await dispatch("windowClose", payload.property);
        }
      }
    },

    /**
     * 指定されたプロパティパスの値を反転させる
     * @param getters
     * @param commit
     * @param property
     */
    doReverseProperty: (
      { getters, commit }: { getters: any; commit: Commit },
      { property }: { property: string }
    ) => {
      const target = getters.getStateValue(property);
      const payload = {
        property,
        value: !target,
        logOff: true
      };
      commit("doSetProperty", payload);
    },

    /**
     * =================================================================================================================
     * stateに対するあらゆるデータ格納を代理する関数
     * @param dispatch
     * @param payload
     */
    setProperty: async ({ dispatch }: { dispatch: Dispatch }, payload: any) => {
      if (payload.isNotice) {
        await dispatch("sendNoticeOperation", {
          value: payload,
          method: "doSetProperty"
        });
      } else {
        await dispatch("doSetProperty", payload);
      }
    },

    /**
     * stateに対するあらゆるデータ格納を代理する関数
     * @param commit
     * @param payload
     * @returns {*}
     */
    doSetProperty: ({ commit }: { commit: Commit }, payload: any) => {
      delete payload.ownerPeerId;
      return commit("doSetProperty", payload);
    },

    /**
     * =================================================================================================================
     * 指定されたプロパティパスにある配列を空にする
     * @param dispatch
     * @param payload
     */
    emptyProperty: async (
      { dispatch }: { dispatch: Dispatch },
      payload: any
    ) => {
      if (payload.isNotice) {
        await dispatch("sendNoticeOperation", {
          value: payload,
          method: "doEmptyProperty"
        });
      } else {
        await dispatch("doEmptyProperty", payload);
      }
    },
    /**
     * 指定されたプロパティパスにある配列を空にする
     * @param getters
     * @param property
     * @param logOff
     */
    doEmptyProperty: (
      { getters }: { getters: any },
      { property, logOff }: { property: string; logOff: boolean }
    ) => {
      if (!logOff) window.console.log(`#empty ${property}:`);
      const target = getters.getStateValue(property);
      target.splice(0, target.length);
    },
    updateActorKey: ({ commit }, actorKey) => {
      return commit("updateActorKey", actorKey);
    }
  },
  mutations: {
    /**
     * stateに対するあらゆるデータ格納を代理する関数
     * @param state
     * @param property プロパティパス
     * @param value 代入する値
     * @param logOff true:ログを出力しない
     */
    doSetProperty: (
      state: Volatile,
      {
        property,
        value,
        logOff = false
      }: {
        property: string;
        value: any;
        logOff: boolean;
      }
    ) => {
      if (!logOff) {
        window.console.log(`doSetProperty => ${property}:`, value);
      }

      const propProc = (target: any, props: any[], value: any) => {
        // if (!logOff) window.console.log("【0】propProc", target, props, value);
        const prop = props.shift();
        if (props.length > 0) {
          // if (!logOff) window.console.log("【1】call propProc", JSON.parse(JSON.stringify(target[prop])), props, value);
          propProc(target[prop], props, value);
        } else {
          // 値の適用
          if (
            !(value instanceof Object) ||
            value instanceof Array ||
            typeof value === "function"
          ) {
            // if (!logOff) window.console.log("【2】propProc", JSON.parse(JSON.stringify(target[prop])), "=", value);
            // XXX target[prop] = value;
            Vue.set(target, prop, value);
          } else {
            const propProc2 = (target: any, props: any[]) => {
              for (const prop in props) {
                if (!props.hasOwnProperty(prop)) continue;
                const val: any = props[prop];
                // if (!logOff) window.console.log("【4】propProc2", JSON.parse(JSON.stringify(target)), prop, val, props);
                if (!(val instanceof Object) || typeof val === "function") {
                  // XXX target[prop] = val;
                  Vue.set(target, prop, val);
                } else if (val instanceof Array) {
                  // XXX target[prop] = val;
                  Vue.set(target, prop, val);
                  if (val.length > 0) {
                    val.splice(0, 1, val[0]);
                  }
                } else {
                  if (!target[prop]) {
                    // XXX target[prop] = {};
                    Vue.set(target, prop, {});
                  }
                  // if (!logOff) window.console.log("【6】call propProc2", JSON.parse(JSON.stringify(target[prop])), "=", val);
                  propProc2(target[prop], val);
                }
                // 配列の場合、リアクティブになるよう、splice関数で更新する
                if (target instanceof Array) {
                  const index = parseInt(prop, 10);
                  // if (!logOff) window.console.log("【7】splice propProc2", JSON.parse(JSON.stringify(target)), index, target[index]);
                  target.splice(index, 1, target[index]);
                }
              }
            };
            if (!target[prop]) {
              // XXX target[prop] = {};
              Vue.set(target, prop, {});
            }
            // if (!logOff) window.console.log("【3】call propProc2", JSON.parse(JSON.stringify(target[prop])), value);
            propProc2(target[prop], value);
          }
        }
        // 配列の場合、リアクティブになるよう、splice関数で更新する
        if (target instanceof Array) {
          const index = parseInt(prop, 10);
          // if (!logOff) window.console.log("【8】splice propProc", JSON.parse(JSON.stringify(target)), index, target[index]);
          target.splice(index, 1, target[index]);
        }
      };
      propProc(state, property.split("."), value);
    },
    updateWebRtcPeer: (
      state: Volatile,
      { peer, isWait }: { peer: string; isWait: boolean }
    ) => {
      if (!isWait) state.self.webRtcPeer = peer;
      else state.self.webRtcPeerWait = peer;
    },
    updateWebRtcRoom: (
      state: Volatile,
      { room, isWait }: { room: any; isWait: boolean }
    ) => {
      if (!isWait) state.room.webRtcRoom = room;
      else state.room.webRtcRoomWait = room;
    },
    updateIsWait: (state: Volatile, isWait: boolean) => {
      state.mode.isWait = isWait;
    },
    updateIsModal: (state: Volatile, isModal: boolean) => {
      state.mode.isModal = isModal;
    },
    updateIsJoined: (state: Volatile, isJoined: boolean) => {
      state.room.isJoined = isJoined;
    },
    updateActorKey: (state: Volatile, actorKey: string) => {
      state.chat.actorKey = actorKey;
    }
  },
  getters: {
    loadYaml: (state: Volatile) =>
      /**
       * 指定されたURLのyamlを読み込み、オブジェクトを返却する
       * @param yamlPath yamlファイルのURL
       * @returns {*}
       */
      (yamlPath: string) =>
        window
          .fetch(process.env.BASE_URL + yamlPath)
          .then(responce => responce.text())
          .then(text => yaml.safeLoad(text))
          .catch(err => {
            window.console.log(
              "yamlファイルの読み込みに失敗しました",
              yamlPath
            );
            throw err;
          }),

    loadJson: (state: Volatile) =>
      /**
       * 指定されたURLのjsonを読み込み、オブジェクトを返却する
       * @param jsonPath jsonファイルのURL
       * @returns {*}
       */
      (jsonPath: string) => {
        return window
          .fetch(process.env.BASE_URL + jsonPath)
          .then(responce => responce.text())
          .then(text => JSON.parse(text))
          .catch(err => {
            window.console.log(
              "jsonファイルの読み込みに失敗しました",
              jsonPath
            );
            throw err;
          });
      },

    getStateValue: (state: Volatile, getters: any, rootState: any) =>
      /**
       * stateから指定されたプロパティパスの値を取得する
       * @param property
       * @returns {*}
       */
      (property: string) => {
        let target = rootState;
        property.split(".").forEach(prop => {
          target = target[prop];
        });
        return target;
      },

    isWindowOpen: (state: Volatile, getters: any) =>
      /**
       * isDisplayに相当するプロパティ値を取得する
       * @param displayProperty
       * @returns {*}
       */
      (displayProperty: string) => {
        const target = getters.getStateValue(displayProperty);
        return typeof target === "boolean" ? target : target.isDisplay;
      },

    getKeyObj: () =>
      /**
       * keyをプロパティとして持つオブジェクトの配列から指定されたkeyを持つオブジェクトを検索する
       * @param list
       * @param key
       * @returns {*}
       */
      (list: any[], key: string) => {
        const filteredList = list.filter((obj: any) => obj.key === key);
        if (filteredList.length === 0) {
          // window.console.log(`key:"${key}" is not find.`);
          return null;
        }
        if (filteredList.length > 1) {
          // window.console.log(`key:"(${key})" is duplicate.`);
          return null;
        }
        return filteredList[0];
      },

    parseColor: () =>
      /**
       * 文字をparseしてカラー編集オブジェクトを生成する
       * @param colorText
       * @returns {*}
       */
      (colorText: string) => {
        let _c: any = null;
        if (colorText.startsWith("rgb")) {
          let splits = colorText.replace(/(rgba?\()|\)/g, "").split(",");
          _c = {
            r: parseInt(splits[0].trim(), 10),
            g: parseInt(splits[1].trim(), 10),
            b: parseInt(splits[2].trim(), 10),
            a: colorText.startsWith("rgb(") ? 1 : parseFloat(splits[3].trim())
          };
        } else if (colorText.startsWith("#")) {
          _c = {
            r: parseInt(colorText.substr(1, 2), 16),
            g: parseInt(colorText.substr(3, 2), 16),
            b: parseInt(colorText.substr(5, 2), 16),
            a: 1
          };
        }
        _c.getColorCode = () =>
          `#${("00" + _c.r.toString(16)).slice(-2)}${(
            "00" + _c.g.toString(16)
          ).slice(-2)}${("00" + _c.b.toString(16)).slice(-2)}`;
        _c.getColorCodeReverse = () =>
          `#${("00" + (255 - _c.r).toString(16)).slice(-2)}${(
            "00" + (255 - _c.g).toString(16)
          ).slice(-2)}${("00" + (255 - _c.b).toString(16)).slice(-2)}`;
        _c.getRGB = () => `rgb(${_c.r}, ${_c.g}, ${_c.b})`;
        _c.getRGBA = () => `rgba(${_c.r}, ${_c.g}, ${_c.b}, ${_c.a})`;
        _c.getRGBReverse = () =>
          `rgb(${255 - _c.r}, ${255 - _c.g}, ${255 - _c.b})`;
        return _c;
      },

    objToString: () =>
      /**
       * 指定されたオブジェクトの内容を示す文字列を生成する
       * @param obj
       * @returns {string}
       */
      (obj: any) => {
        const params = [];
        for (const key in obj) {
          if (!obj.hasOwnProperty(key)) continue;
          let val = obj[key];
          if (typeof val === "string") {
            val = `"${val}"`;
          }
          params.push(`${key}:${val}`);
        }
        return `{ ${params.join(", ")} }`;
      },

    paramRoomName: (state: Volatile): string | null => state.param.roomName,
    paramRoomPassword: (state: Volatile): string | null =>
      state.param.roomPassword,
    paramPlayerName: (state: Volatile): string | null => state.param.playerName,
    paramPlayerPassword: (state: Volatile): string | null =>
      state.param.playerPassword,
    paramPlayerType: (state: Volatile): string | null => state.param.playerType,
    isRoomExist: (state: Volatile): boolean => state.room.isExist,
    isRoomJoined: (state: Volatile): boolean => state.room.isJoined,
    isModal: (state: Volatile): boolean => state.mode.isModal,
    isLoading: (state: Volatile): number => state.mode.isLoading,
    isWait: (state: Volatile): boolean => state.mode.isWait,
    activeChatTab: (state: Volatile): string => state.chat.activeChatTab,
    hoverChatTab: (state: Volatile): string => state.chat.hoverChatTab,
    moveObj: (state: Volatile): VolatileMapMoveObjInfo => state.map.moveObj,
    rollObj: (state: Volatile): VolatileMapRollObjInfo => state.map.rollObj,
    isDraggingLeft: (state: Volatile): boolean => state.map.isDraggingLeft,
    isMouseDownRight: (state: Volatile): boolean => state.map.isMouseDownRight,
    isOverEvent: (state: Volatile): boolean => state.map.isOverEvent,
    isDraggingRight: (state: Volatile): boolean => state.map.isDraggingRight,
    move: (state: Volatile): VolatileMapMoveInfo => state.map.move,
    angleVolatile: (state: Volatile): VolatileMapAngleInfo => state.map.angle,
    mouseOnTable: (state: Volatile): Locate => state.map.mouse.onTable,
    mouseOnCanvas: (state: Volatile): Locate => state.map.mouse.onCanvas,
    mouseLocate: (state: Volatile): VolatileMouse => state.mouse,
    deckCommand: (state: Volatile): string | null => state.deck.command,
    deckHoverIndex: (state: Volatile): number => state.deck.hoverIndex,
    deckHoverKey: (state: Volatile): string => state.deck.hoverKey,
    webRtcPeer: (state: Volatile): any => (isWait: boolean) =>
      !isWait ? state.self.webRtcPeer : state.self.webRtcPeerWait,
    webRtcRoom: (state: Volatile): any => (isWait: boolean) =>
      !isWait ? state.room.webRtcRoom : state.room.webRtcRoomWait,
    chatActorKey: (state: Volatile): string => state.chat.actorKey,
    volatilePrivateData: (state: Volatile): any[] =>
      state.volatileSaveData.players,
    chatTabs: (
      state: Volatile,
      getters: any,
      rootState: any,
      rootGetters: any
    ) =>
      rootGetters.chatTabsOption.map((privateTab: any) => {
        const publicTab = rootGetters.chatTabList.filter(
          (publicTab: any) => publicTab.key === privateTab.key
        )[0];
        return {
          key: publicTab.key,
          name: publicTab.name,
          isTotal: publicTab.isTotal,
          isActive: privateTab.isActive,
          isHover: privateTab.isHover,
          unRead: privateTab.unRead,
          order: privateTab.order
        };
      }),
    grid: (state: Volatile): Matrix =>
      JSON.parse(JSON.stringify(state.map.grid)),
    isMoving: (state: Volatile): boolean => state.map.moveObj.isMoving,
    isRolling: (state: Volatile): boolean => state.map.rollObj.isRolling,
    diceSystemList: (state: Volatile): DiceSystem[] =>
      state.chat.diceSystemList,
    dice: (state: Volatile): VolatileDice => state.dice,
    dicePipsImage: (state: Volatile): Function => (
      faceNum: number,
      type: string,
      pips: number
    ): Dice | null => {
      const diceSetList: DiceInfo[] = state.dice[faceNum];
      if (!diceSetList) return null;
      const diceObj: DiceInfo | null = diceSetList.filter(
        (diceSet: DiceInfo) => diceSet.type === type
      )[0];
      if (!diceObj) return null;
      return diceObj.pips[pips];
    },
    hash: (): Function => (planeText: string, key: string): string =>
      CryptoJS.HmacSHA1(planeText, key),
    isSameHash: (): Function => (
      hash: string,
      planeText: string,
      key: string
    ): boolean => hash === CryptoJS.HmacSHA1(planeText, key)
  }
});
