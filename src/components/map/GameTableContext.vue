<template>
  <context-frame displayProperty="private.display.gameTableContext">
    <div class="item" @click.left.prevent="addCharacter">キャラクター追加</div>
    <div class="item" @click.left.prevent="addMapMask">マップマスク追加</div>
    <div class="item" @click.left.prevent="addMapMarker">マップマーカー追加</div>
    <div class="item" @click.left.prevent="addChit">チット追加</div>
    <hr>
    <div class="item" @click.left.prevent="addDiceSymbol">ダイスシンボル追加</div>
    <hr>
    <div class="item" @click.left.prevent="changeMap">マップ変更</div>
    <hr>
    <div class="item" @click.left.prevent="createHandCardArea">手札置き場の作成</div>
    <div class="item" @click.left.prevent="createMessageCard">メッセージカード作成</div>
    <hr>
    <div class="item" @click.left.prevent="resetWindowLocate">ウィンドウ配置初期化</div>
  </context-frame>
</template>

<script lang="ts">
import ContextFrame from "../ContextFrame";
import WindowMixin from "../WindowMixin";
import { qLog } from "../common/Utility";

import { Action } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: { ContextFrame }
})
export default class GameTableContext extends Mixins<WindowMixin>(WindowMixin) {
  @Action("windowOpen") private windowOpen: any;
  @Action("setProperty") private setProperty: any;
  @Action("windowClose") private windowClose: any;
  @Action("doResetWindowLocate") private doResetWindowLocate: any;

  private addCharacter(): void {
    this.windowOpen("private.display.addCharacterSettingWindow");
    this.windowClose("private.display.gameTableContext");
  }

  private addMapMask(): void {
    this.windowOpen("private.display.addMapMaskWindow");
    this.windowClose("private.display.gameTableContext");
  }

  private addMapMarker(): void {
    this.setProperty({
      property: "private.display.unSupportWindow.title",
      value: "マップマーカー追加",
      logOff: true
    });
    this.windowOpen("private.display.unSupportWindow");
    this.windowClose("private.display.gameTableContext");
  }

  private addChit(): void {
    this.windowOpen("private.display.addChitWindow");
    this.windowClose("private.display.gameTableContext");
  }

  private addDiceSymbol(): void {
    this.windowOpen("private.display.addDiceSymbolWindow");
    this.windowClose("private.display.gameTableContext");
  }

  private changeMap(): void {
    this.windowOpen("private.display.editMapWindow");
    this.windowClose("private.display.gameTableContext");
  }

  private createHandCardArea(): void {
    qLog(`  [methods] select context => item: GameTable.createHandCardArea`);
    alert("未実装の機能です。");
    this.windowClose("private.display.gameTableContext");
  }

  private createMessageCard(): void {
    qLog(`  [methods] select context => item: GameTable.createMessageCard`);
    this.setProperty({
      property: "private.display.unSupportWindow.title",
      value: "メッセージカード追加",
      logOff: true
    });
    this.windowOpen("private.display.unSupportWindow");
    this.windowClose("private.display.gameTableContext");
  }

  private resetWindowLocate(): void {
    qLog(`  [methods] select context => item: GameTable.resetWindowLocate`);
    this.doResetWindowLocate();
    this.windowClose("private.display.gameTableContext");
  }
}
</script>
