<template>
  <window-frame
    titleText="共有メモ"
    display-property="private.display.publicMemoWindow"
    align="center"
    baseSize="350, 310"
    @open="initWindow"
    @reset="initWindow"
    :fontSizeBar="true"
  >
    <div class="contents">
      <div class="title" v-if="usePublicMemoObj">
        <span v-if="!isEditMode || isPreview">{{usePublicMemoObj.title}}</span>
        <textarea v-model="usePublicMemoObj.title" v-if="isEditMode && !isPreview" @input="textareaOnInput" placeholder="タイトル"></textarea>
      </div>

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
          v-if="isEditMode && !isPreview"
        >＋</span>
      </div>

      <!-- 表裏タブ -->
      <div
        class="tabs surface"
        v-if="isEditMode && !isPreview || usePublicMemoTabObj && usePublicMemoTabObj.back.contentsList.length"
      >
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
      <surface-component
        class="tabContents"
        :class="{ front: isFront, back: !isFront }"
        :surface="useSurfaceObj"
        :isEditMode="isEditMode && !isPreview"
        @open-item-menu="surfaceItemConfigOnOpen"
        @open-last-menu="surfaceLastConfigOnOpen"
        @open-image-menu="surfaceImageConfigOnOpen"
        v-if="usePublicMemoTabObj"
        ref="surfaceElm"
      />

      <div class="operationArea" v-if="isEditMode">
        <button @click="commitButtonOnClick">確定</button>
        <button @click="previewButtonOnClick" v-if="!isPreview">プレビュー確認</button>
        <button @click="editButtonOnClick" v-if="isPreview">編集に戻る</button>
        <button @click="cancelButtonOnClick">キャンセル</button>
      </div>

    </div>

    <!-- 項目操作メニュー -->
    <div
      class="hover-menu"
      v-if="hoverMenuItemIndex >= 0 && hoverMenuImageIndex === -1"
      :style="{ top: hoverMenuY + 'px', left: hoverMenuX + 'px' }"
      @mouseleave="configOnClose"
    >
      <div @click.stop="insertTitleItemOnClick">上に大見出しを追加</div>
      <div @click.stop="insertSubTitleItemOnClick">上に小見出しを追加</div>
      <div @click.stop="insertTextItemOnClick">上にテキストを追加</div>
      <div @click.stop="insertHrItemOnClick">上に区切り線を追加</div>
      <div @click.stop="insertImageFrameItemOnClick">上に画像ブロックを追加</div>
      <div @click.stop="deleteItemOnClick">削除</div>
    </div>

    <!-- 末尾操作メニュー -->
    <div
      class="hover-menu"
      v-if="hoverMenuItemIndex === -2 && hoverMenuImageIndex === -1"
      :style="{ top: hoverMenuY + 'px', left: hoverMenuX + 'px' }"
      @mouseleave="configOnClose"
    >
      <div @click.stop="insertTitleItemOnClick">大見出しを追加</div>
      <div @click.stop="insertSubTitleItemOnClick">小見出しを追加</div>
      <div @click.stop="insertTextItemOnClick">テキストを追加</div>
      <div @click.stop="insertHrItemOnClick">区切り線を追加</div>
      <div @click.stop="insertImageFrameItemOnClick">画像ブロックを追加</div>
    </div>

    <!-- 画像操作メニュー -->
    <div
      class="hover-menu"
      v-if="hoverMenuItemIndex >= 0 && hoverMenuImageIndex >= 0"
      :style="{ top: hoverMenuY + 'px', left: hoverMenuX + 'px' }"
      @mouseleave="configOnClose"
    >
      <div @click.stop="insertImageOnClick">左に画像を追加</div>
      <div @click.stop="deleteImageOnClick" :class="{ disabled: !imageDeletable }">削除</div>
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowFrame from "../WindowFrame.vue";
import WindowMixin from "../WindowMixin.vue";
import SurfaceComponent from "@/components/public-memo/SurfaceComponent.vue";

import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({ components: { WindowFrame, SurfaceComponent } })
export default class PublicMemoWindow extends Mixins<WindowMixin>(WindowMixin) {
  @Action("windowOpen") windowOpen: any;
  @Action("setProperty") setProperty: any;
  @Action("changeListObj") changeListObj: any;
  @Action("changePublicMemoObj") changePublicMemoObj: any;
  @Action("windowClose") windowClose: any;
  @Getter("publicMemo") publicMemo: any;
  @Getter("playerKey") playerKey: any;

  private currentTabIndex: number = 0;
  private isFront: boolean = true;
  private hoverMenuItemIndex: number = -1;
  private hoverMenuImageIndex: number = -1;
  private imageDeletable: boolean = true;
  private hoverMenuX: number = -1;
  private hoverMenuY: number = -1;
  private isPreview: boolean = false;
  private editingPublicMemoData: any = null;

  private initWindow() {
    this.currentTabIndex = 0;
    this.isFront = true;
    this.hoverMenuItemIndex = -1;
    this.hoverMenuImageIndex = -1;
    this.imageDeletable = true;
    this.hoverMenuX = -1;
    this.hoverMenuY = -1;
    this.isPreview = false;
    this.editingPublicMemoData = null;
    setTimeout(() => {
      this.editingPublicMemoData = JSON.parse(
        JSON.stringify(this.publicMemoObj)
      );
    });
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

  private addButtonOnClick() {
    // TODO
  }

  private commitButtonOnClick() {
    // ルームメイトにも反映する
    const tabList: any = {};
    tabList[this.currentTabIndex] = this.usePublicMemoTabObj;
    this.changeListObj({
      key: this.objKey,
      title: this.usePublicMemoObj.title,
      tabList
    });
    // this.changePublicMemoObj(this.usePublicMemoObj);

    // 画面を閉じる
    this.windowClose("private.display.publicMemoWindow");
  }

  private previewButtonOnClick() {
    this.isPreview = true;
  }

  private editButtonOnClick() {
    this.isPreview = false;
  }

  private cancelButtonOnClick() {
    this.windowClose("private.display.publicMemoWindow");
  }

  /**
   * テキストエリアに入力される度に、必要に応じてテキストエリアの表示サイズを拡張する
   */
  private textareaOnInput(event: any) {
    const textarea: HTMLTextAreaElement = event.target as HTMLTextAreaElement;
    if (textarea.scrollHeight > textarea.offsetHeight) {
      textarea.style.height = textarea.scrollHeight + "px";
    }
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

  private surfaceLastConfigOnOpen(hoverMenuX: number, hoverMenuY: number) {
    this.hoverMenuItemIndex = -2;
    this.hoverMenuImageIndex = -1;
    this.hoverMenuX = hoverMenuX;
    this.hoverMenuY = hoverMenuY;
  }

  /**
   * 設定メニューを閉じる
   */
  private configOnClose() {
    this.hoverMenuItemIndex = -1;
    this.hoverMenuImageIndex = -1;
  }

  private get surfaceElm(): SurfaceComponent {
    return this.$refs.surfaceElm as SurfaceComponent;
  }

  /**
   * タイトル追加が押下された時
   */
  private insertTitleItemOnClick() {
    this.insertContents({
      kind: "title",
      text: "大見出し"
    });
  }

  /**
   * サブタイトル追加が押下された時
   */
  private insertSubTitleItemOnClick() {
    this.insertContents({
      kind: "sub-title",
      text: "小見出し"
    });
  }

  /**
   * テキスト追加が押下された時
   */
  private insertTextItemOnClick() {
    this.insertContents({
      kind: "text",
      text: "テキスト"
    });
  }

  /**
   * 区切り線追加が押下された時
   */
  private insertHrItemOnClick() {
    this.insertContents({
      kind: "separator"
    });
  }

  /**
   * 画像フレーム追加が押下された時
   */
  private insertImageFrameItemOnClick() {
    this.insertContents({
      kind: "images",
      imageKeyList: [{ key: "image-0", tag: "(全て)" }]
    });
  }

  private insertContents(insertObj: any) {
    window.console.log(
      "insertContents",
      this.hoverMenuItemIndex,
      insertObj,
      this.useSurfaceObj.contentsList
    );
    const contentsList: any[] = this.useSurfaceObj.contentsList;
    if (this.hoverMenuItemIndex === -2) {
      contentsList.push(insertObj);
    } else {
      contentsList.splice(this.hoverMenuItemIndex, 0, insertObj);
    }
    this.configOnClose();
  }

  /**
   * 項目削除が押下された時
   */
  private deleteItemOnClick() {
    const contentsList: any[] = this.useSurfaceObj.contentsList;
    contentsList.splice(this.hoverMenuItemIndex, 1);
    this.configOnClose();
  }

  /**
   * 画像追加が押下された時
   */
  private insertImageOnClick() {
    this.useSurfaceObj.contentsList[
      this.hoverMenuItemIndex
    ].imageKeyList.splice(this.hoverMenuImageIndex, 0, {
      key: "image-0",
      tag: "(全て)"
    });
    this.configOnClose();
  }

  /**
   * 画像削除が押下された時
   */
  private deleteImageOnClick() {
    if (!this.imageDeletable) return;
    this.useSurfaceObj.contentsList[
      this.hoverMenuItemIndex
    ].imageKeyList.splice(this.hoverMenuImageIndex, 1);
    this.configOnClose();
  }

  private get isEditMode(): boolean {
    window.console.log(
      "get isEditMode",
      this.$store.state.private.display.publicMemoWindow.isEditMode
    );
    return this.$store.state.private.display.publicMemoWindow.isEditMode;
  }

  private get objKey(): string {
    return this.$store.state.private.display.publicMemoWindow.objKey;
  }

  /**
   * 共有メモデータ
   */
  private get publicMemoObj(): any {
    return this.publicMemo.list.filter(
      (publicMemo: any) => publicMemo.key === this.objKey
    )[0];
  }

  private get usePublicMemoObj(): any {
    window.console.log("usePublicMemoObj", this.isEditMode);
    return this.isEditMode ? this.editingPublicMemoData : this.publicMemoObj;
  }

  /**
   * 使うタブのリスト
   */
  private get usePublicMemoTabList(): any[] {
    return this.usePublicMemoObj ? this.usePublicMemoObj.tabList : [];
  }

  private get usePublicMemoTabObj(): any {
    return this.usePublicMemoTabList[this.currentTabIndex];
  }

  private get useSurfaceObj(): any {
    window.console.log("useSurfaceObj", this.isEditMode);
    const usePublicMemoObj: any = this.isEditMode
      ? this.editingPublicMemoData
      : this.publicMemoObj;
    if (!usePublicMemoObj) return null;
    if (!usePublicMemoObj.tabList[this.currentTabIndex]) return null;
    return this.isFront
      ? usePublicMemoObj.tabList[this.currentTabIndex].front
      : usePublicMemoObj.tabList[this.currentTabIndex].back;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../common.scss";

.contents {
  @include flex-box(column);
  height: 100%;

  > .operationArea {
    @include flex-box(row, center, center);
    margin-top: 0.5rem;
    width: 100%;

    > button:not(:first-child) {
      margin-left: 0.5em;
    }

    > button:last-child {
      margin-left: auto;
    }
  }

  > .title {
    font-size: 150%;
    @include flex-box(column, center);
    width: 100%;

    > span {
      position: relative;
      padding: 0.25rem 1rem;
      border-left: solid 1px gray;
      border-right: solid 1px #333;

      &:before,
      &:after {
        content: "";
        position: absolute;
        width: calc(100% - 0.25rem);
      }

      &:before {
        top: 0.2rem;
        left: -0.5rem;
        height: 1px;
        background-color: gray;
      }

      &:after {
        bottom: 0.2rem;
        right: -0.5rem;
        height: 2px;
        background-color: #333;
      }
    }
    margin-bottom: 0.2rem;
  }
}

.hover-menu {
  position: absolute;
  z-index: 999999;
  background-color: white;
  border: solid 1px black;
  transform: translateY(-50%);

  > * {
    padding: 0.2em 0.5em;

    &:hover {
      background-color: lightblue;
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
    border-bottom-width: 0;
  }
}

.tab {
  @include flex-box(row, center, center);
  position: relative;
  height: 2em;
  font-size: 11px;
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
    font-size: 13px;

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
