<template>
  <window-frame
    titleText="キャラクター変更"
    display-property="private.display.editCharacterWindow"
    align="center"
    fixSize="653, 377"
    @open="open"
    @reset="open"
  >
    <div class="container" @contextmenu.prevent>
      <div class="viewImage"><img v-img="currentImage" draggable="false" :class="{isReverse : isReverse}"/></div>

      <image-selector
        v-model="selectImage"
        :imageTag.sync="currentImageTag"
        class="imageSelector"
      />

      <div class="switchImageArea">
        <ctrl-button v-show="!isOpenSwitch" @click="isOpenSwitch = true" class="switchButton">画像切替設定</ctrl-button>
        <span v-show="isOpenSwitch" class="switchImage">
          <img
            v-for="switchObj in switchImageList"
            :class="{active : switchObj.key === switchCurrentKey, isReverse : switchObj.isReverse}"
            :key="switchObj.key"
            v-img="getImage(switchObj.imgKey)"
            @click="selectSwitchImage(switchObj.key)"
            tabindex="0"
            draggable="false"
          />
        </span>
        <ctrl-button v-show="isOpenSwitch" @click.prevent="addSwitch">追加</ctrl-button>
        <ctrl-button v-show="isOpenSwitch" @click.prevent="deleteSwitch" :disabled="!isCanSwitchDelete">削除</ctrl-button>
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
import CtrlButton from "@/components/parts/CtrlButton.vue";
import ImageSelector from "@/components/parts/ImageSelector.vue";

import { Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: {
    CtrlButton,
    WindowFrame,
    ImageSelector
  }
})
export default class EditCharacterWindow extends Mixins<WindowMixin>(
  WindowMixin
) {
  @Action("setProperty") private setProperty: any;
  @Action("windowOpen") private windowOpen: any;
  @Action("windowClose") private windowClose: any;
  @Action("changeListObj") private changeListObj: any;
  @Getter("getObj") private getObj: any;
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

  private isOpenSwitch: boolean = false;
  private currentImageTag: string = "imgTag-2";
  private switchImageList: any[] = [
    { key: 0, imgKey: "image-1", isReverse: false }
  ];
  private switchCurrentKey: number = 0;
  private name: string = "";
  private size: number = 1;
  private isHide: boolean = false;
  private url: string = "";
  private text: string = "";

  private addSwitch(): void {
    const nextKey: number =
      Math.max.apply(null, this.switchImageList.map(image => image.key)) + 1;

    this.switchImageList.push({
      key: nextKey,
      imgKey: this.selectImage.replace(":R", ""),
      isReverse: false
    });
    this.switchCurrentKey = nextKey;
  }

  private doReverse(): void {
    const index = this.switchImageList.findIndex(
      image => image.key === this.switchCurrentKey
    );
    const switchImageObj = this.switchImageList[index];
    switchImageObj.isReverse = !switchImageObj.isReverse;
    this.switchImageList.splice(index, 1, switchImageObj);
  }

  private getImage(key: string): string {
    const imageObj = this.imageList.filter(
      (image: any) => image.key === key
    )[0];
    return imageObj ? imageObj.data : null;
  }

  private getKeyObj(list: any[], key: string | number): any {
    return list.filter(obj => obj.key === key)[0];
  }

  private selectSwitchImage(key: number): void {
    this.switchCurrentKey = key;
  }

  private selectTagImage(key: number): void {
    const index = this.switchImageList.findIndex(
      image => image.key === this.switchCurrentKey
    );
    const switchImageObj = this.switchImageList[index];
    switchImageObj.imgKey = key;
    switchImageObj.isReverse = false;
    this.switchImageList.splice(index, 1, switchImageObj);
  }

  private deleteSwitch(): void {
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

  private commit(): void {
    if (this.name === "") {
      alert(`名前を入力してください。`);
      return;
    }
    this.changeListObj({
      key: this.key,
      isNotice: true,
      name: this.name,
      columns: this.size,
      rows: this.size,
      useImageList: this.switchImageList
        .map(imgObj => imgObj.imgKey + (imgObj.isReverse ? ":R" : ""))
        .join("|"),
      isHide: this.isHide,
      url: this.url,
      text: this.text,
      useImageIndex: 0,
      currentImageTag: this.currentImageTag
    });
    this.windowClose("private.display.editCharacterWindow");
  }

  private cancel(): void {
    this.windowClose("private.display.editCharacterWindow");
  }

  private open(): void {
    this.isOpenSwitch = false;
    let characterObj = this.getObj(this.key);
    this.currentImageTag = characterObj.currentImageTag;
    this.switchImageList.splice(0, this.switchImageList.length);
    characterObj.useImageList.split("|").forEach((imageStr, index) => {
      const isReverse = imageStr.indexOf(":R") >= 0;
      const imageKey = imageStr.replace(":R", "");
      this.switchImageList.push({
        key: index,
        imgKey: imageKey,
        isReverse: isReverse
      });
    });
    this.switchCurrentKey = characterObj.useImageIndex;
    this.name = characterObj.name;
    this.size = characterObj.columns;
    this.isHide = characterObj.isHide;
    this.url = characterObj.url;
    this.text = characterObj.text;
    this.selectImage = this.switchImageList[this.switchCurrentKey].imgKey;
  }

  private get key(): string {
    return this.$store.state.private.display["editCharacterWindow"].key;
  }

  private get selectedTagIndexText(): string {
    const imageList = this.imageList;
    const keyObj = this.getKeyObj(imageList, this.currentImageKey);
    const index = keyObj ? imageList.indexOf(keyObj) + 1 : 0;
    return `${index}/${imageList.length}`;
  }

  private get isReverse(): boolean {
    return this.getKeyObj(this.switchImageList, this.switchCurrentKey)
      .isReverse;
  }

  private get isCanSwitchDelete(): boolean {
    return this.switchImageList.length > 1;
  }

  private get storeImages(): any[] {
    return this.$store.state.public.image.list;
  }

  private get currentImage(): any {
    return this.getImage(this.currentImageKey);
  }

  private get currentImageKey(): string {
    return this.getKeyObj(this.switchImageList, this.switchCurrentKey).imgKey;
  }

  private get tagList(): any[] {
    return this.$store.state.public.image.tags.list;
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
  grid-template-rows: 125px auto 1fr auto auto auto auto auto;
  grid-template-areas:
    "viewImage       imageSelector   imageSelector"
    "viewImage       switchImageArea switchImageArea"
    "initiativeTable initiativeTable initiativeTable"
    "nameArea        nameArea        otherTextLabel"
    "pieceOptions    pieceOptions    otherText"
    "urlArea         urlArea         otherText"
    "buttonArea      buttonArea      buttonArea";
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

  button.switchButton {
    height: 26px;
  }

  button:not(.switchButton) {
    height: 50px;
    display: inline-block;
    margin-left: 10px;
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

  span {
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
  }
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

  input {
    flex: 1;
    margin-right: 7px;
  }
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
