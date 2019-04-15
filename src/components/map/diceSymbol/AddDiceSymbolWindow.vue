<template>
  <window-frame
    titleText="ダイスシンボル生成"
    display-property="private.display.addDiceSymbolWindow"
    align="center"
    fixSize="240, 130"
    @open="initWindow"
    @reset="initWindow"
  >
    <div class="container" @contextmenu.prevent>
      <div class="control">
        <label>
          <span>ダイス目</span>
          <input type="number" min="1" :max="faceNum" v-model="pips">
        </label>
        <label>
          <span>ダイス種別</span>
          <select v-model="faceNum">
            <option value="4">D4</option>
            <option value="6">D6</option>
            <option value="8">D8</option>
            <option value="10">D10</option>
            <option value="12">D12</option>
            <option value="20">D20</option>
          </select>
        </label>
        <label :style="{ visibility: (dice[faceNum] && dice[faceNum].length > 1) ? 'visible' : 'hidden' }">
          <span></span>
          <select v-model="type">
            <option
              v-for="diceObj in dice[faceNum]"
              :key="diceObj.type"
              :value="diceObj.type"
            >{{diceObj.label}}</option>
          </select>
        </label>
        <label>
          <input type="checkbox" v-model="isHide">
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

import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";
import { Watch } from "vue-property-decorator";

@Component({
  components: {
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

  private faceNum: number = 6;
  private type: string = "";
  private pips: number = 1;
  private isHide: boolean = false;

  private initWindow() {
    this.faceNum = 6;
    this.pips = 1;
    this.isHide = false;
    this.onChangeFaceNum(this.faceNum);
  }

  @Watch("faceNum", { immediate: true })
  onChangeFaceNum(faceNum: number) {
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
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
    width: 100%;
    height: 2em;

    span {
      flex: 1;
    }

    input[type="number"],
    select {
      font-size: 12px;
      padding: 0;
      margin: 0;
    }

    input[type="number"] {
      min-width: 3.7em;
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
