<template>
  <context-frame displayProperty="private.display.publicMemoContext">
    <div class="item" @click.left.prevent="viewItemOnClick">表示</div>
    <hr>
    <div class="item" @click.left.prevent="editItemOnClick">編集</div>
    <hr>
    <div class="item" @click.left.prevent="deleteItemOnClick">削除</div>
  </context-frame>
</template>

<script lang="ts">
import ContextFrame from "../ContextFrame.vue";
import WindowMixin from "../WindowMixin.vue";

import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({ components: { ContextFrame } })
export default class PublicMemoContext extends Mixins<WindowMixin>(
  WindowMixin
) {
  @Action("windowOpen") private windowOpen: any;
  @Action("setProperty") private setProperty: any;
  @Action("changeListObj") private changeListObj: any;
  @Action("deleteListObj") private deleteListObj: any;
  @Action("windowClose") private windowClose: any;
  @Getter("getObj") private getObj: any;
  @Getter("characterContextObjKey") private characterContextObjKey: any;
  @Getter("playerKey") private playerKey: any;
  @Getter("mapMaskIsLock") private mapMaskIsLock: any;

  private viewItemOnClick() {
    this.openPublicMemoWindow(false);
    this.windowClose("private.display.publicMemoContext");
  }

  private editItemOnClick() {
    this.openPublicMemoWindow(true);
    this.windowClose("private.display.publicMemoContext");
  }

  private openPublicMemoWindow(isEditMode: boolean) {
    this.setProperty({
      property: "private.display.publicMemoWindow",
      value: {
        objKey: this.objKey,
        isEditMode: isEditMode
      }
    });
    this.windowOpen("private.display.publicMemoWindow");
    this.windowClose("private.display.publicMemoContext");
  }

  private deleteItemOnClick() {
    this.deleteListObj({
      propName: "publicMemo",
      key: this.objKey
    });
    this.windowClose("private.display.publicMemoContext");
  }

  viewEditCharacter(): void {
    this.setProperty({
      property: "private.display.editCharacterWindow.key",
      value: this.characterContextObjKey
    });
    this.windowOpen("private.display.editCharacterWindow");
    this.windowClose("private.display.characterContext");
  }

  private get objKey() {
    return this.$store.state.private.display.publicMemoContext.objKey;
  }
}
</script>
