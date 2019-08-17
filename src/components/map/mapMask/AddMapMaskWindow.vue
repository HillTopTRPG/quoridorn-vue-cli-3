<template>
  <window-frame
    titleText="マスク作成"
    display-property="private.display.addMapMaskWindow"
    align="center"
    fixSize="285, 195"
    message="ドラッグ＆ドロップで配置"
    @open="open"
    @reset="open"
  >
    <table>
      <tbody>
        <tr>
          <th>文字：</th>
          <td>
            <input
              type="text"
              v-model="name"
              placeholder="表示文字"
              ref="input"
              @keydown.enter.stop
              @keyup.enter.stop
              @keydown.229.stop
              @keyup.229.stop
            />
          </td>
          <td class="mapMaskGrid" rowspan="6">
            <div
              :style="mapMaskStyle"
              @dragstart="dragStart"
              @mousedown.stop="
                windowActive({
                  property: 'private.display.addMapMaskWindow',
                  isClose: false
                })
              "
              class="mapMask"
              draggable="true"
            >
              {{ name }}
            </div>
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
              @keydown.229.stop
              @keyup.229.stop
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
              @keydown.229.stop
              @keyup.229.stop
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
              @keydown.229.stop
              @keyup.229.stop
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
              @keydown.229.stop
              @keyup.229.stop
            />
          </td>
        </tr>
        <tr>
          <td colspan="2" class="multi">
            <label
              ><input
                type="checkbox"
                v-model="isMulti"
                @keydown.enter.stop
                @keyup.enter.stop
                @keydown.229.stop
                @keyup.229.stop
              />複数作成</label
            >
          </td>
        </tr>
      </tbody>
    </table>
  </window-frame>
</template>

<script lang="ts">
import WindowFrame from "../../WindowFrame.vue";
import WindowMixin from "../../WindowMixin.vue";

import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: {
    WindowFrame
  }
})
export default class AddMapMaskWindow extends Mixins<WindowMixin>(WindowMixin) {
  @Action("windowActive") private windowActive: any;
  @Action("windowClose") private windowClose: any;
  @Getter("parseColor") private parseColor: any;
  @Getter("currentMap") private currentMap: any;

  private transparency: number = 0;
  private width: number = 1;
  private height: number = 1;
  private name: string = "";
  private isMulti: boolean = true;
  private color: string = "#000000";

  private open() {
    const input: HTMLInputElement = this.$refs.input as HTMLInputElement;
    input.focus();
  }

  private dragStart(event: any): void {
    event.dataTransfer.setData("kind", "mapMask");
    event.dataTransfer.setData("name", this.name);
    event.dataTransfer.setData("color", this.rgba);
    event.dataTransfer.setData("fontColor", this.fontColor);
    event.dataTransfer.setData("columns", this.width);
    event.dataTransfer.setData("rows", this.height);
    event.dataTransfer.setData("isMulti", this.isMulti);
    window.console.log(
      `  [methods] drag start mapMask => {name:"${this.name}", color:${
        this.color
      }, size:(${this.width}, ${this.height}), transparency:${
        this.transparency
      }`
    );
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
    let result = {
      width: width + "px",
      height: height + "px",
      "background-color": this.rgba,
      color: this.fontColor
    };
    return result;
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
