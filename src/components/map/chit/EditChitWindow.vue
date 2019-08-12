<template>
  <window-frame
    titleText="チット変更"
    display-property="private.display.editChitWindow"
    align="center"
    fixSize="653, 305"
    @open="initWindow"
    @reset="initWindow"
  >
    <div class="container" @contextmenu.prevent>
      <div class="viewImage">
        <img
          class="img"
          v-img="currentImage"
          draggable="false"
          :class="{ isReverse: isReverse }"
        />
      </div>

      <image-selector
        v-model="selectImage"
        :imageTag.sync="currentImageTag"
        class="imageSelector"
      />

      <div class="rowsNum">
        <label>縦マス：</label>
        <input
          type="number"
          min="1"
          class="size"
          v-model="rows"
          @keydown.enter.stop
          @keyup.enter.stop
        />
      </div>
      <div class="columnsNum">
        <label>横マス：</label>
        <input
          type="number"
          min="1"
          class="size"
          v-model="columns"
          @keydown.enter.stop
          @keyup.enter.stop
        />
      </div>
      <textarea
        class="otherText"
        v-model="description"
        placeholder="説明"
      ></textarea>
      <div class="buttonArea">
        <div>
          <ctrl-button @click="commit">確定</ctrl-button>
          <ctrl-button @click="cancel">キャンセル</ctrl-button>
        </div>
      </div>
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowFrame from "../../WindowFrame.vue";
import WindowMixin from "../../WindowMixin.vue";
import CtrlButton from "../../parts/CtrlButton.vue";
import ImageSelector from "@/components/parts/ImageSelector.vue";

import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";
import { Watch } from "vue-property-decorator";

@Component({
  components: {
    CtrlButton,
    WindowFrame,
    ImageSelector
  }
})
export default class EditChitWindow extends Mixins<WindowMixin>(WindowMixin) {
  @Action("windowOpen") private windowOpen: any;
  @Action("windowClose") private windowClose: any;
  @Action("changeListObj") private changeListObj: any;
  @Getter("getObj") private getObj: any;
  @Getter("imageList") private imageList: any;
  @Getter("imageListFromTagKey") private imageListFromTagKey: any;

  private currentImageTag: string = "imgTag-0";
  private selectImage: string = "image-12";
  private isReverse: boolean = false;
  private rows: number = 1;
  private columns: number = 1;
  private description: string = "";

  private commit(): void {
    this.changeListObj({
      key: this.key,
      currentImageTag: this.currentImageTag,
      imageKey: this.selectImage,
      isReverse: this.isReverse,
      rows: this.rows,
      columns: this.columns,
      description: this.description,
      isNotice: true
    });
    this.windowClose("private.display.editChitWindow");
  }

  private cancel(): void {
    this.windowClose("private.display.editChitWindow");
  }

  @Watch("selectImage")
  private onChangeSelectImage(selectImage: string) {
    this.isReverse = /:R/.test(this.selectImage);
  }

  private getImage(key: string): string {
    return this.getKeyObj(this.imageList, key).data;
  }

  private getKeyObj(list: any[], key: string): any {
    return list.filter(obj => obj.key === key)[0];
  }

  private initWindow(): void {
    let chitObj = this.getObj(this.key);
    window.console.log(this.key, chitObj);
    this.currentImageTag = chitObj.currentImageTag;
    this.selectImage = chitObj.imageKey;
    this.isReverse = chitObj.isReverse;
    this.rows = chitObj.rows;
    this.columns = chitObj.columns;
    this.description = chitObj.description;
  }

  private get key(): string {
    return this.$store.state.private.display["editChitWindow"].key;
  }

  private get currentImage(): string | null {
    const imageObj = this.getKeyObj(
      this.imageList,
      this.selectImage.replace(":R", "")
    );
    return imageObj ? imageObj.data : null;
  }
}
</script>

<style scoped lang="scss">
.container {
  display: grid;
  width: 100%;
  height: 100%;
  font-size: 12px;
  position: absolute;
  grid-template-columns: 100px 100px 1fr;
  grid-template-rows: 182px auto 1fr auto;
  grid-template-areas:
    "viewImage  viewImage  imageSelector"
    "viewImage  viewImage  otherText"
    "rowsNum    columnsNum otherText"
    "buttonArea buttonArea buttonArea";
}

.isReverse {
  transform: scale(-1, 1);
}

.container > * {
  padding: 1px 0;
}

.viewImage {
  grid-area: viewImage;

  img {
    display: inline-block;
    width: 200px;
    height: 200px;
  }
}

.imageSelector {
  grid-area: imageSelector;
}

.initiativeTable {
  grid-area: initiativeTable;
}

.rowsNum {
  grid-area: rowsNum;
}

.columnsNum {
  grid-area: columnsNum;
}

.size {
  width: 33px;
}

.otherText {
  grid-area: otherText;
  resize: none;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.buttonArea {
  grid-area: buttonArea;
  text-align: center;
  padding-top: 10px;

  > div {
    display: inline-block;

    > * {
      margin: 0 0.5em;
    }
  }
}

input {
  padding: 2px;
}
</style>
