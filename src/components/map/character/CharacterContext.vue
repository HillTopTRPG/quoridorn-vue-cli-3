<template>
  <ContextFrame displayProperty="private.display.characterContext">
    <div class="item" @click.left.prevent="viewEditCharacter">変更</div>
    <hr>
    <div class="item" @click.left.prevent="moveToWaitRoom">キャラクター待合室に移動</div>
    <div class="item" @click.left.prevent="moveToGraveyard">墓場に移動（削除）</div>
    <hr>
    <div class="item" @click.left.prevent="copyCharacter">複製</div>
    <template v-if="characterContextObjKey !== -1 ? getObj(characterContextObjKey).url : null">
      <hr>
      <div class="item" @click.left.prevent="openRefURL">データ参照先URLを開く</div>
    </template>
  </ContextFrame>
</template>

<script lang="ts">
import ContextFrame from "../../ContextFrame.vue";
import WindowMixin from "../../WindowMixin.vue";

import { Component, Vue } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";

@Component<CharacterContext>({
  name: "characterContext",
  mixins: [WindowMixin],
  components: {
    ContextFrame
  }
})
export default class CharacterContext extends Vue {
  @Action("windowOpen") windowOpen: any;
  @Action("setProperty") setProperty: any;
  @Action("changeListInfo") changeListInfo: any;
  @Action("windowClose") windowClose: any;
  @Action("getObj") getObj: any;
  @Getter("characterContextObjKey") characterContextObjKey: any;
  @Getter("playerKey") playerKey: any;
  @Getter("mapMaskIsLock") mapMaskIsLock: any;

  viewEditCharacter(): void {
    window.console.log(
      `  [methods] select context => item: Character(${
        this.characterContextObjKey
      }).viewEditCharacter`
    );
    this.setProperty({
      property: "private.display.editCharacterWindow.key",
      value: this.characterContextObjKey
    });
    this.windowOpen("private.display.editCharacterWindow");
    this.windowClose("private.display.characterContext");
  }
  moveToWaitRoom(): void {
    this.changeListInfo({
      key: this.characterContextObjKey,
      place: "waiting",
      isNotice: true
    });
    this.windowClose("private.display.characterContext");
  }
  moveToGraveyard(): void {
    this.changeListInfo({
      key: this.characterContextObjKey,
      place: "graveyard",
      isNotice: true
    });
    this.windowClose("private.display.characterContext");
  }
  copyCharacter(): void {
    window.console.log(
      `  [methods] select context => item: Character(${
        this.characterContextObjKey
      }).copyCharacter`
    );
    this.windowClose("private.display.characterContext");
    alert("未実装の機能です。");
  }
  openRefURL(): void {
    window.open(this.getObj(this.characterContextObjKey).url, "_blank");
    this.windowClose("private.display.characterContext");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
