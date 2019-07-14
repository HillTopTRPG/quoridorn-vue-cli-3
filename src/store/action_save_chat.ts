// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import Vuex from "vuex";
import saveAs from "file-saver";
import moment from "moment";
import * as Mustache from "mustache";

Vue.use(Vuex);

/**
 * Store
 * @type { Vuex }
 */
export default {
  actions: {
    /** ========================================================================
     * HTML形式でチャットログをダウンロードする
     * @param rootState
     * @param rootGetters
     * @param dispatch
     * @param data
     */
    saveChatLogHtml(
      {
        rootState,
        rootGetters,
        dispatch
      }: { rootState: any; dispatch: any; rootGetters: any },
      data: any
    ) {
      const chatData = rootGetters.chatLogs;
      window.console.log(chatData);
      return;

      // TODO 一時的な書き換え
      // Promise.resolve()
      //   // テンプレートファイル読み込み
      //   .then(() =>
      //     fetch(`${process.env.BASE_URL}/static/chatLogTemplate.html`).then(
      //       res => res.text()
      //     )
      //   )
      //
      //   // テンプレートエンジン
      //   .then((templateStr: string) => Mustache.render(templateStr, data))
      //
      //   // HTML出力
      //   .then((contents: string) => {
      //     const blob = new Blob([contents], { type: "text/html" });
      //     const dateStr = moment().format("YYYYMMDD_hhmmss");
      //     saveAs(blob, `Quoridorn_chatLog_${dateStr}.html`);
      //   })
      //
      //   // エラー処理
      //   .catch((err: any) => window.console.error(err));
    }
  }
};
