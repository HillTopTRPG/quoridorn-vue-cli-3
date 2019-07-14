<template>
  <window-frame
    titleText="ダイスボット用表管理"
    display-property="private.display.customDiceBotTableWindow"
    align="center"
    fixSize="450, 300"
  >
    <div class="contents" @contextmenu.prevent>
      <div class="tableContainer">
        <table @mousemove="event => moveDev(event)" @mouseup="moveDevEnd">
          <thead>
            <tr>
              <th :style="colStyle(0)">ゲームシステム</th>
              <divider :index="0" prop="customDiceBotTableWindow" />
              <th :style="colStyle(1)">コマンド名</th>
              <divider :index="1" prop="customDiceBotTableWindow" />
              <th :style="colStyle(2)">表タイトル</th>
            </tr>
          </thead>
          <tbody>
            <!-- ===============================================================
            コンテンツ
          -->
            <!-- ユーザが手動で追加したもの -->
            <tr
              v-for="customDiceBot in customDiceBotList"
              :key="customDiceBot.key"
              @click="selectLine(customDiceBot.key)"
              :class="{ isActive: selectLineKey === customDiceBot.key }"
            >
              <!-- ゲームシステム -->
              <td :style="colStyle(0)">
                {{ getSystemName(customDiceBot.diceBotSystem) }}
              </td>
              <divider :index="0" prop="customDiceBotTableWindow" />

              <!-- コマンド名 -->
              <td :style="colStyle(1)">
                {{ customDiceBot.commandName }}
              </td>
              <divider :index="1" prop="customDiceBotTableWindow" />

              <!-- 表タイトル -->
              <td :style="colStyle(2)">
                {{ customDiceBot.tableTitle }}
              </td>
            </tr>

            <tr class="separator">
              <td colspan="5"></td>
            </tr>
            <tr class="separator">
              <td colspan="5"></td>
            </tr>

            <!-- 設定ファイルから追加したもの -->
            <tr
              v-for="customDiceBot in customDiceBotRoomSysList"
              :key="customDiceBot.key"
              @click="selectLine(customDiceBot.key)"
              :class="{ isActive: selectLineKey === customDiceBot.key }"
            >
              <!-- ゲームシステム -->
              <td :style="colStyle(0)">
                {{ getSystemName(customDiceBot.diceBotSystem) }}
              </td>
              <divider :index="0" prop="customDiceBotTableWindow" />

              <!-- コマンド名 -->
              <td :style="colStyle(1)">
                {{ customDiceBot.commandName }}
              </td>
              <divider :index="1" prop="customDiceBotTableWindow" />

              <!-- 表タイトル -->
              <td :style="colStyle(2)">
                {{ customDiceBot.tableTitle }}（設定ファイル由来）
              </td>
            </tr>

            <!-- 余白部分 -->
            <tr
              class="space"
              :class="{ isOdd: !listLengthIsOdd, isEven: listLengthIsOdd }"
            >
              <td :style="colStyle(0)"></td>
              <divider :index="0" prop="customDiceBotTableWindow" />
              <td :style="colStyle(1)"></td>
              <divider :index="1" prop="customDiceBotTableWindow" />
              <td :style="colStyle(2)"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <ctrl-button @click="addButtonOnClick">新規作成</ctrl-button>
        <ctrl-button @click="copyButtonOnClick">コピー作成</ctrl-button>
        <ctrl-button @click="changeButtonOnClick">変更</ctrl-button>
        <ctrl-button @click="deleteButtonOnClick">削除</ctrl-button>
        <ctrl-button @click="cancelButtonOnClick">閉じる</ctrl-button>
      </div>
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowFrame from "../WindowFrame.vue";
import WindowMixin from "../WindowMixin.vue";
import Divider from "../parts/Divider.vue";
import CtrlButton from "@/components/parts/CtrlButton.vue";

import { Action, Getter, Mutation } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: {
    CtrlButton,
    WindowFrame,
    Divider
  }
})
export default class CustomDiceBotTableWindow extends Mixins<WindowMixin>(
  WindowMixin
) {
  @Action("windowClose") private windowClose: any;
  @Action("windowOpen") private windowOpen: any;
  @Action("setProperty") private setProperty: any;
  @Action("addListObj") private addListObj: any;
  @Action("deleteListObj") private deleteListObj: any;
  @Getter("loadYaml") private loadYaml: any;
  @Getter("getViewName") private getViewName: any;
  @Getter("getObj") private getObj: any;
  @Getter("playerKey") private playerKey: any;
  @Getter("chatActorKey") private chatActorKey: any;
  @Getter("customDiceBotList") private customDiceBotList: any;
  @Getter("customDiceBotRoomSysList") private customDiceBotRoomSysList: any;
  @Getter("diceSystemList") private diceSystemList: any;

  private addButtonOnClick(): void {
    this.loadYaml("/static/conf/system/default/customDiceBot.yaml")
      .then((customDiceBot: any) => {
        // 読み込めた場合
        const tableContents: any = customDiceBot!.tableContents;
        const tableContentsArr = [];
        for (const prop in tableContents) {
          if (!tableContents.hasOwnProperty(prop)) continue;
          tableContentsArr.push(`${prop}:${tableContents[prop]}`);
        }
        customDiceBot.tableContents = tableContentsArr.join("\n");

        this.addListObj({
          propName: "customDiceBot",
          kind: "customDiceBot",
          commandName: customDiceBot.commandName,
          diceRoll: customDiceBot.diceRoll,
          tableTitle: customDiceBot.tableTitle,
          diceBotSystem: "DiceBot",
          tableContents: tableContentsArr.join("\n")
        }).then(() => {
          const lastKey: string = this.customDiceBotList[
            this.customDiceBotList.length - 1
          ].key;
          this.setProperty({
            property: "private.display.editCustomDiceBotTableWindow.objKey",
            value: lastKey,
            logOff: true
          }).then(() => {
            this.windowOpen("private.display.editCustomDiceBotTableWindow");
          });
        });
      })
      .catch((err: any) => {
        window.console.log(err);

        this.addListObj({
          propName: "customDiceBot",
          kind: "customDiceBot",
          commandName: "PGT",
          diceRoll: "1d6",
          tableTitle: "ペンギン属表(Penguin's Generic name Table)",
          diceBotSystem: "DiceBot",
          tableContents: [
            "1:コウテイペンギン属（学名：Aptenodytes）。学名の意味：「翼のない潜水者」。コウテイペンギン／キングペンギン",
            "2:アデリーペンギン属（学名：Aygoscelis）。学名の意味：「尻についた肢（あし）」。アデリーペンギン／ジェンツーペンギン／ヒゲペンギン",
            "3:フンボルトペンギン属（学名：Spheniscus）。学名の意味：「楔のような」。ガラパゴスペンギン／ケープペンギン／フンボルトペンギン／マゼランペンギン",
            "4:マカロニペンギン属（学名：Eudyptes）。学名の意味：「優れた潜水者」。フィヨルドランドペンギン／シュレーターペンギン／スネアーズペンギン／マカロニペンギン／ロイヤルペンギン／イワトビペンギン",
            "5:キンメペンギン属（学名：Megadyptes）。学名の意味：「大型の潜水者」。キンメペンギン（一種一属の固有種）",
            "6:コガタペンギン属（学名：Eudyptula）。学名の意味：「非常に小さい」「優れた潜水者」。コガタペンギン／ハネジロペンギン"
          ].join("\n")
        }).then(() => {
          const lastKey: string = this.customDiceBotList[
            this.customDiceBotList.length - 1
          ].key;
          this.setProperty({
            property: "private.display.editCustomDiceBotTableWindow.objKey",
            value: lastKey,
            logOff: true
          }).then(() => {
            this.windowOpen("private.display.editCustomDiceBotTableWindow");
          });
        });
      });
  }

  private copyButtonOnClick(): void {
    if (!this.selectLineKey) {
      alert("コピー対象を選択してください。");
      return;
    }

    const kind = this.selectLineKey.split("-")[0];

    const useList =
      kind === "customDiceBotRoomSys"
        ? this.customDiceBotRoomSysList
        : this.customDiceBotList;
    const customDiceBotObj: any = JSON.parse(
      JSON.stringify(
        useList.filter((bot: any) => bot.key === this.selectLineKey)[0]
      )
    );

    customDiceBotObj.propName = "customDiceBot";
    customDiceBotObj.kind = "customDiceBot";
    this.addListObj(customDiceBotObj);
  }

  private changeButtonOnClick(key: string): void {
    if (!this.selectLineKey) {
      alert("変更対象を選択してください。");
      return;
    }

    this.setProperty({
      property: "private.display.editCustomDiceBotTableWindow.objKey",
      value: this.selectLineKey,
      logOff: true
    });
    this.windowOpen("private.display.editCustomDiceBotTableWindow");
  }

  private deleteButtonOnClick(): void {
    if (!this.selectLineKey) {
      alert("削除対象を選択してください。");
      return;
    }

    this.deleteListObj({ key: this.selectLineKey, propName: "customDiceBot" });
    this.selectLine("");
  }

  private cancelButtonOnClick(): void {
    this.windowClose("private.display.customDiceBotTableWindow");
  }

  private moveDev(event: any) {
    if (this.movingIndex > -1) {
      const diff = event.clientX - this.startX;
      const afterLeftWidth = this.startLeftWidth + diff;
      const afterRightWidth = this.startRightWidth - diff;
      if (afterLeftWidth >= 10 && afterRightWidth >= 10) {
        const paramObj: any = {};
        paramObj[this.movingIndex] = afterLeftWidth;
        paramObj[this.movingIndex + 1] = afterRightWidth;
        this.setProperty({
          property: "private.display.customDiceBotTableWindow.widthList",
          value: paramObj,
          logOff: true
        });
      }
    }
  }

  private moveDevEnd() {
    this.setProperty({
      property: "private.display.customDiceBotTableWindow",
      value: {
        hoverDevIndex: -1,
        movingIndex: -1,
        startX: -1,
        startLeftWidth: -1,
        startRightWidth: -1
      },
      logOff: true
    });
  }

  private selectLine(selectLineKey: string) {
    this.setProperty({
      property: "private.display.customDiceBotTableWindow.selectLineKey",
      value: selectLineKey,
      logOff: true
    });
  }

  private getSystemName(systemKey: string) {
    if (systemKey === "DiceBot") return "指定なし";
    const systemObj: any = this.diceSystemList.filter(
      (systemObj: any) => systemObj.system === systemKey
    )[0];
    return systemObj.name;
  }

  private get listLengthIsOdd(): boolean {
    return (
      (this.customDiceBotList.length + this.customDiceBotRoomSysList.length) %
        2 !==
      0
    );
  }

  /* Start 列幅可変テーブルのプロパティ */
  private get selectLineKey() {
    return this.$store.state.private.display.customDiceBotTableWindow
      .selectLineKey;
  }

  private get widthList() {
    return this.$store.state.private.display.customDiceBotTableWindow.widthList;
  }

  private get movingIndex() {
    return this.$store.state.private.display.customDiceBotTableWindow
      .movingIndex;
  }

  private get startX() {
    return this.$store.state.private.display.customDiceBotTableWindow.startX;
  }

  private get startLeftWidth() {
    return this.$store.state.private.display.customDiceBotTableWindow
      .startLeftWidth;
  }

  private get startRightWidth() {
    return this.$store.state.private.display.customDiceBotTableWindow
      .startRightWidth;
  }

  private get colStyle() {
    return (index: number) => ({ width: `${this.widthList[index]}px` });
  }
  /* End 列幅可変テーブルのプロパティ */
}
</script>

<style scoped lang="scss">
@import "../common.scss";

.contents {
  position: absolute;
  height: 100%;
  width: 100%;
  font-size: 12px;
}

label {
  display: flex;
  margin-top: 5px;

  input {
    flex: 1;
    margin-left: 5px;
  }
}

.operateArea {
  margin-top: 5px;
  text-align: center;
}

tr.separator {
  height: 1px;
  background-color: #b7babc;
}

/* Start 列幅可変テーブルのCSS */
.tableContainer {
  overflow-y: scroll;
  flex: 1;
  width: 100%;
  height: 216px;
  border: 1px solid rgb(183, 186, 188);
  font-size: 10px;
  box-sizing: border-box;
}

table {
  width: calc(100% - 19px);
  height: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
}

tr {
  height: 2.5em;

  &.space {
    height: auto;
    background-color: transparent;
    background-size: 5em 5em;

    &.isOdd {
      background-image: linear-gradient(
        0deg,
        rgb(247, 247, 247) 0%,
        rgb(247, 247, 247) 50%,
        white 51%,
        white 100%
      );
    }
    &.isEven {
      background-image: linear-gradient(
        0deg,
        white 0%,
        white 50%,
        rgb(247, 247, 247) 51%,
        rgb(247, 247, 247) 100%
      );
    }
  }
}

th,
td {
  padding: 0;
  white-space: nowrap;
  cursor: default;
}

th,
td:not(.divider) {
  overflow: hidden;
}

table tbody {
  height: 100%;

  td {
    text-align: center;
  }

  tr {
    height: 2.5em;

    &:not(.space):not(.separator) {
      &.isActive {
        background-color: rgb(127, 206, 255) !important;
      }

      &:nth-child(odd) {
        background-color: white;

        &:hover {
          background-color: rgb(178, 225, 255);
        }
      }

      &:nth-child(even) {
        background-color: rgb(247, 247, 247);

        &:hover {
          background-color: rgb(178, 225, 255);
        }
      }
    }
  }
}

table thead {
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 1) 0%,
    rgba(234, 234, 234, 1) 100%
  );

  tr {
    border-bottom: 1px solid rgb(183, 186, 188);

    th:hover {
      background: rgb(178, 225, 255);
    }
  }
}

table td.dev {
  background-color: rgb(183, 186, 188);
  cursor: col-resize;
  position: relative;
  width: 1px;

  &:after {
    position: absolute;
    height: 100%;
    top: 0;
    left: -2px;
    content: "";
    width: 5px;
  }
}

td i {
  display: flex;
  align-items: center;
  justify-content: center;
}

table select {
  width: 100%;
  height: 100%;
  background: none;
  border: none;
}

table input {
  background: none;
  border: none;
}

button {
  /*height: 2.5em;*/
  font-size: inherit;
  box-sizing: border-box;
  border-radius: 3px;
  padding: 0.3em 0.5em;
  line-height: 1em;

  &:disabled {
    background-color: lightgrey;
  }
}
/* End 列幅可変テーブルのCSS */
</style>
