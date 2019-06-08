// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import "bcdice-js/lib/preload-dicebots"
import Vue from "vue";
import Vuex from "vuex";
import statePrivate from "./state_private.ts";
import statePublic from "./state_public.ts";
import stateSetting from "./state_setting";
import actionFile from "./action_file";
import actionPeer from "./action_peer.ts";
import actionOperation from "./action_operation.ts";
import { getFileNameArgList, getUrlParam } from "../components/common/Utility";
import CreateNewRoom from "@/components/welcome/login/CreateNewRoom.vue";
import yaml from "js-yaml";
import moment from "moment";
const CryptoJS = require("crypto-js");
// const moment = require("moment");

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
    operation: actionOperation
  },
  state: {
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
      activeChatTab: "chatTab-0",
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
      rollObj: {
        isRolling: false,
        propName: "",
        key: 0
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

    operationQueue: [],

    volatileSaveData: {
      players: []
    },

    mode: {
      isModal: true,
      isLoading: 0,
      isWait: false
    }
  },
  actions: {
    /**
     * =================================================================================================================
     * 起動時の最初の処理
     * @param dispatch
     * @param state
     * @param rootState
     * @param rootGetters
     */
    onMount({ dispatch, state, rootState, rootGetters }) {
      /* ----------------------------------------------------------------------
       * URLパラメータの処理
       */
      let roomName = getUrlParam("roomName");
      const roomPassword = getUrlParam("roomPassword");
      const playerName = getUrlParam("playerName");
      const playerPassword = getUrlParam("playerPassword");
      let playerType = getUrlParam("playerType");
      let system = getUrlParam("system");

      if (!!roomName && roomName.endsWith(CreateNewRoom.ENTRANCE_ROOM_NAME)) {
        alert(
          `「${CreateNewRoom.ENTRANCE_ROOM_NAME}」で終わる部屋名は使えません。`
        );
        roomName = null;
        /* ------------------------------
         * URLを書き換える（リロードなし）
         */
        const paramList = [];
        if (roomPassword !== null)
          paramList.push(`roomPassword=${roomPassword}`);
        if (system !== null) paramList.push(`system=${system}`);
        if (playerName !== null) paramList.push(`playerName=${playerName}`);
        if (playerPassword !== null)
          paramList.push(`playerPassword=${playerPassword}`);
        if (playerType !== null) paramList.push(`playerType=${playerType}`);
        const newUrl = `?${paramList.join("&")}`;
        window.history.replaceState("", "", newUrl);
      }

      state.param.roomName = roomName;
      state.param.roomPassword = roomPassword;
      state.param.playerName = playerName;
      state.param.playerPassword = playerPassword;
      // 選択肢と一致していれば、権限をセットする
      if (rootGetters.roles.findIndex(role => role.value === playerType) >= 0) {
        state.param.playerType = playerType;
      } else {
        playerType = null;
      }
      state.param.system = system;

      /* ----------------------------------------------------------------------
       * 初期表示画面の設定
       */
      setTimeout(() => {
        dispatch("windowOpen", "private.display.chatWindow");
        dispatch("windowOpen", "private.display.initiativeWindow");
        // dispatch("windowOpen", "private.display.resourceWindow");
        // dispatch("windowOpen", "private.display.chatPaletteWindow");
        // dispatch("windowOpen", "private.display.publicMemoWindow");
        // dispatch("windowOpen", "private.display.playerBoxWindow");
        dispatch("windowOpen", "private.display.welcomeWindow");
      }, 0);

      /* ----------------------------------------------------------------------
       * チャットタブの設定
       */
      // dispatch("changeChatTab", { tabsText: "雑談" });

      /* ----------------------------------------------------------------------
       * ダイスの設定
       */
      rootGetters.loadYaml("/static/conf/dice.yaml").then(dice => {
        state.dice = dice;
      });

      /* ----------------------------------------------------------------------
       * カード情報の設定
       */
      const cardSetName = null;
      // const cardSetName = "花札";
      // const cardSetName = "トランプ"
      // const cardSetName = "タロット"

      rootGetters.loadYaml("/static/conf/deck.yaml").then(deckList => {
        const cardSet = deckList.filter(cs => cs.name === cardSetName)[0];

        if (!cardSet) return;
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
        storeDeck.cards.list = cardSet.cards.map((card, i) => ({
          key: `card-${i}`,
          front: { text: `` },
          back: { text: ``, img: basePath + card.file }
        }));
        storeDeck.cards.maxKey = cardSet.cards.length - 1;
      });

      /* ----------------------------------------------------------------------
       * BGMの設定
       */
      rootGetters.loadYaml("/static/conf/bgm.yaml").then(bgmList => {
        bgmList.forEach((bgm, index) => (bgm.key = `bgm-${index}`));
        rootState.public.bgm.list = bgmList;
        rootState.public.bgm.maxKey = bgmList.length - 1;
      });

      /* ----------------------------------------------------------------------
       * 画像の設定
       */
      rootGetters.loadYaml("/static/conf/image.yaml").then(imageList => {
        imageList.forEach((image, index) => {
          image.key = `image-${index}`;
          image.name = image.data.replace(/.*\//, "");

          const imageArgList = getFileNameArgList(image.name);
          if (imageArgList.length) image.imageArgList = imageArgList;

          const regExp = new RegExp("[ 　]+", "g");
          const tagStrList = image.tag.split(regExp);
          tagStrList.forEach(tagStr => {
            const imageTag = rootGetters.imageTagList.filter(
              imageTag => imageTag.name === tagStr
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
      });

      /* ----------------------------------------------------------------------
       * 接続設定の設定
       */
      rootGetters.loadYaml("/static/conf/connect.yaml").then(setting => {
        rootState.setting.connect.skywayKey = setting.skywayKey;
        rootState.setting.connect.type = setting.type;
        rootState.setting.connect.bcdiceServer = setting.bcdiceServer;

        /* ----------------------------------------------------------------------
         * ダイスシステムの検証
         */
        dispatch("getBcdiceSystemList")
          .then(systemList => {
            state.chat.diceSystemList = systemList;
            const index = systemList.findIndex(
              systemObj => systemObj.system === system
            );
            if (index === -1) system = "DiceBot";
          })
          .catch(() => {
            alert(
              `BCDice-apiサーバ\n${
                setting.bcdiceServer
              }\nの接続に失敗しました。`
            );
          });

        /* ----------------------------------------------------------------------
         * 初期入室の処理
         */
        if (roomName) {
          /* ------------------------------
           * 部屋存在チェック
           */
          dispatch("loading", true);
          Promise.resolve()
            .then(() => dispatch("simpleJoinRoom", { roomName: roomName }))
            .then(peerId => {
              // const logTexts = [];
              // logTexts.push(`create room by peer:"${peerId}"`);
              // logTexts.push(`本番: ${rootGetters.peerId(false)}`);
              // logTexts.push(`待ち: ${rootGetters.peerId(true)}`);
              // window.console.log(logTexts.join(", "));
              return dispatch("checkRoomName", { roomName: roomName });
            })
            .then(isExist => {
              const baseArg = {
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
                return dispatch("doNewRoom", baseArg);
              }
              // 「この部屋に入る」画面で入力される項目が指定されていれば既存部屋への入室を試みる
              if (isExist && roomPassword !== null) {
                baseArg.useWindow = true;
                baseArg.useAlert = true;
                return dispatch("doJoinRoom", baseArg);
              }
            })
            .then(() => dispatch("loading", false))
            .catch(() => dispatch("loading", false));
        }
      });
    },

    /**
     * =================================================================================================================
     * ルームメンバがいる場合は部屋主に対して処理の通知を出し、そうでない場合はこの場で処理を実行する
     * @param state
     * @param isStart
     */
    loading({ state }, isStart) {
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
    sendNoticeOperation({ dispatch, rootGetters }, { method, value }) {
      const isWait = rootGetters.isWait;
      if (rootGetters.members[0]) {
        value.ownerPeerId = rootGetters.peerId(isWait);
        const isMaster =
          rootGetters.members[0].peerId === rootGetters.peerId(isWait);
        if (isMaster) {
          value.processTime = moment().format("YYYYMMDD hh:mm:ss");
        }
        dispatch("sendRoomData", {
          type: isMaster ? "DO_METHOD" : "NOTICE_OPERATION",
          value: value,
          method: method,
          isWait: isWait
        });
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
    reverseProperty: ({ dispatch, getters }, payload) => {
      const target = getters.getStateValue(payload.property);
      if (typeof target === "boolean") {
        dispatch("sendNoticeOperation", {
          value: payload,
          method: "doReverseProperty"
        });
      } else {
        // payload.property = `${payload.property}.isDisplay`;
        payload.value = !target.isDisplay;
        if (!target.isDisplay) {
          dispatch("windowOpen", payload.property);
        } else {
          dispatch("windowClose", payload.property);
        }
      }
    },
    /**
     * 指定されたプロパティパスの値を反転させる
     * @param getters
     * @param commit
     * @param property
     */
    doReverseProperty: ({ getters, commit }, { property }) => {
      const target = getters.getStateValue(property);
      const payload = { property, value: !target };
      commit("doSetProperty", payload);
    },

    /**
     * =================================================================================================================
     * stateに対するあらゆるデータ格納を代理する関数
     * @param dispatch
     * @param payload
     */
    setProperty: ({ dispatch }, payload) => {
      if (payload.isNotice) {
        dispatch("sendNoticeOperation", {
          value: payload,
          method: "doSetProperty"
        });
      } else {
        dispatch("doSetProperty", payload);
      }
    },
    /**
     * stateに対するあらゆるデータ格納を代理する関数
     * @param commit
     * @param payload
     * @returns {*}
     */
    doSetProperty: ({ commit }, payload) => {
      delete payload.ownerPeerId;
      return commit("doSetProperty", payload);
    },

    /**
     * =================================================================================================================
     * 指定されたプロパティパスにある配列を空にする
     * @param dispatch
     * @param payload
     */
    emptyProperty: ({ dispatch }, payload) => {
      if (payload.isNotice) {
        dispatch("sendNoticeOperation", {
          value: payload,
          method: "doEmptyProperty"
        });
      } else {
        dispatch("doEmptyProperty", payload);
      }
    },
    /**
     * 指定されたプロパティパスにある配列を空にする
     * @param getters
     * @param property
     * @param logOff
     */
    doEmptyProperty: ({ getters }, { property, logOff }) => {
      if (!logOff) {
        window.console.log(`#empty ${property}:`);
      }
      const target = getters.getStateValue(property);
      target.splice(0, target.length);
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
    doSetProperty: (state, { property, value, logOff = false }) => {
      if (!logOff) {
        window.console.log(`doSetProperty => ${property}:`, value);
      }

      const propProc = (target, props, value) => {
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
            const propProc2 = (target, props) => {
              for (const prop in props) {
                if (!props.hasOwnProperty(prop)) continue;
                const val = props[prop];
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
    updateWebRtcPeer: (state, { peer, isWait }) => {
      if (!isWait) state.self.webRtcPeer = peer;
      else state.self.webRtcPeerWait = peer;
    },
    updateWebRtcRoom: (state, { room, isWait }) => {
      if (!isWait) state.room.webRtcRoom = room;
      else state.room.webRtcRoomWait = room;
    },
    updateIsWait: (state, isWait) => {
      state.mode.isWait = isWait;
    },
    updateIsModal: (state, isModal) => {
      state.mode.isModal = isModal;
    },
    updateIsJoined: (state, isJoined) => {
      state.room.isJoined = isJoined;
    },
    updateActorKey: (state, actorKey) => {
      state.chat.actorKey = actorKey;
    }
  },
  getters: {
    loadYaml: state =>
      /**
       * 指定されたURLのyamlを読み込み、オブジェクトを返却する
       * @param confFilePath yamlファイルのURL
       * @returns {*}
       */
      yamlPath => {
        return window
          .fetch(process.env.BASE_URL + yamlPath)
          .then(responce => responce.text())
          .then(text => yaml.safeLoad(text))
          .catch(err => {
            window.console.log(
              "yamlファイルの読み込みに失敗しました",
              yamlPath
            );
            throw err;
          });
      },

    getStateValue: state =>
      /**
       * stateから指定されたプロパティパスの値を取得する
       * @param property
       * @returns {*}
       */
      property => {
        let target = state;
        property.split(".").forEach(prop => {
          target = target[prop];
        });
        return target;
      },

    isWindowOpen: (state, getters) =>
      /**
       * isDisplayに相当するプロパティ値を取得する
       * @param displayProperty
       * @returns {*}
       */
      displayProperty => {
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
      (list, key) => {
        const filteredList = list.filter(obj => obj.key === key);
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
      colorText => {
        let _c = null;
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
      obj => {
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

    paramRoomName: state => state.param.roomName,
    paramRoomPassword: state => state.param.roomPassword,
    paramPlayerName: state => state.param.playerName,
    paramPlayerPassword: state => state.param.playerPassword,
    paramPlayerType: state => state.param.playerType,
    isRoomExist: state => state.room.isExist,
    isRoomJoined: state => state.room.isJoined,
    isModal: state => state.mode.isModal,
    isLoading: state => state.mode.isLoading,
    isWait: state => state.mode.isWait,
    activeChatTab: state => state.chat.activeChatTab,
    hoverChatTab: state => state.chat.hoverChatTab,
    hoverTab: state => state.chat.hoverTab,
    rollObj: state => state.map.rollObj,
    isDraggingLeft: state => state.map.isDraggingLeft,
    isMouseDownRight: state => state.map.isMouseDownRight,
    isOverEvent: state => state.map.isOverEvent,
    isDraggingRight: state => state.map.isDraggingRight,
    move: state => state.map.move,
    angleVolatile: state => state.map.angle,
    mouseOnScreen: state => state.map.mouse.onScreen,
    mouseOnTable: state => state.map.mouse.onTable,
    mouseOnCanvas: state => state.map.mouse.onCanvas,
    mouseLocate: state => state.mouse,
    deckCommand: state => state.deck.command,
    deckHoverIndex: state => state.deck.hoverIndex,
    deckHoverKey: state => state.deck.hoverKey,
    webRtcPeer: state => isWait =>
      !isWait ? state.self.webRtcPeer : state.self.webRtcPeerWait,
    webRtcRoom: state => isWait =>
      !isWait ? state.room.webRtcRoom : state.room.webRtcRoomWait,
    chatActorKey: state => state.chat.actorKey,
    volatilePrivateData: state => state.volatileSaveData.players,
    chatTabs: (state, getters, rootState, rootGetters) => {
      return rootGetters.chatTabsOption.map(privateTab => {
        const publicTab = rootState.public.chat.tab.list.filter(
          publicTab => publicTab.key === privateTab.key
        )[0];
        return {
          key: publicTab.key,
          name: publicTab.name,
          isActive: privateTab.isActive,
          isHover: privateTab.isHover,
          unRead: privateTab.unRead,
          order: privateTab.order
        };
      });
    },
    grid: state => ({
      c: state.map.grid.c,
      r: state.map.grid.r
    }),
    isRolling: state => state.map.rollObj.isRolling,
    diceSystemList: state => state.chat.diceSystemList,
    dice: state => state.dice,
    dicePipsImage: state => (faceNum, type, pips) => {
      const diceSetList = state.dice[faceNum];
      if (!diceSetList) return null;
      const diceObj = diceSetList.filter(diceSet => diceSet.type === type)[0];
      if (!diceObj) return null;
      return diceObj.pips[pips];
    },
    hash: state => (planeText, key) => CryptoJS.HmacSHA1(planeText, key),
    isSameHash: state => (hash, planeText, key) =>
      hash === CryptoJS.HmacSHA1(planeText, key),
    encrypt: state => (planeText, password) =>
      CryptoJS.AES.encrypt(planeText, password),
    decrypt: state => (ciphertext, password) =>
      CryptoJS.AES.decrypt(ciphertext.toString(), password).toString(
        CryptoJS.enc.Utf8
      )
  }
});
