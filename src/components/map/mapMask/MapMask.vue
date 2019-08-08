<template>
  <div
    class="mapMask"
    :class="[
      storeObj.isLock ? 'isLock' : 'isUnLock',
      isHover ? 'hover' : '',
      storeObj.isBorderHide ? 'isBorderHide' : ''
    ]"
    :style="mapMaskStyle"
    :id="storeObj.key"
    @mouseover="mouseover"
    @mouseout="mouseout"
    @click.right.prevent="e => openContext(e, 'private.display.mapMaskContext')"
    @mousedown.left.stop="leftDown"
    @mouseup.left.stop="leftUp"
    @mousedown.right.stop="rightDown"
    @mouseup.right.stop="rightUp"
    @touchstart.stop="leftDown"
    @touchend.stop="leftUp"
    @touchcancel.stop="leftUp"
    @contextmenu.prevent
  >
    {{ storeObj.name }}
  </div>
</template>

<script lang="ts">
import PieceMixin from "../../PieceMixin.vue";

import { Component } from "vue-property-decorator";
import { Getter } from "vuex-class";

@Component
export default class MapMask extends PieceMixin {
  @Getter("parseColor") private parseColor: any;

  private get mapMaskStyle(): any {
    let obj: any = {};
    const baseStyle = this.style;
    for (let key in baseStyle) {
      obj[key] = baseStyle[key];
    }
    const translate = this.isHover ? -2 : 0;
    obj.transform =
      obj.transform.replace(/ translate[XY]\([^)]+\)/g, "") +
      ` translateX(${translate}px) translateY(${translate}px)`;
    let colorObj = this.parseColor(this.storeObj.color);
    if (this.storeObj.isDraggingLeft) {
      const plus = 1.5;
      obj.left = this.rect.left - plus + "px";
      obj.top = this.rect.top - plus + "px";
      obj.width = this.rect.width + plus * 2 + "px";
      obj.height = this.rect.height + plus * 2 + "px";
      colorObj.a = colorObj.a * 0.6;
    }
    obj["background-color"] = colorObj.getRGBA();
    obj["color"] = this.storeObj.fontColor;
    // window.console.log(` [computed] mapMask(${this.objKey}) style => isDraggingLeft:${storeObj.isDraggingLeft},transZ:${obj['transform']} lt(${obj.left}, ${obj.top}), wh(${obj.width}, ${obj.height}), bg:"${obj['background-color']}", font:"${obj.color}"`)
    return obj;
  }
}
</script>

<style scoped lang="scss">
.mapMask {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  border-style: solid;
  border-width: 0;
  border-color: transparent;
  white-space: nowrap;
  font-size: 12px;
  cursor: crosshair;
  z-index: 200000000;

  &.hover {
    z-index: 999999999;
  }

  &:not(.isBorderHide).hover {
    border-width: 2px;

    &.isLock {
      border-color: blue;
    }

    &.isUnLock {
      border-color: yellow;
    }
  }
}
</style>
