<template>
  <window-frame
    titleText="カウンターリモコン"
    display-property="private.display.counterRemoconWindow"
    align="center"
    baseSize="300, 500"
    ref="window"
  >
    <div class="contents" @contextmenu.prevent>

      <!-- ボタン表示エリア -->
      <div class="buttonArea">
        <template
          v-for="(infoObj, index) in publicCounterRemoconList"
        >
          <label class="select" v-if="infoObj.target === null" :key="index">
            <span>{{infoObj.label}}</span>
            <select @change="value => doChange(infoObj, value)">
              <option v-for="character in useCharacterList" :key="character.key">
              </option>
            </select>
          </label>

          <label class="button" v-if="infoObj.target !== null" :key="index">
            <button
              class="counterRemocon"
              @click="doChange(infoOb)"
            >{{infoObj.label}}</button>
          </label>
        </template>
      </div>

      <!-- 操作エリア -->
      <div class="playOperationArea">
        <!-- セーブボタン -->
        <button
          class="save"
          @click="doSave"
        >セーブ</button>

        <!-- ロードボタン -->
        <button
          class="load"
          @click="doLoad"
        >ロード</button>

        <!-- ボタン追加ボタン -->
        <button
          class="add"
          @click="doAdd"
        >ボタン追加</button>
      </div>
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowMixin from "../WindowMixin.vue";
import WindowFrame from "../WindowFrame.vue";
import Divider from "../parts/Divider.vue";
import ColorCheckBox from "@/components/parts/ColorCheckBox.vue";

import { Component, Vue, Watch } from "vue-property-decorator";
import { Action, Getter, Mutation } from "vuex-class";
import { sum } from "@/components/common/Utility";

@Component<CounterRemoconWindow>({
  name: "counterRemoconWindow",
  mixins: [WindowMixin],
  components: {
    WindowFrame
  }
})
export default class CounterRemoconWindow extends Vue {
  @Action("windowOpen") windowOpen: any;

  private publicCounterRemoconList: any[] = [];
  private useCharacterList: any[] = [];

  doChange(remoconObj: any, targetKey: string | null = null) {
    const messageFormat = remoconObj.messageFormat;
    const modifyValue = remoconObj.modifyValue;
    const counterName = remoconObj.counterName;
    const operator = remoconObj.operator;

    if (isNaN(parseInt(modifyValue, 10))) {
      // 数値じゃない場合はダイスロール
    } else {
      // 数値の場合
    }
  }

  doAdd() {
    this.windowOpen("private.display.counterRemoconEditorWindow");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.contents {
  position: absolute;
  height: 100%;
  width: 100%;
  font-size: 12px;
  display: flex;
  flex-direction: column;

  .playOperationArea {
    display: flex;
    flex-direction: row;

    button {
      font-size: 10px;
      padding: 1px 3px;
      min-width: 4em;
      box-sizing: content-box;

      &.back,
      &.start {
        margin-right: 1em;
      }

      &.next {
        margin-right: 2em;
      }
    }
  }

  .operateArea {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
}

button {
  border-radius: 0.5em;

  &:disabled {
    background-color: lightgrey;
  }
}
</style>
