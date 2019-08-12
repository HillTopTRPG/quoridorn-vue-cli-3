<template>
  <div id="app">
    <!-- 視点 -->
    <fieldset class="visual-block">
      <legend
        :class="{ open: isViewVisualBlock }"
        @click="onClickLegend('isViewVisualBlock')"
      >
        視点
      </legend>
      <div v-show="isViewVisualBlock">
        <label v-for="player in playerList" :key="player.key"
          >{{ getViewName(player.key)
          }}<input
            type="checkbox"
            @input.stop="
              event => onTargetCheck(player.key, event.target.checked)
            "
            @keydown.enter.stop
            @keyup.enter.stop
        /></label>
      </div>
    </fieldset>

    <!-- 出力形式 -->
    <fieldset class="save-block">
      <legend
        :class="{ open: isViewSaveBlock }"
        @click="onClickLegend('isViewSaveBlock')"
      >
        出力
      </legend>
      <div v-show="isViewSaveBlock">
        <ctrl-button @click="onClickSaveAsDodontofHTML">
          どどんとふHTML
        </ctrl-button>
        <ctrl-button @click="onClickSaveAsDodontofText">
          どどんとふText
        </ctrl-button>
        <ctrl-button @click="onClickSaveAsJson">
          Json
        </ctrl-button>
      </div>
    </fieldset>

    <!----------------
     ! チャットログ
     !--------------->
    <chat-log-viewer
      :tabIndex="0"
      :chatLogList="chatLogList(activeChatTab)"
      :tabList="chatTabList"
      :activeChatTab="activeChatTab"
      :hoverChatTab="hoverChatTab"
      :isVertical="isChatTabVertical"
      :isViewTime="true"
      :isViewTotalTab="true"
      :textFunc="info => info.name"
      @onSelect="chatTabOnSelect"
      @onHover="chatTabOnHover"
      @editTab="tabAddButtonOnClick"
      :colorMap="colorMap"
      style="align-self: stretch;"
    />
  </div>
</template>

<style lang="scss">
@import "./components/common.scss";

html,
body {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  @include flex-box(column, flex-start, normal);
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

fieldset {
  display: inline-block;
  margin-bottom: 0.5em;
  background-color: lightcyan;
  border: 1px solid black;
  padding: 0.5em;
  user-select: none;

  legend {
    background-color: inherit;
    border: 1px solid black;
    cursor: pointer;
    user-select: none;
    padding: 0 0.5em;
    position: relative;

    &.open:after {
      content: "(+)";
    }

    &:after {
      content: "(-)";
    }

    &:hover:before {
      content: "";
      background-color: rgba(0, 0, 0, 0.1);
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
    }
  }

  > div {
    @include inline-flex-box(row, flex-start, normal);
    flex-wrap: wrap;

    > *:not(:first-child) {
      margin-left: 0.5em;
    }
  }
}
</style>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import TabsComponent from "@/components/parts/tab-component/TabsComponent.vue";
import { Action, Getter, Mutation } from "vuex-class";
import ChatLogViewer from "@/components/chat/ChatLogViewer.vue";
import { Watch } from "vue-property-decorator";
import ImportTypeRadio from "@/components/parts/radio/ImportTypeRadio.vue";
import CtrlButton from "@/components/parts/CtrlButton.vue";
import { saveJson, saveHTML, saveText } from "@/components/common/Utility";

@Component({
  components: {
    CtrlButton,
    ImportTypeRadio,
    ChatLogViewer,
    TabsComponent
  }
})
export default class ChatLog extends Vue {
  @Action("onMount") private onMount: any;
  @Mutation("setChatTabVertical") private setChatTabVertical: any;
  @Getter("chatLogs") private chatLogs: any;
  @Getter("chatTabList") private chatTabList: any;
  @Getter("groupTargetTabList") private groupTargetTabList: any;
  @Getter("isChatTabVertical") private isChatTabVertical: any;
  @Getter("getViewName") private getViewName: any;
  @Getter("getObj") private getObj: any;
  @Getter("colorMap") private colorMap: any;
  @Getter("chatLineRegExp") private chatLineRegExp: any;

  private activeChatTab: string = "";
  private hoverChatTab: string = "";
  private targetPlayers: string[] = [];
  private isViewVisualBlock: boolean = true;
  private isViewSaveBlock: boolean = false;

  private mounted() {
    this.onMount();
  }

  private onClickLegend(this: any, target: string) {
    this[target] = !this[target];
  }

  private onTargetCheck(targetKey: string, check: boolean) {
    const index: number = this.targetPlayers.findIndex(
      (targetPlayer: string) => targetPlayer === targetKey
    );
    if (index > -1) {
      this.targetPlayers.splice(index, 1);
    } else {
      this.targetPlayers.push(targetKey);
    }
  }

  @Watch("chatTabList", { immediate: true })
  onChangeChatTabList(chatTabList: any[]) {
    if (!chatTabList) return;
    this.activeChatTab = chatTabList[0].key;
  }

  private chatTabOnSelect(tabKey: string): void {
    this.activeChatTab = tabKey;
  }

  private chatTabOnHover(tabKey: string): void {
    this.hoverChatTab = tabKey;
  }

  private tabAddButtonOnClick(): void {
    alert("未実装");
  }

  private get chatLogList(): Function {
    return (chatTab: string) => {
      const isTargetPlayer: Function = (playerKey: string) =>
        this.targetPlayers.filter(
          (targetPlayer: any) => targetPlayer === playerKey
        )[0];
      const activeChatTab = this.getObj(chatTab);

      return this.chatLogs.filter((log: any) => {
        if (!activeChatTab) return false;
        if (!activeChatTab.isTotal && log.tab !== activeChatTab.key)
          return false;
        if (log.type !== 1) return false;
        if (!log.target) return true;
        if (log.target === "groupTargetTab-0") return true;
        if (isTargetPlayer(log.owner)) return true;
        const kind = log.target.split("-")[0];
        if (kind === "groupTargetTab") {
          const target = this.getObj(log.target);
          if (!target.isSecret) return true;
          if (target.isAll) return true;
          const findIndex = target.group.findIndex((g: string) => {
            const kind = g.split("-")[0];
            if (kind === "player") {
              if (isTargetPlayer(g)) return true;
            } else if (kind === "character") {
              if (isTargetPlayer(this.getObj(g).owner)) return true;
            }
            return false;
          });
          return findIndex > -1;
        } else if (kind === "player") {
          return isTargetPlayer(log.target);
        } else {
          const target = this.getObj(log.target);
          return isTargetPlayer(target.owner);
        }
      });
    };
  }

  private get playerList(): any {
    const actors: any[] = (window as any)!["actors"];
    return actors.filter((actor: any) => actor.key.startsWith("player"));
  }

  private onClickSaveAsDodontofHTML() {
    const replaceFunc: Function = (text: string) =>
      text.replace(this.chatLineRegExp, "").replace(/\[\[quot]]/g, '"');

    saveHTML(
      "html",
      [
        "<?xml version='1.0' encoding='UTF-8'?>",
        "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>",
        "<html xmlns='http://www.w3.org/1999/xhtml' lang='ja'>",
        "<head>",
        "<meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />",
        "<title>チャットログ：null</title>",
        "</head>",
        "<body>",
        this.jsonData
          .map((logObj: any) => {
            const tabName = logObj.isDiceBot ? "" : `[${logObj.tab}]`;
            const targetText =
              logObj.targetName === "全体" ? "" : `＞＞${logObj.targetName}`;
            return [
              tabName,
              `<font color="${logObj.color}">`,
              "<b>",
              logObj.name,
              targetText,
              "</b>",
              "：",
              replaceFunc(logObj.text),
              "</font>",
              "<br>"
            ].join("");
          })
          .join("\n"),
        "</body>",
        "</html>"
      ].join("\n")
    );
  }

  private onClickSaveAsDodontofText() {
    const replaceFunc: Function = (text: string) =>
      text.replace(this.chatLineRegExp, "").replace(/\[\[quot]]/g, '"');

    saveText(
      "text",
      this.jsonData
        .map((logObj: any) => {
          const tabName = logObj.isDiceBot ? "" : `[${logObj.tab}]`;
          const targetText =
            logObj.targetName === "全体" ? "" : `＞＞${logObj.targetName}`;
          return [
            tabName,
            logObj.name,
            targetText,
            "：",
            replaceFunc(logObj.text)
          ].join("");
        })
        .join("\n")
    );
  }

  private onClickSaveAsJson() {
    saveJson("chat-log", this.jsonData);
  }

  private get jsonData(): any {
    const chatLogs: any[] = JSON.parse(
      JSON.stringify(this.chatLogList("chatTab-0"))
    );
    chatLogs.forEach((logObj: any) => {
      // タブの指定
      const tabObj: any = this.chatTabList.filter(
        (tabObj: any) => tabObj.key === logObj.tab
      )[0];
      logObj.tab = tabObj.name;

      // 色
      logObj.color = this.colorMap[logObj.color];

      // 時間
      logObj.time = logObj.processTime;
      delete logObj.processTime;

      // from
      const fromActor: any = this.getObj(logObj.from);
      logObj.from = fromActor ? fromActor.name : logObj.from;

      // owner
      const ownerPlayer: any = this.getObj(logObj.owner);
      logObj.owner = ownerPlayer ? ownerPlayer.name : logObj.owner;

      // target
      const targetObj = this.getObj(logObj.target);
      logObj.isSecret = targetObj.isSecret;
      logObj.targetName = targetObj.name;
      logObj.isAllTarget = targetObj.isAll;
      logObj.target = targetObj.group.map((t: any) => {
        const actor: any = this.getObj(t);
        return actor ? actor.name : t;
      });
    });
    return chatLogs;
  }
}
</script>
