<template>
  <window-frame
    titleText="画像選択"
    display-property="private.display.imageSelectorWindow"
    align="center"
    fixSize="400, 193"
    :message="fileName"
  >
    <div class="contents" @contextmenu.prevent>
      <image-selector
        v-model="imageKey"
        :imageTag.sync="imageTag"
      />
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowFrame from "../WindowFrame.vue";
import WindowMixin from "../WindowMixin.vue";
import ImageSelector from "@/components/parts/ImageSelector.vue";

import { Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: {
    WindowFrame,
    ImageSelector
  }
})
export default class ImageSelectorWindow extends Mixins<WindowMixin>(
  WindowMixin
) {
  @Action("windowClose") private windowClose: any;
  @Getter("imageSelectorKey") private imageSelectorKey: any;
  @Getter("imageSelectorTag") private imageSelectorTag: any;
  @Getter("imageSelectorCallback") private imageSelectorCallback: any;
  @Getter("imageList") private imageList: any;

  private imageKey: string = "";
  private imageTag: string = "";

  @Watch("imageSelectorKey", { immediate: true })
  onChangeImageSelectorKey(imageSelectorKey: string) {
    this.imageKey = imageSelectorKey;
  }

  @Watch("imageSelectorTag", { immediate: true })
  onChangeImageSelectorTag(imageSelectorTag: string) {
    this.imageTag = imageSelectorTag;
  }

  @Watch("imageKey")
  onChangeImageKey(imageKey: string) {
    if (!this.imageSelectorCallback) return;
    this.imageSelectorCallback(imageKey, this.imageTag);
  }

  @Watch("imageTag")
  onChangeImageTag(imageTag: string) {
    if (!this.imageSelectorCallback) return;
    this.imageSelectorCallback(this.imageKey, imageTag);
  }

  get fileName(): string {
    if (!this.imageKey) return "";
    const image = this.imageList.filter(
      (image: any) => image.key === this.imageKey.replace(":R", "")
    )[0];
    return image ? image.name : "";
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.contents {
  position: absolute;
  height: 100%;
  width: 100%;
  font-size: 12px;
  display: flex;

  > div {
    flex: 1;
  }
}
</style>
