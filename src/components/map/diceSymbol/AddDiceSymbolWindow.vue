<template>
  <window-frame
    titleText="ダイスシンボル生成"
    display-property="private.display.addDiceSymbolWindow"
    align="center"
    fixSize="240, 130"
    @open="open"
    @reset="open"
  >
    <div class="container" @contextmenu.prevent>
      <div class="control">
        <label>
          <span>ダイス目</span>
          <input
            type="number"
            min="1"
            :max="faceNum"
            v-model="pips"
            ref="input"
            @keydown.enter.stop
            @keyup.enter.stop
            @keydown.229.stop
            @keyup.229.stop
          />
        </label>
        <label>
          <span>ダイス種別</span>
          <ctrl-select
            v-model="faceNum"
            :optionInfoList="faceNumOptionInfoList"
          />
        </label>
        <label
          :style="{
            visibility:
              dice[faceNum] && dice[faceNum].length > 1 ? 'visible' : 'hidden'
          }"
        >
          <span></span>
          <ctrl-select
            v-model="type"
            :optionInfoList="diceTypeOptionInfoList"
          />
        </label>
        <label>
          <input
            type="checkbox"
            v-model="isHide"
            @keydown.enter.stop
            @keyup.enter.stop
            @keydown.229.stop
            @keyup.229.stop
          />
          <span>ダイス目を隠して置く</span>
        </label>
      </div>
      <div class="imageContainer">
        <img
          class="img"
          v-img="diceImage"
          @dragstart="dragStart"
          draggable="true"
          @mousedown.stop
        />
      </div>
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowFrame from "../../WindowFrame.vue";
import WindowMixin from "../../WindowMixin.vue";
import CtrlSelect from "@/components/parts/CtrlSelect.vue";

import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";
import { Watch } from "vue-property-decorator";

@Component({
  components: {
    CtrlSelect,
    WindowFrame
  }
})
export default class AddDiceSymbolWindow extends Mixins<WindowMixin>(
  WindowMixin
) {
  @Action("windowOpen") private windowOpen: any;
  @Action("windowClose") private windowClose: any;
  @Getter("imageTagList") private imageTagList: any;
  @Getter("imageList") private imageList: any;
  @Getter("dice") private dice: any;
  @Getter("dicePipsImage") private dicePipsImage: any;

  private faceNum: string = "6";
  private type: string = "";
  private pips: number = 1;
  private isHide: boolean = false;

  private open() {
    this.faceNum = "6";
    this.pips = 1;
    this.isHide = false;
    this.onChangeFaceNum(this.faceNum);

    const input: HTMLInputElement = this.$refs.input as HTMLInputElement;
    input.focus();
  }

  @Watch("faceNum", { immediate: true })
  onChangeFaceNum(faceNum: string) {
    this.pips = 1;
    const diceSetList: any[] = this.dice[faceNum];
    this.type = diceSetList ? diceSetList[0].type : "";
  }

  private dragStart(event: any) {
    event.dataTransfer.setData("kind", "diceSymbol");
    event.dataTransfer.setData("faceNum", this.faceNum);
    event.dataTransfer.setData("type", this.type);
    event.dataTransfer.setData("pips", this.pips);
    event.dataTransfer.setData("isHide", this.isHide);
  }

  private get diceImage() {
    return this.dicePipsImage(this.faceNum, this.type, this.pips);
  }

  private get faceNumOptionInfoList(): any[] {
    const resultList: any[] = [];
    resultList.push({
      key: 0,
      value: "4",
      text: "D4",
      disabled: false
    });
    resultList.push({
      key: 1,
      value: "6",
      text: "D6",
      disabled: false
    });
    resultList.push({
      key: 2,
      value: "8",
      text: "D8",
      disabled: false
    });
    resultList.push({
      key: 3,
      value: "10",
      text: "D10",
      disabled: false
    });
    resultList.push({
      key: 4,
      value: "12",
      text: "D12",
      disabled: false
    });
    resultList.push({
      key: 5,
      value: "20",
      text: "D20",
      disabled: false
    });
    return resultList;
  }

  private get diceTypeOptionInfoList(): any[] {
    return !this.dice[this.faceNum]
      ? []
      : this.dice[this.faceNum].map((diceObj: any) => ({
          key: diceObj.type,
          value: diceObj.type,
          text: diceObj.label,
          disabled: false
        }));
  }
}
</script>

<style scoped lang="scss">
@import "../../common.scss";

.container {
  @include flex-box(row);
  width: 100%;
  font-size: 12px;

  > * {
    @include flex-box(column);
    min-width: 6em;
  }

  label {
    @include flex-box(row);
    height: 2em;

    span {
      flex: 1;
    }

    input[type="number"],
    select {
      font-size: 12px;
      padding: 0 0.5em;
      margin: 0;
    }

    input[type="number"] {
      min-width: 2.7em;
    }

    select {
      min-width: 4em;
    }
  }

  .imageContainer {
    @include flex-box(row, center, center);
    flex: 1;

    > img {
      max-height: 4em;
    }
  }
}
</style>
