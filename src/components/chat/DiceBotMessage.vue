<template>
  <div
    class="diceBotMessageText"
    :class="[animationClass, colorClass]"
    v-if="isView"
    v-html="viewMessage"
    title="閉じる"
    @click="onClick"
  ></div>
</template>

<script lang="ts">
import Vue from "vue";

import { Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";
import DiceBotSelect from "../parts/select/DiceBotSelect.vue";

@Component({ components: {} })
export default class DiceBotMessage extends Vue {
  @Action("setProperty") private setProperty: any;
  @Getter("diceBotMessageText") private diceBotMessageText: any;
  @Getter("diceBotMessageView") private diceBotMessageView: any;

  private animationClass: string = "";
  private isView: boolean = false;
  private colorClass: string = "";

  /**
   * メッセージの文言に「成功」「失敗」が含まれていたら、背景の色を変える仕様
   * @param diceBotMessageText
   */
  @Watch("diceBotMessageText", { immediate: true })
  private onChangeCustomDiceBotMessage(diceBotMessageText: string) {
    let successCount: number =
      diceBotMessageText.split(/成功|[Ss]uccess/).length - 1;
    let failureCount: number =
      diceBotMessageText.split(/失敗|[Ff]ailure/).length - 1;
    if (successCount > failureCount) this.colorClass = "success";
    else if (successCount < failureCount) this.colorClass = "failure";
    else this.colorClass = "normal";
  }

  private onClick() {
    this.setProperty({
      property: `public.chat.diceBotMessage`,
      value: {
        // message: "",
        isView: false
      },
      isNotice: true,
      logOff: true
    });
  }

  private get viewMessage() {
    return this.diceBotMessageText
      .split("。")
      .map((lineStr: string) => {
        const sepList = lineStr.split("、");
        for (let i = 0; i < sepList.length; i++) {
          if (
            i < sepList.length - 1 &&
            sepList[i].length + sepList[i + 1].length < 25
          ) {
            sepList[i] += "、" + sepList.splice(i + 1, 1)[0];
            i--;
          }
        }
        return sepList.join("、<br />");
      })
      .join("。<br />");
  }

  private timer: any = null;

  /**
   * 「表示」「非表示」の際に「フェードイン」「フェードアウト」する仕様
   * @param diceBotMessageView
   */
  @Watch("diceBotMessageView", { immediate: true })
  private onChangeCustomDiceBotView(diceBotMessageView: boolean) {
    if (diceBotMessageView) {
      this.animationClass = "fade-in";
      this.isView = true;

      this.timer = setTimeout(() => {
        this.setProperty({
          property: `public.chat.diceBotMessage.isView`,
          value: false,
          isNotice: false,
          logOff: true
        });
      }, 5000);
    } else {
      if (this.timer !== null) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.animationClass = "fade-out";
      setTimeout(() => {
        this.isView = false;
      }, 200);
    }
  }
}
</script>

<style scoped lang="scss">
@import "../common";

.diceBotMessageText {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999999;
  background-color: yellow;
  border: 1px solid black;
  font-size: 22px;
  border-radius: 0.5em;
  padding: 0 2em;
  max-width: 100%;
  overflow-wrap: break-word;
  box-sizing: border-box;
  /*white-space: normal;*/

  &.normal {
    background-color: #5dd8d8;
  }

  &.success {
    background-color: #5bd762;
  }

  &.failure {
    background-color: #d60c31;
  }
}

.fade-in {
  animation-name: fade-in;
  animation-duration: 200ms;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

.fade-out {
  animation-name: fade-out;
  animation-duration: 200ms;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
