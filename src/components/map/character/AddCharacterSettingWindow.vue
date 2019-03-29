<template>
  <window-frame titleText="キャラクター追加" display-property="private.display.addCharacterSettingWindow" align="center" fixSize="653, 377" @open="open"><!--  baseSize="601, 377" -->
    <div class="container" @contextmenu.prevent>
      <div class="viewImage"><img v-img="currentImage" draggable="false" :class="{isReverse : isReverse}"/></div>
      <image-selector
        v-model="selectImage"
        :imageTag.sync="currentImageTag"
        class="imageSelector"
      />
      <div class="switchImageArea">
        <button v-show="!isOpenSwitch" @click="isOpenSwitch = true" class="switchButton">画像切替設定</button>
        <span v-show="isOpenSwitch" class="switchImage"><img v-for="switchObj in switchImageList" :class="{active : switchObj.key === switchCurrentKey, isReverse : switchObj.isReverse}" :key="switchObj.key" v-img="getImage(switchObj.imgKey)" @click="selectSwitchImage(switchObj.key)" tabindex="0" draggable="false"/></span>
        <button v-show="isOpenSwitch" @click.prevent="addSwitch">追加</button>
        <button v-show="isOpenSwitch" @click.prevent="deleteSwitch" :disabled="!isCanSwitchDelete">削除</button>
      </div>
      <div class="initiativeTable">
      </div>
      <div class="nameArea"><label>名前：</label><input type="text" class="name" placeholder="必ず入力してください" v-model="name"/></div>
      <div class="pieceOptions">
        <label>サイズ：</label><input type="number" class="size" min="1" v-model="size"/>
        <label><input type="checkbox" class="hide" v-model="isHide"/><span>マップマスクの下に隠す<br>(イニシアティブ表で非表示)</span></label>
      </div>
      <div class="urlArea"><label>参照URL：</label><input type="text" v-model="url" placeholder="キャラクターシートのURL"/></div>
      <div class="otherTextLabel"><span>その他</span></div>
      <textarea class="otherText" v-model="text"></textarea>
      <div class="buttonArea">
        <div>
          <button @click="commit">追加</button>
          <button @click="cancel">キャンセル</button>
        </div>
      </div>
    </div>
  </window-frame>
</template>

<script lang="ts">
import ImageSelector from "@/components/parts/ImageSelector.vue";
import WindowFrame from "../../WindowFrame.vue";
import WindowMixin from "../../WindowMixin.vue";

import { Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: {
    WindowFrame,
    ImageSelector
  }
})
export default class AddCharacterSettingWindow extends Mixins<WindowMixin>(
  WindowMixin
) {
  @Action("setProperty") private setProperty: any;
  @Action("windowOpen") private windowOpen: any;
  @Action("windowClose") private windowClose: any;
  @Getter("parseColor") private parseColor: any;
  @Getter("imageList") private imageList: any;

  private selectImage: string = "image-1";

  @Watch("selectImage")
  onChangeSelectImage(selectImage: string) {
    const index = this.switchImageList.findIndex(
      image => image.key === this.switchCurrentKey
    );
    const switchImageObj = this.switchImageList[index];
    switchImageObj.imgKey = selectImage.replace(":R", "");
    switchImageObj.isReverse = /:R/.test(selectImage);
    this.switchImageList.splice(index, 1, switchImageObj);
  }

  @Watch("currentImageTag")
  onChangeCurrentImageTag(currentImageTag: string) {
    // alert("currentImageTag" + currentImageTag);
  }

  private isOpenSwitch: boolean = false;
  private currentImageTag: string = "キャラクター";
  private switchImageList: any[] = [
    { key: 0, imgKey: "image-1", isReverse: false }
  ];
  private switchCurrentKey: number = 0;
  private name: string = "";
  private size: number = 1;
  private isHide: boolean = false;
  private url: string = "";
  private text: string = "";

  addSwitch() {
    const nextKey: number =
      Math.max.apply(null, this.switchImageList.map(image => image.key)) + 1;

    this.switchImageList.push({
      key: nextKey,
      imgKey: this.selectImage.replace(":R", ""),
      isReverse: false
    });
    this.switchCurrentKey = nextKey;
  }
  doReverse() {
    const index = this.switchImageList.findIndex(
      image => image.key === this.switchCurrentKey
    );
    const switchImageObj = this.switchImageList[index];
    switchImageObj.isReverse = !switchImageObj.isReverse;
    this.switchImageList.splice(index, 1, switchImageObj);
  }
  getImage(key: number) {
    const imageObj = this.imageList.filter(
      (image: any) => image.key === key
    )[0];
    return imageObj ? imageObj.data : null;
  }
  getKeyObj(list: any[], key: number) {
    return list.filter(obj => obj.key === key)[0];
  }
  selectSwitchImage(key: number) {
    this.switchCurrentKey = key;
  }
  selectTagImage(key: number) {
    const index = this.switchImageList.findIndex(
      image => image.key === this.switchCurrentKey
    );
    const switchImageObj = this.switchImageList[index];
    switchImageObj.imgKey = key;
    switchImageObj.isReverse = false;
    this.switchImageList.splice(index, 1, switchImageObj);
  }
  deleteSwitch() {
    const index = this.switchImageList.findIndex(
      image => image.key === this.switchCurrentKey
    );
    const switchImageObj = this.switchImageList[index];
    // 削除
    this.switchImageList.splice(index, 1);
    this.switchCurrentKey = this.switchImageList[
      index < this.switchImageList.length
        ? index
        : this.switchImageList.length - 1
    ].key;
  }
  commit() {
    if (this.name === "") {
      alert(`名前を入力してください。`);
      return;
    }

    const useImageList = this.switchImageList
      .map(imgObj => `${imgObj.imgKey}${imgObj.isReverse ? ":R" : ""}`)
      .join("|");

    const obj = {
      name: this.name,
      size: this.size,
      useImageList: useImageList,
      isHide: this.isHide,
      url: this.url,
      text: this.text,
      useImageIndex: this.switchCurrentKey,
      currentImageTag: this.currentImageTag
    };
    this.setProperty({
      property: `private.display.addCharacterWindow`,
      value: obj
    });
    this.windowOpen("private.display.addCharacterWindow");
  }
  cancel() {
    this.windowClose("private.display.addCharacterSettingWindow");
  }
  open() {
    this.isOpenSwitch = false;
    this.currentImageTag = "キャラクター";
    this.switchImageList.splice(0, this.switchImageList.length);
    this.switchImageList.push({
      key: 0,
      imgKey: "image-1",
      isReverse: false
    });
    this.switchCurrentKey = 0;
    this.name = "";
    this.size = 1;
    this.isHide = false;
    this.url = "";
    this.text = "";
    this.windowClose("private.display.addCharacterWindow");
  }

  get isReverse() {
    return this.getKeyObj(this.switchImageList, this.switchCurrentKey)
      .isReverse;
  }
  get isCanSwitchDelete() {
    return this.switchImageList.length > 1;
  }
  get currentImage() {
    return this.getImage(this.currentImageKey);
  }
  get currentImageKey() {
    return this.getKeyObj(this.switchImageList, this.switchCurrentKey).imgKey;
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
  grid-template-columns: 200px auto 1fr;
  grid-template-rows: 150px 1fr auto auto auto auto auto;
  grid-template-areas:
    "viewImage       imageSelector   imageSelector"
    "viewImage       switchImageArea switchImageArea"
    "initiativeTable initiativeTable initiativeTable"
    "nameArea        nameArea        otherTextLabel"
    "pieceOptions    pieceOptions    otherText"
    "urlArea         urlArea         otherText"
    "buttonArea      buttonArea      buttonArea";

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
.switchImageArea {
  grid-area: switchImageArea;
  display: flex;

  .switchImage {
    display: inline-block;
    flex: 1;
    height: 50px;

    img {
      width: 50px;
      height: 50px;
      border: solid rgba(0, 0, 0, 0) 1px;

      &.active {
        border: solid blue 1px;
      }
    }
  }

  button {
    &.switchButton {
      height: 26px;
    }

    &:not(.switchButton) {
      height: 50px;
      display: inline-block;
      margin-left: 10px;
    }
  }
}
.initiativeTable {
  grid-area: initiativeTable;
}
.nameArea {
  grid-area: nameArea;
}
.viewImage {
  grid-area: viewImage;
}
.otherTextLabel {
  display: flex;
  grid-area: otherTextLabel;
  vertical-align: bottom;

  span {
    display: inline;
    vertical-align: bottom;
    flex: 1;
  }
}
.pieceOptions {
  grid-area: pieceOptions;

  input[type="number"] {
    width: 35px;
  }
}
.pieceOptions span {
  display: inline-block;
  vertical-align: middle;
  margin-right: 10px;
}
.otherText {
  grid-area: otherText;
  resize: none;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.urlArea {
  grid-area: urlArea;
  display: flex;
  vertical-align: middle;

  label {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.urlArea input {
  flex: 1;
  margin-right: 7px;
}
.buttonArea {
  grid-area: buttonArea;
  text-align: center;
  padding-top: 15px;
  padding-bottom: 10px;

  > div {
    display: inline-block;
  }
}
input {
  padding: 2px;
}
</style>
