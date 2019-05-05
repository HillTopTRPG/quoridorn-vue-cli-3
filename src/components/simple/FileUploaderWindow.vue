<template>
  <window-frame
    titleText="画像アップローダ"
    display-property="private.display.fileUploaderWindow"
    align="center"
    fixSize="530, 400"
    :message="message"
    @open="initWindow"
    @reset="initWindow"
  >
    <div class="contents" @contextmenu.prevent>
      <!-- 画像選択エリア -->
      <div class="image-container">
        <div
          class="image-block"
          v-for="image in useImageList"
          :key="image.key"
          :class="{ hover: image.key === hoverImageKey }"
          @mouseenter="imageOnHover(image.key)"
          @mouseleave="imageOnHover()"
        >
          <img v-img="image.image" alt="">
          <span class="icon-cross" @click="deleteImageOnClick(image.key)"></span>
        </div>
      </div>

      <div class="ctrl-type-1">
        <label>対応画像：JPEG/GIF/PNG/WEBP</label>
        <ctrl-select :disabled="true">
          <option value="">部屋専用のみ</option>
        </ctrl-select>
        <ctrl-button>隠し画像パスワード設定</ctrl-button>
      </div>

      <div class="ctrl-type-1">
        <label for="fileUploader-tag">付与するタグ（半角・全角スペースで区切り）：</label>
        <input type="text" id="fileUploader-tag" v-model="inputImageTag">
        <image-tag-select class="tagSelect" v-model="selectImageTag"/>
      </div>

      <div class="ctrl-type-2">
        <ctrl-file-selector @change="fileOnChange">アップロード対象画像選択</ctrl-file-selector>
        <ctrl-button :disabled="!useImageList.length" @click="commitOnClick">アップロード</ctrl-button>
        <ctrl-button @click="cancelOnClick">閉じる</ctrl-button>
      </div>
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowFrame from "../WindowFrame.vue";
import WindowMixin from "../WindowMixin.vue";
import CtrlButton from "@/components/parts/CtrlButton.vue";
import CtrlSelect from "@/components/parts/CtrlSelect.vue";
import ImageTagSelect from "@/components/parts/select/ImageTagSelect.vue";
import CtrlFileSelector from "@/components/parts/CtrlFileSelector.vue";

import { fileToBase64 } from "../common/Utility";
import { Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: {
    CtrlFileSelector,
    CtrlButton,
    CtrlSelect,
    ImageTagSelect,
    WindowFrame
  }
})
export default class FileUploaderWindow extends Mixins<WindowMixin>(
  WindowMixin
) {
  @Action("addImage") private addImage: any;
  @Action("windowClose") private windowClose: any;
  @Getter("imageTagList") private imageTagList: any;
  @Getter("playerKey") private playerKey: any;

  private inputImageTag: string = "キャラクター";
  private selectImageTag: string = "imgTag-2";
  private useImageList: any[] = [];
  private hoverImageKey: number | null = null;
  private committed: boolean = false;

  private initWindow() {
    this.inputImageTag = "キャラクター";
    this.selectImageTag = "imgTag-2";
    this.useImageList = [];
    this.hoverImageKey = null;
    this.committed = false;
  }

  /**
   * selectボックスが選択されたら、入力欄の内容を更新する
   */
  @Watch("selectImageTag")
  private onChangeSelectImageTag(selectImageTag: string) {
    const imageTagObj = (this.imageTagList as Array<any>).filter(
      (imageTag: any) => imageTag.key === selectImageTag
    )[0];
    if (!imageTagObj) return;

    this.inputImageTag = selectImageTag === "imgTag-0" ? "" : imageTagObj.name;
  }

  /**
   * 入力欄に入力されたら、selectボックスの内容を更新する
   */
  @Watch("inputImageTag")
  private onChangeInputImageTag(inputImageTag: string) {
    const regExp = new RegExp("[ 　]+");
    const tagNameList: string[] = this.inputImageTag.trim().split(regExp);

    if (tagNameList.length === 1 && tagNameList[0] === "") {
      this.selectImageTag = "imgTag-0";
      return;
    }

    if (tagNameList.length > 1) {
      this.selectImageTag = "";
      return;
    }

    const filtered: any = this.imageTagList.filter(
      (imageTagObj: any) => imageTagObj.name === tagNameList[0]
    )[0];
    this.selectImageTag = filtered ? filtered.key : "";
  }

  private fileOnChange(event: any) {
    const files: File[] = Array.from(event.target.files);
    const imageFiles: File[] = files.filter(
      file => file.type.indexOf("image/") === 0
    );

    fileToBase64(imageFiles).then((values: any[]) => {
      values.forEach((valueObj: any, index: number) => {
        const lastKey = this.useImageList.length
          ? this.useImageList[this.useImageList.length - 1].key
          : -1;
        valueObj.key = index + lastKey + 1;
      });

      this.useImageList = this.useImageList.concat(values);
      event.target.value = "";
    });
  }

  private get imageTagObjList(): any[] {
    const regExp = new RegExp("[ 　]+");
    const tagNameList: string[] = this.inputImageTag.trim().split(regExp);
    const resultList: any[] = [];
    tagNameList.forEach(tagName => {
      const filtered: any = this.imageTagList.filter(
        (imageTagObj: any) => imageTagObj.name === tagName
      )[0];
      if (filtered) {
        resultList.push(filtered);
      } else {
        // TODO
      }
    });
    return resultList;
  }

  private deleteImageOnClick(key: number) {
    const index: number = this.useImageList.findIndex(
      imageObj => imageObj.key === key
    );
    this.useImageList.splice(index, 1);
    this.hoverImageKey = null;
  }

  private imageOnHover(key: number | undefined) {
    this.hoverImageKey = key !== undefined ? key : null;
  }

  private get message() {
    const imageObj: any = this.useImageList.filter(
      imageObj => imageObj.key === this.hoverImageKey
    )[0];

    return imageObj ? imageObj.name : "";
  }

  private commitOnClick() {
    this.useImageList.forEach(imageObj => {
      this.addImage({
        name: imageObj.name,
        tag: imageObj.currentTag,
        data: imageObj.image,
        thumbnail: imageObj.thumbnail,
        imageArgList: imageObj.imageArgList,
        owner: this.playerKey
      });
    });
  }

  private cancelOnClick() {
    this.windowClose("private.display.fileUploaderWindow");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../common.scss";

.contents {
  @include flex-box(column, flex-start, center);
  position: absolute;
  height: 100%;
  width: 100%;
  font-size: 12px;

  > * {
    width: 100%;
    box-sizing: border-box;
  }

  .image-container {
    @include flex-box(row, flex-start, flex-start, wrap);
    overflow-y: scroll;
    flex: 1;
    border: solid gray 1px;
    box-sizing: border-box;
    align-content: flex-start;

    .image-block {
      position: relative;
      width: 96px;
      height: 96px;
      box-sizing: content-box;
      border: solid rgba(0, 0, 0, 0) 1px;
      flex-grow: 0;

      &.hover {
        border-color: blue;

        .icon-cross {
          visibility: visible;
        }
      }

      img {
        width: 100%;
        height: 100%;
        background-size: contain;
      }

      .icon-cross {
        position: absolute;
        top: 0;
        right: 0;
        padding: 5px;
        background-color: white;
        border-left: solid 1px blue;
        border-bottom: solid 1px blue;
        cursor: pointer;
        visibility: hidden;

        &:hover {
          background-color: lightyellow;
          color: red;
        }
      }
    }
  }

  .ctrl-type-1 {
    @include flex-box(row, center, center);

    > *:nth-child(2) {
      margin: auto;
    }
  }

  .ctrl-type-2 {
    @include flex-box(row, center, center);
    height: 3em;

    > * {
      margin: 0 0.5em;
    }

    > :first-child {
      margin-right: 2em;
    }
  }

  .result {
    @include flex-box(row, center, center);
  }
}
</style>
