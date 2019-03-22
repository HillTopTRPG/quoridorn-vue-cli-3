<template>
  <window-frame titleText="チャットタブ設定画面" display-property="private.display.settingChatTabWindow" align="center" fixSize="320, 432" @open="initWindow" @reset="initWindow">
    <div class="contents" @contextmenu.prevent>
      <draggable v-model="tabs">
        <template v-for="(tab, index) in tabs">
          <label :key="tab.key">
            <span v-if="tab.key === 'chatTab-0'">{{tab.name}}</span>
            <input v-if="tab.key !== 'chatTab-0'" type="text" v-model="tab.name">
            <button v-if="tab.key !== 'chatTab-0'" type="button" @click="delTab(tab.key, index)">削除</button>
          </label>
        </template>
      </draggable>
      <button type="button" @click="addTab">追加</button>
      <div class="operateArea">
        <button type="button" @click="commit">変更</button>
        <button type="button" @click="cancel">キャンセル</button>
      </div>
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowFrame from "../WindowFrame.vue";
import WindowMixin from "../WindowMixin.vue";
import draggable from "vuedraggable";

import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: {
    WindowFrame,
    draggable
  }
})
export default class SettingChatTabWindow extends Mixins<WindowMixin>(
  WindowMixin
) {
  @Action("windowClose") private windowClose: any;
  @Action("addChatTab") private addChatTab: any;
  @Action("updateChatTab") private updateChatTab: any;
  @Action("deleteChatTab") private deleteChatTab: any;
  @Getter("chatTabs") private chatTabs: any;

  private tabs: any[] = [];
  private addIndex: number = -1;
  private delTabs: string[] = [];

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
    this.windowClose("private.display.settingChatTabWindow");
  }

  private cancel() {
    this.windowClose("private.display.settingChatTabWindow");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
}
label input {
  flex: 1;
  margin-left: 5px;
}
.operateArea {
  margin-top: 5px;
  text-align: center;
}
</style>
