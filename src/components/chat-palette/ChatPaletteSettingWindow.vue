<template>
  <window-frame
    titleText="チャットパレット"
    display-property="private.display.chatPaletteSettingWindow"
    align="center"
    :fixSize="fixSize"
    :fontSizeBar="true"
    @open="open"
    @reset="open"
  >
    <div class="contents">
      <div class="optionLine">
        <label>
          パレット数
          <ctrl-select
            v-model="columns"
            :optionInfoList="
              ['1', '2', '3'].map(numStr => ({
                key: numStr,
                value: numStr,
                text: numStr
              }))
            "
          />
        </label>

        <!-- ダイスボット選択 -->
        <dice-bot-select v-model="currentDiceBotSystem" />
      </div>

      <div class="container">
        <chat-palette-setting-component
          v-for="num in new Array(parseInt(columns, 10)).map(
            (num, index) => index
          )"
          :key="num"
          :currentDiceBotSystem="currentDiceBotSystem"
          ref="component"
        />
      </div>
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowFrame from "../WindowFrame.vue";
import WindowMixin from "../WindowMixin.vue";
import ChatPaletteSettingComponent from "@/components/chat-palette/ChatPaletteSettingComponent.vue";

import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";
import CtrlSelect from "@/components/parts/CtrlSelect.vue";
import { Watch } from "vue-property-decorator";
import DiceBotSelect from "@/components/parts/select/DiceBotSelect.vue";

@Component({
  components: {
    DiceBotSelect,
    CtrlSelect,
    ChatPaletteSettingComponent,
    WindowFrame
  }
})
export default class ChatPaletteSettingWindow extends Mixins<WindowMixin>(
  WindowMixin
) {
  private columns: string = "1";
  private currentDiceBotSystem: string = "DiceBot";

  private open() {
    const refs: ChatPaletteSettingComponent[] = this.$refs
      .component as ChatPaletteSettingComponent[];
    if (!refs || !refs[0]) return;
    refs[0].requestFocus();
  }

  private get fixSize() {
    const columnNum = parseInt(this.columns, 10);

    const width = columnNum * 329 + 16;

    return `${width}, 540`;
  }
}
</script>

<style scoped lang="scss">
@import "../common.scss";

.contents {
  @include flex-box(column, stretch, center);
  position: absolute;
  height: 100%;
  width: 100%;

  .optionLine {
    @include flex-box(row, space-around, center);
  }

  .container {
    @include flex-box(row, center, center);
    width: 100%;
    flex: 1;

    .chat-palette-setting-component {
      height: 100%;
      flex: 1;
    }
  }
}
</style>
