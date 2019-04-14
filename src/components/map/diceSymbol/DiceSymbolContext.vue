<template>
  <context-frame displayProperty="private.display.diceSymbolContext">
    <div class="item" @click.left.prevent="openOnClick" v-if="isHide">ダイス目を公開する</div>
    <div class="item" @click.left.prevent="diceRollOnClick">ダイスを振る</div>
    <hr>
    <div
      v-for="pips in pipsList"
      :key="pips"
      class="item"
      @click.left.prevent="changePipsOnClick(pips)"
    >ダイス目を{{pips}}に</div>
    <hr v-if="!isHide">
    <div class="item" @click.left.prevent="hideOnClick" v-if="!isHide">ダイス目を隠す</div>
    <hr>
    <div class="item" @click.left.prevent="deleteDiceOnClick">ダイスの削除</div>
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
export default class DiceSymbolContext extends Mixins<WindowMixin>(
  WindowMixin
) {
  @Action("setProperty") private setProperty: any;
  @Action("windowClose") private windowClose: any;
  @Action("changeListObj") private changeListObj: any;
  @Action("deleteListObj") private deleteListObj: any;
  @Getter("getObj") private getObj: any;
  @Getter("dice") private dice: any;

  private diceRollOnClick() {
    this.windowClose("private.display.diceSymbolContext");
  }

  private changePipsOnClick(pips: number) {
    this.changeListObj({
      key: this.objKey,
      pips
    });
    this.windowClose("private.display.diceSymbolContext");
  }

  private openOnClick() {
    this.changeListObj({
      key: this.objKey,
      isHide: false
    });
    this.windowClose("private.display.diceSymbolContext");
  }

  private hideOnClick() {
    this.changeListObj({
      key: this.objKey,
      isHide: true
    });
    this.windowClose("private.display.diceSymbolContext");
  }

  private deleteDiceOnClick() {
    this.deleteListObj({ key: this.objKey });
    this.windowClose("private.display.diceSymbolContext");
  }

  private get objKey() {
    return this.$store.state.private.display.diceSymbolContext.objKey;
  }

  private get isHide(): boolean {
    const diceObj: any = this.getObj(this.objKey);
    return diceObj.isHide;
  }

  private get pipsList(): number[] {
    const pipsList: number[] = [];
    const diceObj: any = this.getObj(this.objKey);
    if (!diceObj) return pipsList;

    window.console.log(diceObj, this.dice[diceObj.faceNum]);
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
