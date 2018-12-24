// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'bcdice-js/lib/preload-dicebots'
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

/**
 * Store
 */
const storeModulePublic = {
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
      /** BGMのプリセット */
      list: [
        {
          key: "bgm-0",
          chatLinkage: 0,
          chatLinkageSearch: "",
          tag: "BGM",
          title: "BGM停止",
          url: "",
          playLength: 0,
          volume: 0.5,
          isLoop: false,
          fadeIn: 1,
          fadeOut: 1
        },
        {
          key: "bgm-1",
          chatLinkage: 0,
          chatLinkageSearch: "",
          tag: "SE",
          title: "SE停止",
          url: "",
          playLength: 0,
          volume: 0.5,
          isLoop: false,
          fadeIn: 1,
          fadeOut: 1
        },
        {
          key: "bgm-2",
          chatLinkage: 0,
          chatLinkageSearch: "",
          tag: "BGM",
          title: "馬車道",
          url: require("../assets/BGM/o12.mp3"),
          playLength: 0,
          volume: 0.8,
          isLoop: true,
          fadeIn: 1,
          fadeOut: 0
        },
        {
          key: "bgm-3",
          chatLinkage: 0,
          chatLinkageSearch: "",
          tag: "BGM",
          title: "羊飼いの夕餉",
          url: require("../assets/BGM/n122.mp3"),
          playLength: 0,
          volume: 1,
          isLoop: true,
          fadeIn: 0,
          fadeOut: 1
        },
        {
          key: "bgm-4",
          chatLinkage: 0,
          chatLinkageSearch: "",
          tag: "BGM",
          title: "小さな行進曲",
          url: require("../assets/BGM/n26.mp3"),
          playLength: 0,
          volume: 0.8,
          isLoop: true,
          fadeIn: 0,
          fadeOut: 0
        },
        {
          key: "bgm-5",
          chatLinkage: 0,
          chatLinkageSearch: "",
          tag: "BGM",
          title: "華志の舞 (Kashi no Mai)",
          url: "https://www.youtube.com/watch?v=nq3YnT0km2o&t=15s",
          playLength: 0,
          volume: 0.8,
          isLoop: true,
          fadeIn: 0,
          fadeOut: 0
        },
        {
          key: "bgm-6",
          chatLinkage: 0,
          chatLinkageSearch: "",
          tag: "BGM",
          title: "ECHO【Gumi English】",
          url: "https://www.youtube.com/watch?v=cQKGUgOfD8U",
          playLength: 0,
          volume: 0.8,
          isLoop: true,
          fadeIn: 0,
          fadeOut: 0
        },
        {
          key: "bgm-7",
          chatLinkage: 0,
          chatLinkageSearch: "",
          tag: "BGM",
          title: "DJ Sona's Ultimate Skin Music: Kinetic",
          url: "https://www.youtube.com/watch?v=uHJyAZtRrOY",
          playLength: 0,
          volume: 0.8,
          isLoop: false,
          fadeIn: 0,
          fadeOut: 0
        },
        {
          key: "bgm-8",
          chatLinkage: 0,
          chatLinkageSearch: "",
          tag: "BGM",
          title: "Tobu - Higher",
          url: "https://www.youtube.com/watch?v=blA7epJJaR4",
          playLength: 0,
          volume: 0.8,
          isLoop: true,
          fadeIn: 0,
          fadeOut: 0
        },
        {
          key: "bgm-9",
          chatLinkage: 0,
          chatLinkageSearch: "チーン1",
          tag: "SE",
          title: "チーン1",
          url: require("../assets/BGM/tin1.mp3"),
          playLength: 0,
          volume: 0.8,
          isLoop: false,
          fadeIn: 0,
          fadeOut: 0
        },
        {
          key: "bgm-10",
          chatLinkage: 1,
          chatLinkageSearch: "出題1",
          tag: "SE",
          title: "出題1",
          url: require("../assets/BGM/question1.mp3"),
          playLength: 0,
          volume: 0.8,
          isLoop: false,
          fadeIn: 0,
          fadeOut: 0
        },
        {
          key: "bgm-11",
          chatLinkage: 1,
          chatLinkageSearch: "正解1",
          tag: "SE",
          title: "正解1",
          url: require("../assets/BGM/correct1.mp3"),
          playLength: 0,
          volume: 0.8,
          isLoop: false,
          fadeIn: 0,
          fadeOut: 0
        },
        {
          key: "bgm-12",
          chatLinkage: 1,
          chatLinkageSearch: "不正解1",
          tag: "SE",
          title: "不正解1",
          url: require("../assets/BGM/incorrect1.mp3"),
          playLength: 0,
          volume: 0.8,
          isLoop: false,
          fadeIn: 0,
          fadeOut: 0
        },
        {
          key: "bgm-13",
          chatLinkage: 0,
          chatLinkageSearch: "",
          tag: "BGM",
          title: "おばけのウケねらい",
          url: "https://www.youtube.com/watch?v=M92c6pl10u0",
          playLength: 0,
          volume: 0.8,
          isLoop: true,
          fadeIn: 0,
          fadeOut: 0
        },
        {
          key: "bgm-14",
          chatLinkage: 0,
          chatLinkageSearch: "",
          tag: "BGM",
          title: "気まぐれメルシィ feat. 初音ミク",
          url: "https://www.youtube.com/watch?v=o1iz4L-5zkQ",
          playLength: 0,
          volume: 0.8,
          isLoop: true,
          fadeIn: 0,
          fadeOut: 0
        },
        {
          key: "bgm-15",
          chatLinkage: 0,
          chatLinkageSearch: "",
          tag: "BGM",
          title: "Bad Apple!!",
          url: "https://www.youtube.com/watch?v=9lNZ_Rnr7Jc",
          playLength: 0,
          volume: 0.8,
          isLoop: true,
          fadeIn: 0,
          fadeOut: 0
        },
        {
          key: "bgm-16",
          chatLinkage: 0,
          chatLinkageSearch: "",
          tag: "BGM",
          title: "Again",
          url: "https://www.youtube.com/watch?v=jdQWia3fwMU",
          playLength: 0,
          volume: 0.8,
          isLoop: true,
          fadeIn: 0,
          fadeOut: 0
        },
        {
          key: "bgm-17",
          chatLinkage: 0,
          chatLinkageSearch: "",
          tag: "BGM",
          title: "LUVORATORRRRRY! ver れをる feat.nqrse",
          url: "https://www.youtube.com/watch?v=p-o_bMkzOW0",
          playLength: 0,
          volume: 0.8,
          isLoop: true,
          fadeIn: 0,
          fadeOut: 0
        }
      ],
      maxKey: 13,

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
    room: { id: "", members: [], system: "DiceBot", password: "" },

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
     * ルームメンバを追加する
     * @param commit
     * @returns {*}
     */
    addMember: ({ commit }, { peerId, name, isCame }) =>
      commit("addMember", { peerId, name, isCame }),

    /**
     * プレイヤーを追加する
     * @param commit
     * @returns {*}
     */
    addPlayer: ({ commit }, { name, color, type }) => {
      return commit("addPlayer", { name, color, type });
      // commit('addPlayerWidth')
    },

    /**
     * ルームメンバを空にする
     * @param commit
     * @returns {*}
     */
    emptyMember: ({ commit }) => commit("emptyMember"),

    /**
     * チャットのタブを選択したことをデータに反映する
     * @param commit
     * @param tab
     * @returns {*}
     */
    chatTabSelect: ({ commit }, tab) => commit("chatTabSelect", tab),

    /**
     * チャット対象のタブを選択したことをデータに反映する
     * @param commit
     * @param tab
     * @returns {*}
     */
    groupTargetTabSelect: ({ commit }, tab) =>
      commit("groupTargetTabSelect", tab),

    /**
     * 画像のタブの構成を変更する
     * @param commit
     * @param payload
     * @returns {*}
     */
    imageTagChange: ({ commit }, payload) => commit("imageTagChange", payload),

    /**
     * チャットのタブの構成を変更する
     * @param getters
     * @param commit
     * @param tabsText
     * @returns {*}
     */
    changeChatTab: ({ getters, commit }, tabsText) =>
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
    noticeInput: ({ commit, state }, { name, target }) => {
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
     * ルームメンバを追加する
     * @param state
     * @returns {*[]}
     */
    addMember: (state, { peerId, name, isCame }) => {
      state.room.members.push({
        peerId: peerId,
        name: name,
        isCame: isCame
      });
    },

    /**
     * プレイヤーを追加する
     * @param state
     * @returns {*[]}
     */
    addPlayer: (state, { name, color, type }) => {
      const key = `player-${name}`;
      state.player.list.push({
        key: key,
        name: name,
        fontColor: color,
        type: type
      });
      return key;
    },

    /**
     * ルームメンバを空にする
     * @param state
     * @returns {*[]}
     */
    emptyMember: state =>
      state.room.members.splice(0, state.room.members.length),

    /**
     * チャットのタブを選択したことをデータに反映する
     * @param state
     * @param tab
     */
    chatTabSelect(state, tab) {
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
    groupTargetTabSelect(state, tab) {
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
    inputPeerId(state, { name, add }) {
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
    imageTagChange(state, { key, imageList }) {
      const useTexts = [];
      /* eslint no-control-regex: 0 */
      const regExp = new RegExp("[　\t \r\n,]+", "g");
      // window.console.qLog(imageList)
      imageList.forEach(imageObj => {
        Array.prototype.push.apply(
          useTexts,
          imageObj.currentTag.replace(regExp, ",").split(",")
        );
      });

      let addList = useTexts.concat(); // 配列をシャロ―コピー
      const deleteList = state.image.tags.list.filter(tag => {
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
          state.image.list.forEach(imageObj => {
            if (findFlg) return;
            const filteredList = imageObj.tag
              .split(",")
              .filter(imgTag => imgTag === tag.name);
            if (filteredList.length > 0) {
              findFlg = true;
            }
          });
        }
        return !findFlg;
      });
      // 削除リストに基づいてタグを消していく
      deleteList.forEach(delTagObj =>
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
    changeChatTab(state, { tabsText, lastActiveTab }) {
      // 秘匿チャット以外を削除
      state.chat.tabs
        .map((tab, index) => {
          if (!tab.secretInfo) return;
          return index;
        })
        .reverse()
        .forEach(index => state.chat.tabs.splice(index, 1));

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
      state.chat.tabs.forEach(tabsTab => {
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
     * @returns {T}
     */
    activeChatTab: state =>
      state.chat.tabs.filter(tabObj => tabObj.isActive)[0],

    /**
     * すべての障害物を取得
     * @param state
     */
    getAllObstacle: state => {
      const allPieceList = state.character.list
        .filter(o => o.place === "field")
        .concat(state.chit.list.filter(o => o.place === "field"))
        .concat(state.mapMask.list.filter(o => o.place === "field"));
      // TODO obstacle属性の作成
      return allPieceList;
    },

    /**
     * グリッドに合わせるかどうか
     * @param state
     * @returns {boolean}
     */
    isFitGrid: state => state.setting.isFitGrid,

    getPieceObj: (state, getters) =>
      /**
       * 指定されたタイプのオブジェクトの中から、指定されたキーのオブジェクトを絞り込んで取得する
       * @param type
       * @param key
       * @param logOff
       * @returns {*}
       */
      (type, key, logOff = true) => {
        const result = getters.getKeyObj(state[type].list, key);
        if (!logOff) {
          window.console.qLog(
            `  [getters] pieceObj[${type}]#${key} => ${getters.objToString(
              result
            )}`
          );
        }
        return result;
      },

    pieceKeyList: state =>
      /**
       * 指定されたタイプのオブジェクトの、キーの一覧を取得する
       * @param type
       * @returns {*}
       */
      type =>
        state[type].list
          .filter(pieceObj => pieceObj.place === "field")
          .map(pieceObj => pieceObj.key),

    /**
     * 現在の背景画像
     * @param state
     * @returns {*}
     */
    getBackgroundImage: state =>
      state.image.list.filter(d => d.key === state.map.imageKey)[0].data,

    getPeerActors: (state, getters, rootState) => {
      const playerName = rootState.private.self.playerName;
      const player = state.player.list.filter(p => p.name === playerName)[0];
      if (player) {
        return [
          player,
          ...state.character.list.filter(
            character => character.owner === player.key
          )
        ];
      } else {
        return [{ name: "名無し", type: "PL" }, ...state.character.list];
      }
    },

    getObj: state => key => {
      if (!key) return;
      const kind = key.split("-")[0];
      if (kind === "player") {
        // プレイヤー
        return state.player.list.filter(player => player.key === key)[0];
      } else if (kind === "character") {
        // キャラクター
        return state.character.list.filter(
          character => character.key === key
        )[0];
      } else if (kind === "groupTargetTab") {
        // グループチャットタブ
        return state.chat.groupTargetTab.list.filter(tab => tab.key === key)[0];
      }
    },

    getViewName: (state, getters) => key => {
      const obj = getters.getObj(key);
      if (!obj) return "名無し(PL)";
      const kind = obj.key.split("-")[0];
      if (kind === "player") {
        // プレイヤー
        const type = obj.type;
        return `${obj.name}(${type})`;
      } else {
        return `${obj.name}`;
      }
    }
  } /* end of getters */
};
export default storeModulePublic;
