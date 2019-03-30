<template>
  <context-frame displayProperty="private.display.chitContext">
    <div class="item" @click.left.prevent="viewEditChit">変更</div>
    <div class="item" @click.left.prevent="copyChit">複製</div>
    <div class="item" @click.left.prevent="deleteChit">削除</div>
  </context-frame>
</template>

<script lang="ts">
import ContextFrame from "../../ContextFrame.vue";
import WindowMixin from "../../WindowMixin.vue";

import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: {
    ContextFrame
  }
})
export default class ChitContext extends Mixins<WindowMixin>(WindowMixin) {
  @Action("windowOpen") private windowOpen: any;
  @Action("setProperty") private setProperty: any;
  @Action("deleteListObj") private deleteListObj: any;
  @Action("windowClose") private windowClose: any;
  @Getter("getObj") private getObj: any;
  @Getter("chitContextObjKey") private chitContextObjKey: any;
  @Getter("playerKey") private playerKey: any;

  viewEditChit() {
    window.console.log(
      `  [methods] select context => item: Chit(${
        this.chitContextObjKey
      }).viewEditChit`
    );
    this.setProperty({
      property: "private.display.editChitWindow.key",
      value: this.chitContextObjKey
    });
    this.windowOpen("private.display.editChitWindow");
    this.windowClose("private.display.chitContext");
  }
  copyChit() {
    window.console.log(
      `  [methods] select context => item: Chit(${
        this.chitContextObjKey
      }).copyChit`
    );
    alert("未実装の機能です");
    this.windowClose("private.display.chitContext");
  }
  deleteChit() {
    window.console.log(
      `  [methods] select context => item: Chit(${
        this.chitContextObjKey
      }).deleteChit`
    );
    this.deleteListObj({
      propName: "chit",
      key: this.chitContextObjKey,
      owner: this.playerKey,
      isNotice: true
    });
    this.windowClose("private.display.chitContext");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
