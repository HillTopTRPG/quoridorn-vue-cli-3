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
     * @param rootGetters
     */
    saveChatLogHtml({ rootGetters }: { rootGetters: any }) {
      const dateStr = moment().format("YYYYMMDD_HHmmss");
      const title = `Quoridorn_chatLog_${dateStr}`;

      const data = {
        chatLogs: JSON.stringify(rootGetters.chatLogs),
        actors: JSON.stringify(rootGetters.getAllActors),
        groupTargetTabList: JSON.stringify(rootGetters.groupTargetTabList),
        chatTabList: JSON.stringify(rootGetters.chatTabList),
        title,
        mode: "dev"
      };
      window.console.log(data);

      // TODO 一時的な書き換え
      Promise.resolve()
        // テンプレートファイル読み込み
        .then(() =>
          fetch(`${process.env.BASE_URL}/static/chatLogTemplate.html`).then(
            res => res.text()
          )
        )

        // テンプレートエンジン
        .then((templateStr: string) => Mustache.render(templateStr, data))

        // HTML出力
        .then((contents: string) => {
          const blob = new Blob([contents], { type: "text/html" });
          saveAs(blob, `${title}.html`);
        })

        // エラー処理
        .catch((err: any) => window.console.error(err));
    }
  }
};
