<template>
  <div class="tabs dep" @contextmenu.prevent>
    <!-- タブ -->
    <div
      class="tab"
      v-for="(tabObj, index) in tabList"
      :key="tabObj.name"
      :tabindex="index + 1"
      :class="getTabClasses(tabObj)"
    >
      <div
        class="corner-container"
        v-if="isChatTabIsVertical"
      >
        <div
          class="corner"
          @mousedown.prevent="chatTabOnSelect(tabObj.key)"
          @mouseenter.prevent="chatTabOnHover(tabObj.key)"
          @mouseleave.prevent="chatTabOnHover('')"
        ></div>
      </div>

      <div
        class="text"
        @mousedown.prevent="chatTabOnSelect(tabObj.key)"
        @mouseenter.prevent="chatTabOnHover(tabObj.key)"
        @mouseleave.prevent="chatTabOnHover('')"
      ><span>#{{tabObj.name}}/{{tabObj.unRead}}</span></div>
    </div>

    <!-- タブ設定ボタン -->
    <span
      class="tab addButton"
      @click="tabAddButtonOnClick"
      :tabindex="chatTabs.length + 1"
    ><span class="icon-cog"></span></span>
  </div>
</template>

<script lang="ts">
import { Emit, Prop, Vue, Watch } from "vue-property-decorator";
import { Action, Getter, Mutation } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({ components: {} })
export default class ChatWindow extends Vue {
  @Prop({ type: Array, required: true })
  private tabList!: any[];

  @Prop({ type: String, required: true })
  private activeChatTab!: string;

  @Prop({ type: String, required: true })
  private hoverChatTab!: string;

  @Action("chatTabSelect") private chatTabSelect: any;
  @Action("setProperty") private setProperty: any;
  @Action("windowOpen") private windowOpen: any;
  @Getter("chatTabs") private chatTabs: any;
  @Getter("isChatTabIsVertical") private isChatTabIsVertical: any;

  /**
   * チャットログ表示タブを選択されたときの挙動
   * @param key タブのkey
   */
  @Emit("onSelect")
  private chatTabOnSelect(key: string): void {
    this.setProperty({
      property: "chat.activeChatTab",
      value: key,
      logOff: true
    });
    this.chatTabSelect(key);
  }

  /**
   * チャットログ表示タブをホバーされたときの挙動
   * @param key タブのkey
   */
  @Emit("onHover")
  private chatTabOnHover(key: string): void {
    this.hoverChatTab = key;
  }

  /**
   * チャットタブ追加ボタンクリックイベントハンドラ
   */
  private tabAddButtonOnClick(): void {
    this.windowOpen("private.display.settingChatTabWindow");
  }

  private getTabClasses(tabObj: any, index: number) {
    return {
      active: tabObj.key === this.activeChatTab,
      hover: tabObj.key === this.hoverChatTab,
      unRead: tabObj.unRead > 0,
      vertical: this.isChatTabIsVertical,
      isLast: index === this.chatTabs.length - 1
    };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../common";
$background-gradient: linear-gradient(
  to bottom,
  rgba(240, 240, 240, 1),
  rgba(200, 200, 200, 1)
);

$hover-border-color: #0092ed;

.tabs {
  display: flex;
  align-items: flex-end;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: -1px;

  .tab {
    @include inline-flex-box(row, flex-start, flex-end);
    outline: none;
    overflow: visible;
    margin-right: -1px;

    .corner-container {
      @include flex-box(row, center, center);
      position: absolute;
      width: calc(2.82em - 1px);
      height: 1.41em;
      /*border-bottom: solid 1px gray;*/
      z-index: 7;
      overflow: hidden;

      .corner {
        transform: translateY(calc(0.7em + 1px)) rotate(-45deg);
        background: $background-gradient;
        transform-origin: center;
        width: 2em;
        height: 2em;
        min-height: 1px;
        border-top: 1px solid gray;
        box-sizing: content-box;
        cursor: pointer;
      }
    }

    .text {
      @include flex-box(row, flex-start, center);
      /*position: absolute;*/
      border-radius: 5px 5px 0 0;
      padding: 0 0.5em;
      z-index: 8;
      height: calc(2em - 1px);
      background: $background-gradient;
      box-sizing: content-box;
      cursor: pointer;
      border: 1px solid gray;
      border-bottom-width: 0;
    }

    &.vertical {
      width: calc(2.82em);
      margin-right: 0;

      .text {
        border-radius: 0 5px 0 0;
        border-left-width: 0;
        border-bottom-width: 0;
        margin-top: 2.5em;
        transform: translateX(2.82em) translateX(-1px) rotate(-45deg);
        transform-origin: left bottom;
        flex: 1;
        width: 5em;
        padding: 0;

        > * {
          margin-left: -0.7em;
          min-width: 5em;
          padding-right: 0.5em;
          overflow: hidden;
        }
      }

      &.hover {
        .text {
          border-bottom-width: 1px;
          transform: translateX(2.82em) translateX(-1px) rotate(-45deg)
            translateY(1px);
        }
      }

      &.isLast .text {
        border-bottom-width: 1px;
        transform: translateX(2.82em) translateX(-1px) rotate(-45deg)
          translateY(1px);
      }
    }

    &.unRead {
      background-color: yellow;
    }

    &.hover {
      .corner-container .corner,
      .text {
        border-color: $hover-border-color;
      }

      .text {
        z-index: 9;
        width: auto;
      }
    }

    &.active {
      .corner-container .corner,
      .text {
        background: white none;
      }

      .corner-container {
        z-index: 11;
      }

      .text {
        z-index: 12;
      }
    }

    &.addButton {
      position: absolute;
      right: 1px;
      cursor: pointer;
      z-index: 20;
    }
  }
}
</style>
