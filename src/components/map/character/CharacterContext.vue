<template>
  <context-frame displayProperty="private.display.characterContext">
    <div class="item" @click.left.prevent="viewEditCharacter">変更</div>
    <hr>
    <div class="item" v-if="place !== 'field'" @click.left.prevent="moveToField">マップに移動</div>
    <div class="item" v-if="place !== 'waiting'" @click.left.prevent="moveToWaitRoom">キャラクター待合室に移動</div>
    <div class="item" v-if="place !== 'graveyard'" @click.left.prevent="moveToGraveyard">墓場に移動（削除）</div>
    <hr>
    <div class="item" @click.left.prevent="copyCharacter">複製</div>
    <template v-if="characterContextObjKey !== null && getObj(characterContextObjKey).url">
      <hr>
      <div class="item" @click.left.prevent="openRefURL">データ参照先URLを開く</div>
    </template>
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
export default class CharacterContext extends Mixins<WindowMixin>(WindowMixin) {
  @Action("windowOpen") private windowOpen: any;
  @Action("setProperty") private setProperty: any;
  @Action("changeListObj") private changeListObj: any;
  @Action("windowClose") private windowClose: any;
  @Getter("getObj") private getObj: any;
  @Getter("characterContextObjKey") private characterContextObjKey: any;
  @Getter("playerKey") private playerKey: any;
  @Getter("mapMaskIsLock") private mapMaskIsLock: any;

  viewEditCharacter(): void {
    this.setProperty({
      property: "private.display.editCharacterWindow.key",
      value: this.characterContextObjKey,
      logOff: true
    });
    this.windowOpen("private.display.editCharacterWindow");
    this.windowClose("private.display.characterContext");
  }
  moveToField(): void {
    this.moveTo("field");
  }
  moveToWaitRoom(): void {
    this.moveTo("waiting");
  }
  moveToGraveyard(): void {
    this.moveTo("graveyard");
  }
  private moveTo(place: string): void {
    this.changeListObj({
      key: this.characterContextObjKey,
      place: place,
      isNotice: true
    });
    this.windowClose("private.display.characterContext");
  }
  copyCharacter(): void {
    this.windowClose("private.display.characterContext");
    alert("未実装の機能です。");
  }
  openRefURL(): void {
    window.open(this.getObj(this.characterContextObjKey).url, "_blank");
    this.windowClose("private.display.characterContext");
  }
  get place(): string {
    const character = this.getObj(this.characterContextObjKey);
    return character ? character.place : null;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
