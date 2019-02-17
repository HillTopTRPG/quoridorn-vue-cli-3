<template>
  <ContextFrame displayProperty="private.display.mapMaskContext">
    <div class="item" @click.left.prevent="viewEditMapMask">変更</div>
    <div class="item" @click.left.prevent="changeMapMaskLock" v-show="!mapMaskIsLock">固定</div>
    <div class="item" @click.left.prevent="changeMapMaskLock" v-show="mapMaskIsLock">固定を解除</div>
    <div class="item" @click.left.prevent="deleteMapMask">削除</div>
  </ContextFrame>
</template>

<script lang="ts">
import ContextFrame from "../../ContextFrame.vue";
import WindowMixin from "../../WindowMixin.vue";

import { Component, Vue } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";

@Component<MapMaskContext>({
  name: "mapMaskContext",
  mixins: [WindowMixin],
  components: {
    ContextFrame
  }
})
export default class MapMaskContext extends Vue {
  @Action("windowOpen") windowOpen: any;
  @Action("setProperty") setProperty: any;
  @Action("changeListInfo") changeListInfo: any;
  @Action("deletePieceInfo") deletePieceInfo: any;
  @Action("windowClose") windowClose: any;
  @Getter("mapMaskContextObjKey") mapMaskContextObjKey: any;
  @Getter("playerKey") playerKey: any;
  @Getter("mapMaskIsLock") mapMaskIsLock: any;

  viewEditMapMask() {
    window.console.log(
      `  [methods] select context => item: MapMask(${
        this.mapMaskContextObjKey
      }).viewEditMapMask`
    );
    this.setProperty({
      property: "private.display.editMapMaskWindow.key",
      value: this.mapMaskContextObjKey,
      logOff: true
    });
    this.windowOpen("private.display.editMapMaskWindow");
    this.windowClose("private.display.mapMaskContext");
  }
  changeMapMaskLock() {
    window.console.log(
      `  [methods] select context => item: MapMask(${
        this.mapMaskContextObjKey
      }).changeMapMaskLock`
    );
    this.changeListInfo({
      key: this.mapMaskContextObjKey,
      isLock: !this.mapMaskIsLock,
      isNotice: true
    });
    this.windowClose("private.display.mapMaskContext");
  }
  deleteMapMask() {
    window.console.log(
      `  [methods] select context => item: MapMask(${
        this.mapMaskContextObjKey
      }).deleteMapMask`
    );
    this.deletePieceInfo({
      propName: "mapMask",
      key: this.mapMaskContextObjKey,
      owner: this.playerKey,
      isNotice: true
    });
    this.windowClose("private.display.mapMaskContext");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
