<template>
  <div class="imageSelector" @contextmenu.prevent>

    <!-- 画像選択エリア -->
    <div class="choseImage">
      <div class="tagImages">
        <img
          v-for="image in useImageList"
          :class="{active : value && (image.key === value.replace(':R', ''))}"
          :key="image.key"
          v-img="image.data"
          @click="selectTagImage(image.key)"
          draggable="false"/>
      </div>
    </div>

    <!-- 絞り込み情報 -->
    <div class="imageInfo">
      <div class="selectedImage">
        <label>タグ名：</label>
        <image-tag-select class="tagSelect" v-model="selectImageTag" />
        <span>{{selectedTagIndexText}}</span>
      </div>
      <ctrl-button>隠し画像</ctrl-button>
      <ctrl-button @click="doReverse">反</ctrl-button>
    </div>
  </div>
</template>

<script lang="ts">
import ImageTagSelect from "@/components/parts/select/ImageTagSelect.vue";
import CtrlButton from "@/components/parts/CtrlButton.vue";

import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator";
import { Getter } from "vuex-class";

@Component({ components: { CtrlButton, ImageTagSelect } })
export default class ImageSelector extends Vue {
  @Getter("imageList") private imageList: any;

  @Prop({ type: String })
  public value!: string;

  @Prop({ type: String, default: "(全て)" })
  private imageTag!: string;

  private selectImageTag: string = "";

  @Emit("input")
  public input(value: string | null) {}

  @Watch("imageTag", { immediate: true })
  onChangeImageTag(value: string) {
    this.selectImageTag = value || "(全て)";
  }

  @Watch("selectImageTag")
  @Emit("update:imageTag")
  onChangeSelectImageTag(value: string) {}

  private get localValue(): string | null {
    return this.value;
  }

  private set localValue(value: string | null) {
    this.input(value);
  }

  private get imageKey(): string | null {
    if (this.localValue === null) return null;
    return this.localValue.replace(":R", "");
  }

  private get isReverse(): boolean {
    if (!this.localValue) return false;
    return /:R/.test(this.localValue);
  }

  private set isReverse(isReverse: boolean) {
    const imageKey = this.imageKey;
    if (imageKey === null) this.localValue = null;
    this.localValue = imageKey + (isReverse ? ":R" : "");
  }

  selectTagImage(key: string) {
    this.localValue = key;
  }

  doReverse() {
    this.isReverse = !this.isReverse;
  }

  get selectedTagIndexText() {
    const index = this.useImageList.findIndex(
      image => image.key === this.imageKey
    );
    return `${index + 1}/${this.useImageList.length}`;
  }

  get useImageList(): any[] {
    return this.imageList.filter((obj: any) => {
      if (this.selectImageTag === "(全て)") return true;
      return obj.tag.indexOf(this.selectImageTag) >= 0;
    });
  }
}
</script>

<style scoped lang="scss">
.imageSelector {
  display: flex;
  flex-direction: column;
}
.choseImage {
  grid-area: choseImage;
  overflow-y: scroll;
  max-height: 130px;
  flex: 1;
  border: solid gray 1px;

  .tagImages {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    align-content: flex-start;
    flex-wrap: wrap;
    height: auto;
    box-sizing: border-box;
    min-height: calc(100% - 2px);

    img {
      width: 50px;
      height: 50px;
      border: solid rgba(0, 0, 0, 0) 1px;

      &.active {
        border: solid blue 1px;
      }
    }
  }
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

  button {
    margin-left: 10px;
  }
}
</style>
