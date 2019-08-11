<template>
  <context-frame displayProperty="private.display.characterContext">
    <div class="item" @click.left.prevent="editObj">変更</div>
    <div class="item" @click.left.prevent="copyObj">複製</div>
    <hr />
    <div
      class="item"
      v-if="place !== 'field'"
      @click.left.prevent="moveToField"
    >
      マップに移動
    </div>
    <div
      class="item"
      v-if="place !== 'waiting'"
      @click.left.prevent="moveToWaitRoom"
    >
      キャラクター待合室に移動
    </div>
    <div
      class="item"
      v-if="place !== 'graveyard'"
      @click.left.prevent="moveToGraveyard"
    >
      墓場に移動（削除）
    </div>
    <hr />
    <div class="item" @click.left.prevent="changeIsHideBorder(!isBorderHide)">
      枠線を{{ isBorderHide ? "表示" : "非表示" }}
    </div>
    <template
      v-if="
        characterContextObjKey !== null && getObj(characterContextObjKey).url
      "
    >
      <hr />
      <div class="item" @click.left.prevent="openRefURL">
        データ参照先URLを開く
      </div>
    </template>
    <template v-if="isGameMaster">
      <hr />
      <div class="item" @click.left.prevent="getOwner">
        オーナーになる
      </div>
      <div class="item" @click.left.prevent="giveOwner">
        オーナーを渡す
      </div>
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
  @Action("copyListObj") private copyListObj: any;
  @Action("windowClose") private windowClose: any;
  @Getter("getObj") private getObj: any;
  @Getter("characterContextObjKey") private characterContextObjKey: any;
  @Getter("playerKey") private playerKey: any;
  @Getter("isGameMaster") private isGameMaster: any;

  private editObj(): void {
    this.setProperty({
      property: "private.display.editCharacterWindow.key",
      value: this.characterContextObjKey,
      logOff: true
    });
    this.windowOpen("private.display.editCharacterWindow");
    this.windowClose("private.display.characterContext");
  }
  private moveToField(): void {
    this.moveTo("field");
  }
  private moveToWaitRoom(): void {
    this.moveTo("waiting");
  }
  private moveToGraveyard(): void {
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
  private copyObj(): void {
    this.copyListObj({
      key: this.characterContextObjKey
    });
    this.windowClose("private.display.characterContext");
  }
  private openRefURL(): void {
    window.open(this.getObj(this.characterContextObjKey).url, "_blank");
    this.windowClose("private.display.characterContext");
  }
  private get place(): string {
    const character = this.getObj(this.characterContextObjKey);
    return character ? character.place : null;
  }
  private get isBorderHide(): boolean {
    const character = this.getObj(this.characterContextObjKey);
    return character ? character.isBorderHide : null;
  }

  private changeIsHideBorder(isBorderHide: boolean): void {
    this.changeListObj({
      key: this.characterContextObjKey,
      isBorderHide,
      isNotice: true
    });
    this.windowClose("private.display.characterContext");
  }

  private getOwner() {
    const character = this.getObj(this.characterContextObjKey);
    this.changeListObj({
      key: this.characterContextObjKey,
      owner: this.playerKey,
      isNotice: true
    });
  }
  private giveOwner() {
    this.setProperty({
      property: "private.display.selectNewOwnerWindow.objKey",
      value: this.characterContextObjKey,
      logOff: true
    }).then(() => {
      this.windowOpen("private.display.selectNewOwnerWindow");
    });
  }
}
</script>
