<template>
  <div
    class="diceSymbol"
    :class="[isThisRolling ? 'rolling' : '', isHover ? 'hover' : '']"
    :style="chitStyle"
    @click.right.prevent="(e) => openContext(e, 'private.display.diceSymbolContext')"
    @mouseover="mouseover"
    @mouseout="mouseout"
    @mousedown.left.stop="leftDown"
    @mouseup.left.stop="leftUp"
    @mousedown.right.stop="rightDown"
    @mouseup.right.stop="rightUp"
    @touchstart="leftDown" @touchend="leftUp"
    @touchcancel="leftUp"
    @contextmenu.prevent
  >
    <div class="border"></div>
    <img class="image" v-img="diceImage" draggable="false"/>
  </div>
</template>

<script lang="ts">
import PieceMixin from "../../PieceMixin.vue";

import { Component, Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";

@Component({})
export default class DiceSymbol extends PieceMixin {
  @Getter("dicePipsImage") private dicePipsImage: any;

  getKeyObj(list, key) {
    const filteredList = list.filter(obj => obj.key === key);
    if (filteredList.length === 0) return null;
    if (filteredList.length > 1) return null;
    return filteredList[0];
  }

  get chitStyle() {
    let obj: any = this.style;
    if (this.storeObj.isDraggingLeft) {
      const plus = 1.5;
      obj.left = this.rect.left - plus + "px";
      obj.top = this.rect.top - plus + "px";
      obj.width = this.rect.width + plus * 2 + "px";
      obj.height = this.rect.height + plus * 2 + "px";
      obj.opacity = 0.6;
    }
    // window.console.log(` [computed] chit(${this.objKey}) style => lt(${obj.left}, ${obj.top}), wh(${obj.width}, ${obj.height}), bg:"${obj['background-color']}", font:"${obj.color}"`)
    return obj;
  }

  get faceNum() {
    return this.storeObj.faceNum;
  }

  get diceType() {
    return this.storeObj.type;
  }

  get pips() {
    return this.storeObj.pips;
  }

  get isHide() {
    return this.storeObj.isHide;
  }

  get diceImage() {
    return this.dicePipsImage(this.faceNum, this.diceType, this.pips);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.diceSymbol {
  /*
  box-sizing: border-box;
  */
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  font-size: 12px;
  cursor: crosshair;
  border-radius: 3px;
  z-index: 100000000;

  &.hover,
  &.rolling {
    z-index: 999999999;
  }

  &:before {
    content: "";
    position: absolute;
    left: -2px;
    right: -2px;
    bottom: -2px;
    top: -2px;
  }
}

img.image {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;

  &.reverse {
    transform: scale(-1, 1);
  }
}

img.rotate {
  position: absolute;
  left: -5px;
  top: -5px;
  object-fit: fill;
  background-color: red;
  width: 15px;
  height: 15px;
  border-radius: 5px;

  &:hover {
    width: 19px;
    height: 19px;
    transform: translate(-2px, -2px);
  }
}

.name {
  position: absolute;
  top: calc(-1em - 4px);
  background-color: rgba(255, 255, 255, 0.3);
  padding: 0 3px;
}

.border {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 3px solid rgb(187, 187, 0);
  border-radius: 1px;
}
</style>
