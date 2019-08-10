<template>
  <div class="chat-log-container">
    <!----------------
     ! タブ
     !--------------->
    <tabs-component
      :tabIndex="0"
      :tabList="useTabList"
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
        <span v-if="activeChatTab === 'chatTab-0'"
          >[{{ getViewName(chatLog.tab) }}]
        </span>
        <span :style="{ color: `var(--${chatLog.color}, #000)` }">
          <b>{{ chatLog.name }}</b
          ><span v-if="chatLog.target !== 'groupTargetTab-0'"
            >＞＞<b>{{ getViewName(chatLog.target) }}</b></span
          >：<span v-html="transText(chatLog.text)"></span></span
        ><span class="time" v-if="isViewTime">{{
          getTime(chatLog.processTime)
        }}</span>
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
import moment from "moment";

@Component({
  components: { TabsComponent }
})
export default class ChatLogViewer extends Vue {
  @Getter("getViewName") private getViewName: any;
  @Getter("chatLineRegExp") private chatLineRegExp: any;
  @Getter("borderStyleRegExp") private borderStyleRegExp: any;
  @Getter("chatStyleRegExp") private chatStyleRegExp: any;

  @Prop({ type: Array, required: true })
  private tabList!: any[];

  private get useTabList() {
    if (this.isViewTotalTab) return this.tabList;
    return this.tabList.filter((tab: any) => !tab.isTotal);
  }

  @Prop({ type: String, required: true })
  private activeChatTab!: string;

  @Prop({ type: String, required: true })
  private hoverChatTab!: string;

  @Prop({ type: Boolean, required: true })
  private isVertical!: boolean;

  @Prop({ type: Boolean, required: true })
  private isViewTime!: boolean;

  @Prop({ type: Boolean, required: true })
  private isViewTotalTab!: boolean;

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

    const matchInfoList: any[] = [];
    let matchResult = null;
    while ((matchResult = this.chatLineRegExp.exec(text)) !== null) {
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
      const textDecoration: string[] = [];
      let rubyText: string = "";
      let matchResult = null;
      while ((matchResult = this.chatStyleRegExp.exec(styleStr)) !== null) {
        if (matchResult[1] === "c") style.push(`color: ${matchResult[2]}`);
        if (matchResult[1] === "bc")
          style.push(`background-color: ${matchResult[2]}`);
        if (matchResult[3] === "u" || matchResult[3] === "o") {
          const lineObj: any = {
            type: matchResult[3] === "u" ? "underline" : "overline",
            style: "",
            color: ""
          };
          const setFunc: Function = (str: string): void => {
            if (str) {
              if (this.borderStyleRegExp.test(str)) lineObj.style = ` ${str}`;
              else lineObj.color = ` ${str}`;
            }
          };
          setFunc(matchResult[4]);
          setFunc(matchResult[5]);

          textDecoration.push(
            `${lineObj.type}${lineObj.style}${lineObj.color}`
          );
        }
        if (matchResult[6] === "b") style.push("font-weight: bold");
        if (matchResult[7] === "i") style.push("font-style: italic");
        if (matchResult[8] === "lt") textDecoration.push("line-through");
        if (matchResult[9] === "r") rubyText = matchResult[10];
      }
      if (textDecoration.length) {
        style.push(`text-decoration: ${textDecoration.join(" ")}`);
      }

      const styleText: string = style.join(";");
      const styleAttrStr: string = styleText ? ` style="${styleText};"` : "";
      let contentsText: string = contentsStr;
      if (rubyText) {
        contentsText = `<ruby><rb${styleAttrStr}>${contentsText}</rb><rp>（</rp><rt${styleAttrStr}>${rubyText}</rt><rp>）</rp></ruby>`;
      } else {
        if (styleText) {
          contentsText = `<span${styleAttrStr}>${contentsText}</span>`;
        }
      }
      resultTexts.push(contentsText);
    }
    return resultTexts.join("");
  }

  private getTime(timeNum: number) {
    return timeNum
      ? moment(String(timeNum), "YYYYMMDDHHmmss").format("HH:mm:ss")
      : "";
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
  @include flex-box(column, stretch, flex-start);
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

  li {
    @include flex-box(row, flex-start, center);
    min-height: 1.5em;

    > * {
      display: block;
    }

    .time {
      flex: 1;
      @include flex-box(row, flex-end, center);
    }
  }

  rt {
    font-size: 80%;
  }
}
</style>
