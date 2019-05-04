<template>
  <window-frame
    titleText="画像アップローダ"
    display-property="private.display.fileUploaderWindow"
    align="center"
    fixSize="600, 400"
    @open="initWindow"
  >
    <div class="contents" @contextmenu.prevent>
      <div class="image-container"></div>
      <div class="ctrl-type-1">
        <label>対応画像：JPEG/GIF/PNG/WEBP</label>
        <select>
          <option>部屋専用のみ</option>
        </select>
        <ctrl-button>隠し画像パスワード設定</ctrl-button>
      </div>
      <div class="ctrl-type-1">
        <label for="fileUploader-tag">付与するタグ（半角・全角スペースで区切り）：</label>
        <input type="text" id="fileUploader-tag">
        <image-tag-select class="tagSelect" v-model="selectImageTag"/>
      </div>
      <div class="ctrl-type-2">
        <ctrl-button>アップロード対象画像選択</ctrl-button>
        <ctrl-button>アップロード</ctrl-button>
        <ctrl-button>閉じる</ctrl-button>
      </div>
      <div class="result"></div>
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowFrame from "../WindowFrame.vue";
import WindowMixin from "../WindowMixin.vue";
import CtrlButton from "@/components/parts/CtrlButton.vue";
import ImageTagSelect from "@/components/parts/select/ImageTagSelect.vue";

import { Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({ components: { CtrlButton, ImageTagSelect, WindowFrame } })
export default class FileUploaderWindow extends Mixins<WindowMixin>(
  WindowMixin
) {
  @Action("addImage") private addImage: any;
  @Action("windowClose") private windowClose: any;
  @Getter("imageTagList") private imageTagList: any;

  private inputImageTag: string = "キャラクター画像";
  private selectImageTag: string = "キャラクター画像";

  private initWindow() {
    this.inputImageTag = "キャラクター画像";
    this.selectImageTag = "キャラクター画像";
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

    this.inputImageTag = imageTagObj.name;
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
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../common.scss";

.contents {
  position: absolute;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  font-size: 12px;

  .image-container {
    @include flex-box(row, center, center);
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
  }

  .result {
    @include flex-box(row, center, center);
  }
}
</style>
