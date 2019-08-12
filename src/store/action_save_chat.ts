import saveAs from "file-saver";
import moment from "moment";
import * as Mustache from "mustache";

export default {
  actions: {
    /** ========================================================================
     * HTML形式でチャットログをダウンロードする
     * @param rootGetters
     */
    async saveChatLogHtml({ rootGetters }: { rootGetters: any }) {
      const dateStr = moment().format("YYYYMMDD_HHmmss");
      const title = `Quoridorn_chatLog_${dateStr}`;

      const func: Function = (list: any[]): string =>
        JSON.stringify(
          list.map((obj: any) =>
            rootGetters.encrypt({ planeText: JSON.stringify(obj) })
          )
        );

      const data = {
        chatLogs: func(rootGetters.chatLogs),
        actors: func(rootGetters.getAllActors),
        groupTargetTabList: func(rootGetters.groupTargetTabList),
        chatTabList: func(rootGetters.chatTabList),
        title,
        mode: "dev"
      };

      return (
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
          .catch((err: any) => window.console.error(err))
      );
    }
  }
};
