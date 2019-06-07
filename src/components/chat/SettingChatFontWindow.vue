<template>
  <window-frame
    titleText="チャットフォント設定画面"
    display-property="private.display.settingChatFontWindow"
    align="center"
    fixSize="320, 132"
    @open="initWindow"
    @reset="initWindow"
  >
    <div class="contents" @contextmenu.prevent>
      <div>この画面の操作は即時反映されます。</div>
      <label v-if="members.length === 0">
        文字色
        <input
          type="color"
          :value="fontColor"
          @change="event => changePrivateFontColor(event)"
        />
      </label>
      <label v-if="members.length === 0">
        過去ログ反映<input type="checkbox" v-model="historyChange" />
      </label>
      <fieldset
        class="memberArea"
        v-for="member in members"
        :key="member.peerId"
      >
        <legend>
          {{ getObj(member.playerKey).name || `(${member.peerId})` }}
        </legend>
        <div>
          <label>
            文字色
            <input
              type="color"
              :value="member.color"
              @change="event => changePeerFontColor(member.peerId, event)"
            />
          </label>
          <label>過去ログ反映<input type="checkbox" value="false"/></label>
        </div>
      </fieldset>
      <div class="operateArea">
        <ctrl-button @click="cancel">閉じる</ctrl-button>
      </div>
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowFrame from "../WindowFrame.vue";
import WindowMixin from "../WindowMixin.vue";
import CtrlButton from "@/components/parts/CtrlButton.vue";

import { Action, Getter, Mutation } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: {
    CtrlButton,
    WindowFrame
  }
})
export default class SettingChatFontWindow extends Mixins<WindowMixin>(
  WindowMixin
) {
  @Action("windowClose") private windowClose: any;
  @Action("setProperty") private setProperty: any;
  @Getter("getObj") private getObj: any;
  @Getter("fontColor") private fontColor: any;

  private historyChange: boolean = false;

  private initWindow() {
    this.historyChange = false;
  }

  private changePrivateFontColor(event: any) {
    const color: string = event.target.value;
    const historyChange: boolean =
      event.target.parentNode.nextElementSibling.firstElementChild["checked"];
    this.setProperty({
      property: `private.self.color`,
      value: color,
      isNotice: false
    });
    this.historyChange = historyChange;
    this.doHistoryChange(color);
  }
  private changePeerFontColor(peerId: string, event: any) {
    const color: string = event.target.value;
    const historyChange: boolean =
      event.target.parentNode.nextElementSibling.firstElementChild["checked"];
    const matchMember: any = this.members.filter(
      (member: any) => member.peerId === peerId
    )[0];
    if (!matchMember) return;
    const index: number = this.members.indexOf(matchMember);
    this.setProperty({
      property: `public.room.members.${index}.color`,
      value: color,
      isNotice: true
    });
    this.setProperty({
      property: `private.self.color`,
      value: color,
      isNotice: false
    });
    this.historyChange = historyChange;
    this.doHistoryChange(color, peerId);
  }

  private doHistoryChange(color: string, peerId: string | null = null) {
    if (!this.historyChange) return;
    const change: any = {};
    for (const tab in this.chatLogs) {
      if (!this.chatLogs.hasOwnProperty(tab)) continue;
      const changeTab: any = {};
      change[tab] = changeTab;
      this.chatLogs[tab].forEach((log: any, index: number) => {
        if (log.peerId !== peerId) return;
        changeTab[index] = {
          viewHtml: log.viewHtml.replace(
            /^(<span style="color: )([^;]+)(;">)/,
            `$1${color}$3`
          )
        };
      });
    }
    this.setProperty({
      property: `public.chat.logs`,
      value: change,
      isNotice: true
    });
  }

  private cancel() {
    this.windowClose("private.display.settingChatFontWindow");
  }

  private get members() {
    return this.$store.state.public.room.members;
  }

  private get chatLogs() {
    return this.$store.state.public.chat.logs;
  }
}
</script>

<style scoped lang="scss">
.contents {
  position: absolute;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  font-size: 12px;
}
label {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-top: 5px;

  input[type="color"] {
    width: 30px;
    margin-left: 5px;
  }
}
.operateArea {
  margin-top: 5px;
  text-align: center;
}
</style>
