<template>
  <window-frame
    titleText="チャットパレット"
    display-property="private.display.chatPaletteSettingWindow"
    align="center"
    fixSize="676, 540"
    :fontSizeBar="true"
  >
    <div class="contents">
      <chat-palette-setting-component />
      <chat-palette-setting-component />
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowFrame from "../WindowFrame.vue";
import WindowMixin from "../WindowMixin.vue";
import ChatPaletteSettingComponent from "@/components/chat-palette/ChatPaletteSettingComponent.vue";

import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: {
    ChatPaletteSettingComponent,
    WindowFrame
  }
})
export default class ChatPaletteSettingWindow extends Mixins<WindowMixin>(
  WindowMixin
) {}
</script>

<style scoped lang="scss">
@import "../common.scss";

.contents {
  @include flex-box(row, center, center);
  position: absolute;
  height: 100%;
  width: 100%;
  font-size: 12px;

  .chat-palette-setting-component {
    height: 100%;
    flex: 1;
  }
}
</style>
