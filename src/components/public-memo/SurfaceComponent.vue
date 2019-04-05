<template>
  <div
    class="surfaceComponent"
    :class="{ disabled: !isViewableSurface() }"
  >
    <!-- 閲覧権限がない場合 -->
    {{!isViewableSurface() ? "あなたにこの面は開示されていません。" : ""}}

    <!-- 閲覧権限がある場合 -->
    <template v-if="isViewableSurface()">
      <template v-for="(contents, itemIndex) in surface.contentsList">
        <!-- タイトル -->
        <div
          v-if="contents.kind === 'title'"
          class="item title selectable"
          :key="`contents-${itemIndex}`"
        >
          <span v-html="contents.text.replace('\n', '<br>')" v-if="!isEditMode"></span>
          <textarea v-model="contents.text" v-if="isEditMode" @input="textareaOnInput"></textarea>
          <span
            class="item-config icon-cog"
            @click="event => itemConfigOnClick(event, itemIndex)"
            v-if="isEditMode"
          ></span>
        </div>

        <!-- サブタイトル -->
        <div
          v-if="contents.kind === 'sub-title'"
          class="item sub-title selectable"
          :key="`contents-${itemIndex}`"
        >
          <span v-html="contents.text.replace('\n', '<br>')" v-if="!isEditMode"></span>
          <textarea v-model="contents.text" v-if="isEditMode" @input="textareaOnInput"></textarea>
          <span
            class="item-config icon-cog"
            @click="event => itemConfigOnClick(event, itemIndex)"
            v-if="isEditMode"
          ></span>
        </div>

        <!-- テキスト -->
        <div
          v-if="contents.kind === 'text'"
          class="item text selectable"
          :key="`contents-${itemIndex}`"
        >
          <span v-html="contents.text.replace('\n', '<br>')" v-if="!isEditMode"></span>
          <textarea v-model="contents.text" v-if="isEditMode" @input="textareaOnInput"></textarea>
          <span
            class="item-config icon-cog"
            @click="event => itemConfigOnClick(event, itemIndex)"
            v-if="isEditMode"
          ></span>
        </div>

        <!-- 区切り線 -->
        <div
          v-if="contents.kind === 'separator'"
          class="item"
          :key="`contents-${itemIndex}`"
          style="display: flex;"
        >
          <hr>
          <span
            class="item-config icon-cog"
            @click="event => itemConfigOnClick(event, itemIndex)"
            v-if="isEditMode"
          ></span>
        </div>

        <!-- 画像 -->
        <div
          v-if="contents.kind === 'images'"
          class="item imageContainer"
          :key="`contents-${itemIndex}`"
        >
          <div
            v-for="(imageObj, imageIndex) in contents.imageKeyList"
            :key="`image-${imageIndex}`"
            class="imageFrame"
            @click="imageFrameOnClick(imageObj.key, itemIndex, imageIndex)"
          >
            <img
              v-if="getObj(imageObj.key)"
              :src="getObj(imageObj.key).data"
              alt="">
            <span
              class="image-config icon-cog"
              @click.stop="event => imageConfigOnClick(event, itemIndex, imageIndex, contents.imageKeyList.length)"
              v-if="isEditMode"
            ></span>
          </div>
          <div
            class="imageFrame"
            @click="insertImage(itemIndex, contents.imageKeyList.length)"
            v-if="isEditMode"
          >
            <span class="image-add icon-plus"></span>
          </div>
          <span
            class="item-config icon-cog"
            v-if="isEditMode"
            @click="event => itemConfigOnClick(event, itemIndex)"
          ></span>
        </div>

      </template>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";

@Component({})
export default class SurfaceComponent extends Vue {
  @Prop({ type: Object, required: true })
  private surface!: any;

  @Prop({ type: Boolean, required: true })
  private isEditMode!: boolean;

  @Action("setProperty") setProperty: any;
  @Action("windowOpen") windowOpen: any;
  @Getter("getObj") getObj: any;
  @Getter("playerKey") playerKey: any;

  @Emit("openItemMenu")
  private openItemMenu(index: number, hoverMenuX: number, hoverMenuY: number) {}

  @Emit("openImageMenu")
  private openImageMenu(
    itemIndex: number,
    imageIndex: number,
    imageListSize: number,
    hoverMenuX: number,
    hoverMenuY: number
  ) {}

  @Emit("closeItemMenu")
  private closeItemMenu() {}

  @Emit("closeImageMenu")
  private closeImageMenu() {
    window.console.log("closeImageMenu");
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
   * タイトルを挿入する
   */
  public insertTitleItem(index: number) {
    this.surface.contentsList.splice(index, 0, {
      kind: "title",
      text: "タイトル"
    });
    this.closeItemMenu();
  }

  /**
   * サブタイトルを挿入する
   */
  public insertSubTitleItem(index: number) {
    window.console.log("insertSubTitleItem", index);
    this.surface.contentsList.splice(index, 0, {
      kind: "sub-title",
      text: "サブタイトル"
    });
    this.closeItemMenu();
  }

  /**
   * テキストを挿入する
   */
  public insertTextItem(index: number) {
    window.console.log("insertTextItem", index);
    this.surface.contentsList.splice(index, 0, {
      kind: "text",
      text: "テキスト"
    });
    this.closeItemMenu();
  }

  /**
   * 仕切り線を挿入する
   */
  public insertHrItem(index: number) {
    window.console.log("insertHrItem", index);
    this.surface.contentsList.splice(index, 0, {
      kind: "separator"
    });
    this.closeItemMenu();
  }

  /**
   * 画像フレームを挿入する
   */
  public insertImageFrameItem(index: number) {
    window.console.log("insertImageFrameItem", index);
    this.surface.contentsList.splice(index, 0, {
      kind: "images",
      imageKeyList: [{ key: "image-0", tag: "(全て)" }]
    });
    this.closeItemMenu();
  }

  /**
   * 項目を削除する
   */
  public deleteItem(index: number) {
    this.surface.contentsList.splice(index, 1);
    this.closeItemMenu();
  }

  /**
   * 画像を挿入する
   */
  public insertImage(itemIndex: number, imageIndex: number) {
    this.surface.contentsList[itemIndex].imageKeyList.splice(imageIndex, 0, {
      key: "image-0",
      tag: "(全て)"
    });
    this.closeImageMenu();
  }

  /**
   * 画像を削除する
   */
  public deleteImage(itemIndex: number, imageIndex: number) {
    this.surface.contentsList[itemIndex].imageKeyList.splice(imageIndex, 1);
    this.closeImageMenu();
  }

  /**
   * この面の内容を表示して良いかどうかを調べる
   */
  private isViewableSurface() {
    return (
      this.surface.targetList.length === 0 ||
      this.surface.targetList.indexOf(this.playerKey) > -1
    );
  }

  /**
   * 項目設定をクリックした時
   */
  private itemConfigOnClick(event: any, index: number) {
    let contentsElm: HTMLElement = event.target;
    while (!contentsElm.classList.contains("contents")) {
      contentsElm = contentsElm.parentNode as HTMLElement;
    }
    const contentsRect = contentsElm.getBoundingClientRect();

    const hoverMenuY = event.pageY - contentsRect.top + 5;
    const hoverMenuX = event.pageX - contentsRect.left - 5;

    this.openItemMenu(index, hoverMenuX, hoverMenuY);
  }

  /**
   * 画像設定をクリックした時
   */
  private imageConfigOnClick(
    event: any,
    itemIndex: number,
    imageIndex: number,
    imageListSize: number
  ) {
    let contentsElm: HTMLElement = event.target;
    while (!contentsElm.classList.contains("contents")) {
      contentsElm = contentsElm.parentNode as HTMLElement;
    }
    const contentsRect = contentsElm.getBoundingClientRect();

    const hoverMenuY = event.pageY - contentsRect.top + 5;
    const hoverMenuX = event.pageX - contentsRect.left - 5;

    this.openImageMenu(
      itemIndex,
      imageIndex,
      imageListSize,
      hoverMenuX,
      hoverMenuY
    );
  }

  /**
   * イメージ枠をクリックした時
   * @param imageKey
   * @param itemIndex
   * @param imageIndex
   */
  private imageFrameOnClick(
    imageKey: string,
    itemIndex: number,
    imageIndex: number
  ) {
    if (this.isEditMode) {
      const imageObj: any = this.surface.contentsList[itemIndex].imageKeyList[
        imageIndex
      ];
      Promise.resolve()
        .then(() =>
          // リアクティブのための更新と、それに伴うコールバックの一時無効のための指定
          this.setProperty({
            property: "private.display.imageSelectorWindow",
            value: {
              imageKey: null,
              imageTag: null,
              callback: null
            },
            logOff: true
          })
        )
        .then(() => {
          return this.setProperty({
            property: "private.display.imageSelectorWindow",
            value: {
              imageKey,
              imageTag: imageObj.tag,
              callback: this.changeImage.bind(this, itemIndex, imageIndex)
            },
            logOff: true
          });
        })
        .then(() => {
          this.windowOpen("private.display.imageSelectorWindow");
        });
    } else {
      this.setProperty({
        property: `private.display.imageViewWindow.objKey`,
        value: imageKey,
        isNotice: false,
        logOff: true
      });
      this.windowOpen("private.display.imageViewWindow");
    }
  }

  /**
   * 編集中モードで画像を選択された時
   * @param itemIndex
   * @param imageIndex
   * @param imageKey
   * @param imageTag
   */
  private changeImage(
    itemIndex: number,
    imageIndex: number,
    imageKey: string,
    imageTag: string
  ) {
    this.surface.contentsList[itemIndex].imageKeyList.splice(imageIndex, 1, {
      key: imageKey.replace(":R", ""),
      tag: imageTag
    });
  }
}
</script>

<style scoped lang="scss">
@import "../common.scss";

$space-width: 0.5em;

.surfaceComponent {
  border: solid 1px gray;
  border-top-width: 0;
  background-color: white;
  overflow-y: auto;
  width: 100%;
  flex: 1;
  padding: $space-width 0;
  position: relative;

  &.disabled {
    padding: $space-width;
    background-color: lightgrey;
    width: calc(100% - #{$space-width} * 2);
    flex: 1;
  }
}

.imageContainer {
  @include flex-box(row, flex-start, center, wrap);
  width: calc(100% - #{$space-width});
  /*background-color: gray;*/
  padding-top: $space-width;
  padding-right: $space-width;

  .image-add {
    border: 2px solid black;
    border-radius: 50%;
    font-size: 2em;
    padding: 0.5em;
    background-color: white;
  }

  .imageFrame {
    @include flex-box(column, center, center);
    width: 5em;
    height: 5em;
    padding: 0.5em;
    margin-left: $space-width;
    margin-bottom: $space-width;
    border: solid 1px black;
    position: relative;

    &:hover {
      background-color: lightyellow;
      cursor: pointer;
    }

    &:hover .image-config {
      visibility: visible;
    }

    > .image-config {
      background-color: lightpink;
      position: absolute;
      right: 0;
      top: 0;
      @include flex-box(row, center, center);
      width: 2em;
      height: 2em;
      visibility: hidden;
      border-left: 1px solid black;
      border-bottom: 1px solid black;
    }
  }
}

.item {
  position: relative;

  > .item-config {
    background-color: lightpink;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    @include flex-box(row, center, center);
    width: 2em;
    visibility: hidden;
  }

  &:hover .item-config {
    visibility: visible;
  }

  textarea {
    border-width: 1px;
    width: calc(100% - 2em - 2px);
    max-width: calc(100% - 2em - 2px);
    min-width: calc(100% - 2em - 2px);
    min-height: 1.6em;
    display: inline-block;
  }
}

.title {
  margin: 0 0 0.25em;
  background-color: lightblue;
  color: darkblue;
  font-weight: bold;
  padding: 0.25em $space-width;
  width: calc(100% - #{$space-width} * 2);
}

.sub-title {
  margin: 0 $space-width 0.25em $space-width;
  padding: 0.1em $space-width;
  border-left: solid 5px lightblue;
  border-bottom: solid 2px lightblue;
  width: calc(100% - #{$space-width} * 4 - 5px);

  > .item-config {
    margin-right: -$space-width;
  }
}

.text {
  padding: 0 $space-width;
  width: calc(100% - #{$space-width} * 2);
}

hr {
  margin: $space-width $space-width;
  border-width: 1px;
  width: calc(100% - #{$space-width} * 2 - 2px);
}

img {
  max-width: 5em;
  max-height: 5em;
}
</style>
