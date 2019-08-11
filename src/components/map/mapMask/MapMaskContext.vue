<template>
  <context-frame displayProperty="private.display.mapMaskContext">
    <div class="item" @click.left.prevent="editObj">変更</div>
    <div class="item" @click.left.prevent="copyObj">複製</div>
    <div class="item" @click.left.prevent="deleteObj">削除</div>
    <hr />
    <div class="item" @click.left.prevent="changeLock">
      固定{{ isLock ? "を解除" : "" }}
    </div>
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
export default class MapMaskContext extends Mixins<WindowMixin>(WindowMixin) {
  @Action("windowOpen") private windowOpen: any;
  @Action("setProperty") private setProperty: any;
  @Action("changeListObj") private changeListObj: any;
  @Action("copyListObj") private copyListObj: any;
  @Action("deleteListObj") private deleteListObj: any;
  @Action("windowClose") private windowClose: any;
  @Getter("mapMaskContextObjKey") private mapMaskContextObjKey: any;
  @Getter("playerKey") private playerKey: any;
  @Getter("getObj") private getObj: any;

  private editObj(): void {
    this.setProperty({
      property: "private.display.editMapMaskWindow.key",
      value: this.mapMaskContextObjKey,
      logOff: true
    });
    this.windowOpen("private.display.editMapMaskWindow");
    this.windowClose("private.display.mapMaskContext");
  }
  private changeLock(): void {
    this.changeListObj({
      key: this.mapMaskContextObjKey,
      isLock: !this.isLock,
      isNotice: true
    });
    this.windowClose("private.display.mapMaskContext");
  }
  private copyObj(): void {
    this.copyListObj({
      key: this.mapMaskContextObjKey
    });
    this.windowClose("private.display.mapMaskContext");
  }
  private deleteObj(): void {
    this.deleteListObj({
      propName: "mapMask",
      key: this.mapMaskContextObjKey,
      owner: this.playerKey,
      isNotice: true
    });
    this.windowClose("private.display.mapMaskContext");
  }

  private get isLock(): boolean {
    const mapMaskObj = this.getObj(this.mapMaskContextObjKey);
    if (!mapMaskObj) return false;
    return mapMaskObj.isLock;
  }

  private changeIsHideBorder(isBorderHide: boolean): void {
    this.changeListObj({
      key: this.mapMaskContextObjKey,
      isBorderHide,
      isNotice: true
    });
    this.windowClose("private.display.mapMaskContext");
  }

  private get isBorderHide(): boolean {
    const mapMaskObj = this.getObj(this.mapMaskContextObjKey);
    return mapMaskObj ? mapMaskObj.isBorderHide : null;
  }
}
</script>
