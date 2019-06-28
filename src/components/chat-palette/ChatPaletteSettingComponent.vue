<template>
  <div class="chat-palette-setting-component">
    <actor-tab-component @change="changeActor" :optionTabInfo="[]">
      <div slot="option" slot-scope="{ option }" v-if="option">
        {{ option }}
      </div>
      <div
        class="chat-palette-frame"
        slot="actor"
        slot-scope="{ actor }"
        v-if="actor"
      >
        <label class="sendLine">
          <input type="text" v-model="chatTemporarily" />
          <ctrl-button @click="sendLine(actor, null)">送信</ctrl-button>
        </label>

        <label class="operationLine">
          <ctrl-button @click="edit(actor)">編集</ctrl-button>
          <ctrl-button @click="exportData(actor)">セーブ</ctrl-button>
          <ctrl-button @click="importData(actor)">ロード</ctrl-button>
        </label>

        <ul class="chat-palette">
          <li
            v-for="(chatPaletteLine, index) in actor.chatPalette.list"
            :key="index"
            @dblclick="sendLine(actor, chatPaletteLine)"
            @click="selectLine(actor, index)"
            :class="{ isActive: selectedIndex === index }"
          >
            {{ chatPaletteLine }}
          </li>
          <li
            class="space"
            :class="{
              isOdd: actor.chatPalette.list.length % 2,
              isEven: !(actor.chatPalette.list.length % 2)
            }"
          ></li>
        </ul>
      </div>
    </actor-tab-component>
  </div>
</template>

<script lang="ts">
import WindowMixin from "../WindowMixin.vue";
import ActorTabComponent from "@/components/parts/tab-component/ActorTabComponent.vue";
import CtrlButton from "@/components/parts/CtrlButton.vue";

import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: {
    CtrlButton,
    ActorTabComponent
  }
})
export default class ChatPaletteSettingWindow extends Mixins<WindowMixin>(
  WindowMixin
) {
  @Action("addChatLog") private addChatLog: any;
  @Action("windowOpen") private windowOpen: any;
  @Action("setProperty") private setProperty: any;
  @Getter("getViewName") private getViewName: any;
  @Getter("getObj") private getObj: any;

  private actorKey: string = "";
  private chatTemporarily: string = "";
  private selectedIndex: number = -1;

  private changeActor(actorKey: string): void {
    this.actorKey = actorKey;
  }

  /**
   * チャットパレットの１行が送信された時の挙動
   * @param actor
   * @param text
   */
  private sendLine(actor: any, text: string | undefined) {
    if (!text) {
      text = this.chatTemporarily;
    }
    this.addChatLog({
      name: this.getViewName(actor.key),
      text,
      actorKey: actor.key,
      owner: actor.key
    });
    this.chatTemporarily = "";
  }

  /**
   * チャットパレットの１行が選択された時の挙動
   * @param actor
   * @param index
   */
  private selectLine(actor: any, index: number) {
    this.chatTemporarily = actor.chatPalette.list[index];
    this.selectedIndex = index;
  }

  /**
   * チャットパレットを編集する
   * @param actor
   */
  private edit(actor: any) {}

  /**
   * チャットパレットをセーブする
   * @param actor
   */
  private exportData(actor: any) {}

  /**
   * チャットパレットをロードする
   * @param actor
   */
  private importData(actor: any) {}
}
</script>

<style scoped lang="scss">
@import "../common.scss";

.chat-palette-setting-component {
  position: relative;
  @include flex-box(column, stretch, stretch);

  .sendLine {
    @include flex-box(row, center, stretch);
    padding: 0.5em 0.5em 0 0.5em;
    height: 2em;

    input {
      flex: 1;
      margin-right: 0.5em;
    }
  }

  .chat-palette-frame {
    @include flex-box(column, stretch, center);
    flex: 1;

    ul {
      @include flex-box(column, stretch, center);
      list-style: none;
      padding: 0;
      margin: 0.5em 0;
      background-color: white;
      border-top: solid 1px #777;
      border-bottom: solid 1px #777;
      flex: 1;

      li {
        @include flex-box(row, flex-start, center);
        height: 2em;

        &:not(.space) {
          &:nth-child(even) {
            background-color: rgb(247, 247, 247);
          }

          &:hover {
            background-color: #b2e1fe;
          }

          &.isActive {
            background-color: #7ecefd;
          }
        }
      }

      li.space {
        flex: 1;
        width: 100%;

        &.isOdd {
          background-image: linear-gradient(
            0deg,
            white 0%,
            white 50%,
            rgb(247, 247, 247) 51%,
            rgb(247, 247, 247) 100%
          );
          background-size: 4em 4em;
        }
        &.isEven {
          background-image: linear-gradient(
            0deg,
            rgb(247, 247, 247) 0%,
            rgb(247, 247, 247) 50%,
            white 51%,
            white 100%
          );
          background-size: 4em 4em;
        }
      }
    }
  }
}
</style>
