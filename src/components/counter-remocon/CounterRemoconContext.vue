<template>
  <context-frame displayProperty="private.display.counterRemoconContext">
    <div class="item" @click.left.prevent="changeOnClick">ボタンの変更</div>
    <hr>
    <div class="item" @click.left.prevent="deleteOnClick">ボタンの削除</div>
    <hr>
    <div class="item" @click.left.prevent="copyOnClick">ボタンの複製</div>
    <hr>
    <div class="item" @click.left.prevent="moveRightOnClick">ボタンを【&emsp;&emsp;右→】へ</div>
    <div class="item" @click.left.prevent="moveLeftOnClick">ボタンを【←左&emsp;&emsp;】へ</div>
  </context-frame>
</template>

<script lang="ts">
import ContextFrame from "../ContextFrame.vue";
import WindowMixin from "../WindowMixin.vue";

import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({ components: { ContextFrame } })
export default class CounterRemoconContext extends Mixins<WindowMixin>(
  WindowMixin
) {
  @Action("windowOpen") private windowOpen: any;
  @Action("setProperty") private setProperty: any;
  @Action("windowClose") private windowClose: any;
  @Getter("getObj") private getObj: any;
  @Getter("remoconContextKey") private remoconContextKey: any;

  private changeOnClick(): void {
    window.console.log("changeOnClick", this.remoconContextKey);
    this.setProperty({
      property: `private.display.counterRemoconEditorWindow.objKey`,
      value: this.remoconContextKey,
      isNotice: false,
      logOff: false
    });
    this.windowClose("private.display.counterRemoconContext");
    this.windowOpen("private.display.counterRemoconEditorWindow");
  }

  private deleteOnClick(): void {
    // TODO
    window.console.log("deleteOnClick");
    alert("未実装です");
    this.windowClose("private.display.counterRemoconContext");
  }

  private copyOnClick(): void {
    // TODO
    window.console.log("copyOnClick");
    alert("未実装です");
    this.windowClose("private.display.counterRemoconContext");
  }

  private moveRightOnClick(): void {
    // TODO
    window.console.log("moveRightOnClick");
    alert("未実装です");
    this.windowClose("private.display.counterRemoconContext");
  }

  private moveLeftOnClick(): void {
    // TODO
    window.console.log("moveLeftOnClick");
    alert("未実装です");
    this.windowClose("private.display.counterRemoconContext");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
