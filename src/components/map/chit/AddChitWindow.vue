<template>
  <window-frame titleText="チット作成" display-property="private.display.addChitWindow" align="center" fixSize="653, 271" @open="open">
    <div class="container" @contextmenu.prevent>
      <div class="viewImage"><img class="img" v-img="currentImage" @dragstart="dragStart" draggable="true" :class="{isReverse : isReverse}" @mousedown.stop/></div>
      <!-- <div class="viewImage"><img v-img="currentImage" draggable="false" :class="{isReverse : isReverse}"/></div> -->
      <image-selector
        v-model="imageKey"
        :imageTag.sync="currentImageTag"
        class="imageSelector"
      />
      <div class="rowsNum"><label>縦マス：</label><input type="number" min="1" class="size" v-model="rows"/></div>
      <div class="columnsNum"><label>横マス：</label><input type="number" min="1" class="size" v-model="columns"/></div>
      <textarea class="otherText" v-model="description" placeholder="説明"></textarea>
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowFrame from "../../WindowFrame.vue";
import WindowMixin from "../../WindowMixin.vue";
import ImageSelector from "@/components/parts/ImageSelector.vue";

import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: {
    WindowFrame,
    ImageSelector
  }
})
export default class AddChitWindow extends Mixins<WindowMixin>(WindowMixin) {
  @Action("windowOpen") private windowOpen: any;
  @Action("windowClose") private windowClose: any;
  @Getter("imageTagList") private imageTagList: any;
  @Getter("imageList") private imageList: any;

  private currentImageTag: string = "フロアタイル";
  private imageKey: string = "image-11";
  private isReverse: boolean = false;
  private rows: number = 1;
  private columns: number = 1;
  private description: string = "";

  dragStart(event: any) {
    event.dataTransfer.setData("kind", "chit");
    event.dataTransfer.setData("currentImageTag", this.currentImageTag);
    event.dataTransfer.setData("imageKey", this.imageKey);
    event.dataTransfer.setData("isReverse", this.isReverse);
    event.dataTransfer.setData("rows", this.rows);
    event.dataTransfer.setData("columns", this.columns);
    event.dataTransfer.setData("description", this.description);
  }
  doReverse() {
    this.isReverse = !this.isReverse;
  }
  selectImage(key: string) {
    this.imageKey = key;
  }
  getImage(key: string) {
    return this.getKeyObj(this.imageList, key).data;
  }
  getKeyObj(list: any[], key: string) {
    const filteredList = list.filter(obj => obj.key === key);
    if (filteredList.length === 0) {
      // window.console.log(`key:"${key}" is not find.`);
      return null;
    }
    if (filteredList.length > 1) {
      // window.console.log(`key:"(${key})" is duplicate.`);
      return null;
    }
    return filteredList[0];
  }
  open() {
    this.currentImageTag = "フロアタイル";
    this.imageKey = "image-11";
    this.isReverse = false;
    this.rows = 1;
    this.columns = 1;
    this.description = "";
  }

  get selectedTagIndexText() {
    const useImageList = this.useImageList;
    const keyObj = this.getKeyObj(useImageList, this.imageKey);
    const index = keyObj ? useImageList.indexOf(keyObj) + 1 : 0;
    return `${index}/${useImageList.length}`;
  }
  get currentImage() {
    const imageObj = this.getKeyObj(this.useImageList, this.imageKey);
    return imageObj ? imageObj.data : null;
  }
  get useImageList() {
    return this.imageList.filter((obj: any) => {
      if (this.currentImageTag === "(全て)") {
        return true;
      }
      return obj.tag.indexOf(this.currentImageTag) >= 0;
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.container {
  display: grid;
  width: 100%;
  font-size: 12px;
  position: absolute;
  grid-template-columns: 100px 100px 1fr;
  grid-template-rows: 150px 1fr auto;
  grid-template-areas:
    "viewImage viewImage  imageSelector"
    "viewImage viewImage  otherText"
    "rowsNum   columnsNum otherText";

  > * {
    padding: 1px 0;
  }
}

.tagImages {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  align-content: flex-start;
  flex-wrap: wrap;
  height: auto;
  min-height: calc(100% - 2px);
  box-sizing: border-box;
  border: solid gray 1px;

  img {
    width: 50px;
    height: 50px;
    border: solid rgba(0, 0, 0, 0) 1px;

    &.active {
      border: solid blue 1px;
    }
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

.choseImage {
  grid-area: choseImage;
  overflow-y: scroll;
  height: 130px;
}

.imageInfo {
  grid-area: imageInfo;
  display: flex;

  .selectedImage {
    flex: 1;
    display: flex;

    > * {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    select {
      flex: 1;
    }
  }

  > button {
    margin-left: 10px;
  }
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

.viewImage {
  grid-area: viewImage;
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
