<template>
  <div
    class="surfaceComponent"
    :class="{ disabled: !isViewableSurface() }"
  >
    <!-- 閲覧権限がない場合 -->
    {{!isViewableSurface() ? "あなたにこの面は開示されていません。" : ""}}

    <!-- 閲覧権限がある場合 -->
    <template v-if="isViewableSurface()">
      <div v-if="isEditMode" class="targetListArea">
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
          <span>{{actor.name}}</span>
          <span class="icon-cross"></span>
        </div>
        <div class="list">
        </div>
      </div>

      <div v-for="(contents, itemIndex) in surface.contentsList" :key="itemIndex">
        <!-- 大見出し -->
        <div
          v-if="contents.kind === 'title'"
          class="item title selectable"
          :key="`contents-${itemIndex}`"
        >
          <span v-html="contents.text.replace('\n', '<br>').replace(/^$/, '大見出し')" v-if="!isEditMode"></span>
          <textarea
            v-model="contents.text"
            v-if="isEditMode"
            @input="event => textareaOnInput(event, '大見出し', contents)"
            placeholder="大見出し"
          ></textarea>
          <span
            class="item-config icon-cog"
            @click="event => itemConfigOnClick(event, itemIndex)"
            v-if="isEditMode"
          ></span>
        </div>

        <!-- 小見出し -->
        <div
          v-if="contents.kind === 'sub-title'"
          class="item sub-title selectable"
          :key="`contents-${itemIndex}`"
        >
          <span v-html="contents.text.replace('\n', '<br>').replace(/^$/, '小見出し')" v-if="!isEditMode"></span>
          <textarea
            v-model="contents.text"
            v-if="isEditMode"
            @input="event => textareaOnInput(event, '小見出し', contents)"
            placeholder="小見出し"
          ></textarea>
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
          <span v-html="contents.text.replace('\n', '<br>').replace(/^$/, 'テキスト')" v-if="!isEditMode"></span>
          <textarea
            v-model="contents.text"
            v-if="isEditMode"
            @input="event => textareaOnInput(event, 'テキスト', contents)"
            placeholder="テキスト"
          ></textarea>
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

      </div>

      <span
        class="last-config icon-cog"
        @click="lastConfigOnClick"
        v-if="isEditMode"
      ></span>
    </template>
  </div>
</template>

<script lang="ts">
import CharacterSelect from "@/components/parts/select/CharacterSelect.vue";
import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import ActorSelect from "@/components/parts/select/ActorSelect.vue";

@Component({ components: { ActorSelect, CharacterSelect } })
export default class SurfaceComponent extends Vue {
  @Prop({ type: Object, required: true })
  public surface!: any;

  @Prop({ type: Boolean, required: true })
  private isEditMode!: boolean;

  @Action("setProperty") setProperty: any;
  @Action("windowOpen") windowOpen: any;
  @Getter("getObj") getObj: any;
  @Getter("playerKey") playerKey: any;

  private selectedActorKey: string = "";

  @Watch("selectedActorKey")
  private onChangeSelectedCharacter(selectedActorKey: string) {
    if (!selectedActorKey) return;
    this.surface.targetList.push(selectedActorKey);
    this.selectedActorKey = "";
  }

  @Emit()
  private openItemMenu(index: number, hoverMenuX: number, hoverMenuY: number) {}

  @Emit()
  private openLastMenu(hoverMenuX: number, hoverMenuY: number) {}

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
  private textareaOnInput(event: any, defaultText: any, contents: any) {
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
   * 末尾メニューをクリックした時
   */
  private lastConfigOnClick(event: any) {
    const locate: any = SurfaceComponent.getMenuLocate(event);
    this.openLastMenu(locate.x, locate.y);
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
  border: solid 1px gray;
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

.targetListArea {
  @include flex-box(row, flex-start, center, wrap);
  margin-bottom: 0.5em;

  .actor {
    @include flex-box(row, flex-start, center);
    border: solid 1px lightgray;
    border-radius: 0.5em;
    padding: 0 0.25em;

    > span[class^="icon-"] {
      @include flex-box(row, center, center);
      font-size: 10px;
      transform: scale(0.8);
      transform-origin: center;
      visibility: hidden;
    }

    &:not(:last-child) {
      margin-right: 0.5em;
    }

    &:hover {
      border-color: gray;

      > span[class^="icon-"] {
        visibility: visible;
      }
    }
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
    font-size: 2rem;
    padding: 0.5rem;
    background-color: white;
  }

  .imageFrame {
    @include flex-box(column, center, center);
    width: 4rem;
    height: 4rem;
    padding: 0.5rem;
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
      width: 1.5rem;
      height: 1.5rem;
      visibility: hidden;
      border-left: 1px solid black;
      border-bottom: 1px solid black;
    }

    img {
      max-width: 4rem;
      max-height: 4rem;
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
  word-wrap: break-word;
  white-space: normal;
}

.sub-title {
  margin: 0 $space-width 0.25em $space-width;
  padding: 0.1em $space-width;
  border-left: solid 5px lightblue;
  border-bottom: solid 2px lightblue;
  width: calc(100% - #{$space-width} * 4 - 5px);
  word-wrap: break-word;
  white-space: normal;

  > .item-config {
    margin-right: -$space-width;
  }
}

.text {
  padding: 0 $space-width;
  width: calc(100% - #{$space-width} * 2);
  word-wrap: break-word;
  white-space: normal;
}

hr {
  margin: $space-width $space-width;
  border-width: 1px;
  width: calc(100% - #{$space-width} * 2 - 2px);
}

.last-config {
  @include flex-box(row, center, center);
  width: 100%;
  background-color: lightpink;
  height: 2em;
  opacity: 0.5;

  &:hover {
    opacity: 1;
  }
}
</style>
