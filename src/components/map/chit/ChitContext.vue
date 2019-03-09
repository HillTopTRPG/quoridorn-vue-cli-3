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

import { Component, Vue } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";

@Component<ChitContext>({
  name: "chitContext",
  mixins: [WindowMixin],
  components: {
    ContextFrame
  }
})
export default class ChitContext extends Vue {
  @Action("windowOpen") windowOpen: any;
  @Action("setProperty") setProperty: any;
  @Action("deletePieceInfo") deletePieceInfo: any;
  @Action("windowClose") windowClose: any;
  @Getter("getObj") getObj: any;
  @Getter("chitContextObjKey") chitContextObjKey: any;
  @Getter("playerKey") playerKey: any;

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
    this.deletePieceInfo({
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
