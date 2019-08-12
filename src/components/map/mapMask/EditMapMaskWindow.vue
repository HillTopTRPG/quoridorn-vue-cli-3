<template>
  <window-frame
    titleText="マスク変更"
    display-property="private.display.editMapMaskWindow"
    align="center"
    fixSize="285, 198"
    @open="initWindow"
    @reset="initWindow"
  >
    <table>
      <tbody>
        <tr>
          <th>文字：</th>
          <td>
            <input
              type="text"
              v-model="name"
              @keydown.enter.stop
              @keyup.enter.stop
            />
          </td>
          <td rowspan="6" class="mapMaskGrid">
            <div class="mapMask" :style="mapMaskStyle">{{ name }}</div>
          </td>
        </tr>
        <tr>
          <th>色：</th>
          <td>
            <input
              type="color"
              v-model="color"
              @keydown.enter.stop
              @keyup.enter.stop
            />
          </td>
        </tr>
        <tr>
          <th>高さ：</th>
          <td>
            <input
              type="number"
              min="1"
              v-model="height"
              @keydown.enter.stop
              @keyup.enter.stop
            />
          </td>
        </tr>
        <tr>
          <th>幅：</th>
          <td>
            <input
              type="number"
              min="1"
              v-model="width"
              @keydown.enter.stop
              @keyup.enter.stop
            />
          </td>
        </tr>
        <tr>
          <th>透明度：</th>
          <td>
            <input
              type="range"
              v-model="transparency"
              @keydown.enter.stop
              @keyup.enter.stop
            />
          </td>
        </tr>
        <tr>
          <td colspan="2" class="multi">
            <ctrl-button @click="commitEdit">編集</ctrl-button
            ><ctrl-button @click="cancelEdit">キャンセル</ctrl-button>
          </td>
        </tr>
      </tbody>
    </table>
  </window-frame>
</template>

<script lang="ts">
import CtrlButton from "../../parts/CtrlButton.vue";
import WindowFrame from "../../WindowFrame.vue";
import WindowMixin from "../../WindowMixin.vue";

import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: {
    CtrlButton,
    WindowFrame
  }
})
export default class EditMapMaskWindow extends Mixins<WindowMixin>(
  WindowMixin
) {
  @Action("changeListObj") private changeListObj: any;
  @Action("windowClose") private windowClose: any;
  @Getter("parseColor") private parseColor: any;
  @Getter("getObj") private getObj: any;
  @Getter("currentMap") private currentMap: any;

  private name: string = "";
  private width: number = 1;
  private height: number = 1;
  private color: string = "#000000";
  private transparency: number = 0;

  private commitEdit() {
    this.changeListObj({
      key: this.key,
      name: this.name,
      columns: this.width,
      rows: this.height,
      color: this.rgba,
      fontColor: this.fontColor,
      isNotice: true
    });
    this.windowClose("private.display.editMapMaskWindow");
  }

  private cancelEdit() {
    this.windowClose("private.display.editMapMaskWindow");
  }

  private initWindow() {
    // window.console.log(`initWindow`)
    let mapMaskObj = this.getObj(this.key);
    this.name = mapMaskObj.name;
    this.width = mapMaskObj.columns;
    this.height = mapMaskObj.rows;
    const colorObj = this.parseColor(mapMaskObj.color);
    this.color = colorObj.getColorCode();
    this.transparency = 100 - Math.floor(colorObj.a * 100);
    window.console.log(
      `  [methods] init window => EditMapMask:{name:"${this.name}", color:${
        this.color
      }, size:(${this.width}, ${this.height}), transparency:${
        this.transparency
      }}`
    );
  }

  private get key() {
    return this.$store.state.private.display["editMapMaskWindow"].key;
  }

  private get mapMaskStyle() {
    let width = this.width * this.gridSize;
    let height = this.height * this.gridSize;
    let zoom = 1;
    if (Math.max(width, height) > 160) {
      zoom = 160 / Math.max(width, height);
      width *= zoom;
      height *= zoom;
    }
    return {
      width: width + "px",
      height: height + "px",
      "background-color": this.rgba,
      color: this.fontColor
    };
  }

  private get rgba() {
    const colorObj = this.parseColor(this.color);
    colorObj.a = (100 - this.transparency) / 100;
    return colorObj.getRGBA();
  }

  private get fontColor() {
    return this.parseColor(this.color).getColorCodeReverse();
  }

  private get gridSize() {
    return this.currentMap.grid.size;
  }
}
</script>

<style scoped lang="scss">
table {
  font-size: 12px;
  white-space: nowrap;
  border-collapse: collapse;
}

th,
td {
  padding: 0;
  border: none;
}

th {
  text-align: right;
  font-weight: normal;
}

td.multi {
  text-align: center;
}

td.mapMaskGrid {
  width: 161px;
  height: 161px;
  max-width: 161px;
  max-height: 161px;
  text-align: center;
  border: none;
}

.mapMask {
  max-width: 157px;
  max-height: 157px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  border: solid yellow 2px;
}

input[type="number"] {
  width: 46px;
}

input[type="text"] {
  width: 60px;
}

input[type="range"] {
  width: 60px;
}
</style>
