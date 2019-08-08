<template>
  <window-frame
    titleText="キャラクター変更"
    display-property="private.display.editCharacterWindow"
    align="center"
    fixSize="653, 377"
    @open="open"
    @reset="open"
  >
    <div class="container v-box">
      <div class="h-box flex-max" @contextmenu.prevent>
        <div class="viewImage">
          <img
            v-img="currentImage"
            draggable="false"
            :class="{ isReverse: isReverse }"
          />
        </div>

        <div class="v-box flex-max">
          <image-selector
            v-model="selectImage"
            :imageTag.sync="currentImageTag"
            class="imageSelector flex-max"
          />

          <div class="switchImageArea">
            <ctrl-button
              v-show="!isOpenSwitch"
              @click="isOpenSwitch = true"
              class="switchButton"
            >
              画像切替設定
            </ctrl-button>
            <span v-show="isOpenSwitch" class="switchImage">
              <img
                v-for="switchObj in switchImageList"
                :class="{
                  active: switchObj.key === switchCurrentKey,
                  isReverse: switchObj.isReverse
                }"
                :key="switchObj.key"
                v-img="getImage(switchObj.imgKey)"
                @click="selectSwitchImage(switchObj.key)"
                tabindex="0"
                draggable="false"
              />
            </span>
            <ctrl-button v-show="isOpenSwitch" @click.prevent="addSwitch">
              追加
            </ctrl-button>
            <ctrl-button
              v-show="isOpenSwitch"
              @click.prevent="deleteSwitch"
              :disabled="!isCanSwitchDelete"
            >
              削除
            </ctrl-button>
          </div>
        </div>
      </div>

      <div class="initiativeTable" @contextmenu.prevent></div>

      <div class="h-box">
        <div class="v-box">
          <div class="nameArea">
            <label>
              <span @contextmenu.prevent>名前：</span>
              <input
                type="text"
                class="name"
                placeholder="必ず入力してください"
                v-model="name"
              />
            </label>
          </div>
          <div class="pieceOptions">
            <label>
              <span @contextmenu.prevent>サイズ：</span>
              <input type="number" class="size" min="1" v-model="size" />
            </label>
            <label @contextmenu.prevent>
              <input type="checkbox" class="hide" v-model="isHide" />
              <span>
                マップマスクの下に隠す
                <br />(イニシアティブ表で非表示)
              </span>
            </label>
          </div>
          <div class="urlArea">
            <label>
              <span @contextmenu.prevent>参照URL：</span>
              <input
                type="text"
                v-model="url"
                placeholder="キャラクターシートのURL"
              />
            </label>
          </div>
        </div>

        <label class="v-box flex-max">
          <span @contextmenu.prevent>その他</span>
          <textarea class="otherText flex-max" v-model="text"></textarea>
        </label>
      </div>

      <div class="buttonArea" @contextmenu.prevent>
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

  private getImage(key: number | string): string | null {
    const imageObj = this.imageList.filter(
      (image: any) => image.key === key
    )[0];
    return imageObj ? imageObj.data : null;
  }

  private getKeyObj(list: any[], key: number | string): any | null {
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
    this.name = this.name.trim();
    if (!this.name) {
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
    characterObj.useImageList
      .split("|")
      .forEach((imageStr: string, index: number) => {
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

  private get currentImage(): string | null {
    return this.getImage(this.currentImageKey);
  }

  private get currentImageKey(): string {
    return this.getKeyObj(this.switchImageList, this.switchCurrentKey).imgKey;
  }
}
</script>

<style scoped lang="scss">
@import "../../common.scss";

.container {
  width: 100%;
  height: 100%;
  font-size: 12px;

  > * {
    padding: 1px 0;
  }
}

.isReverse {
  transform: scale(-1, 1);
}
.viewImage {
  img {
    display: inline-block;
    width: 200px;
    height: 200px;
  }
}
.imageSelector {
}
.switchImageArea {
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
}
.nameArea {
}
.viewImage {
}
.pieceOptions {
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
  resize: none;
  box-sizing: border-box;
}
.urlArea {
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
}
.buttonArea {
  text-align: center;
  padding-top: 0.5em;
  /*padding-bottom: 10px;*/

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
