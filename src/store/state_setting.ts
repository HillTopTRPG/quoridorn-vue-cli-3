// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'bcdice-js/lib/preload-dicebots'
import Vue from "vue";
import Vuex from "vuex";
// // @ts-ignore
// import deckList from "../../public/static/conf/deck.yaml";

Vue.use(Vuex);

/**
 * Store
 */
export default {
  // FIXME settingのデータは別経路で保存する？
  state: {
    /** バージョン */
    version: "1.0.0b7",
    /** 接続情報 */
    connect: {
      skywayKey: "",
      type: ""
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
  getters: {
    roles: (state: any) => state.roles,
    systemLog: (state: any) => state.systemLog,
    chatOptionPagingSize: () => 8,
    skywayKey: (state: any) => state.connect.skywayKey,
    connectType: (state: any) => state.connect.type,
    version: (state: any) => state.version
  }
};
