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
          <label>
            出力先
            <chat-tab-select v-model="sendTab" />
          </label>
          <ctrl-button @click="edit(actor)">編集</ctrl-button>
          <div class="spacer"></div>
          <ctrl-button @click="doExport(actor)">セーブ</ctrl-button>
          <ctrl-button @click="doImport(actor)">ロード</ctrl-button>
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
import ChatTabSelect from "@/components/parts/select/ChatTabSelect.vue";

@Component({
  components: {
    ChatTabSelect,
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
  private sendTab: string = "";

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
      tab: this.sendTab ? this.sendTab : undefined,
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
  private edit(actor: any) {
    this.setProperty({
      property: "private.display.editChatPaletteWindow.objKey",
      value: actor.key,
      logOff: true
    }).then(() => {
      this.windowOpen("private.display.editChatPaletteWindow");
    });
  }

  /**
   * チャットパレットをセーブする
   * @param actor
   */
  private doExport(actor: any) {
    window.console.log("doExport");
    const data = {
      saveData: {
        lines: actor.chatPalette.list
      },
      saveDataTypeName: "Quoridorn_ChatPalette01"
    };
    const blob = new Blob([JSON.stringify(data, null, "  ")], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.download = `チャットパレット_${actor.name}.json`;
    anchor.href = url;
    anchor.click();
  }

  /**
   * チャットパレットをロードする
   * @param actor
   */
  private doImport(actor: any) {
    this.setProperty({
      property: "private.display.importChatPaletteWindow.objKey",
      value: actor.key,
      logOff: true
    }).then(() => {
      this.windowOpen("private.display.importChatPaletteWindow");
    });
  }
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

  .operationLine {
    @include flex-box(row, center, stretch);
    padding-right: 0.5em;
    margin-top: 0.5em;

    > * {
      margin-left: 0.5em;
    }

    .spacer {
      flex: 1;
    }
  }

  .chat-palette-frame {
    @include flex-box(column, stretch, center);
    position: relative;
    flex: 1;

    > *:not(.chat-palette) {
      font-size: 12px;
    }

    ul.chat-palette {
      @include flex-box(column, stretch, center);
      position: relative;
      list-style: none;
      padding: 0;
      margin: 0.5em 0;
      background-color: white;
      border-top: solid 1px #777;
      border-bottom: solid 1px #777;
      flex: 1;
      max-width: 327px;
      overflow: auto;

      li {
        @include inline-flex-box(row, flex-start, center);
        height: 2em;
        min-height: 2em;

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
