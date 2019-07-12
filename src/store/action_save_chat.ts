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
     * @param dispatch
     * @param data
     */
    saveChatLogHtml({ dispatch }: { dispatch: any }, data: any) {
      fetch("/static/chatLog.html")
        .then(res => res.text())
        .then(text => {
          const content = Mustache.render(text, data);
          const blob = new Blob([content], { type: "text/html" });
          const dateStr = moment().format("YYYYMMDD_hhmmss");
          saveAs(blob, `Quoridorn_chatLog_${dateStr}.html`);
        })
        .catch(err => window.console.log(err));
    }
  }
};
