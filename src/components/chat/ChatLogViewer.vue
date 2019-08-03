<template>
  <div class="chat-log-container">
    <!----------------
     ! タブ
     !--------------->
    <tabs-component
      :tabIndex="0"
      :tabList="tabList"
      :activeChatTab="activeChatTab"
      :hoverChatTab="hoverChatTab"
      :isVertical="isVertical"
      :textFunc="textFunc"
      @onSelect="onSelect"
      @onHover="onHover"
      @editTab="editTab"
    />

    <!----------------
     ! チャットログ
     !--------------->
    <ul id="chatLog" class="selectable" @wheel.stop>
      <li v-for="(chatLog, index) in chatLogList" :key="index">
        <span :style="{ color: `var(--${chatLog.color}, #000)` }">
          <b>{{ chatLog.name }}</b
          ><span v-if="chatLog.target !== 'groupTargetTab-0'"
            >＞＞<b>{{ getViewName(chatLog.target) }}</b></span
          >：<span v-html="transText(chatLog.text)"></span
        ></span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import { Emit, Prop, Watch } from "vue-property-decorator";
import { Component } from "vue-mixin-decorator";
import TabsComponent from "@/components/parts/tab-component/TabsComponent.vue";
import { Getter } from "vuex-class";

@Component({
  components: { TabsComponent }
})
export default class ChatLogViewer extends Vue {
  @Getter("getViewName") private getViewName: any;

  @Prop({ type: Array, required: true })
  private tabList!: any[];

  @Prop({ type: String, required: true })
  private activeChatTab!: string;

  @Prop({ type: String, required: true })
  private hoverChatTab!: string;

  @Prop({ type: Boolean, required: true })
  private isVertical!: boolean;

  @Prop({ type: Number, required: true })
  private tabIndex!: number;

  @Prop({ type: Function, required: true })
  private textFunc!: Function;

  @Prop({ type: Array, required: true })
  private chatLogList!: any[];

  @Prop({ type: Object, required: true })
  private colorMap!: any;

  /**
   * チャットログ表示タブを選択されたときの挙動
   * @param key タブのkey
   */
  @Emit("onSelect")
  private onSelect(key: string): void {}

  /**
   * チャットログ表示タブをホバーされたときの挙動
   * @param key タブのkey
   */
  @Emit("onHover")
  private onHover(key: string): void {}

  /**
   * チャットタブ追加ボタンクリックイベントハンドラ
   */
  @Emit("editTab")
  private editTab(): void {}

  @Watch("colorMap", { immediate: true, deep: true })
  private onChangeColorMap(colorMap: any) {
    for (const colorKey in colorMap) {
      if (!colorMap.hasOwnProperty(colorKey)) continue;
      document.documentElement.style.setProperty(
        `--${colorKey}`,
        colorMap[colorKey]
      );
    }
  }

  private transText(text: string) {
    text = text.replace(/\[\[quot]]/g, '"');

    const regExp: RegExp = new RegExp(/(\[\[style([: #0-9a-zA-Z]*)]])/g);
    const styleExp: RegExp = new RegExp(
      /(?:: *)(rgba?\([0-9, .]+\)|#[0-9a-fA-F]+|b|i|[a-zA-Z]+)/g
    );

    const matchInfoList: any[] = [];
    let matchResult = null;
    while ((matchResult = regExp.exec(text)) !== null) {
      // window.console.log(matchResult);
      const styleStr = matchResult[1];
      const startIndex = matchResult.index;
      const contentsIndex = matchResult.index + matchResult[0].length;
      matchInfoList.push({
        styleStr,
        startIndex,
        contentsIndex
      });
    }

    if (!matchInfoList.length) return text;

    matchInfoList.push({ startIndex: text.length });

    const resultTexts: string[] = [];
    resultTexts.push(text.substring(0, matchInfoList[0].startIndex));
    for (let i = 0; i < matchInfoList.length - 1; i++) {
      const styleStr: string = matchInfoList[i]!.styleStr;
      const startIndex: number = matchInfoList[i]!.contentsIndex;
      const endIndex: number = matchInfoList[i + 1]!.startIndex;
      const contentsStr = text.substring(startIndex, endIndex);

      const style: string[] = [];
      let matchResult = null;
      while ((matchResult = styleExp.exec(styleStr)) !== null) {
        switch (matchResult[1]) {
          case "i":
            style.push("font-style: italic");
            break;
          case "b":
            style.push("font-weight: bold");
            break;
          default:
            style.push(`color: ${matchResult[1]}`);
        }
      }

      resultTexts.push(
        styleStr
          ? `<span style="${style.join(";")};">${contentsStr}</span>`
          : contentsStr
      );
    }
    return resultTexts.join("");
  }
}
</script>

<style scoped lang="scss">
@import "../common";

.chat-log-container {
  @include flex-box(column, normal, normal);
  position: relative;
  flex: 1;
}

#chatLog {
  @include flex-box(column, flex-start, flex-start);
  background-color: white;
  flex: 1;
  -moz-box-flex: 1;
  -webkit-box-flex: 1;
  border: 1px solid gray;
  overflow-y: scroll;
  overflow-x: auto;
  margin: 0;
  padding-left: 2px;
  list-style: none;
  min-height: 70px;
  position: relative;
  z-index: 10;
  white-space: normal;
  word-break: break-all;
}
</style>
