<template>
  <window-frame
    titleText="チャットパレット読み込み画面"
    display-property="private.display.importChatPaletteWindow"
    align="center"
    fixSize="348, 540"
    @open="open"
    @reset="open"
  >
    <div class="contents">
      <label class="operationLine">
        <ctrl-button @click="chooseFile">ファイルを選択</ctrl-button>
        <div class="description">
          {{ file ? file.name : "未選択" }}
        </div>
        <input
          ref="fileChooser"
          type="file"
          style="display: none;"
          accept=".json,.cpd,.txt"
          @change="selectFile"
        />
      </label>

      <textarea v-model="text"></textarea>

      <label class="operationLine">
        <ctrl-button @click="commit()">確定</ctrl-button>
        <ctrl-button @click="cancel()">キャンセル</ctrl-button>
      </label>
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowFrame from "../WindowFrame.vue";
import WindowMixin from "../WindowMixin.vue";
import ChatPaletteSettingComponent from "@/components/chat-palette/ChatPaletteSettingComponent.vue";

import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";
import CtrlButton from "@/components/parts/CtrlButton.vue";
import { Watch } from "vue-property-decorator";

@Component({
  components: {
    CtrlButton,
    WindowFrame
  }
})
export default class ImportChatPaletteWindow extends Mixins<WindowMixin>(
  WindowMixin
) {
  @Action("changeListObj") private changeListObj: any;
  @Action("windowClose") private windowClose: any;
  @Getter("getObj") private getObj: any;

  private file: File | null = null;
  private text: string = "";

  /**
   * 画面が開いた時の挙動
   */
  private open() {
    this.file = null;
    this.text = "";
  }

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
    if (!file) return;

    //FileReaderのインスタンスを作成する
    const reader = new FileReader();

    //ファイルの中身を取得後に処理を行う
    reader.addEventListener("load", () => {
      const text: string = reader.result as string;

      const nameSplit: string[] = file.name.split(".");
      const ext: string = nameSplit[nameSplit.length - 1];

      if (ext === "txt") {
        this.text = text;
        return;
      }

      const json = JSON.parse(text);
      if (
        ext === "json" &&
        json.saveDataTypeName === "Quoridorn_ChatPalette01"
      ) {
        this.text = json.saveData.lines.join("\n");
      }

      if (ext === "cpd" && json.saveDataTypeName === "ChatPalette2") {
        this.text = json.saveData.tabInfos
          .map((info: any) => info.lines.join("\n"))
          .join("\n==========\n\n");
      }
    });

    //読み込んだファイルの中身を取得する
    reader.readAsText(file);
  }

  private commit() {
    this.changeListObj({
      key: this.objKey,
      chatPalette: {
        list: this.text.split("\n")
      }
    });
    this.windowClose("private.display.importChatPaletteWindow");
    this.text = "";
  }

  private cancel() {
    this.windowClose("private.display.importChatPaletteWindow");
  }

  private get character() {
    return this.getObj(this.objKey);
  }

  private get objKey() {
    return this.$store.state.private.display["importChatPaletteWindow"].objKey;
  }
}
</script>

<style scoped lang="scss">
@import "../common.scss";

.contents {
  @include flex-box(column, center, center);
  position: absolute;
  height: 100%;
  width: 100%;

  textarea {
    align-self: stretch;
    flex: 1;
    resize: none;
    font-size: inherit;
    line-height: calc(2em);
    background-image: linear-gradient(
      0deg,
      white 0%,
      white 50%,
      rgb(247, 247, 247) 51%,
      rgb(247, 247, 247) 100%
    );
    background-size: 100% calc(4em - 0px);
    background-origin: content-box;
    background-clip: content-box;
    background-attachment: local;
    white-space: nowrap;
  }

  .operationLine {
    @include flex-box(row, center, center);
    margin-top: 0.5em;
    font-size: 12px;

    > *:not(:first-child) {
      margin-left: 0.5em;
    }
  }
}
</style>
