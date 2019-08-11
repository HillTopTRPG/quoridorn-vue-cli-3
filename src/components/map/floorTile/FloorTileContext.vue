<template>
  <context-frame displayProperty="private.display.floorTileContext">
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
export default class FloorTileContext extends Mixins<WindowMixin>(WindowMixin) {
  @Action("windowOpen") private windowOpen: any;
  @Action("setProperty") private setProperty: any;
  @Action("deleteListObj") private deleteListObj: any;
  @Action("changeListObj") private changeListObj: any;
  @Action("copyListObj") private copyListObj: any;
  @Action("windowClose") private windowClose: any;
  @Getter("floorTileContextObjKey") private floorTileContextObjKey: any;
  @Getter("playerKey") private playerKey: any;
  @Getter("getObj") private getObj: any;

  private editObj() {
    this.setProperty({
      property: "private.display.editFloorTileWindow.key",
      value: this.floorTileContextObjKey,
      logOff: true
    });
    this.windowOpen("private.display.editFloorTileWindow");
    this.windowClose("private.display.floorTileContext");
  }
  private changeLock(): void {
    this.changeListObj({
      key: this.floorTileContextObjKey,
      isLock: !this.isLock,
      isNotice: true
    });
    this.windowClose("private.display.floorTileContext");
  }
  private copyObj(): void {
    this.copyListObj({
      key: this.floorTileContextObjKey
    });
    this.windowClose("private.display.floorTileContext");
  }
  private deleteObj(): void {
    this.deleteListObj({
      propName: "floorTile",
      key: this.floorTileContextObjKey,
      owner: this.playerKey,
      isNotice: true
    });
    this.windowClose("private.display.floorTileContext");
  }

  private get isLock(): boolean {
    const floorTileObj = this.getObj(this.floorTileContextObjKey);
    if (!floorTileObj) return false;
    return floorTileObj.isLock;
  }

  private changeIsHideBorder(isBorderHide: boolean): void {
    this.changeListObj({
      key: this.floorTileContextObjKey,
      isBorderHide,
      isNotice: true
    });
    this.windowClose("private.display.floorTileContext");
  }

  private get isBorderHide(): boolean {
    const floorTileObj = this.getObj(this.floorTileContextObjKey);
    return floorTileObj ? floorTileObj.isBorderHide : null;
  }
}
</script>
