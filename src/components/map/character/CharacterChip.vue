<template>
  <div
    class="character-chip"
    :class="[isThisRolling ? 'rolling' : '', isHover ? 'hover' : '']"
    :style="characterStyle"
    :title="storeObj.text"
    @click.right.prevent="(e) => openContext(e, 'private.display.characterContext')"
    @mouseover="mouseover"
    @mouseout="mouseout"
    @contextmenu.prevent
  >
    <div class="border"></div>
    <img
      class="image" v-img="imageObj.data"
      :class="{reverse : imageObj.isReverse}"
      draggable="false"
    />
    <div class="name">{{name}}</div>
  </div>
</template>

<script lang="ts">
import PieceMixin from "../../PieceMixin.vue";

import { Component } from "vue-property-decorator";
import { Getter } from "vuex-class";

@Component
export default class CharacterChip extends PieceMixin {
  @Getter("imageList") private imageList: any;

  getKeyObj(list: any[], key: string) {
    const filteredList = list.filter(obj => obj.key === key);
    if (filteredList.length === 0) return null;
    if (filteredList.length > 1) return null;
    return filteredList[0];
  }

  get characterStyle(): void {
    let obj: any = this.style;
    obj.left = 0;
    obj.top = 0;
    obj.width = this.gridSize + "px";
    obj.height = this.gridSize + "px";
    // delete obj.transform
    // window.console.log(` [computed] character(${this.objKey}) style => lt(${obj.left}, ${obj.top}), wh(${obj.width}, ${obj.height}), bg:"${obj['background-color']}", font:"${obj.color}"`)
    return obj;
  }
  get name() {
    return this.storeObj.name;
  }
  get useImageList() {
    return this.storeObj.useImageList;
  }
  get useImageIndex() {
    return this.storeObj.useImageIndex;
  }
  get imageObj() {
    if (this.useImageList === "") {
      return "";
    }
    const imageStr = this.useImageList.split("|")[this.useImageIndex];
    // window.console.log(`list:${this.useImageList}(${this.useImageIndex}), image:${imageStr}`)
    const isReverse = imageStr.indexOf(":R") >= 0;
    const imageKey = imageStr.replace(":R", "");
    return {
      isReverse: isReverse,
      data: this.getKeyObj(this.imageList, imageKey).data
    };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.character-chip {
  /*position: fixed;*/
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  font-size: 12px;
  cursor: crosshair;
  border-radius: 3px;
  z-index: 600000000;
  overflow: visible;
  margin-top: 1em;

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
    border: solid black 2px;
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
