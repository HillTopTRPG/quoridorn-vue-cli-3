<template>
  <div class="surfaceComponent">
    <template v-if="isEditMode">
      <label>
        タブの名前
        <input type="text" v-model="localValue" />
      </label>
      <!-- タブの設定 -->
      <div class="tabSettingArea">
        <ctrl-button
          class="left"
          @click.stop="moveTabOnClick(true)"
          :class="{ disabled: tabIndex === 0 }"
        >
          ＜
        </ctrl-button>
        <ctrl-button
          class="right"
          @click.stop="moveTabOnClick(false)"
          :class="{ disabled: tabIndex === tabLength - 1 }"
        >
          ＞
        </ctrl-button>
        <span class="icon-cross" @click.stop="deleteTab()">タブを削除</span>
        <span class="icon-copy" @click.stop="copyTab()">タブをコピー</span>
      </div>

      <!-- 閲覧権限の設定 -->
      <div class="targetListArea">
        <actor-select
          v-model="selectedActorKey"
          :selectedActorList="targetActorList"
          defaultLabel="閲覧許可アクター"
        />
        <div
          v-for="actor in targetActorList"
          :key="actor.key"
          class="actor"
          @click="deleteTargetOnClick(actor.key)"
        >
          <span>{{ actor.name }}</span>
          <span class="icon-cross"></span>
        </div>

        <span
          class="item-config icon-cog"
          @click="event => itemConfigOnClick(event, 0)"
        ></span>
      </div>
    </template>

    <!-- 閲覧権限がない場合 -->
    <div v-if="!isViewableSurface()" class="disabled">
      {{ !isViewableSurface() ? "あなたにこの面は開示されていません。" : "" }}
    </div>

    <!-- 閲覧権限がある場合 -->
    <template v-if="isViewableSurface()">
      <div v-if="!isFront && surface.contentsList.length === 0" class="warning">
        ※ 裏面が白紙なので、このタブは面がありません。
      </div>
      <template v-for="(contents, itemIndex) in surface.contentsList">
        <!-- 大見出し -->
        <div
          v-if="contents.kind === 'title'"
          class="item title selectable"
          :key="`contents-${itemIndex}`"
        >
          <span
            v-html="
              contents.text.replace(/\n/g, '<br />').replace(/^$/, '大見出し')
            "
            v-if="!isEditMode"
          ></span>
          <textarea
            v-model="contents.text"
            v-if="isEditMode"
            @input="textareaOnInput"
            placeholder="大見出し"
          ></textarea>
          <span
            class="item-config icon-cog"
            @click="event => itemConfigOnClick(event, itemIndex + 1)"
            v-if="isEditMode"
          ></span>
        </div>

        <!-- 小見出し -->
        <div
          v-if="contents.kind === 'sub-title'"
          class="item sub-title selectable"
          :key="`contents-${itemIndex}`"
        >
          <span
            v-html="
              contents.text.replace(/\n/g, '<br />').replace(/^$/, '小見出し')
            "
            v-if="!isEditMode"
          ></span>
          <textarea
            v-model="contents.text"
            v-if="isEditMode"
            @input="textareaOnInput"
            placeholder="小見出し"
          ></textarea>
          <span
            class="item-config icon-cog"
            @click="event => itemConfigOnClick(event, itemIndex + 1)"
            v-if="isEditMode"
          ></span>
        </div>

        <!-- テキスト -->
        <div
          v-if="contents.kind === 'text'"
          class="item text selectable"
          :key="`contents-${itemIndex}`"
        >
          <span
            v-html="
              contents.text.replace(/\n/g, '<br />').replace(/^$/, 'テキスト')
            "
            v-if="!isEditMode"
          ></span>
          <textarea
            v-model="contents.text"
            v-if="isEditMode"
            @input="textareaOnInput"
            placeholder="テキスト"
          ></textarea>
          <span
            class="item-config icon-cog"
            @click="event => itemConfigOnClick(event, itemIndex + 1)"
            v-if="isEditMode"
          ></span>
        </div>

        <!-- 区切り線 -->
        <div
          v-if="contents.kind === 'separator'"
          class="item separator"
          :key="`contents-${itemIndex}`"
        >
          <hr />
          <span
            class="item-config icon-cog"
            @click="event => itemConfigOnClick(event, itemIndex + 1)"
            v-if="isEditMode"
          ></span>
        </div>

        <!-- チェックボックス -->
        <div
          v-if="contents.kind === 'checkbox'"
          class="item checkbox"
          :key="`contents-${itemIndex}`"
        >
          <label :class="{ isEditMode: isEditMode }">
            <input
              type="checkbox"
              :checked="contents.checked"
              @change="event => checkOnChange(event.target.checked, itemIndex)"
              :disabled="isEditMode"
            />
            <span
              v-html="contents.text.replace(/\n/g, '<br />')"
              v-if="!isEditMode"
            ></span>
          </label>
          <textarea
            v-model="contents.text"
            v-if="isEditMode"
            @input="textareaOnInput"
            placeholder=""
          ></textarea>
          <span
            class="item-config icon-cog"
            @click="event => itemConfigOnClick(event, itemIndex + 1)"
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
              alt=""
            />
            <span
              class="image-config icon-cog"
              @click.stop="
                event =>
                  imageConfigOnClick(
                    event,
                    itemIndex,
                    imageIndex,
                    contents.imageKeyList.length
                  )
              "
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
            @click="event => itemConfigOnClick(event, itemIndex + 1)"
          ></span>
        </div>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import ActorSelect from "@/components/parts/select/ActorSelect.vue";
import CharacterSelect from "@/components/parts/select/CharacterSelect.vue";
import CtrlButton from "@/components/parts/CtrlButton.vue";

import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";

@Component({ components: { CtrlButton, ActorSelect, CharacterSelect } })
export default class SurfaceComponent extends Vue {
  @Prop({ type: String, required: true })
  public value!: string;

  @Prop({ type: Object, required: true })
  public surface!: any;

  @Prop({ type: Boolean, required: true })
  private isEditMode!: boolean;

  @Prop({ type: Boolean, required: true })
  private isFront!: boolean;

  @Prop({ type: Number, required: true })
  private tabIndex!: number;

  @Prop({ type: Number, required: true })
  private tabLength!: number;

  @Action("setProperty") setProperty: any;
  @Action("windowOpen") windowOpen: any;
  @Getter("getObj") getObj: any;
  @Getter("playerKey") playerKey: any;

  private selectedActorKey: string = "";

  @Emit()
  private deleteTab() {}

  @Emit()
  private copyTab() {}

  @Emit()
  private moveTabOnClick(isLeft: boolean) {}

  @Emit()
  public input(value: string | null) {}

  private get localValue(): string | null {
    return this.value || "";
  }

  private set localValue(value: string | null) {
    this.input(value);
  }

  @Watch("selectedActorKey")
  private onChangeSelectedCharacter(selectedActorKey: string) {
    if (!selectedActorKey) return;
    this.surface.targetList.push(selectedActorKey);
    this.selectedActorKey = "";
  }

  @Emit()
  private openItemMenu(index: number, hoverMenuX: number, hoverMenuY: number) {}

  @Emit()
  private checkOnChange(checked: boolean, itemIndex: number) {}

  @Emit()
  private openImageMenu(
    itemIndex: number,
    imageIndex: number,
    imageListSize: number,
    hoverMenuX: number,
    hoverMenuY: number
  ) {}

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
   * この面の内容を表示して良いかどうかを調べる
   */
  private isViewableSurface(): boolean {
    // ターゲットが指定されていないなら公開情報
    if (this.surface.targetList.length === 0) return true;

    // ターゲットが指定されているので、許可されているか調べる
    return this.targetActorList.filter(actor => {
      const type: string = actor.key.split("-")[0];
      if (type === "character") {
        return actor.owner === this.playerKey;
      } else {
        return actor.key === this.playerKey;
      }
    })[0];
  }

  private static getMenuLocate(event: any): any {
    let contentsElm: HTMLElement = event.target;
    while (!contentsElm.classList.contains("contents")) {
      contentsElm = contentsElm.parentNode as HTMLElement;
    }
    const contentsRect = contentsElm.getBoundingClientRect();

    return {
      x: event.pageX - contentsRect.left - 5,
      y: event.pageY - contentsRect.top + 5
    };
  }

  /**
   * 項目設定をクリックした時
   */
  private itemConfigOnClick(event: any, index: number) {
    const locate: any = SurfaceComponent.getMenuLocate(event);
    this.openItemMenu(index, locate.x, locate.y);
  }

  private insertImage(itemIndex: number, imageIndex: number) {
    this.surface.contentsList[itemIndex].imageKeyList.splice(imageIndex, 0, {
      key: "image-0",
      tag: "(全て)"
    });
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
    const locate: any = SurfaceComponent.getMenuLocate(event);
    this.openImageMenu(
      itemIndex,
      imageIndex,
      imageListSize,
      locate.x,
      locate.y
    );
  }

  private deleteTargetOnClick(targetKey: string) {
    this.surface.targetList.splice(
      this.surface.targetList.findIndex(
        (listKey: string) => listKey === targetKey
      ),
      1
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

  private get targetActorList(): any[] {
    return this.surface.targetList.map((actorKey: string) =>
      this.getObj(actorKey)
    );
  }
}
</script>

<style scoped lang="scss">
@import "../common.scss";

$space-width: 0.5rem;

.surfaceComponent {
  @include inline-flex-box(column, flex-start, flex-start);
  border: solid 1px gray;
  background-color: white;
  width: 100%;
  padding: 0;
  position: relative;

  > .disabled {
    padding: $space-width;
    background-color: lightgrey;
    width: calc(100% - #{$space-width} * 2);
    flex: 1;
  }

  > * {
    width: 100%;
    flex-shrink: 0;

    &:not(.targetListArea):not(.imageContainer):not(.separator) {
      margin-top: $space-width;
    }

    &:last-child:not(.disabled) {
      margin-bottom: $space-width;
    }
  }

  .warning {
    @include inline-flex-box(row, center, center);
    width: 100%;
    white-space: normal;
    word-wrap: normal;
    background-color: yellow;
  }

  .item-config {
    @include flex-box(row, center, center);
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: lightpink;
    width: 1.5rem;
    min-height: 1rem;
    cursor: pointer;
  }

  .item {
    position: relative;

    > .item-config {
      visibility: hidden;
    }

    &:hover .item-config {
      visibility: visible;
    }
  }
}

.tabSettingArea {
  @include inline-flex-box(row, flex-start, center);

  > button {
    @include inline-flex-box(row, center, center);
    padding: 0 0.2rem;
    margin: 0;
    outline: none;
    border: solid 1px lightgrey;

    &:hover:not(.disabled) {
      background-color: lightyellow;
      cursor: pointer;
      border-color: gray;
    }

    &.disabled {
      background-color: lightgray;
    }

    &.left {
      border-radius: 0.3rem 0 0 0.3rem / 0.3rem 0 0 0.3rem;
      border-right-style: dashed;
      margin-right: -1px;

      &.disabled {
        border-right-color: white;
      }

      &:hover {
        z-index: 1;
      }
    }

    &.right {
      border-radius: 0 0.3rem 0.3rem 0 / 0 0.3rem 0.3rem 0;
      border-left-style: dashed;
      padding-left: -1px;

      &.disabled {
        border-left-color: white;
      }

      &:hover {
        z-index: 1;
      }
    }
  }

  [class^="icon-"] {
    @include inline-flex-box(row, center, center);
    border: 1px solid gray;
    border-radius: 0.2rem;
    padding: 0.1rem 0.2rem;
    height: 100%;
    margin-left: 1em;
    cursor: pointer;

    &:before {
      font-size: 10px;
    }

    &:hover {
      color: red;
      background-color: lightyellow;
      border-color: red;
    }
  }
}

.targetListArea {
  @include flex-box(row, flex-start, center, wrap);
  position: relative;
  padding: $space-width 0 0;

  .actor {
    @include flex-box(row, flex-start, center);
    border: solid 1px lightgray;
    border-radius: 0.5em;
    padding: 0 calc(#{$space-width} / 2);
    font-size: 12px;

    > span[class^="icon-"] {
      @include flex-box(row, center, center);
      font-size: 10px;
      transform: scale(0.8);
      transform-origin: center;
      visibility: hidden;
    }

    &:not(:last-child) {
      margin-right: 0.3rem;
    }

    &:hover {
      border-color: gray;

      > span[class^="icon-"] {
        visibility: visible;
      }
    }
  }
}

.title {
  @include flex-box(row, flex-start, flex-start);
  background-color: lightblue;
  color: darkblue;
  font-weight: bold;
  padding: 0.25rem $space-width;
  width: 100%;
  box-sizing: border-box;
  word-wrap: break-word;
  white-space: normal;

  textarea {
    border-width: 1px;
    width: calc(100% - 1.5rem);
    max-width: calc(100% - 1.5rem);
    min-width: calc(100% - 1.5rem);
    box-sizing: content-box;
  }
}

.sub-title {
  @include flex-box(row, flex-start, flex-start);
  margin: 0 $space-width;
  padding: 0.1rem $space-width;
  border-left: solid 5px lightblue;
  border-bottom: solid 2px lightblue;
  width: calc(100% - #{$space-width} * 2);
  /*width: 100%;*/
  box-sizing: border-box;
  word-wrap: break-word;
  white-space: normal;

  > .item-config {
    margin-right: -$space-width;
  }

  textarea {
    border-width: 1px;
    width: calc(100% - 1rem);
    max-width: calc(100% - 1rem);
    min-width: calc(100% - 1rem);
    box-sizing: content-box;
  }
}

.text {
  @include flex-box(row, flex-start, flex-start);
  padding: 0 $space-width;
  width: calc(100% - #{$space-width} * 2);
  word-wrap: break-word;
  white-space: normal;

  textarea {
    border-width: 1px;
    width: calc(100% - 1.5rem);
    max-width: calc(100% - 1.5rem);
    min-width: calc(100% - 1.5rem);
    box-sizing: content-box;
  }
}

.checkbox {
  @include flex-box(row, flex-start, center);

  label {
    @include flex-box(row, flex-start, center);

    &:not(.isEditMode) {
      width: 100%;
      &:hover {
        background-color: lightyellow;
        cursor: pointer;
      }
    }
  }

  input[type="checkbox"] {
    margin: 0 0.25rem;
  }

  textarea {
    border-width: 1px;
    width: calc(100% - 3.25rem);
    max-width: calc(100% - 3.25rem);
    min-width: calc(100% - 3.25rem);
    box-sizing: content-box;
  }
}

.separator {
  overflow-y: visible;
  hr {
    margin: $space-width $space-width 0;
    border-width: 1px;
    width: calc(100% - #{$space-width} * 2 - 2px);
  }
}

.imageContainer {
  @include flex-box(row, flex-start, center, wrap);
  width: calc(100% - #{$space-width});
  padding-right: $space-width;
  min-height: auto;

  .image-add {
    border: 2px solid black;
    border-radius: 50%;
    font-size: 2rem;
    padding: 0.5rem;
    background-color: white;
  }

  .imageFrame {
    @include flex-box(column, center, center);
    width: 4rem;
    height: 4rem;
    padding: 0.5rem;
    margin-top: $space-width;
    margin-left: $space-width;
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
      @include flex-box(row, center, center);
      background-color: lightpink;
      position: absolute;
      left: 0;
      top: 0;
      width: 1.5rem;
      height: 1.5rem;
      visibility: hidden;
      border-right: 1px solid black;
      border-bottom: 1px solid black;
    }

    img {
      max-width: 4rem;
      max-height: 4rem;
    }
  }
}
</style>
