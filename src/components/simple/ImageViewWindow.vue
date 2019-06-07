<template>
  <window-frame
    titleText="画像プレビュー"
    display-property="private.display.imageViewWindow"
    align="center"
    baseSize="418, 339"
  >
    <div class="contents">
      <img :src="imageData" alt="" />
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowFrame from "../WindowFrame.vue";
import WindowMixin from "../WindowMixin.vue";

import { Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({ components: { WindowFrame } })
export default class ImageViewWindow extends Mixins<WindowMixin>(WindowMixin) {
  @Getter("getObj") getObj: any;

  private get imageData() {
    const imageObj = this.getObj(this.objKey);
    return imageObj ? imageObj.data : null;
  }

  private get objKey() {
    return this.$store.state.private.display.imageViewWindow.objKey;
  }
}
</script>

<style scoped lang="scss">
@import "../common.scss";

.contents {
  @include flex-box(row, center, center);
  width: 100%;
  height: 100%;

  > img {
    width: 100%;
    height: 100%;
  }
}
</style>
