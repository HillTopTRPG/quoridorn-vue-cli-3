<template>
  <window-frame
    titleText="カウンターリモコンエディター"
    display-property="private.display.counterRemoconEditorWindow"
    align="left-top"
    fixSize="300, 300"
    ref="window"
    @open="initWindow"
  >
    <div class="contents" @contextmenu.prevent>
      <label>
        <span class="label">ボタン名</span>
        <input type="text" v-model="buttonName">
      </label>
      <label>
        <span class="label">カウンター名{1}</span>
        <input type="text" v-model="counterName">
      </label>
      <label>
        <span class="label">修正値{2}</span>
        <select v-model="modifyType">
          <option :value="CounterRemoconEditorWindow.MODIFY_PLUS">＋</option>
          <option :value="CounterRemoconEditorWindow.MODIFY_MINUS">−</option>
          <option :value="CounterRemoconEditorWindow.MODIFY_EQUALS">＝</option>
        </select>
        <input type="text" v-model="modifyValue">
      </label>
      <label>
        <span class="label">表示メッセージ</span>
        <input type="text" v-model="message">
      </label>
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

@Component<CounterRemoconEditorWindow>({
  name: "counterRemoconEditorWindow",
  mixins: [WindowMixin],
  components: {
    WindowFrame
  }
})
export default class CounterRemoconEditorWindow extends Vue {
  public static MODIFY_PLUS = 1;
  public static MODIFY_MINUS = -1;
  public static MODIFY_EQUALS = 0;

  private buttonName: string = "";
  private counterName: string = "";
  private modifyType: number = CounterRemoconEditorWindow.MODIFY_PLUS;
  private modifyValue: string = "";
  private message: string = "{0}の{1}を{2}した";

  private initWindow() {}
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
}
</style>
