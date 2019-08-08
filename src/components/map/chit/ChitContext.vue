<template>
  <context-frame displayProperty="private.display.chitContext">
    <div class="item" @click.left.prevent="viewEditChit">変更</div>
    <div class="item" @click.left.prevent="copyChit">複製</div>
    <div class="item" @click.left.prevent="deleteChit">削除</div>
    <div class="item" @click.left.prevent="changeIsHideBorder(!isBorderHide)">
      枠線を{{ isBorderHide ? "表示" : "非表示" }}
    </div>
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
  @Action("changeListObj") private changeListObj: any;
  @Action("copyListObj") private copyListObj: any;
  @Action("windowClose") private windowClose: any;
  @Getter("chitContextObjKey") private chitContextObjKey: any;
  @Getter("playerKey") private playerKey: any;
  @Getter("getObj") private getObj: any;

  private viewEditChit() {
    this.setProperty({
      property: "private.display.editChitWindow.key",
      value: this.chitContextObjKey
    });
    this.windowOpen("private.display.editChitWindow");
    this.windowClose("private.display.chitContext");
  }

  private copyChit(): void {
    this.copyListObj({
      key: this.chitContextObjKey
    });
    this.windowClose("private.display.chitContext");
  }

  private deleteChit() {
    this.deleteListObj({
      propName: "chit",
      key: this.chitContextObjKey,
      owner: this.playerKey,
      isNotice: true
    });
    this.windowClose("private.display.chitContext");
  }

  private changeIsHideBorder(isBorderHide: boolean): void {
    this.changeListObj({
      key: this.chitContextObjKey,
      isBorderHide,
      isNotice: true
    });
    this.windowClose("private.display.chitContext");
  }

  private get isBorderHide(): boolean {
    const character = this.getObj(this.chitContextObjKey);
    return character ? character.isBorderHide : null;
  }
}
</script>
