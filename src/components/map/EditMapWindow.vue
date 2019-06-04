<template>
  <window-frame
    titleText="マップ変更"
    display-property="private.display.editMapWindow"
    align="center"
    fixSize="401, 435"
    @open="initWindow"
    @reset="initWindow"
    @cancel="cancel"
    @close="close"
  >
    <div class="container" @contextmenu.prevent>
      <image-selector
        v-model="edit.imageKey"
        :imageTag.sync="edit.imageTag"
        class="imageSelector"
      />

      <fieldset class="imageAreaSettings">
        <legend>イメージ部分</legend>
        <div>
          <div class="totalRow">
            <label
              >縦マス：<input
                type="number"
                min="1"
                class="size"
                v-model="edit.totalRow"
            /></label>
          </div>
          <div class="totalColumn">
            <label
              >横マス：<input
                type="number"
                min="1"
                class="size"
                v-model="edit.totalColumn"
            /></label>
          </div>
          <div class="gridColor">
            <label
              >マス目の色：<input
                type="color"
                class="size"
                v-model="edit.gridColor"
            /></label>
          </div>
        </div>
      </fieldset>
      <fieldset class="marginAreaSettings">
        <legend>余白部分</legend>
        <div>
          <div class="marginGridSize">
            <label
              >マス数：<input
                type="number"
                min="0"
                class="size"
                v-model="edit.marginGridSize"
            /></label>
          </div>
          <div class="borderWidth">
            <label
              >外周罫線の太さ：<input
                type="number"
                min="0"
                class="size"
                v-model="edit.borderWidth"
            /></label>
          </div>
          <div class="isUseImage">
            <label
              >ぼかし画像：<input type="checkbox" v-model="edit.isUseImage"
            /></label>
          </div>
        </div>
        <div>
          <div class="isUseGridColor">
            <label
              >被せ色：<input
                type="color"
                class="size"
                v-model="edit.maskColor"/><input
                type="range"
                class="maskAlpha"
                min="0"
                max="1"
                step="0.1"
                v-model="edit.maskAlpha"
            /></label>
          </div>
          <div class="isUseGridColor">
            <label
              >方眼罫線：<input
                type="checkbox"
                v-model="edit.isUseGridColor"/><input
                v-show="edit.isUseGridColor"
                type="color"
                class="size"
                v-model="edit.marginGridColor"
            /></label>
          </div>
        </div>
      </fieldset>
      <fieldset class="backgroundAreaSettings">
        <legend>背景部分</legend>
        <div>
          <div class="backgroundColor">
            <label
              >背景色：<input
                type="color"
                class="size"
                v-model="edit.backgroundColor"
            /></label>
          </div>
        </div>
      </fieldset>
      <div class="buttonArea">
        <div>
          <ctrl-button @click="commit">確定</ctrl-button>
          <ctrl-button @click="cancel">キャンセル</ctrl-button>
        </div>
        <p>確定ボタンを押下しないとルームメンバーには反映されません。</p>
      </div>
    </div>
  </window-frame>
</template>

<script lang="ts">
import CtrlButton from "../parts/CtrlButton.vue";
import WindowFrame from "../WindowFrame.vue";
import WindowMixin from "../WindowMixin.vue";

import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";
import { Watch } from "vue-property-decorator";
import ImageSelector from "@/components/parts/ImageSelector.vue";

@Component({
  components: {
    ImageSelector,
    CtrlButton,
    WindowFrame
  }
})
export default class EditMapWindow extends Mixins<WindowMixin>(WindowMixin) {
  @Action("setProperty") private setProperty: any;
  @Action("windowOpen") private windowOpen: any;
  @Action("windowClose") private windowClose: any;
  @Getter("peerId") private peerId: any;
  @Getter("isWait") private isWait: any;
  @Getter("imageListFromTagKey") private imageListFromTagKey: any;
  @Getter("currentMap") private currentMap: any;

  private edit: any = {
    imageTag: "imgTag-1",
    imageKey: "image-1",
    isReverse: false,
    marginGridSize: 5,
    marginGridColor: "#FFFFFF",
    maskColor: "#145014",
    maskAlpha: 0.1,
    isUseGridColor: true,
    isUseImage: true,
    borderWidth: 20,
    totalColumn: 20,
    totalRow: 15,
    gridColor: "#000000",
    backgroundColor: "#92A8B3"
  };

  private original: any = {
    imageTag: "imgTag-1",
    imageKey: "image-1",
    isReverse: false,
    marginGridSize: 5,
    marginGridColor: "#FFFFFF",
    maskColor: "#145014",
    maskAlpha: 0.1,
    isUseGridColor: true,
    isUseImage: true,
    borderWidth: 20,
    totalColumn: 20,
    totalRow: 15,
    gridColor: "#000000",
    backgroundColor: "#92A8B3"
  };

  private initWindow() {
    const peerId = this.peerId(this.isWait);
    if (this.storeMap.isEditing && this.storeMap.isEditing !== peerId) {
      alert(
        "他の画面とマップ変更操作が競合しますので、この操作はキャンセルします。"
      );
      this.windowClose("private.display.editMapWindow");
      return;
    }
    this.edit.imageTag = this.currentMap.imageTag;
    this.edit.imageKey = this.currentMap.imageKey;
    this.edit.isReverse = this.currentMap.isReverse;
    this.edit.marginGridSize = this.currentMap.margin.gridSize;
    this.edit.isUseGridColor = this.currentMap.margin.isUseGridColor;
    this.edit.isUseImage = this.currentMap.margin.isUseImage;
    this.edit.marginGridColor = this.currentMap.margin.gridColor;
    this.edit.maskColor = this.currentMap.margin.maskColor;
    this.edit.maskAlpha = this.currentMap.margin.maskAlpha;
    this.edit.borderWidth = this.currentMap.margin.borderWidth;
    this.edit.totalColumn = this.currentMap.grid.totalColumn;
    this.edit.totalRow = this.currentMap.grid.totalRow;
    this.edit.gridColor = this.currentMap.grid.color;
    this.edit.backgroundColor = this.currentMap.background;

    this.original.imageTag = this.currentMap.imageTag;
    this.original.imageKey = this.currentMap.imageKey;
    this.original.isReverse = this.currentMap.isReverse;
    this.original.marginGridSize = this.currentMap.margin.gridSize;
    this.original.isUseGridColor = this.currentMap.margin.isUseGridColor;
    this.original.isUseImage = this.currentMap.margin.isUseImage;
    this.original.marginGridColor = this.currentMap.margin.gridColor;
    this.original.maskColor = this.currentMap.margin.maskColor;
    this.original.maskAlpha = this.currentMap.margin.maskAlpha;
    this.original.borderWidth = this.currentMap.margin.borderWidth;
    this.original.totalColumn = this.currentMap.grid.totalColumn;
    this.original.totalRow = this.currentMap.grid.totalRow;
    this.original.gridColor = this.currentMap.grid.color;
    this.original.backgroundColor = this.currentMap.background;
    this.setProperty({
      property: "public.map.isEditing",
      isNotice: true,
      value: peerId,
      logOff: true
    });
  }

  private commit() {
    const peerId = this.peerId(this.isWait);
    if (this.storeMap.isEditing === peerId) {
      const index = this.storeMap.list.findIndex(
        (mapObj: any) => mapObj.key === this.currentMap.key
      );
      this.setProperty({
        property: `public.map.list.${index}`,
        isNotice: true,
        value: {
          imageTag: this.edit.imageTag,
          imageKey: this.edit.imageKey,
          isReverse: this.edit.isReverse,
          margin: {
            gridSize: parseInt(this.edit.marginGridSize, 10),
            borderWidth: parseInt(this.edit.borderWidth, 10),
            gridColor: this.edit.marginGridColor,
            isUseGridColor: this.edit.isUseGridColor,
            isUseImage: this.edit.isUseImage,
            maskColor: this.edit.maskColor,
            maskAlpha: parseFloat(this.edit.maskAlpha)
          },
          grid: {
            totalColumn: parseInt(this.edit.totalColumn, 10),
            totalRow: parseInt(this.edit.totalRow, 10),
            color: this.edit.gridColor
          },
          background: this.edit.backgroundColor,
          isEditing: false
        },
        logOff: true
      });
    } else {
      alert(
        "ルームメイトとマップ変更操作が競合しますので、この操作はキャンセルします。"
      );
    }
    this.setProperty({
      property: "public.map.isEditing",
      isNotice: true,
      value: null,
      logOff: true
    }).then(() => {
      this.windowClose("private.display.editMapWindow");
    });
  }

  private cancel() {
    if (this.storeMap.isEditing === this.peerId(this.isWait)) {
      const index = this.storeMap.list.findIndex(
        (mapObj: any) => mapObj.key === this.currentMap.key
      );
      this.setProperty({
        property: `public.map.list.${index}`,
        isNotice: true,
        value: {
          imageTag: this.original.imageTag,
          imageKey: this.original.imageKey,
          isReverse: this.original.isReverse,
          margin: {
            gridSize: parseInt(this.original.marginGridSize, 10),
            borderWidth: parseInt(this.original.borderWidth, 10),
            gridColor: this.original.marginGridColor,
            isUseGridColor: this.original.isUseGridColor,
            isUseImage: this.original.isUseImage,
            maskColor: this.original.maskColor,
            maskAlpha: parseFloat(this.original.maskAlpha)
          },
          grid: {
            totalColumn: parseInt(this.original.totalColumn, 10),
            totalRow: parseInt(this.original.totalRow, 10),
            color: this.original.gridColor
          },
          background: this.original.backgroundColor,
          isEditing: false
        },
        logOff: true
      });
    }
    this.windowClose("private.display.editMapWindow");
  }

  private close() {
    this.setProperty({
      property: "public.map.isEditing",
      isNotice: true,
      value: null,
      logOff: true
    });
  }

  private doReverse() {
    this.edit.isReverse = !this.edit.isReverse;
  }

  private selectImage(key: string) {
    this.edit.imageKey = key;
  }

  private getKeyObj(list: any[], key: string) {
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

  private get selectedTagIndexText(): string {
    const useImageList = this.useImageList;
    const keyObj = this.getKeyObj(useImageList, this.edit.imageKey);
    const index = keyObj ? useImageList.indexOf(keyObj) + 1 : 0;
    return `${index}/${useImageList.length}`;
  }

  private get tagList() {
    return this.$store.state.public.image.tags.list;
  }

  private get storeImages() {
    return this.$store.state.public.image.list;
  }

  private get currentImage() {
    return this.getKeyObj(this.storeImages, this.edit.imageKey).data;
  }

  private get useImageList(): any[] {
    return this.imageListFromTagKey(this.edit.imageTag);
  }

  private get storeMap() {
    return this.$store.state.public.map;
  }

  private watchBase(property: string, value: any) {
    this.setProperty({
      property,
      value,
      logOff: true
    });
  }

  @Watch("edit.imageTag")
  private onChangeEditImageTag(imageTag: string) {
    this.watchBase("public.map.imageTag", imageTag);
  }

  @Watch("edit.imageKey")
  private onChangeEditImageKey(imageKey: string) {
    this.watchBase("public.map.imageKey", imageKey);
  }

  @Watch("edit.isReverse")
  private onChangeEditIsReverse(isReverse: boolean) {
    this.watchBase("public.map.isReverse", isReverse);
  }

  @Watch("edit.marginGridSize")
  private onChangeEditMarginGridSize(marginGridSize: string) {
    this.watchBase("public.map.margin.gridSize", parseInt(marginGridSize, 10));
  }

  @Watch("edit.isUseGridColor")
  private onChangeEditIsUseGridColor(isUseGridColor: boolean) {
    this.watchBase("public.map.margin.isUseGridColor", isUseGridColor);
  }

  @Watch("edit.isUseImage")
  private onChangeEditIsUseImage(isUseImage: boolean) {
    this.watchBase("public.map.margin.isUseImage", isUseImage);
  }

  @Watch("edit.marginGridColor")
  private onChangeEditMarginGridColor(marginGridColor: string) {
    this.watchBase("public.map.margin.gridColor", marginGridColor);
  }

  @Watch("edit.maskColor")
  private onChangeEditMaskColor(maskColor: string) {
    this.watchBase("public.map.margin.maskColor", maskColor);
  }

  @Watch("edit.maskAlpha")
  private onChangeEditMaskAlpha(maskAlpha: string) {
    this.watchBase("public.map.margin.maskAlpha", parseFloat(maskAlpha));
  }

  @Watch("edit.borderWidth")
  private onChangeEditBorderWidth(borderWidth: string) {
    this.watchBase("public.map.margin.borderWidth", parseInt(borderWidth, 10));
  }

  @Watch("edit.totalColumn")
  private onChangeEditTotalColumn(totalColumn: string) {
    this.watchBase("public.map.grid.totalColumn", parseInt(totalColumn, 10));
  }

  @Watch("edit.totalRow")
  private onChangeEditTotalRow(totalRow: string) {
    this.watchBase("public.map.grid.totalRow", parseInt(totalRow, 10));
  }

  @Watch("edit.gridColor")
  private onChangeEditGridColor(gridColor: string) {
    this.watchBase("public.map.grid.color", gridColor);
  }

  @Watch("edit.backgroundColor")
  private onChangeEditBackgroundColor(backgroundColor: string) {
    this.watchBase("public.map.background", backgroundColor);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
p {
  margin: 0;
  padding: 0;
  font-size: 10px;
}

.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  font-size: 12px;
}

fieldset {
  padding: 0;

  > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    height: 2.2em;
    margin-bottom: 5px;

    > div {
      display: inline-block;
      white-space: nowrap;
      margin-left: 10px;

      > label {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  legend {
    margin-left: 10px;
  }
}

.imageSelector {
  flex: 1;
}

.size {
  width: 33px;
}

.maskAlpha {
  width: 66px;
  background-color: red;
  border: 1px solid red;
}

.otherText {
  grid-area: otherText;
  resize: none;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.buttonArea {
  text-align: center;
  padding-top: 0.5em;

  > div {
    display: inline-block;
    padding-bottom: 0.5em;

    > * {
      margin: 0 0.5em;
    }
  }
}

input {
  padding: 2px;
  margin: 0;
}
</style>
