<template>
  <window-frame titleText="画像選択" display-property="private.display.imageSelectorWindow" align="center" fixSize="400, 193">
    <div class="contents">
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

import { Component, Emit, Vue, Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";

@Component<ImageSelectorWindow>({
  name: "imageSelectorWindow",
  mixins: [WindowMixin],
  components: {
    WindowFrame,
    ImageSelector
  }
})
export default class ImageSelectorWindow extends Vue {
  @Action("windowClose") windowClose: any;
  @Getter("imageSelectorKey") imageSelectorKey: any;
  @Getter("imageSelectorTag") imageSelectorTag: any;
  @Getter("imageSelectorCallback") imageSelectorCallback: any;

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
