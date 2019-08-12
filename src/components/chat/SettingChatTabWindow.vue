<template>
  <window-frame
    titleText="チャットタブ設定画面"
    display-property="private.display.settingChatTabWindow"
    align="center"
    fixSize="320, 432"
    @open="open"
    @reset="open"
  >
    <div class="contents" @contextmenu.prevent>
      <draggable v-model="tabs">
        <template v-for="(tab, index) in tabs">
          <label :key="tab.key">
            <span v-if="tab.key === 'chatTab-1'">{{ tab.name }}</span>
            <input
              v-if="tab.key !== 'chatTab-1'"
              type="text"
              v-model="tab.name"
              @keydown.enter.stop
              @keyup.enter.stop
            />
            <ctrl-button
              v-if="tab.key !== 'chatTab-1'"
              @click="delTab(tab.key, index)"
            >
              削除
            </ctrl-button>
          </label>
        </template>
      </draggable>
      <ctrl-button @click="addTab" ref="button">追加</ctrl-button>
      <label>
        タブを斜めにする<input
          type="checkbox"
          v-model="isTabVertical"
          @keydown.enter.stop
          @keyup.enter.stop
        />
      </label>
      <label>
        時間を表示する<input
          type="checkbox"
          v-model="isLogViewTime"
          @keydown.enter.stop
          @keyup.enter.stop
        />
      </label>
      <label>
        統合タブを表示する<input
          type="checkbox"
          v-model="isLogViewAllTab"
          @keydown.enter.stop
          @keyup.enter.stop
        />
      </label>
      <div class="operateArea">
        <ctrl-button @click="commit">変更</ctrl-button>
        <ctrl-button @click="cancel">キャンセル</ctrl-button>
      </div>
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowFrame from "../WindowFrame.vue";
import WindowMixin from "../WindowMixin.vue";
import draggable from "vuedraggable";
import CtrlButton from "@/components/parts/CtrlButton.vue";

import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: {
    CtrlButton,
    WindowFrame,
    draggable
  }
})
export default class SettingChatTabWindow extends Mixins<WindowMixin>(
  WindowMixin
) {
  @Action("setProperty") private setProperty: any;
  @Action("windowClose") private windowClose: any;
  @Action("addChatTab") private addChatTab: any;
  @Action("updateChatTab") private updateChatTab: any;
  @Action("deleteChatTab") private deleteChatTab: any;
  @Getter("chatTabs") private chatTabs: any;
  @Getter("isChatTabVertical") private isChatTabVertical: any;
  @Getter("isViewTime") private isViewTime: any;
  @Getter("isViewTotalTab") private isViewTotalTab: any;

  private tabs: any[] = [];
  private addIndex: number = -1;
  private delTabs: string[] = [];
  private isTabVertical: boolean = false;
  private isLogViewTime: boolean = false;
  private isLogViewAllTab: boolean = false;

  private open() {
    this.tabs = this.chatTabs.filter((tab: any) => !tab.isTotal).concat();
    this.delTabs = [];
    this.isTabVertical = this.isChatTabVertical;
    this.isLogViewTime = this.isViewTime;
    this.isLogViewAllTab = this.isViewTotalTab;

    const button: CtrlButton = this.$refs.button as CtrlButton;
    button.requestFocus();
  }

  private addTab() {
    const key = `chatTabAdd-${++this.addIndex}`;
    this.tabs.push({
      key: key,
      name: ""
    });
  }

  private delTab(key: string, index: number) {
    this.tabs.splice(index, 1);
    if (!key.startsWith("chatTabAdd")) {
      this.delTabs.push(key);
    }
  }

  private commit() {
    this.delTabs.forEach((key: string) => this.deleteChatTab({ key }));
    this.tabs.forEach((tab: any, index: number) => {
      if (tab.key.startsWith("chatTabAdd")) {
        this.addChatTab({
          name: tab.name,
          order: index
        });
      } else {
        this.updateChatTab({
          key: tab.key,
          name: tab.name,
          order: index + 1
        });
      }
    });
    this.setProperty({
      property: "public.chat.tab",
      value: {
        isChatTabVertical: this.isTabVertical,
        isViewTime: this.isLogViewTime,
        isViewTotalTab: this.isLogViewAllTab
      },
      isNotice: true,
      logOff: true
    });
    this.delTabs = [];
    this.windowClose("private.display.settingChatTabWindow");
  }

  private cancel() {
    this.delTabs = [];
    this.windowClose("private.display.settingChatTabWindow");
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
</style>
