<template>
  <window-frame
    titleText="BGMインポート画面"
    display-property="private.display.importBGMWindow"
    align="center"
    fixSize="394, 334"
    @open="initWindow"
  >
    <div class="contents" @contextmenu.prevent>
      <div class="playOperationArea">
        <ctrl-button @click="chooseFile">ファイルを選択</ctrl-button>
        <div class="description">
          {{ file ? file.name : "未選択" }}
        </div>
        <input
          ref="fileChooser"
          type="file"
          style="display: none;"
          accept=".json"
          @input.stop="selectFile"
          @keydown.enter.stop
          @keyup.enter.stop
        />
        <span class="space"></span>
        <ctrl-button @click="doPreview">プレビュー(自分のみ)</ctrl-button>
      </div>
      <div class="tableContainer">
        <table @mousemove="event => moveDev(event)" @mouseup="moveDevEnd">
          <thead>
            <tr>
              <th :style="colStyle(0)">連動</th>
              <divider :index="0" prop="importBGMWindow" />
              <th :style="colStyle(1)">タグ</th>
              <divider :index="1" prop="importBGMWindow" />
              <th :style="colStyle(2)">種別</th>
              <divider :index="2" prop="importBGMWindow" />
              <th :style="colStyle(3)">タイトル</th>
              <divider :index="3" prop="importBGMWindow" />
              <th :style="colStyle(4)">時間</th>
              <divider :index="4" prop="importBGMWindow" />
              <th :style="colStyle(5)">繰</th>
              <divider :index="5" prop="importBGMWindow" />
              <th :style="colStyle(6)">音量</th>
              <divider :index="6" prop="importBGMWindow" />
              <th :style="colStyle(7)">fade</th>
            </tr>
          </thead>
          <tbody>
            <!-- ===============================================================
              コンテンツ
            -->
            <tr
              v-for="bgmObj in bgmList"
              :key="bgmObj.key"
              @click="selectLine(bgmObj.key)"
              @dblclick="playBGM()"
              :class="{ isActive: selectLineKey === bgmObj.key }"
            >
              <td :style="colStyle(0)" :title="linkageStr(bgmObj)">
                {{ bgmObj.chatLinkage > 0 ? "あり" : "なし" }}
              </td>
              <divider :index="0" prop="importBGMWindow" />
              <td :style="colStyle(1)">{{ bgmObj.tag }}</td>
              <divider :index="1" prop="importBGMWindow" />
              <td :style="colStyle(2)">
                <i class="icon-stop2" v-if="!bgmObj.url"></i>
                <i class="icon-youtube2" v-if="isYoutube(bgmObj.url)"></i>
                <i class="icon-dropbox" v-if="isDropBox(bgmObj.url)"></i>
                <i
                  class="icon-file-music"
                  v-if="
                    bgmObj.url &&
                      !isYoutube(bgmObj.url) &&
                      !isDropBox(bgmObj.url)
                  "
                ></i>
              </td>
              <divider :index="2" prop="importBGMWindow" />
              <td :style="colStyle(3)" class="selectable">
                {{ bgmObj.title }}
              </td>
              <divider :index="3" prop="importBGMWindow" />
              <td :style="colStyle(4)">
                {{ bgmObj.url ? convertSecond(bgmObj.start, bgmObj.end) : "-" }}
              </td>
              <divider :index="4" prop="importBGMWindow" />
              <td :style="colStyle(5)">
                <i class="icon-loop" v-if="bgmObj.url && bgmObj.isLoop"></i
                >{{ bgmObj.url && bgmObj.isLoop ? "" : "-" }}
              </td>
              <divider :index="5" prop="importBGMWindow" />
              <td :style="colStyle(6)">
                {{ bgmObj.url ? bgmObj.volume * 100 : "-" }}
              </td>
              <divider :index="6" prop="importBGMWindow" />
              <td :style="colStyle(7)" :title="fadeTitle(bgmObj)">
                {{ bgmObj.url ? fadeStr(bgmObj) : "-" }}
              </td>
            </tr>
            <tr class="space">
              <td :style="colStyle(0)"></td>
              <divider :index="0" prop="importBGMWindow" />
              <td :style="colStyle(1)"></td>
              <divider :index="1" prop="importBGMWindow" />
              <td :style="colStyle(2)"></td>
              <divider :index="2" prop="importBGMWindow" />
              <td :style="colStyle(3)"></td>
              <divider :index="3" prop="importBGMWindow" />
              <td :style="colStyle(4)"></td>
              <divider :index="4" prop="importBGMWindow" />
              <td :style="colStyle(5)"></td>
              <divider :index="5" prop="importBGMWindow" />
              <td :style="colStyle(6)"></td>
              <divider :index="6" prop="importBGMWindow" />
              <td :style="colStyle(7)"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="operateArea">
        <ctrl-button @click="doDelete">削除</ctrl-button>
        <ctrl-button @click="doUp">↑</ctrl-button>
        <ctrl-button @click="doDown">↓</ctrl-button>
        <div class="space"></div>
        <import-type-radio v-model="importType" />
        <ctrl-button @click="doImport">取り込む</ctrl-button>
      </div>
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowFrame from "../WindowFrame.vue";
import WindowMixin from "../WindowMixin.vue";
import Divider from "../parts/Divider.vue";
import CtrlButton from "@/components/parts/CtrlButton.vue";

import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";
import ImportTypeRadio from "@/components/parts/radio/ImportTypeRadio.vue";
import { Watch } from "vue-property-decorator";

@Component({
  components: { ImportTypeRadio, CtrlButton, WindowFrame, Divider }
})
export default class ImportBGMWindow extends Mixins<WindowMixin>(WindowMixin) {
  @Action("setProperty") private setProperty: any;
  @Action("windowOpen") private windowOpen: any;
  @Action("addListObj") private addListObj: any;
  @Action("deleteListObj") private deleteListObj: any;
  @Action("moveListObj") private moveListObj: any;
  @Action("importBgmList") private importBgmList: any;
  @Getter("decrypt") private decrypt: any;

  private bgmList: any[] = [];
  private importType: string = "1";
  private file: File | null = null;

  private chooseFile(this: any): void {
    const fileChooser: HTMLElement = this.$refs.fileChooser;
    fileChooser.click();
  }

  private selectFile(event: any) {
    if (event.target.files.length === 0) return;
    this.file = event.target.files[0];
  }

  @Watch("file")
  private onChangeFile(file: File) {
    this.bgmList = [];
    if (!file) return;

    //FileReaderのインスタンスを作成する
    const reader = new FileReader();

    //ファイルの中身を取得後に処理を行う
    reader.addEventListener("load", () => {
      const text: string = reader.result as string;

      const nameSplit: string[] = file.name.split(".");
      const ext: string = nameSplit[nameSplit.length - 1];
      const reset: Function = () => {
        this.file = null;
        const fileChooser: HTMLInputElement = this.$refs
          .fileChooser as HTMLInputElement;
        fileChooser.value = "";
      };

      if (ext !== "json") {
        reset();
        alert("JSONファイルを指定してください。");
        return;
      }

      let json: any = {};
      try {
        json = JSON.parse(text);
      } catch (err) {
        reset();
        alert("JSONファイルのフォーマットが壊れています。");
        return;
      }
      if (json.saveDataTypeName === "Quoridorn_BGM_01") {
        const regExp = new RegExp(/youtube/);
        json.saveData.forEach((bgm: any) => {
          const url: string = bgm.url;
          if (!regExp.test(url)) bgm.url = this.decrypt({ cipherText: url });
        });
        this.bgmList = json.saveData;
      } else {
        reset();
        alert("ファイルフォーマットが違います。\n（正：Quoridorn_BGM_01）");
      }
    });

    //読み込んだファイルの中身を取得する
    reader.readAsText(file);
  }

  private isYoutube(url: string) {
    return /www\.youtube\.com/.test(url);
  }

  private isDropBox(url: string) {
    return /dropbox/.test(url);
  }

  private initWindow(): void {
    this.setProperty({
      property: "private.display.importBGMWindow.selectLineKey",
      value: null,
      logOff: true
    });
  }

  private doPreview(): void {
    this.playBGM(true);
  }

  private doDelete(): void {
    if (!this.selectLineKey) {
      alert("BGMを選択してください");
      return;
    }
    const index = this.bgmList.findIndex(
      (bgm: any) => bgm.key === this.selectLineKey
    );
    const nextIndex: number =
      index === this.bgmList.length - 1 ? index - 1 : index;
    this.bgmList.splice(index, 1);
    if (nextIndex === -1) return;
    this.selectLine(this.bgmList[nextIndex].key);
  }

  private doUp(): void {
    if (!this.selectLineKey) {
      alert("BGMを選択してください");
      return;
    }
    const index = this.bgmList.findIndex(
      (bgm: any) => bgm.key === this.selectLineKey
    );
    const obj = this.bgmList.splice(index, 1)[0];

    const nextIndex: number = index === 0 ? this.bgmList.length : index - 1;
    this.bgmList.splice(nextIndex, 0, obj);
  }

  private doDown(): void {
    if (!this.selectLineKey) {
      alert("BGMを選択してください");
      return;
    }
    const index = this.bgmList.findIndex(
      (bgm: any) => bgm.key === this.selectLineKey
    );
    const obj = this.bgmList.splice(index, 1)[0];

    const nextIndex: number = index === this.bgmList.length ? 0 : index + 1;
    this.bgmList.splice(nextIndex, 0, obj);
  }

  private doImport(): void {
    this.importBgmList({
      bgmList: this.bgmList,
      addType: this.importType
    }).then(() => {
      this.file = null;
      const fileChooser: HTMLInputElement = this.$refs
        .fileChooser as HTMLInputElement;
      fileChooser.value = "";
    });
  }

  private selectLine(bgmKey: string): void {
    this.setProperty({
      property: "private.display.importBGMWindow.selectLineKey",
      value: bgmKey,
      logOff: true
    });
  }

  private playBGM(isPreview: boolean = false): void {
    const addBgmObj: any = this.bgmList.find(
      (bgmObj: any) => bgmObj.key === this.selectLineKey
    );
    if (!addBgmObj) {
      alert("BGMを選択してください");
      return;
    }
    this.setProperty({
      property: "private.display.jukeboxWindow.command",
      logOff: true,
      isNotice: !isPreview,
      value: { command: "add", payload: addBgmObj }
    });
  }

  private moveDev(event: any): void {
    if (this.movingIndex > -1) {
      const diff = event.clientX - this.startX;
      const afterLeftWidth = this.startLeftWidth + diff;
      const afterRightWidth = this.startRightWidth - diff;
      if (afterLeftWidth >= 10 && afterRightWidth >= 10) {
        const paramObj: any = {};
        paramObj[this.movingIndex] = afterLeftWidth;
        paramObj[this.movingIndex + 1] = afterRightWidth;
        this.setProperty({
          property: "private.display.importBGMWindow.widthList",
          value: paramObj,
          logOff: true
        });
      }
    }
  }

  private moveDevEnd(): void {
    this.setProperty({
      property: "private.display.importBGMWindow",
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

  private get convertSecond(): Function {
    return (start: number, end: number): string => {
      if (start && end) return `${start}〜${end}`;
      if (start) return `${start}〜`;
      if (end) return `〜${end}`;
      return "All";
    };
  }

  /* Start 列幅可変テーブルのプロパティ */
  private get selectLineKey(): string {
    return this.$store.state.private.display.importBGMWindow.selectLineKey;
  }

  private get widthList(): number[] {
    return this.$store.state.private.display.importBGMWindow.widthList;
  }

  private get movingIndex(): number {
    return this.$store.state.private.display.importBGMWindow.movingIndex;
  }

  private get startX(): number {
    return this.$store.state.private.display.importBGMWindow.startX;
  }

  private get startLeftWidth(): number {
    return this.$store.state.private.display.importBGMWindow.startLeftWidth;
  }

  private get startRightWidth(): number {
    return this.$store.state.private.display.importBGMWindow.startRightWidth;
  }

  private get colStyle(): any {
    return (index: number) => ({ width: `${this.widthList[index]}px` });
  }
  /* End 列幅可変テーブルのプロパティ */

  private get fadeStr(): Function {
    return (bgmObj: any): string => {
      if (bgmObj.fadeIn > 0 && bgmObj.fadeOut > 0) return "in/out";
      if (bgmObj.fadeIn > 0 && bgmObj.fadeOut === 0) return "in";
      if (bgmObj.fadeIn === 0 && bgmObj.fadeOut > 0) return "out";
      return "-";
    };
  }

  private get fadeTitle(): Function {
    return (bgmObj: any): string => {
      if (bgmObj.fadeIn > 0 && bgmObj.fadeOut > 0)
        return `in:${bgmObj.fadeIn}\nout:${bgmObj.fadeOut}`;
      if (bgmObj.fadeIn > 0 && bgmObj.fadeOut === 0)
        return `in:${bgmObj.fadeIn}`;
      if (bgmObj.fadeIn === 0 && bgmObj.fadeOut > 0)
        return `out:${bgmObj.fadeOut}`;
      return "-";
    };
  }

  private get linkageStr(): Function {
    return (bgmObj: any): string => {
      if (bgmObj.chatLinkage === 1)
        return `【末尾文字】\n${bgmObj.chatLinkageSearch}`;
      if (bgmObj.chatLinkage === 2)
        return `【正規表現】\n${bgmObj.chatLinkageSearch}`;
      return "なし";
    };
  }
}
</script>

<style scoped lang="scss">
@import "../common.scss";
.contents {
  @include flex-box(column, normal, normal);
  position: absolute;
  height: 100%;
  width: 100%;
  font-size: 12px;

  > div {
    @include flex-box(row, normal, normal);

    > .space {
      display: block;
      flex: 1;
    }
  }
}
button {
  font-size: 10px;
  border-radius: 5px;
  cursor: pointer;
}
.playOperationArea {
  @include flex-box(row, normal, normal);
  margin-bottom: 0.5em;

  .space {
    flex: 1;
  }

  button {
    margin-bottom: 5px;
  }
}
.operateArea {
  @include flex-box(row, center, normal);
  margin-top: 5px;

  > * {
    margin-right: 0.5em;

    &:last-child {
      margin-right: 0;
    }
  }

  > .space {
    flex: 1;
  }
}
/* Start 列幅可変テーブルのCSS */
.tableContainer {
  overflow-y: scroll;
  flex: 1;
  width: 100%;
  height: 216px;
  border: 1px solid rgb(183, 186, 188);
  font-size: 8px;
  box-sizing: border-box;
}
table {
  width: calc(100% - 19px);
  height: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
  background-image: linear-gradient(
    0deg,
    white 0%,
    white 50%,
    rgb(247, 247, 247) 51%,
    rgb(247, 247, 247) 100%
  );
  background-size: 4em 4em;

  td {
    &.dev {
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

    i {
      @include flex-box(row, center, center);
    }
  }

  tr {
    height: 2em;

    &.space {
      height: auto;
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

  tbody {
    height: 100%;

    tr {
      height: 2em;

      &:not(.space) {
        &.isActive {
          background-color: rgb(127, 206, 255) !important;
        }

        &:nth-child(odd):hover {
          background: rgb(178, 225, 255);
        }

        &:nth-child(even):hover {
          background: rgb(178, 225, 255);
        }
      }
    }

    td {
      text-align: center;
    }
  }

  thead {
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
}
/* End 列幅可変テーブルのCSS */
.comment {
  font-size: 10px;
  font-weight: bold;
  color: red;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-file-music {
  font-size: 1.5em;
}
</style>
