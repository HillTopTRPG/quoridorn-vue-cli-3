<template>
  <context-frame displayProperty="private.display.diceSymbolContext">
    <template v-if="!isAbsoluteHide">
      <div class="item" @click.left.prevent="openOnClick" v-if="isHide">
        ダイス目を公開する
      </div>

      <div class="item" @click.left.prevent="diceRollOnClick">
        ダイスを振る
      </div>

      <hr />

      <div
        v-for="pips in pipsList"
        :key="pips"
        class="item"
        @click.left.prevent="changePipsOnClick(pips)"
      >
        ダイス目を{{ pips }}に
      </div>

      <hr v-if="!isHide" />

      <div class="item" @click.left.prevent="hideOnClick" v-if="!isHide">
        ダイス目を隠す
      </div>

      <hr />

      <div class="item" @click.left.prevent="deleteDiceOnClick">
        ダイスの削除
      </div>
    </template>

    <div
      class="item disabled"
      v-if="isAbsoluteHide"
      @click.left.prevent="closeContextOnClick"
    >
      操作できません
    </div>
  </context-frame>
</template>

<script lang="ts">
import ContextFrame from "../../ContextFrame.vue";
import WindowMixin from "../../WindowMixin.vue";

import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({ components: { ContextFrame } })
export default class DiceSymbolContext extends Mixins<WindowMixin>(
  WindowMixin
) {
  @Action("setProperty") private setProperty: any;
  @Action("windowClose") private windowClose: any;
  @Action("changeListObj") private changeListObj: any;
  @Action("deleteListObj") private deleteListObj: any;
  @Action("sendBcdiceServer") private sendBcdiceServer: any;
  @Action("addChatLog") private addChatLog: any;
  @Getter("getObj") private getObj: any;
  @Getter("dice") private dice: any;
  @Getter("playerKey") private playerKey: any;

  private diceRollOnClick() {
    const diceObj: any = this.getObj(this.objKey);
    const command: string = `1D${diceObj.faceNum}`;
    const ownerPlayer: any = this.getObj(diceObj.owner);

    this.sendBcdiceServer({
      system: "DiceBot",
      command
    }).then((json: any) => {
      if (json.ok) {
        // bcdiceとして結果が取れた場合
        const resultValue = json.result.replace(/^.+＞ /, "");
        if (/^-?[0-9]+$/.test(resultValue)) {
          // 数値として応答された
          const matchResult = json.result.match(/^.+＞ ([^＞]+) ＞ [^＞]+$/);

          const pips: number = parseInt(resultValue, 10);
          // ログに出力
          if (!diceObj.isHide) {
            this.addChatLog({
              text: `ダイス合計：${pips}(${command} = [${pips}])`
            });
          }
          // 応答の結果をもって更新 -----------------------------------------------------------------------------------
          this.changePipsOnClick(pips);
          return;
        }
      }
      alert("実行結果で数値が取得できませんでした。\nキャンセルします。");
    });
  }

  private changePipsOnClick(pips: number) {
    const diceObj: any = this.getObj(this.objKey);
    const ownerPlayer: any = this.getObj(diceObj.owner);

    let text: string = `「${
      ownerPlayer.name
    }」のダイスシンボルの値が変更されました。`;
    if (!diceObj.isHide) text += `(${diceObj.pips}→${pips})`;
    // ログに出力
    this.addChatLog({ text });
    this.windowClose("private.display.diceSymbolContext");

    // ダイスシンボルに反映
    this.changeListObj({
      key: this.objKey,
      pips,
      owner: this.playerKey
    });
  }

  private openOnClick() {
    this.changeListObj({ key: this.objKey, isHide: false });
    this.windowClose("private.display.diceSymbolContext");
  }

  private hideOnClick() {
    this.changeListObj({ key: this.objKey, isHide: true });
    this.windowClose("private.display.diceSymbolContext");
  }

  private deleteDiceOnClick() {
    this.deleteListObj({ key: this.objKey, propName: "diceSymbol" });
    this.windowClose("private.display.diceSymbolContext");
  }

  private closeContextOnClick() {
    this.windowClose("private.display.diceSymbolContext");
  }

  private get objKey() {
    return this.$store.state.private.display.diceSymbolContext.objKey;
  }

  private get isHide(): boolean {
    const diceObj: any = this.getObj(this.objKey);
    return diceObj ? diceObj.isHide : false;
  }

  private get isAbsoluteHide() {
    if (!this.isHide) return false;
    return this.owner !== this.playerKey;
  }

  private get owner() {
    const diceObj: any = this.getObj(this.objKey);
    return diceObj ? diceObj.owner : null;
  }

  private get pipsList(): number[] {
    const pipsList: number[] = [];
    const diceObj: any = this.getObj(this.objKey);
    if (!diceObj) return pipsList;

    const diceSetList: any[] = this.dice[diceObj.faceNum];
    const diceSetObj = diceSetList.filter(
      diceSet => diceSet.type === diceObj.type
    )[0];
    if (!diceSetObj) return pipsList;

    const pipsContainer: any = diceSetObj.pips;
    for (const pips in pipsContainer) {
      if (!pipsContainer.hasOwnProperty(pips)) continue;
      pipsList.push(parseInt(pips, 10));
    }
    pipsList.sort((pips1, pips2) => {
      if (pips1 < pips2) return -1;
      if (pips1 > pips2) return 1;
      return 0;
    });
    return pipsList;
  }
}
</script>
