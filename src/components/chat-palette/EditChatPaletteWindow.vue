<template>
  <window-frame
    titleText="チャットパレット編集画面"
    display-property="private.display.editChatPaletteWindow"
    align="center"
    fixSize="338, 540"
    :fontSizeBar="true"
    @open="open"
    @reset="open"
  >
    <div class="contents">
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

@Component({
  components: {
    CtrlButton,
    WindowFrame
  }
})
export default class EditChatPaletteWindow extends Mixins<WindowMixin>(
  WindowMixin
) {
  @Action("changeListObj") private changeListObj: any;
  @Action("windowClose") private windowClose: any;
  @Getter("getObj") private getObj: any;

  private text: string = "";

  /**
   * 画面が開いた時の挙動
   */
  private open() {
    this.text = this.chatPaletteText;
  }

  private commit() {
    this.changeListObj({
      key: this.objKey,
      chatPalette: {
        list: this.text.split("\n")
      }
    });
    this.windowClose("private.display.editChatPaletteWindow");
    this.text = "";
  }

  private cancel() {
    this.windowClose("private.display.editChatPaletteWindow");
  }

  private get chatPaletteText(): string {
    const character = this.character;
    return character ? character.chatPalette.list.join("\n") : "";
  }

  private get character() {
    return this.getObj(this.objKey);
  }

  private get objKey() {
    return this.$store.state.private.display["editChatPaletteWindow"].objKey;
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
  }

  .operationLine {
    margin-top: 0.5em;
    font-size: 12px;

    > *:not(:first-child) {
      margin-left: 0.5em;
    }
  }
}
</style>
