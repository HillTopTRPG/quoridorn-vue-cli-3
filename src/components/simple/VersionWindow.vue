<template>
  <window-frame titleText="バージョン" display-property="private.display.versionWindow" align="center" fixSize="300, 158">
    <div class="contents">
      <div class="logo-container" @contextmenu.prevent>
        <logo/>
      </div>
      <div class="footer">
        <span>Quoridorn Ver.{{version}}</span>
        <button @click="cancel" @contextmenu.prevent>閉じる</button>
      </div>
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowFrame from "../WindowFrame.vue";
import WindowMixin from "../WindowMixin.vue";
import Logo from "./Logo.vue";

import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: {
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.contents {
  position: absolute;
  height: 100%;
  width: 100%;
  font-size: 12px;
}
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.3em;
  font-size: 16px;
  pointer-events: none;
  user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}
.footer {
  display: flex;
  justify-content: space-between;
}
</style>
