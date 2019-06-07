<template>
  <window-frame
    titleText="バージョン"
    display-property="private.display.versionWindow"
    align="center"
    fixSize="500, 158"
  >
    <logo />
  </window-frame>
</template>

<script lang="ts">
import CtrlButton from "@/components/parts/CtrlButton.vue";
import WindowFrame from "../WindowFrame.vue";
import WindowMixin from "../WindowMixin.vue";
import Logo from "./Logo.vue";

import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: {
    CtrlButton,
    WindowFrame,
    Logo
  }
})
export default class VersionWindow extends Mixins<WindowMixin>(WindowMixin) {
  @Action("windowClose") private windowClose: any;
  @Getter("version") private version: any;

  cancel(): void {
    this.windowClose("private.display.versionWindow");
  }
}
</script>

<style scoped lang="scss"></style>
