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
  @Action("deleteListObj") private deleteListObj: any;
  @Action("copyListObj") private copyListObj: any;
  @Getter("getObj") private getObj: any;
  @Getter("remoconContextKey") private remoconContextKey: any;

  private changeOnClick(): void {
    this.setProperty({
      property: `private.display.counterRemoconEditorWindow.objKey`,
      value: this.remoconContextKey,
      isNotice: false,
      logOff: true
    });
    this.windowClose("private.display.counterRemoconContext");
    this.windowOpen("private.display.counterRemoconEditorWindow");
  }

  private deleteOnClick(): void {
    this.deleteListObj({
      propName: "counterRemocon",
      key: this.remoconContextKey,
      isNotice: true
    });
    this.windowClose("private.display.counterRemoconContext");
  }

  private copyOnClick(): void {
    this.copyListObj({
      key: this.remoconContextKey
    });
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
