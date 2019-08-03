<template>
  <div id="app">
    <!-- 視点 -->
    <fieldset class="imageAreaSettings">
      <legend>視点</legend>
      <div>
        <label v-for="player in playerList" :key="player.key"
          >{{ getViewName(player.key)
          }}<input
            type="checkbox"
            @input="event => onTargetCheck(player.key, event.target.checked)"
        /></label>
      </div>
    </fieldset>

    <!----------------
     ! チャットログ
     !--------------->
    <chat-log-viewer
      :tabIndex="0"
      :tabList="chatTabList"
      :activeChatTab="activeChatTab"
      :hoverChatTab="hoverChatTab"
      :isVertical="isChatTabVertical"
      :textFunc="info => info.name"
      @onSelect="chatTabOnSelect"
      @onHover="chatTabOnHover"
      @editTab="tabAddButtonOnClick"
      :chatLogList="chatLogList"
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
  text-align: center;
  color: #2c3e50;
  @include flex-box(column, flex-start, normal);
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.imageAreaSettings {
  display: inline-block;
  margin-bottom: 0.5em;

  > div {
    @include inline-flex-box(column, flex-start, normal);
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

@Component({
  components: {
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

  private activeChatTab: string = "";
  private hoverChatTab: string = "";
  private targetPlayers: string[] = [];

  private mounted() {
    this.onMount();
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

  private get chatLogList(): any {
    const isTargetPlayer: Function = (playerKey: string) =>
      this.targetPlayers.filter(
        (targetPlayer: any) => targetPlayer === playerKey
      )[0];

    return this.chatLogs[this.activeChatTab].filter((log: any) => {
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
  }

  private get playerList(): any {
    const actors: any[] = (window as any)!["actors"];
    return actors.filter((actor: any) => actor.key.startsWith("player"));
  }

  /*
  private get actors(): any[] {
    return (window as any)!["actors"];
  }
  */
}
</script>
