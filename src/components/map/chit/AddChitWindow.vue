<template>
  <window-frame
    titleText="チット作成"
    display-property="private.display.addChitWindow"
    align="center"
    fixSize="653, 271"
    message="画像を直接マップにドラッグ＆ドロップで配置"
    @open="open"
    @reset="open"
  >
    <div class="container" @contextmenu.prevent>
      <div class="viewImage">
        <img
          class="img"
          v-img="currentImage"
          @dragstart="dragStart"
          draggable="true"
          :class="{ isReverse: isReverse }"
          @mousedown.stop
        />
      </div>

      <image-selector
        v-model="selectImage"
        :imageTag.sync="currentImageTag"
        class="imageSelector"
      />

      <div class="rowsNum">
        <label>縦マス：</label>
        <input type="number" min="1" class="size" v-model="rows" />
      </div>
      <div class="columnsNum">
        <label>横マス：</label>
        <input type="number" min="1" class="size" v-model="columns" />
      </div>
      <textarea
        class="otherText"
        v-model="description"
        placeholder="説明"
      ></textarea>
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowFrame from "../../WindowFrame.vue";
import WindowMixin from "../../WindowMixin.vue";
import ImageSelector from "@/components/parts/ImageSelector.vue";

import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";
import { Watch } from "vue-property-decorator";

@Component({
  components: {
    WindowFrame,
    ImageSelector
  }
})
export default class AddChitWindow extends Mixins<WindowMixin>(WindowMixin) {
  @Action("windowOpen") private windowOpen: any;
  @Action("windowClose") private windowClose: any;
  @Getter("imageList") private imageList: any;
  @Getter("imageListFromTagKey") private imageListFromTagKey: any;

  private currentImageTag: string = "imgTag-0";
  private selectImage: string = "image-11";
  private isReverse: boolean = false;
  private rows: number = 1;
  private columns: number = 1;
  private description: string = "";

  private dragStart(event: any) {
    event.dataTransfer.setData("kind", "chit");
    event.dataTransfer.setData("currentImageTag", this.currentImageTag);
    event.dataTransfer.setData("imageKey", this.selectImage);
    event.dataTransfer.setData("isReverse", this.isReverse);
    event.dataTransfer.setData("rows", this.rows);
    event.dataTransfer.setData("columns", this.columns);
    event.dataTransfer.setData("description", this.description);
  }

  @Watch("selectImage")
  private onChangeSelectImage(selectImage: string) {
    this.isReverse = /:R/.test(this.selectImage);
  }

  private getImage(key: string) {
    return this.getKeyObj(this.imageList, key).data;
  }

  private getKeyObj(list: any[], key: string): any {
    return list.filter(obj => obj.key === key)[0];
  }

  private open() {
    this.currentImageTag = "imgTag-0";
    this.selectImage = "image-11";
    this.isReverse = false;
    this.rows = 1;
    this.columns = 1;
    this.description = "";
  }

  private get currentImage() {
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
  grid-template-rows: 182px auto 1fr;
  grid-template-areas:
    "viewImage viewImage  imageSelector"
    "viewImage viewImage  otherText"
    "rowsNum   columnsNum otherText";

  > * {
    padding: 1px 0;
  }
}

.isReverse {
  transform: scale(-1, 1);
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

input {
  padding: 2px;
}
</style>
