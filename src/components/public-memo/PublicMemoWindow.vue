<template>
  <window-frame
    titleText="共有メモ"
    display-property="private.display.publicMemoWindow"
    align="center"
    baseSize="300, 240"
    @open="initWindow"
    @reset="initWindow"
  >
    <div class="contents">

      <button @click="changeMode">test button</button>

      <!-- タブ -->
      <div class="tabs">
        <span
          v-for="(tabObj, index) in usePublicMemoTabList"
          :key="index"
          class="tab"
          :class="{ active: index === currentTabIndex }"
          @click.prevent="tabOnClick(index)"
        >{{tabObj.tabName}}</span>
        <span
          class="tab addButton"
          @click="addButtonOnClick"
          v-if="isEditMode"
        >＋</span>
      </div>

      <!-- 表裏タブ -->
      <div class="tabs surface">
        <span
          class="tab surface"
          :class="{ active: isFront }"
          @click.prevent="surfaceTabOnClick(true)"
        >表</span>
        <span
          class="tab surface"
          :class="{ active: !isFront }"
          @click.prevent="surfaceTabOnClick(false)"
        >裏</span>
      </div>

      <!-- タブ内容 -->

      <!-- 表面 -->
      <surface-component
        class="tabContents front"
        :surface="usePublicMemoTabList[currentTabIndex].front"
        :isEditMode="isEditMode"
        @openItemMenu="surfaceItemConfigOnOpen"
        @closeItemMenu="surfaceItemConfigOnClose"
        @openImageMenu="surfaceImageConfigOnOpen"
        @closeImageMenu="surfaceImageConfigOnClose"
        v-if="isFront"
        ref="frontSurface"
      />

      <!-- 裏面 -->
      <surface-component
        class="tabContents back"
        :surface="usePublicMemoTabList[currentTabIndex].back"
        :isEditMode="isEditMode"
        @openItemMenu="surfaceItemConfigOnOpen"
        @closeItemMenu="surfaceItemConfigOnClose"
        @openImageMenu="surfaceImageConfigOnOpen"
        @closeImageMenu="surfaceImageConfigOnClose"
        v-if="!isFront"
        ref="backSurface"
      />

    </div>

    <!-- 項目操作メニュー -->
    <div
      class="hover-menu"
      v-if="hoverMenuItemIndex >= 0 && hoverMenuImageIndex === -1"
      :style="{ top: hoverMenuY + 'px', left: hoverMenuX + 'px' }"
      @mouseleave="surfaceItemConfigOnClose"
    >
      <div @click.stop="insertTitleItemOnClick">上にタイトルを追加<span class="icon-plus"></span></div>
      <div @click.stop="insertSubTitleItemOnClick">上にサブタイトルを追加<span class="icon-plus"></span></div>
      <div @click.stop="insertTextItemOnClick">上にテキストを追加<span class="icon-plus"></span></div>
      <div @click.stop="insertHrItemOnClick">上に区切り線を追加<span class="icon-plus"></span></div>
      <div @click.stop="insertImageFrameItemOnClick">上に画像ブロックを追加<span class="icon-plus"></span></div>
      <div @click.stop="deleteItemOnClick">削除<span class="icon-cross"></span></div>
    </div>

    <!-- 画像操作メニュー -->
    <div
      class="hover-menu"
      v-if="hoverMenuItemIndex >= 0 && hoverMenuImageIndex >= 0"
      :style="{ top: hoverMenuY + 'px', left: hoverMenuX + 'px' }"
      @mouseleave="surfaceImageConfigOnClose"
    >
      <div @click.stop="insertImageOnClick">左に画像を追加<span class="icon-plus"></span></div>
      <div @click.stop="deleteImageOnClick" :class="{ disabled: !imageDeletable }">削除<span class="icon-cross"></span></div>
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowFrame from "../WindowFrame.vue";
import WindowMixin from "../WindowMixin.vue";
import SurfaceComponent from "@/components/public-memo/SurfaceComponent.vue";

import { Vue, Watch } from "vue-property-decorator";
import { Action, Getter, Mutation } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({ components: { WindowFrame, SurfaceComponent } })
export default class PublicMemoWindow extends Mixins<WindowMixin>(WindowMixin) {
  @Action("windowOpen") windowOpen: any;
  @Action("setProperty") setProperty: any;
  @Getter("publicMemo") publicMemo: any;
  @Getter("playerKey") playerKey: any;

  private currentTabIndex: number = 0;
  private isFront: boolean = true;
  private hoverMenuItemIndex: number = -1;
  private hoverMenuImageIndex: number = -1;
  private imageDeletable: boolean = true;
  private hoverMenuX: number = -1;
  private hoverMenuY: number = -1;

  private initWindow() {
    this.currentTabIndex = 0;
  }

  private changeMode() {
    this.setProperty({
      property: "private.display.publicMemoWindow.isEditMode",
      value: !this.isEditMode
    });
  }

  private addButtonOnClick() {
    // TODO
  }

  /**
   * 項目設定メニューを開く
   */
  private surfaceItemConfigOnOpen(
    index: number,
    hoverMenuX: number,
    hoverMenuY: number
  ) {
    this.hoverMenuItemIndex = index;
    this.hoverMenuImageIndex = -1;
    this.hoverMenuX = hoverMenuX;
    this.hoverMenuY = hoverMenuY;
  }

  /**
   * 画像設定メニューを開く
   */
  private surfaceImageConfigOnOpen(
    itemIndex: number,
    imageIndex: number,
    imageListSize: number,
    hoverMenuX: number,
    hoverMenuY: number
  ) {
    this.hoverMenuItemIndex = itemIndex;
    this.hoverMenuImageIndex = imageIndex;
    this.hoverMenuX = hoverMenuX;
    this.hoverMenuY = hoverMenuY;
    this.imageDeletable = imageListSize > 1;
  }

  /**
   * 項目設定メニューを閉じる
   */
  private surfaceItemConfigOnClose() {
    this.hoverMenuItemIndex = -1;
    this.hoverMenuImageIndex = -1;
  }

  /**
   * 画像設定メニューを閉じる
   */
  private surfaceImageConfigOnClose() {
    this.hoverMenuItemIndex = -1;
    this.hoverMenuImageIndex = -1;
  }

  private get surfaceElm(): SurfaceComponent {
    return (this.isFront
      ? this.$refs.frontSurface
      : this.$refs.backSurface) as SurfaceComponent;
  }

  /**
   * タイトル追加が押下された時
   */
  private insertTitleItemOnClick() {
    this.surfaceElm.insertTitleItem(this.hoverMenuItemIndex);
  }

  /**
   * サブタイトル追加が押下された時
   */
  private insertSubTitleItemOnClick() {
    this.surfaceElm.insertSubTitleItem(this.hoverMenuItemIndex);
  }

  /**
   * テキスト追加が押下された時
   */
  private insertTextItemOnClick() {
    this.surfaceElm.insertTextItem(this.hoverMenuItemIndex);
  }

  /**
   * 区切り線追加が押下された時
   */
  private insertHrItemOnClick() {
    this.surfaceElm.insertHrItem(this.hoverMenuItemIndex);
  }

  /**
   * 画像フレーム追加が押下された時
   */
  private insertImageFrameItemOnClick() {
    this.surfaceElm.insertImageFrameItem(this.hoverMenuItemIndex);
  }

  /**
   * 項目削除が押下された時
   */
  private deleteItemOnClick() {
    this.surfaceElm.deleteItem(this.hoverMenuItemIndex);
  }

  /**
   * 画像追加が押下された時
   */
  private insertImageOnClick() {
    this.surfaceElm.insertImage(
      this.hoverMenuItemIndex,
      this.hoverMenuImageIndex
    );
  }

  /**
   * 画像削除が押下された時
   */
  private deleteImageOnClick() {
    if (!this.imageDeletable) return;
    this.surfaceElm.deleteImage(
      this.hoverMenuItemIndex,
      this.hoverMenuImageIndex
    );
  }

  /**
   * タブが押下された時
   * @param index
   */
  private tabOnClick(index: number) {
    this.currentTabIndex = index;
  }

  /**
   * 表裏タブが押下された時
   * @param isFront
   */
  private surfaceTabOnClick(isFront: boolean) {
    this.isFront = isFront;
  }

  /**
   * 使うタブのリスト
   */
  private get usePublicMemoTabList(): any[] {
    return this.publicMemo.list.filter(
      (publicMemo: any) => publicMemo.key === this.objKey
    )[0].tabList;
  }

  private get objKey(): string {
    return this.$store.state.private.display.publicMemoWindow.objKey;
  }

  private get isEditMode(): boolean {
    return this.$store.state.private.display.publicMemoWindow.isEditMode;
  }

  private get usePublicMemoList() {
    return this.publicMemo.list
      .map((publicMemo: any) => JSON.parse(JSON.stringify(publicMemo)))
      .map((publicMemo: any) => {
        publicMemo.tabList = publicMemo.tabList
          .map((tab: any) => {
            const getSurface: Function = (surfaceName: string): any => {
              const surfaceTarget = tab[surfaceName].targetList;
              return surfaceTarget.length === 0 ||
                surfaceTarget.indexOf(this.playerKey)
                ? tab[surfaceName]
                : null;
            };
            tab["front"] = getSurface("front");
            tab["back"] = getSurface("back");
            return tab;
          })
          .filter((tab: any) => tab.front || tab.back);
        return publicMemo;
      })
      .filter((publicMemo: any) => publicMemo.tabList.length);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../common.scss";

.contents {
  @include flex-box(column);
  height: 100%;
}

.hover-menu {
  position: absolute;
  z-index: 999999;
  background-color: white;
  border: solid 1px black;
  transform: translateY(-50%);

  > * {
    position: relative;
    padding-right: 1.5em;

    &:hover {
      background-color: lightblue;
    }

    > span[class^="icon-"] {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      font-size: 10px;
      padding: 0.1em;
      border: 1px solid black;
      border-radius: 50%;
      height: 10px;

      &.icon-cross {
        color: red;
        border-color: red;
      }

      &.icon-plus {
        color: blue;
        border-color: blue;
      }
    }
  }

  > .disabled {
    background-color: lightgrey;
  }
}

.tabs {
  @include flex-box();
  margin-bottom: -1px;
  width: 100%;

  &.surface {
    border: 1px solid gray;
    /*border-bottom-width: 0;*/
  }
}

.tab {
  @include flex-box(row, center, center);
  position: relative;
  height: 2em;
  font-size: 10px;
  background: linear-gradient(rgba(240, 240, 240, 1), rgba(0, 0, 0, 0.2));
  padding: 0 0.5em;
  border: 1px solid gray;
  border-bottom-width: 0;
  border-radius: 5px 5px 0 0;
  margin-right: -1px;
  z-index: 10;
  white-space: nowrap;
  cursor: pointer;

  &.surface {
    @include flex-box(row, center, center);
    flex: 1;
    background: white none 1px top;
    border-width: 0;
    border-bottom-width: 1px;
    border-radius: 0;
    margin: 0;
    padding-bottom: 2px;

    &.active {
      border-bottom: 3px solid #0092ed;
      font-weight: bold;
      padding-bottom: 0;
    }

    &:hover {
      background-color: lightyellow;
    }
  }

  &:not(.surface) {
    &:first-child {
      margin-left: 1em;
    }

    &.active,
    &:active {
      background: white none;
    }

    &:hover {
      border-color: #0092ed;
      z-index: 100;
    }
  }

  &.addButton {
    margin-left: 100px;
    cursor: pointer;
  }
}
</style>
