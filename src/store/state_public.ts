// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'bcdice-js/lib/preload-dicebots'
import Vue from "vue";
import Vuex from "vuex";
// // @ts-ignore
// import imageList from "@/assets/conf/image.yaml";

Vue.use(Vuex);

/**
 * Store
 */
export default {
  // publicデータは、ルーム参加者に展開したりデータ保存に利用するデータ
  state: {
    /** 設定(public) */
    setting: {
      /** マス目を表示するか */
      gridLine: true,
      /** 座標を表示するか */
      gridId: true,
      /** 回転マーカーを表示するかどうか */
      pieceRotateMarker: true,
      /** マス目に合わせて動かすかどうか */
      isFitGrid: true
    },

    /** BGM */
    bgm: {
      list: [],
      maxKey: -1
    },

    /** 画像 */
    image: {
      /** 画像のタグ */
      tags: {
        list: [
          { key: "imgTag-0", name: "(全て)" },
          { key: "imgTag-1", name: "マップ" },
          { key: "imgTag-2", name: "キャラクター" },
          { key: "imgTag-3", name: "フロアタイル" },
          { key: "imgTag-4", name: "立ち絵" }
        ],
        maxKey: 4
      },

      /** 画像のプリセットデータ */
      list: [],
      maxKey: -1
    },

    /** デッキ */
    deck: {
      cards: {
        list: [],
        maxKey: -1
      },
      name: null,
      back: null,
      width: 0,
      height: 0,
      author: null,
      title: null,
      refs: []
    },

    /** マップ */
    map: {
      imageTag: "マップ",
      imageKey: "image-0",
      isReverse: false,
      margin: {
        gridSize: 5,
        gridColor: "#FFFFFF",
        maskColor: "#145014",
        maskAlpha: 0.1,
        isUseGridColor: true,
        isUseImage: false,
        borderWidth: 10
      },
      grid: { totalColumn: 20, totalRow: 15, size: 48, color: "#000000" },
      background: "#92A8B3",
      isEditing: null
    },

    /** 部屋情報 */
    room: { name: "", members: [], system: "DiceBot", password: "" },

    /** プレイヤー */
    player: { list: [] },

    /** マップマスク */
    mapMask: { list: [], maxKey: -1 },

    /** キャラクター */
    character: { list: [], maxKey: -1 },

    /** チット */
    chit: { list: [], maxKey: -1 },

    /** キャラクタープロパティ */
    initiative: {
      round: 0,
      roundPlayerKey: "",
      propertyList: [],
      rowStr: ""
    },

    /** カウンターリモコン */
    counterRemocon: {
      list: [
        {
          key: "counterRemocon-0",
          buttonName: "万能",
          target: "",
          counterName: "",
          modifyType: 2,
          modifyValue: "",
          message: "{0}の{1}を{2}した{4}",
          exampleText: "[選択キャラ]の[選択項目]を0した（[選択項目]：3->3）"
        }
      ],
      maxKey: 0
    },

    /** チャット */
    chat: {
      /** チャットのタブ */
      tab: {
        list: [{ key: "chatTab-0", name: "メイン" }],
        maxKey: 0
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
      inputting: {}
    },

    /** 共有メモ */
    publicMemo: {
      maxKey: 0,
      list: []
    }
  } /* end of state */,

  actions: {
    /**
     * プレイヤーを追加する
     * @param dispatch
     * @param commit
     * @param rootGetters
     * @param peerId
     * @param name
     * @param password
     * @param fontColor
     * @param type
     * @param isWait
     * @returns {*}
     */
    addPlayer: (
      {
        dispatch,
        commit,
        rootGetters
      }: { dispatch: Function; commit: Function; rootGetters: any },
      {
        peerId,
        name,
        password = "",
        type,
        fontColor,
        isWait
      }: {
        peerId: string;
        name: string;
        password: string;
        type: string;
        fontColor: string;
        isWait: boolean;
      }
    ): any => {
      const playerIndex: number = rootGetters.playerList.findIndex((p: any) => {
        return p.name === name;
      });
      const player =
        playerIndex > -1 ? rootGetters.playerList[playerIndex] : null;
      const playerKey: string = player ? player.key : `player-${name}`;

      const isSelf = rootGetters.peerId(isWait) === peerId;
      if (isSelf) {
        commit("updateActorKey", playerKey);
        commit("updatePlayerKey", playerKey);
      }

      rootGetters.members.push({
        peerId: peerId,
        playerKey: playerKey
      });

      if (!player) {
        // window.console.log(`Add player key:${playerKey} name:${name}`);
        rootGetters.playerList.push({
          key: playerKey,
          name: name,
          password: password,
          fontColor: fontColor,
          type: type,
          statusList: [
            {
              name: "◆",
              standImage: {
                ref: "",
                base: "",
                baseTag: "",
                autoResize: false,
                animationLength: 0,
                locate: 1,
                diffList: [],
                isSystemLock: true
              }
            }
          ]
        });
      } else {
        // privateデータの復元
        const privateData = player.private;
        if (privateData && isSelf) {
          const peerId = rootGetters.peerId(isWait);
          dispatch("setProperty", {
            property: "private",
            value: privateData,
            isNotice: false,
            logOff: true
          }).then(() => {
            commit("updatePeerId", { peerId: peerId, isWait: isWait });
          });
        }
      }
    },

    /**
     * ルームメンバを空にする
     * @param commit
     * @returns {*}
     */
    emptyMember: ({ commit }: { commit: Function }) => commit("emptyMember"),

    /**
     * 画像のタブの構成を変更する
     * @param commit
     * @param payload
     * @returns {*}
     */
    imageTagChange: ({ commit }: { commit: Function }, payload: any) =>
      commit("imageTagChange", payload),

    /**
     * NOTICE_INPUT
     * ルームメンバの入力中状態の通知
     * @param commit
     * @param state
     * @param key
     * @param target
     */
    noticeInput: (
      { commit, state }: { commit: Function; state: any },
      { key, target }: { key: string; target: any }
    ) => {
      window.console.log("【noticeInput】target:", target);
      // 即時入力カウントアップ
      commit("inputPeerId", { key: key, add: 1 });
      // 少し経ったらカウントダウン
      setTimeout(() => {
        commit("inputPeerId", { key: key, add: -1 });
      }, 400);
    }
  } /* end of actions */,

  mutations: {
    /**
     * ルームメンバを空にする
     * @param state
     * @returns { *[] }
     */
    emptyMember: (state: any) =>
      state.room.members.splice(0, state.room.members.length),

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
      if (!state.chat.inputting[key]) {
        this._vm.$set(state.chat.inputting, key, 0);
      }
      // 値の足し込み
      state.chat.inputting[key] += add;
    },

    /**
     * 画像のタブの構成を変更する
     * @param state
     * @param key
     * @param imageList
     */
    imageTagChange(
      state: any,
      { key, imageList }: { key: string; imageList: any[] }
    ) {
      const useTexts: any[] = [];
      /* eslint no-control-regex: 0 */
      const regExp = new RegExp("[　\t \r\n,]+", "g");
      // window.console.log(imageList)
      imageList.forEach((imageObj: any) => {
        Array.prototype.push.apply(
          useTexts,
          imageObj.currentTag.replace(regExp, ",").split(",")
        );
      });

      let addList = useTexts.concat(); // 配列をシャロ―コピー
      const deleteList = state.image.tags.list.filter((tag: any) => {
        // 「(全て)」は消させない
        if (tag.key === "imgTag-0") {
          return;
        }

        let findFlg = false;
        const filteredList = useTexts.filter(txt => txt === tag.name);
        if (filteredList.length > 0) {
          findFlg = true;
          addList = addList.filter(item => item !== filteredList[0]);
        }
        if (!findFlg) {
          state.image.list.forEach((imageObj: any) => {
            if (findFlg) return;
            const filteredList = imageObj.tag
              .split(",")
              .filter((imgTag: any) => imgTag === tag.name);
            if (filteredList.length > 0) {
              findFlg = true;
            }
          });
        }
        return !findFlg;
      });
      // 削除リストに基づいてタグを消していく
      deleteList.forEach((delTagObj: any) =>
        state.image.tags.list.splice(
          state.image.tags.list.indexOf(delTagObj),
          1
        )
      );
      // 追加リストに基づいてタグを追加していく
      let maxKey = state.image.tags.maxKey;
      addList.forEach(add => {
        // 欠番を埋める方式は不採用
        state.image.tags.list.push({
          name: add,
          key: `imgTag-${++maxKey}`
        });
      });
      state.image.tags.maxKey = maxKey;
      // セレクトボックスに表示される項目は、入力された内容の末尾の指定を使う
      const imageObj = imageList.filter(imageObj => imageObj.key === key)[0];
      const tagTexts = imageObj.currentTag.replace(regExp, ",").split(",");
      imageObj.selectTag = tagTexts[tagTexts.length - 1];
      // リアクティブ発火
      imageList.splice(imageList.indexOf(imageObj), 1, imageObj);
    }
  } /* end of mutations */,

  getters: {
    /**
     * すべての障害物を取得
     * @param state
     */
    getAllObstacle: (state: any) => {
      // TODO obstacle属性の作成
      return state.character.list
        .filter((o: any) => o.place === "field")
        .concat(state.chit.list.filter((o: any) => o.place === "field"))
        .concat(state.mapMask.list.filter((o: any) => o.place === "field"));
    },

    /**
     * グリッドに合わせるかどうか
     * @param state
     * @returns { boolean }
     */
    isFitGrid: (state: any) => state.setting.isFitGrid,

    /**
     * 現在の背景画像
     * @param state
     * @returns {*}
     */
    getBackgroundImage: (state: any) => {
      const imageObj = state.image.list.filter(
        (image: any) => image.key === state.map.imageKey
      )[0];
      return imageObj ? imageObj.data : null;
    },

    getPeerActors: (
      state: any,
      getters: any,
      rootState: any,
      rootGetters: any
    ) => {
      const player = getters.playerList.filter(
        (p: any) => p.key === rootGetters.playerKey
      )[0];
      if (player) {
        return [
          player,
          ...state.character.list.filter(
            (character: any) => character.owner === player.key
          )
        ];
      } else {
        return [{ name: "名無し", type: "PL" }, ...state.character.list];
      }
    },

    getObj: (state: any) => (key: string): any => {
      if (!key) return null;
      const kind = key.split("-")[0];
      const filterFunc: Function = (obj: any) => obj.key === key;
      if (kind === "groupTargetTab") {
        // グループチャットタブ
        return state.chat.groupTargetTab.list.filter(filterFunc)[0];
      } else {
        // その他
        return state[kind].list.filter(filterFunc)[0];
      }
    },

    delObj: (state: any) => (key: string): void => {
      if (!key) return;
      const kind = key.split("-")[0];
      let list: any[] = [];
      const findIndexFunc: Function = () =>
        list.findIndex(obj => obj.key === key);
      if (kind === "groupTargetTab") {
        // グループチャットタブ
        list = state.chat.groupTargetTab.list;
      } else {
        // その他
        list = state[kind].list;
      }
      const index = findIndexFunc(list);
      if (index > -1) {
        list.splice(index, 1);
      }
    },

    getViewName: (state: any, getters: any) => (key: string): string => {
      const obj = getters.getObj(key);
      if (!obj) return "名無し(PL)";
      const kind = obj.key.split("-")[0];
      if (kind === "player") {
        // プレイヤー
        const type = obj.type;
        return `${obj.name}(${type})`;
      } else {
        return obj.name;
      }
    },
    chatLogs: (state: any): any[] => state.chat.logs,
    playerList: (state: any): any[] => state.player.list,
    inputting: (state: any): any => state.chat.inputting,
    marginGridColor: (state: any): string => state.map.margin.gridColor,
    marginMaskColor: (state: any): string => state.map.margin.maskColor,
    marginMaskAlpha: (state: any): number => state.map.margin.maskAlpha,
    isUseGridColor: (state: any): boolean => state.map.margin.isUseGridColor,
    isUseImage: (state: any): boolean => state.map.margin.isUseImage,
    columns: (state: any): number => state.map.grid.totalColumn,
    rows: (state: any): number => state.map.grid.totalRow,
    gridSize: (state: any): number => state.map.grid.size,
    borderWidth: (state: any): number => state.map.margin.borderWidth,
    marginGridSize: (state: any): number => state.map.margin.gridSize,
    roomName: (state: any): string => state.room.name,
    roomPassword: (state: any): string => state.room.password,
    members: (state: any): any[] => state.room.members,
    deck: (state: any): any => state.deck,
    deckCardList: (state: any): any[] => state.deck.cards.list,
    getMapObjectList: (state: any) => ({
      kind,
      place = "",
      playerKey = ""
    }: {
      kind: string;
      place: string;
      playerKey: string;
    }): any[] => {
      const list: any[] = state[kind].list;
      if (!place && !playerKey) {
        return list;
      } else {
        return list.filter((target: any) => {
          if (playerKey && target.owner !== playerKey) return false;
          return !(place && target.place !== place);
        });
      }
    },
    getMembers: (state: any, getters: any) => (playerKey: string): any[] => {
      const player = getters.getObj(playerKey);
      if (!player) return [];
      return getters.members.filter(
        (member: any) => member.playerKey === player.key
      );
    },
    getPlayer: (state: any, getters: any) => (peerId: string): any => {
      const member = getters.members.filter(
        (member: any) => member.peerId === peerId
      )[0];
      if (!member) return null;
      return getters.getObj(member.playerKey);
    },
    inviteUrl: (state: any, getters: any): string => {
      const baseUrl = location.href.replace(/\?.+$/, "");
      const params: string[] = [];
      params.push(`roomName=${getters.roomName}`);
      params.push(`roomPassword=${getters.roomPassword}`);
      params.push(`system=${getters.roomSystem}`);
      return `${baseUrl}?${params.join("&")}`;
    },
    isMapEditing: (state: any): boolean => state.map.isEditing,
    groupTargetTab: (state: any): any => state.chat.groupTargetTab,
    isDrawGridLine: (state: any): boolean => state.setting.gridLine,
    isDrawGridId: (state: any): boolean => state.setting.gridId,
    gridColor: (state: any): string => state.map.grid.color,
    isReverse: (state: any): boolean => state.map.isReverse,
    canvasSize(state: any, getter: any) {
      return {
        w: getter.columns * getter.gridSize,
        h: getter.rows * getter.gridSize
      };
    },
    getChatColor: (state: any, getter: any) => (actorKey: string) => {
      const actor = getter.getPeerActors.filter(
        (actor: any) => actor.key === actorKey
      )[0];
      let color = "black";
      if (actor) {
        if (actor.key.split("-")[0] === "character") {
          if (actor.fontColorType === 0) {
            // プレイヤーと同じ色を使う
            color = getter.getPeerActors[0].color;
          } else {
            color = actor.fontColor;
          }
        } else {
          color = actor.fontColor;
        }
      }
      return color;
    },
    getOwnerKey: (state: any, getter: any) => (actorKey: string) => {
      let ownerKey: string | undefined = undefined;

      if (actorKey) {
        const kind = actorKey.split("-")[0];
        if (kind === "player") {
          ownerKey = actorKey;
        } else if (kind === "character") {
          ownerKey = getter.getObj(actorKey).owner;
        } else {
          ownerKey = undefined;
        }
      }
      return ownerKey;
    },
    bgmList: (state: any) => state.bgm.list,
    imageTagList: (state: any) => state.image.tags.list,
    imageList: (state: any) => state.image.list,
    backgroundColor: (state: any) => state.map.background,
    round: (state: any) => state.initiative.round,
    roundPlayerKey: (state: any) => state.initiative.roundPlayerKey,
    propertyList: (state: any) => state.initiative.propertyList,
    publicCounterRemocon: (state: any) => state.counterRemocon,
    publicCounterRemoconList: (state: any) => state.counterRemocon.list,
    roomSystem: (state: any) => state.room.system,
    publicMemo: (state: any) => state.publicMemo
  } /* end of getters */
};
