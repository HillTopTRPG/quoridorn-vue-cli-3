import Vue from "vue";
import Vuex from "vuex";
import statePrivate from "./state_private";
import statePublic from "./state_public";
import stateSetting from "./state_setting";
import actionFile from "./action_file";
import actionPeer from "./action_peer";
import actionOperation from "./action_operation";
import saveChat from "./action_save_chat";
import { getFileNameArgList, getUrlParam } from "@/components/common/Utility";
import yaml from "js-yaml";
import moment from "moment";

const CryptoJS = require("crypto-js");

type Dispatch = (target: string, payload?: any) => Promise<any>;
type Commit = (target: string, payload?: any) => any;

type Locate = {
  x: number;
  y: number;
};

type Matrix = {
  c: number;
  r: number;
};

interface VolatileMouse extends Locate {
  drag: {
    from: Locate;
    move: Locate;
  };
}

type DiceSystem = {
  system: string;
  name: string;
};

type VolatileChat = {
  activeChatTab: string;
  hoverChatTab: string;
  actorKey: string;
  diceSystemList: DiceSystem[];
};

type VolatileMapMoveObjInfo = {
  isMoving: boolean;
  key: string;
};

type VolatileMapRollObjInfo = {
  isRolling: boolean;
  key: string;
};

type VolatileMapMoveInfo = {
  from: Locate;
  total: Locate;
  dragging: Locate;
};

type VolatileMapAngleInfo = {
  dragging: number;
  dragStart: number;
};

type VolatileMap = {
  grid: Matrix;
  mouse: {
    onScreen: Locate;
    onTable: Locate;
    onCanvas: Locate;
  };
  isDraggingLeft: boolean;
  isMouseDownRight: boolean;
  isDraggingRight: boolean;
  isOverEvent: boolean;
  move: VolatileMapMoveInfo;
  moveObj: VolatileMapMoveObjInfo;
  rollObj: VolatileMapRollObjInfo;
  angle: VolatileMapAngleInfo;
};

type Dice = { [P in string]: string };
type DiceInfo = {
  type: string;
  label: string;
  pips: Dice[];
};
type VolatileDice = { [P in string]: DiceInfo[] };

type Volatile = {
  mouse: VolatileMouse;
  self: { webRtcPeer: any | null; webRtcPeerWait: any | null };
  param: {
    roomName: string | null;
    roomPassword: string | null;
    playerName: string | null;
    playerPassword: string | null;
    playerType: string | null;
    system: string | null;
  };
  room: {
    webRtcRoom: any;
    webRtcRoomWait: any;
    isExist: boolean;
    isJoined: boolean;
  };
  chat: VolatileChat;
  map: VolatileMap;
  deck: {
    viewMode: string;
    hoverIndex: number;
    hoverKey: string;
    command: string | null;
    isReverse: boolean;
  };
  dice: VolatileDice;
  volatileSaveData: {
    players: [];
  };
  mode: {
    isModal: boolean;
    isLoading: number;
    isWait: boolean;
  };
};

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
    file: actionFile,
    peer: actionPeer,
    operation: actionOperation,
    saveChat: saveChat
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
    async onMount({
      dispatch,
      state,
      rootState,
      rootGetters,
      commit
    }: {
      dispatch: Dispatch;
      state: Volatile;
      rootState: any;
      rootGetters: any;
      commit: Commit;
    }) {
      /* ----------------------------------------------------------------------
       * URLパラメータの処理
       */
      let roomName: string | null = getUrlParam("roomName");
      const roomPassword: string | null = getUrlParam("roomPassword");
      const playerName: string | null = getUrlParam("playerName");
      const playerPassword: string | null = getUrlParam("playerPassword");
      let playerType: string | null = getUrlParam("playerType");
      let system: string | null = getUrlParam("system");

      if (roomName && roomName.endsWith(rootGetters.entranceRoomName)) {
        alert(
          `「${rootGetters.entranceRoomName}」で終わる部屋名は使えません。`
        );
        roomName = null;
      }

      state.param.roomName = roomName;
      state.param.roomPassword = roomPassword;
      state.param.playerName = playerName;
      state.param.playerPassword = playerPassword;
      // 選択肢と一致していれば、権限をセットする
      if (
        rootGetters.roles.findIndex((role: any) => role.value === playerType) >=
        0
      ) {
        state.param.playerType = playerType;
      } else {
        playerType = null;
      }
      state.param.system = system;

      /* ------------------------------
       * URLを書き換える（リロードなし）
       */
      const paramList = [];
      if (state.param.roomName !== null)
        paramList.push(`roomName=${state.param.roomName}`);
      if (state.param.roomPassword !== null)
        paramList.push(`roomPassword=${state.param.roomPassword}`);
      if (state.param.system !== null)
        paramList.push(`system=${state.param.system}`);
      if (state.param.playerName !== null)
        paramList.push(`playerName=${state.param.playerName}`);
      if (state.param.playerPassword !== null)
        paramList.push(`playerPassword=${state.param.playerPassword}`);
      if (state.param.playerType !== null)
        paramList.push(`playerType=${state.param.playerType}`);
      const newUrl = `?${paramList.join("&")}`;
      window.history.replaceState("", "", newUrl);

      // state_settingの初期化
      commit("init_state_setting");

      dispatch("onTest").then();

      /* ----------------------------------------------------------------------
       * 初期表示画面の設定
       */
      setTimeout(() => {
        dispatch("windowOpen", "private.display.chatWindow").then();
        dispatch("windowOpen", "private.display.initiativeWindow").then();
        // dispatch("windowOpen", "private.display.resourceWindow");
        // dispatch("windowOpen", "private.display.chatPaletteWindow");
        // dispatch("windowOpen", "private.display.publicMemoWindow");
        // dispatch("windowOpen", "private.display.playerBoxWindow");
        dispatch("windowOpen", "private.display.welcomeWindow").then();
      }, 0);

      const loadYaml: Function = rootGetters.loadYaml;

      /* ----------------------------------------------------------------------
       * ダイスの設定
       */
      state.dice = (await loadYaml("/static/conf/dice.yaml")) as VolatileDice;

      /* ----------------------------------------------------------------------
       * カード情報の設定
       */
      const cardSetName = null;
      // const cardSetName = "花札";
      // const cardSetName = "トランプ"
      // const cardSetName = "タロット"

      const deckList: any[] = await loadYaml("/static/conf/deck.yaml");
      const cardSet: any = deckList.filter(
        (cs: any) => cs.name === cardSetName
      )[0];
      if (cardSet) {
        const basePath = cardSet.basePath || "";
        const storeDeck = rootState.public.deck;
        storeDeck.name = cardSet.name;
        storeDeck.back = basePath + cardSet.back;
        storeDeck.width = cardSet.width || 128;
        storeDeck.height = cardSet.height || 192;
        cardSet.source = cardSet.source || {};
        storeDeck.author = cardSet.source.author || "";
        storeDeck.title = cardSet.source.title || "";
        storeDeck.refs = cardSet.source.refs || [];
        storeDeck.cards.list = cardSet.cards.map((card: any, i: number) => ({
          key: `card-${i}`,
          front: { text: `` },
          back: { text: ``, img: basePath + card.file }
        }));
        storeDeck.cards.maxKey = cardSet.cards.length - 1;
      }

      /* ----------------------------------------------------------------------
       * BGMの設定
       */
      const bgmList: any[] = await loadYaml("/static/conf/bgm.yaml");
      bgmList.forEach((bgm: any, index: number) => (bgm.key = `bgm-${index}`));
      rootState.public.bgm.list = bgmList;
      rootState.public.bgm.maxKey = bgmList.length - 1;

      /* ----------------------------------------------------------------------
       * 画像の設定
       */
      const imageList: any[] = await loadYaml("/static/conf/image.yaml");
      imageList.forEach((image: any, index: number) => {
        image.key = `image-${index}`;
        image.name = image.data.replace(/.*\//, "");

        const imageArgList = getFileNameArgList(image.name);
        if (imageArgList.length) image.imageArgList = imageArgList;

        const regExp = new RegExp("[ 　]+", "g");
        const tagStrList = image.tag.split(regExp);
        tagStrList.forEach((tagStr: string) => {
          const imageTag = rootGetters.imageTagList.filter(
            (imageTag: any) => imageTag.name === tagStr
          )[0];
          if (!imageTag) {
            const nextNum = ++rootState.public.image.tags.maxKey;
            rootState.public.image.tags.list.push({
              key: `imgTag-${nextNum}`,
              name: image.tag
            });
          }
        });
      });
      rootState.public.image.list = imageList;
      rootState.public.image.maxKey = imageList.length - 1;

      /* ----------------------------------------------------------------------
       * チャットフォーマットの設定
       */
      const chatFormatList: any[] = await loadYaml(
        "/static/conf/chatFormat.yaml"
      );
      chatFormatList.forEach((chatFormat: any) => {
        rootState.setting.chatFormat.targetList.push({
          label: chatFormat.label,
          chatText: chatFormat.chatText
        });
      });

      /* ----------------------------------------------------------------------
       * 接続設定の設定
       */
      const setting: any = await loadYaml("/static/conf/connect.yaml");
      rootState.setting.connect.skywayKey = setting.skywayKey;
      rootState.setting.connect.type = setting.type;
      rootState.setting.connect.bcdiceServer = setting.bcdiceServer;

      /* ----------------------------------------------------------------------
       * ダイスシステムの検証
       */
      const systemList: DiceSystem[] = await dispatch(
        "getBcdiceSystemList"
      ).catch(() => {
        alert(
          `BCDice-apiサーバ\n${setting.bcdiceServer}\nの接続に失敗しました。`
        );
      });
      state.chat.diceSystemList = systemList;
      const index = systemList.findIndex(
        (systemObj: any) => systemObj.system === system
      );
      if (index === -1) system = "DiceBot";

      /* ----------------------------------------------------------------------
       * 初期入室の処理
       */
      if (roomName) {
        /* ------------------------------
         * 部屋存在チェック
         */
        dispatch("loading", true).then();

        const endLoading: Function = () => dispatch("loading", false);

        await dispatch("simpleJoinRoom", { roomName: roomName }).catch(
          () => endLoading
        );
        const isExist: boolean = await dispatch("checkRoomName", {
          roomName: roomName
        }).catch(() => endLoading);
        const baseArg: any = {
          roomName,
          roomPassword,
          playerName,
          playerPassword,
          playerType,
          fontColor: "#000000",
          system,
          isWait: false
        };
        // 「新しい部屋をつくる」画面で入力される項目が指定されていれば新規部屋作成を試みる
        if (
          !isExist &&
          roomPassword !== null &&
          playerName &&
          playerPassword !== null &&
          playerType !== null
        ) {
          baseArg.playerType = baseArg.playerType || "PL";
          await dispatch("doNewRoom", baseArg).catch(() => endLoading);
        }
        // 「この部屋に入る」画面で入力される項目が指定されていれば既存部屋への入室を試みる
        if (isExist && roomPassword !== null) {
          baseArg.useWindow = true;
          baseArg.useAlert = true;
          await dispatch("doJoinRoom", baseArg).catch(() => endLoading);
        }
        endLoading();
      }
    },

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
      if (!logOff) {
        window.console.log(`#empty ${property}:`);
      }
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
