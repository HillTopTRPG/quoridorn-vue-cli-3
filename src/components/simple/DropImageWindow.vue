<template>
  <window-frame
    titleText="画像データ登録"
    display-property="private.display.dropImageWindow"
    align="center"
    fixSize="385, 660"
  >
    <div class="contents" @contextmenu.prevent>
      <div v-if="!imageList">画像読込中...</div>
      <fieldset v-for="imageObj in imageList" :key="imageObj.key">
        <legend>{{imageObj.name}}</legend>
        <div>
          <img class="image" v-img="imageObj.image" draggable="false" />
          <ctrl-button class="passwordButton" @click="passwordButtonOnClick">隠し画像パスワード設定</ctrl-button>
          <label class="passwordLabel">隠し画像パスワード：{{imageObj.password !== '' ? 'あり' : 'なし'}}</label>
          <span class="tagLabel">付与するタグ(半角・全角スペースで区切り)</span>
          <input class="tagInput" type="text" @change="changeTag(imageObj.key)" v-model="imageObj.currentTag" />
          <ctrl-select class="tagSelect" @input="selectTag(imageObj.key)" v-model="imageObj.selectTag">
            <option v-for="tagObj in imageTagList.slice(1)" :key="tagObj.key" :value="tagObj.name">{{tagObj.name}}</option>
          </ctrl-select>
        </div>
      </fieldset>
      <div class="operateArea">
        <ctrl-button @click="commit" :disabled="!imageList">決定</ctrl-button>
        <ctrl-button @click="cancel" :disabled="!imageList">キャンセル</ctrl-button>
      </div>
    </div>
  </window-frame>
</template>

<script lang="ts">
import CtrlButton from "@/components/parts/CtrlButton.vue";
import CtrlSelect from "@/components/parts/CtrlSelect.vue";
import WindowFrame from "../WindowFrame.vue";
import WindowMixin from "../WindowMixin.vue";

import { Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: {
    CtrlSelect,
    CtrlButton,
    WindowFrame
  }
})
export default class DropImageWindow extends Mixins<WindowMixin>(WindowMixin) {
  @Action("imageTagChange") private imageTagChange: any;
  @Action("addImage") private addImage: any;
  @Action("windowClose") private windowClose: any;
  @Action("emptyProperty") private emptyProperty: any;
  @Getter("dropImageList") private dropImageList: any;
  @Getter("imageTagList") private imageTagList: any;
  @Getter("playerKey") private playerKey: any;

  private imageList: any[] = [];

  private commit(): void {
    this.imageList.forEach(imageObj => {
      this.addImage({
        name: imageObj.name,
        tag: imageObj.currentTag,
        data: imageObj.image,
        thumbnail: imageObj.thumbnail,
        imageArgList: imageObj.imageArgList,
        owner: this.playerKey
      });
    });
    this.windowClose("private.display.dropImageWindow");
    this.emptyProperty({
      property: "private.display.dropImageWindow.imageDataList"
    });
  }

  private cancel(): void {
    this.windowClose("private.display.dropImageWindow");
    this.emptyProperty({
      property: "private.display.dropImageWindow.imageDataList"
    });
  }

  private getKeyObj(list: any[], key: string): any {
    const filteredList = list.filter(obj => obj.key === key);
    if (filteredList.length === 0) {
      window.console.log(`key:"${key}" is not find.`);
      return null;
    }
    if (filteredList.length > 1) {
      window.console.log(`key:"(${key})" is duplicate.`);
      return null;
    }
    return filteredList[0];
  }

  private passwordButtonOnClick(): void {
    alert("未実装です。");
  }

  private changeTag(key: string): void {
    // 入力によってタグの追加・削除が発生する可能性があるので、タグリストを整理してもらう
    window.console.log("changeTag");
    this.imageTagChange({ key: key, imageList: this.imageList });
  }

  private selectTag(key: string): void {
    const imgObj = this.getKeyObj(this.imageList, key);
    window.console.log(imgObj.currentTag, imgObj.selectTag);
    imgObj.currentTag = imgObj.selectTag;
    // const index = this.imageList.indexOf(imgObj)
    // this.imageList.splice(index, 1, imgObj)
    // 選択によってタグの削除が発生する可能性があるので、タグリストを整理してもらう
    this.imageTagChange({ key: key, imageList: this.imageList });
  }

  @Watch("dropImageList")
  private onChangeDropImageList(dropImageList: any[]): void {
    this.imageList = dropImageList.map(imgObj => ({
      key: imgObj.key,
      name: imgObj.name,
      image: imgObj.image,
      thumbnail: imgObj.thumbnail,
      imageArgList: imgObj.imageArgList,
      currentTag: "キャラクター",
      selectTag: "キャラクター",
      password: ""
    }));
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.contents {
  position: absolute;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  font-size: 12px;

  input {
    display: inline;
  }

  .operateArea {
    vertical-align: middle;
    text-align: center;
    margin-top: 10px;
  }
}

fieldset > div {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto auto 1fr auto auto;
  grid-template-areas:
    "viewImage passwordButton passwordButton"
    "viewImage passwordLabel  passwordLabel"
    "viewImage .............. .............."
    "tagLabel  tagLabel       tagLabel"
    "tagInput  tagInput       tagSelect";
}

button {
  font-size: 11px;
}

.image {
  grid-area: viewImage;
  width: 96px;
  height: 96px;
  border: solid gray 1px;
}

.passwordButton {
  grid-area: passwordButton;
}

.passwordLabel {
  grid-area: passwordLabel;
}

.tagLabel {
  grid-area: tagLabel;
}

.tagInput {
  margin-right: 5px;
  grid-area: tagInput;
}

.tagSelect {
  grid-area: tagSelect;
}
</style>
