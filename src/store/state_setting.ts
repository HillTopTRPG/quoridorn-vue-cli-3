import CryptoJS from "crypto-js";

export default {
  // FIXME settingのデータは別経路で保存する？
  state: {
    /** バージョン */
    version: "1.0.0b15",
    magicWord: "I walk slowly, but I never walk backward.",
    /** 接続情報 */
    connect: {
      skywayKey: "",
      type: "",
      bcdiceServer: ""
    },
    /** 権限 */
    roles: [
      {
        label: "プレイヤー",
        value: "PL",
        description: "部屋の設定や他のプレイヤーの設定の一部が変更不可です。"
      },
      {
        label: "ゲームマスター",
        value: "GM",
        description: "すべての部屋設定とプレイヤーの設定を変更可能です。"
      },
      {
        label: "サブGM",
        value: "サブGM",
        description: "見た目が異なるだけで、ゲームマスターと同等の権限です。"
      },
      {
        label: "見学者",
        value: "見学者",
        description: "部屋の設定、プレイヤーたちの設定は一切変更できません。"
      }
    ],
    systemLog: {
      name: "Quoridorn",
      colorKey: "color-Quoridorn",
      color: "#000",
      tab: "chatTab-1",
      from: "Quoridorn"
    },
    chatFormat: {
      lineRegExp: null,
      borderStyleRegExp: null,
      styleRegExp: null,
      targetList: [
        {
          label: "[リセット]",
          chatText: "[[style]]"
        },
        {
          label: "太文字",
          chatText: "[[style:b]]"
        },
        {
          label: "イタリック",
          chatText: "[[style:i]]"
        },
        {
          label: "赤文字",
          chatText: "[[style:c{#f00}]]"
        },
        {
          label: "赤文字（太文字）",
          chatText: "[[style:c{#f00}:b]]"
        },
        {
          label: "下線",
          chatText: "[[style:u{#000}]]"
        },
        {
          label: "下線（波線）",
          chatText: "[[style:u{#000|wavy}]]"
        },
        {
          label: "下線（赤色ダッシュ）",
          chatText: "[[style:u{red|dashed}]]"
        },
        {
          label: "上付線",
          chatText: "[[style:o{#000}]]"
        },
        {
          label: "上付線（波線）",
          chatText: "[[style:o{#000|wavy}]]"
        },
        {
          label: "上付線（赤色ダッシュ）",
          chatText: "[[style:o{red|dashed}]]"
        },
        {
          label: "取り消し線",
          chatText: "[[style:lt]]"
        },
        {
          label: "ルビ",
          chatText: "[[style:r{ルビ}]]"
        },
        {
          label: "背景色(黄色)",
          chatText: "[[style:bc{yellow}]]"
        }
      ]
    }
  } /* end of state */,

  actions: {
    /**
     * ダイスボット一覧を取得する
     * @param state
     */
    getBcdiceSystemList({ state }: { state: any }) {
      return new Promise((resolve: Function, reject: Function) => {
        const url = `${state.connect.bcdiceServer}/v1/names`;
        fetch(url)
          .then(response => response.json())
          .then(json => {
            json.names.sort((i1: any, i2: any) => {
              if (i1.name === "DiceBot") return -1;
              if (i2.name === "DiceBot") return 1;
              if (i1.name > i2.name) return 1;
              if (i1.name < i2.name) return -1;
              return 0;
            });
            resolve(json.names);
          })
          .catch(err => reject(err));
      });
    },

    /**
     * ダイスボットの情報を取得する
     * @param state
     * @param system
     */
    getBcdiceSystemInfo({ state }: { state: any }, system: string) {
      return new Promise((resolve: Function, reject: Function) => {
        const params: string = `system=${system}`;
        const url = `${state.connect.bcdiceServer}/v1/systeminfo?${params}`;
        fetch(url)
          .then(response => response.json())
          .then(json => {
            if (json.ok) {
              resolve(json.systeminfo);
            } else {
              reject(json);
            }
          })
          .catch(err => reject(err));
      });
    },

    /**
     * ダイスコマンドを送信して結果を取得する
     * @param state
     * @param system
     * @param command
     */
    sendBcdiceServer(
      { state }: { state: any },
      { system, command }: { system: string; command: string }
    ) {
      return new Promise((resolve: Function, reject: Function) => {
        const params: string = [
          `system=${system}`,
          `command=${encodeURIComponent(command)}`
        ].join("&");
        const url = `${state.connect.bcdiceServer}/v1/diceroll?${params}`;

        try {
          fetch(url)
            .then(response => response.json())
            .then(json => {
              resolve(json);
            });
          // .catch(err => { /* 無視 */ }); // reject(err)
        } catch (error) {
          window.console.error(error);
          // 無視
        }
      });
    }
  },

  mutations: {
    init_state_setting: (state: any) => {
      /* ----------------------------------------------------------------------
       * チャット整形に使う正規表現の初期化
       */
      const colorFormat = "#[0-9a-f]+|rgba? *\\([0-9., ]+\\)|[a-z]+";
      const lineStyleFormat = "solid|double|dotted|dashed|wavy";
      state.chatFormat.borderStyleRegExp = new RegExp(lineStyleFormat, "gi");
      const colorAndLineFormat = `(${lineStyleFormat}|${colorFormat})`;
      const styleRegExpList = [
        `(b?c)(?: *{ *)(${colorFormat})(?: *})`,
        `([uo])(?: *{ *)${colorAndLineFormat}(?: *\\| *${colorAndLineFormat})?(?: *})`,
        "(b)",
        "(i)",
        "(lt)",
        "(r)(?: *{ *)([^}]+)(?: *})"
      ];
      const styleRegExpStr = `(?:: *)(?:${styleRegExpList.join("|")})`;
      state.chatFormat.styleRegExp = new RegExp(styleRegExpStr, "gi");

      const regExpStr = `\\[\\[ *style((?: *${styleRegExpStr})*) *]]`;
      window.console.log(regExpStr);
      state.chatFormat.lineRegExp = new RegExp(regExpStr, "gi");
    }
  },

  getters: {
    roles: (state: any) => state.roles,
    systemLog: (state: any) => state.systemLog,
    magicWord: (state: any) => state.magicWord,
    chatOptionPagingSize: () => 8,
    skywayKey: (state: any) => state.connect.skywayKey,
    connectType: (state: any) => state.connect.type,
    version: (state: any) => state.version,
    bcdiceServer: (state: any) => state.bcdiceServer,
    chatFormats: (state: any) => state.chatFormat.targetList,
    chatLineRegExp: (state: any) => state.chatFormat.lineRegExp,
    borderStyleRegExp: (state: any) => state.chatFormat.borderStyleRegExp,
    chatStyleRegExp: (state: any) => state.chatFormat.styleRegExp,

    /** 暗号化 */
    encrypt: (state: any) => ({
      planeText,
      salt = state.magicWord
    }: {
      planeText: string;
      salt: string;
    }) => {
      return CryptoJS.AES.encrypt(planeText, salt).toString();
    },

    /** 復号化 */
    decrypt: (state: any) => ({
      cipherText,
      salt = state.magicWord
    }: {
      cipherText: string;
      salt: string;
    }) => {
      // window.console.log("decrypt", cipherText, salt);
      // window.console.log(CryptoJS.AES.decrypt(cipherText, salt).toString(CryptoJS.enc.Utf8));
      return CryptoJS.AES.decrypt(cipherText, salt).toString(CryptoJS.enc.Utf8);
    }
  }
};
