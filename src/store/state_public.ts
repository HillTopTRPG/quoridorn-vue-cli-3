// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'bcdice-js/lib/preload-dicebots'
import Vue from "vue";
import Vuex from "vuex";
// import { quoridornLog } from "@/components/common/Utility";

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
      list: [
        {
          key: "image-0",
          tag: "マップ",
          data: require("../assets/background-default.jpg"),
          password: ""
        },
        {
          key: "image-1",
          tag: "キャラクター",
          data: require("../assets/charactor/pawnBlack.png"),
          password: ""
        },
        {
          key: "image-2",
          tag: "キャラクター",
          data: require("../assets/charactor/pawnBlue.png"),
          password: ""
        },
        {
          key: "image-3",
          tag: "キャラクター",
          data: require("../assets/charactor/pawnGreen.png"),
          password: ""
        },
        {
          key: "image-4",
          tag: "キャラクター",
          data: require("../assets/charactor/pawnLightBlue.png"),
          password: ""
        },
        {
          key: "image-5",
          tag: "キャラクター",
          data: require("../assets/charactor/pawnOrange.png"),
          password: ""
        },
        {
          key: "image-6",
          tag: "キャラクター",
          data: require("../assets/charactor/pawnPink.png"),
          password: ""
        },
        {
          key: "image-7",
          tag: "キャラクター",
          data: require("../assets/charactor/pawnPurple.png"),
          password: ""
        },
        {
          key: "image-8",
          tag: "キャラクター",
          data: require("../assets/charactor/pawnRed.png"),
          password: ""
        },
        {
          key: "image-9",
          tag: "キャラクター",
          data: require("../assets/charactor/pawnWhite.png"),
          password: ""
        },
        {
          key: "image-10",
          tag: "キャラクター",
          data: require("../assets/charactor/pawnYellow.png"),
          password: ""
        },
        {
          key: "image-11",
          tag: "フロアタイル",
          data: require("../assets/floorTiles/floorTile_001.jpg"),
          password: ""
        },
        {
          key: "image-12",
          tag: "フロアタイル",
          data: require("../assets/floorTiles/floorTile_008.jpg"),
          password: ""
        },
        {
          key: "image-13",
          tag: "フロアタイル",
          data: require("../assets/floorTiles/floorTile_011.jpg"),
          password: ""
        },
        {
          key: "image-14",
          tag: "フロアタイル",
          data: require("../assets/floorTiles/floorTile_012.jpg"),
          password: ""
        },
        {
          key: "image-15",
          tag: "フロアタイル",
          data: require("../assets/floorTiles/floorTile_027.jpg"),
          password: ""
        },
        {
          key: "image-16",
          tag: "フロアタイル",
          data: require("../assets/floorTiles/floorTile_038.jpg"),
          password: ""
        },
        {
          key: "image-17",
          tag: "フロアタイル",
          data: require("../assets/floorTiles/floorTile_047.jpg"),
          password: ""
        },
        {
          key: "image-18",
          tag: "フロアタイル",
          data: require("../assets/floorTiles/floorTile_059.jpg"),
          password: ""
        },
        {
          key: "image-19",
          tag: "立ち絵",
          data: require("../assets/stand/glass_angry.png"),
          password: ""
        },
        {
          key: "image-20",
          tag: "立ち絵",
          data: require("../assets/stand/glass_normal.png"),
          password: ""
        },
        {
          key: "image-21",
          tag: "立ち絵",
          data: require("../assets/stand/glass_smile.png"),
          password: ""
        },
        {
          key: "image-22",
          tag: "立ち絵",
          data: require("../assets/stand/sports_angry.png"),
          password: ""
        },
        {
          key: "image-23",
          tag: "立ち絵",
          data: require("../assets/stand/sports_normal.png"),
          password: ""
        },
        {
          key: "image-24",
          tag: "立ち絵",
          data: require("../assets/stand/sports_smile.png"),
          password: ""
        }
      ],
      maxKey: 24
    },

    /** BGM */
    bgm: {
      /** 再生リスト */
      playList: {
        list: [],
        maxKey: -1
      }
    },

    /** デッキ */
    deck: {
      cards: {
        list: [],
        maxKey: -1
      },
      back: null,
      width: 0,
      height: 0
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
      isEditting: null
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

    /** チャット */
    chat: {
      /** チャットのタブ */
      tabs: [{ name: "メイン", isHover: false, unRead: 0, secretInfo: null }],
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
        メイン: [
          { owner: "SYSTEM", viewHtml: "<b>HillTop</b>：Hello World!!" },
          {
            owner: "SYSTEM",
            viewHtml:
              '<span style="color: red;"><b>SYSTEM</b>：こちらデモ版です。</span>'
          },
          {
            owner: "SYSTEM",
            viewHtml:
              '<span style="color: black;"><b>HillTop</b>：どどんとふの仕様にできるだけ近づけるように努力しています。</span>'
          },
          {
            owner: "SYSTEM",
            viewHtml:
              '<span style="color: black;"><b>HillTop</b>：Twitterで私が困ってたらいろいろ教えていただけると嬉しいです。</span>'
          },
          {
            owner: "SYSTEM",
            viewHtml:
              '<span style="color: black;"><b>HillTop</b>：9月末までは休みを利用して開発できますが、10月からは新しい仕事が始まるので、開発スピードが落ちます。</span>'
          }
        ]
      },

      /** 入力中のルームメイトのpeerId一覧 */
      inputting: {}
    },

    /** 共有メモ */
    publicMemo: {
      /** TODO 内容は未実装につき未定 */
      editTab: "",
      contents: [
        {
          key: 0,
          texts: [{ tab: "メイン", text: "これは共有メモでーす！" }]
        }
      ]
    }
  } /* end of state */,

  actions: {
    /**
     * プレイヤーを追加する
     * @param commit
     * @param peerId
     * @param name
     * @param password
     * @param color
     * @param type
     * @returns {*}
     */
    addPlayer: (
      { commit }: { commit: Function },
      {
        peerId,
        name,
        password,
        type,
        color
      }: {
        peerId: string;
        name: string;
        password: string;
        type: string;
        color: string;
      }
    ) => {
      commit("addPlayer", { peerId, name, password, type, color });
      // commit('addPlayerWidth')
    },

    /**
     * ルームメンバを空にする
     * @param commit
     * @returns {*}
     */
    emptyMember: ({ commit }: { commit: Function }) => commit("emptyMember"),

    /**
     * チャットのタブを選択したことをデータに反映する
     * @param commit
     * @param tab
     * @returns {*}
     */
    chatTabSelect: ({ commit }: { commit: Function }, tab: string) =>
      commit("chatTabSelect", tab),

    /**
     * チャット対象のタブを選択したことをデータに反映する
     * @param commit
     * @param tab
     * @returns {*}
     */
    groupTargetTabSelect: ({ commit }: { commit: Function }, tab: string) =>
      commit("groupTargetTabSelect", tab),

    /**
     * 画像のタブの構成を変更する
     * @param commit
     * @param payload
     * @returns {*}
     */
    imageTagChange: ({ commit }: { commit: Function }, payload: any) =>
      commit("imageTagChange", payload),

    /**
     * チャットのタブの構成を変更する
     * @param getters
     * @param commit
     * @param tabsText
     * @returns {*}
     */
    changeChatTab: (
      { getters, commit }: { getters: any; commit: Function },
      tabsText: string
    ) =>
      commit("changeChatTab", {
        tabsText: tabsText,
        lastActiveTab: getters.activeChatTab
      }),

    /**
     * ルームメンバの入力中状態の通知
     * @param commit
     * @param state
     * @param name
     */
    noticeInput: (
      { commit, state }: { commit: Function; state: any },
      { name }: { name: string; }
    ) => {
      // 即時入力カウントアップ
      commit("inputPeerId", { name: name, add: 1 });
      // 少し経ったらカウントダウン
      setTimeout(() => {
        commit("inputPeerId", { name: name, add: -1 });
      }, 400);
    }
  } /* end of actions */,

  mutations: {
    /**
     * プレイヤーを追加する
     * @param state
     * @param peerId
     * @param name
     * @param password
     * @param color
     * @param type
     * @returns { *[] }
     */
    addPlayer: (
      state: any,
      {
        peerId,
        name,
        type,
        password,
        color
      }: {
        peerId: string;
        name: string;
        password: string;
        color: string;
        type: string
      }
    ) => {
      const player: any = state.player.list.filter((p: any) => {
          return p.name === name;
      })[0];
      const playerKey: string = player ? player.key : `player-${name}`;
      state.room.members.push({
        peerId: peerId,
        playerKey: playerKey
      });
      if (!player) {
        state.player.list.push({
          key: playerKey,
          name: name,
          password: password,
          fontColor: color,
          type: type
        });
      }
    },

    /**
     * ルームメンバを空にする
     * @param state
     * @returns { *[] }
     */
    emptyMember: (state: any) =>
      state.room.members.splice(0, state.room.members.length),

    /**
     * チャットのタブを選択したことをデータに反映する
     * @param state
     * @param tab
     */
    chatTabSelect(state: any, tab: string) {
      for (let tabObj of state.chat.tabs) {
        tabObj.isActive = tab === tabObj.name;
        // 未読数をリセット
        if (tabObj.isActive) tabObj.unRead = 0;
      }
    },

    /**
     * チャット対象のタブを選択したことをデータに反映する
     * @param state
     * @param tab
     */
    groupTargetTabSelect(state: any, tab: string) {
      for (let tabObj of state.chat.tabs) {
        tabObj.isActive = tab === tabObj.name;
        // 未読数をリセット
        if (tabObj.isActive) tabObj.unRead = 0;
      }
    },

    /**
     * ルームメンバの入力中状態の変化
     * @param state
     * @param payload
     */
    inputPeerId(
      this: any,
      state: any,
      { name, add }: { name: string; add: number }
    ) {
      // プロパティが無ければ、リアクティブになる形式で登録をする
      if (!state.chat.inputting[name]) {
        this._vm.$set(state.chat.inputting, name, 0);
      }
      // 値の足し込み
      state.chat.inputting[name] += add;
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
      // quoridornLog(imageList)
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
    },

    /**
     * チャットのタブの構成を変更する
     * @param state
     * @param tabsText
     * @param lastActiveTab
     */
    changeChatTab(
      state: any,
      { tabsText, lastActiveTab }: { tabsText: string; lastActiveTab: any }
    ) {
      // 秘匿チャット以外を削除
      state.chat.tabs
        .map((tab: any, index: number) => {
          if (!tab.secretInfo) return;
          return index;
        })
        .reverse()
        .forEach((index: number) => state.chat.tabs.splice(index, 1));

      tabsText = "メイン " + tabsText;
      const regExp = new RegExp("[ 　]+", "g");
      let tabs = tabsText.replace(regExp, " ").split(" ");
      for (let tab of tabs) {
        let isActive = false;
        if (lastActiveTab && lastActiveTab.name === tab) {
          isActive = true;
        }
        let tabObj = {
          name: tab,
          isActive: isActive,
          isHover: false,
          unRead: 0,
          secretInfo: null
        };
        state.chat.tabs.push(tabObj);
      }
      if (!lastActiveTab) {
        state.chat.tabs[0].isActive = true;
      }

      // 削除されたタブの検知
      let deleteLogTabList = [];
      for (let tab in state.chat.logs) {
        if (!state.chat.logs.hasOwnProperty(tab)) continue;
        let findFlg = false;
        for (const tabsTab of state.chat.tabs) {
          if (tabsTab.name === tab) {
            findFlg = true;
            break;
          }
        }
        if (!findFlg) {
          deleteLogTabList.push(tab);
        }
      }
      deleteLogTabList.forEach(
        delTabName => delete state.chat.logs[delTabName]
      );

      // 追加されたタブの検知
      state.chat.tabs.forEach((tabsTab: any) => {
        if (!state.chat.logs[tabsTab.name]) {
          // this.$set(state.chat.logs, tabsTab.name, [])
          const newLogs = { ...state.chat.logs };
          newLogs[tabsTab.name] = [];
          state.chat.logs = newLogs;
          // state.chat.logs[tabsTab.name] = []
        }
      });
    }
  } /* end of mutations */,

  getters: {
    /**
     * 選択済みのチャットのタブのオブジェクト
     * @param state
     * @returns any
     */
    activeChatTab: (state: any) =>
      state.chat.tabs.filter((tabObj: any) => tabObj.isActive)[0],

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
    getBackgroundImage: (state: any) =>
      state.image.list.filter((image: any) => image.key === state.map.imageKey)[0].data,

    getPeerActors: (state: any, getters: any, rootState: any, rootGetters: any) => {
      const playerName = rootGetters.playerName;
      const player = state.player.list.filter(
        (p: any) => p.name === playerName
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
    chatTabList: (state: any): any[] => state.chat.tabs,
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
    getMapObjectList: (state: any) => (
      {
        kind,
        place = "",
        playerKey = ""
      }: { kind: string; place: string; playerKey: string}
    ): any[] => {
      const list: any[] = state[kind].list;
      if (!place && !playerKey) {
        return list;
      } else {
        return list.filter(
          (target: any) => {
            if (playerKey && target.owner !== playerKey) return false;
            return !(place && target.place !== place);
          }
        );
      }
    },
    getMembers: (state: any, getters: any) => (playerKey: string): any[] => {
      const player = getters.getObj(playerKey);
      return getters.members.filter((member: any) => member.playerKey === player.key)
    },
    getPlayer: (state: any, getters: any) => (peerId: string): any => {
      const member = getters.members.filter((member: any) => member.peerId === peerId);
      if (!member) return null;
      return getters.getObj(member.playerKey);
    },
    inviteUrl: (state: any, getters: any): string => {
      const baseUrl = location.href.replace(/\?.+$/, "");
      const params: string[] = [];
      params.push(`roomName=${getters.roomName}`);
      params.push(`roomPassword=${getters.roomPassword}`);
      return `${baseUrl}?${params.join("&")}`;
    },
    isMapEditing: (state: any): boolean => state.map.isEditting,
    groupTargetTab: (state: any): any => state.chat.groupTargetTab
  } /* end of getters */
};
