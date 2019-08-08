<template>
  <div
    class="chit"
    :class="[
      isThisRolling ? 'rolling' : '',
      isHover ? 'hover' : '',
      storeObj.isBorderHide ? 'isBorderHide' : ''
    ]"
    :style="chitStyle"
    :title="storeObj.description"
    :id="storeObj.key"
    @click.right.prevent="e => openContext(e, 'private.display.chitContext')"
    @mouseover="mouseover"
    @mouseout="mouseout"
    @mousedown.left.stop="leftDown"
    @mouseup.left.stop="leftUp"
    @mousedown.right.stop="rightDown"
    @mouseup.right.stop="rightUp"
    @touchstart="leftDown"
    @touchend="leftUp"
    @touchcancel="leftUp"
    @contextmenu.prevent
  >
    <div class="border" v-if="!storeObj.isBorderHide"></div>
    <img
      class="image"
      v-img="getKeyObj(imageList, imageKey).data"
      :class="{ reverse: storeObj.isReverse }"
      draggable="false"
    />
  </div>
</template>

<script lang="ts">
import PieceMixin from "../../PieceMixin.vue";

import { Component } from "vue-property-decorator";
import { Getter } from "vuex-class";

@Component
export default class Chit extends PieceMixin {
  @Getter("imageList") imageList: any;

  private getKeyObj(list: any[], key: string) {
    const filteredList = list.filter(obj => obj.key === key);
    if (filteredList.length === 0) return null;
    if (filteredList.length > 1) return null;
    return filteredList[0];
  }

  private get chitStyle() {
    let obj: any = this.style;
    if (this.storeObj.isDraggingLeft) {
      const plus = 1.5;
      obj.left = this.rect.left - plus + "px";
      obj.top = this.rect.top - plus + "px";
      obj.width = this.rect.width + plus * 2 + "px";
      obj.height = this.rect.height + plus * 2 + "px";
      obj.opacity = 0.6;
    }
    return obj;
  }

  private get imageKey() {
    return this.storeObj.imageKey.replace(":R", "");
  }
}
</script>

<style scoped lang="scss">
.chit {
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
    border: 2px solid black;
  }

  &.isBorderHide:before {
    border: none;
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
  border: 3px solid #bbbbff;
  border-radius: 1px;
}
</style>
