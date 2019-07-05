import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

/**
 * Store
 */
export default {
  // FIXME settingのデータは別経路で保存する？
  state: {
    /** バージョン */
    version: "1.0.0b14.1",
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
      name: "SYSTEM",
      color: "red",
      tab: "chatTab-0",
      owner: "SYSTEM"
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
          // 無視
        }
      });
    }
  },

  getters: {
    roles: (state: any) => state.roles,
    systemLog: (state: any) => state.systemLog,
    chatOptionPagingSize: () => 8,
    skywayKey: (state: any) => state.connect.skywayKey,
    connectType: (state: any) => state.connect.type,
    version: (state: any) => state.version,
    bcdiceServer: (state: any) => state.bcdiceServer
  }
};
