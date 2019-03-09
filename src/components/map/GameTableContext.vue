<template>
  <context-frame displayProperty="private.display.gameTableContext">
    <div class="item" @click.left.prevent="addCharacter">キャラクター追加</div>
    <div class="item" @click.left.prevent="addMapMask">マップマスク追加</div>
    <div class="item" @click.left.prevent="addMapMarker">マップマーカー追加</div>
    <hr>
    <div class="item" @click.left.prevent="addDiceSymbol">ダイスシンボル追加</div>
    <hr>
    <div class="item" @click.left.prevent="createHandCardArea">手札置き場の作成</div>
    <div class="item" @click.left.prevent="createMessageCard">メッセージカード作成</div>
    <hr>
    <div class="item" @click.left.prevent="resetWindowLocate">ウィンドウ配置初期化</div>
  </context-frame>
</template>

<script>
import { mapActions } from "vuex";
import ContextFrame from "../ContextFrame";
import WindowMixin from "../WindowMixin";
import { qLog } from "../common/Utility";

export default {
  mixins: [WindowMixin],
  components: {
    ContextFrame
  },
  methods: {
    ...mapActions([
      "windowOpen",
      "setProperty",
      "windowClose",
      "doResetWindowLocate"
    ]),
    addCharacter() {
      qLog(`  [methods] select context => item: GameTable.addCharacter`);
      this.windowOpen("private.display.addCharacterSettingWindow");
      this.windowClose("private.display.gameTableContext");
    },
    addMapMask() {
      qLog(`  [methods] select context => item: GameTable.addMapMask`);
      this.windowOpen("private.display.addMapMaskWindow");
      this.windowClose("private.display.gameTableContext");
    },
    addMapMarker() {
      qLog(`  [methods] select context => item: GameTable.addMapMarker`);
      this.setProperty({
        property: "private.display.unSupportWindow.title",
        value: "マップマーカー追加",
        logOff: true
      });
      this.windowOpen("private.display.unSupportWindow");
      this.windowClose("private.display.gameTableContext");
    },
    addDiceSymbol() {
      qLog(`  [methods] select context => item: GameTable.addDiceSymbol`);
      this.setProperty({
        property: "private.display.unSupportWindow.title",
        value: "ダイスシンボル追加",
        logOff: true
      });
      this.windowOpen("private.display.unSupportWindow");
      this.windowClose("private.display.gameTableContext");
    },
    createHandCardArea() {
      qLog(`  [methods] select context => item: GameTable.createHandCardArea`);
      alert("未実装の機能です。");
      this.windowClose("private.display.gameTableContext");
    },
    createMessageCard() {
      qLog(`  [methods] select context => item: GameTable.createMessageCard`);
      this.setProperty({
        property: "private.display.unSupportWindow.title",
        value: "メッセージカード追加",
        logOff: true
      });
      this.windowOpen("private.display.unSupportWindow");
      this.windowClose("private.display.gameTableContext");
    },
    resetWindowLocate() {
      qLog(`  [methods] select context => item: GameTable.resetWindowLocate`);
      this.doResetWindowLocate();
      this.windowClose("private.display.gameTableContext");
    }
  }
};
</script>
