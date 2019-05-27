<template>
  <window-frame titleText="チャットタブ設定画面" display-property="private.display.settingChatTabWindow" align="center" fixSize="320, 432" @open="initWindow" @reset="initWindow">
    <div class="contents" @contextmenu.prevent>
      <draggable v-model="tabs">
        <template v-for="(tab, index) in tabs">
          <label :key="tab.key">
            <span v-if="tab.key === 'chatTab-0'">{{tab.name}}</span>
            <input v-if="tab.key !== 'chatTab-0'" type="text" v-model="tab.name">
            <ctrl-button v-if="tab.key !== 'chatTab-0'" @click="delTab(tab.key, index)">削除</ctrl-button>
          </label>
        </template>
      </draggable>
      <ctrl-button @click="addTab">追加</ctrl-button>
      <label>タブを斜めにする<input type="checkbox" v-model="isTabVertical"></label>
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

  private tabs: any[] = [];
  private addIndex: number = -1;
  private delTabs: string[] = [];
  private isTabVertical: boolean = false;

  private initWindow() {
    this.tabs = this.chatTabs.concat();
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
    this.delTabs.forEach((key: string) => this.deleteChatTab(key));
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
          order: index
        });
      }
    });
    this.setProperty({
      property: "public.chat.tab.isVertical",
      value: this.isTabVertical,
      isNotice: true,
      logOff: true
    });
    this.windowClose("private.display.settingChatTabWindow");
  }

  private cancel() {
    this.windowClose("private.display.settingChatTabWindow");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
