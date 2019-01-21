// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'bcdice-js/lib/preload-dicebots'
import Vue from "vue";
import Vuex from "vuex";
// @ts-ignore
import deckList from "../assets/deck.yaml";

Vue.use(Vuex);

/**
 * Store
 */
export default {
  // FIXME settingのデータは別経路で保存する？
  state: {
    /** バージョン */
    version: "1.0.0b4",
    /** カードセット */
    cardSet: deckList,
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
      tab: "メイン",
      owner: "SYSTEM"
    }
  } /* end of state */,
  getters: {
    roles: (state: any) => state.roles,
    systemLog: (state: any) => state.systemLog,
    chatOptionPagingSize: (state: any) => 8
  }
};
