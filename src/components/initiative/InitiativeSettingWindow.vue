<template>
  <window-frame
    titleText="イニシアティブ表設定"
    display-property="private.display.initiativeSettingWindow"
    align="center"
    fixSize="510, 210"
  >
    <div class="contents">
      <div class="message">
        カウンターに使用するパラメータ名をスペース区切りで入力してください。<br>
        先頭に＊（全角・半角どちらでも可）を付けて記述するとチェック欄になります。<br>
        （最小）＜カウンター名＜（最大）で上下限を設定。「？」を指定すると個別に設定可能。
      </div>
      <div class="message example">
        例）&emsp;-15&lt;HP&lt;?&emsp;?&lt;MP&lt;99&emsp;AC&emsp;新色率&emsp;ポシビリティ&emsp;*毒&emsp;＊転倒<br>
      </div>
      <div class="message">
        （注）この設定は同一プレイルームの全員に影響します。
      </div>
      <label>カウンター名一覧：<input type="text" v-model="format"></label>
      <hr>
      <div class="operationArea">
        <button @click="commit">決定</button>
        <button @click="cancel">キャンセル</button>
      </div>
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowMixin from "../WindowMixin.vue";
import WindowFrame from "../WindowFrame.vue";

import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Action, Getter, Mutation } from "vuex-class";

@Component<InitiativeSettingWindow>({
  name: "initiativeSettingWindow",
  mixins: [WindowMixin],
  components: {
    WindowFrame
  }
})
export default class InitiativeSettingWindow extends Vue {
  @Action("setProperty") setProperty: any;
  @Action("windowClose") windowClose: any;
  @Action("setInitiativeParams") setInitiativeParams: any;
  private format: string = "";

  mounted() {
    this.format = this.value;
  }

  commit() {
    this.setProperty({
      property: "private.display.initiativeSettingWindow.value",
      value: this.format,
      isNotice: true,
      logOff: true
    });
    this.windowClose("private.display.initiativeSettingWindow");
    this.setInitiativeParams({ format: this.format.trim() });
  }

  cancel() {
    this.windowClose("private.display.initiativeSettingWindow");
  }

  get value(): string {
    return this.$store.state.private.display.initiativeSettingWindow.value;
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

  .message {
    line-height: 1.7em;

    &.example {
      text-align: center;
    }
  }

  label {
    display: flex;
    flex-direction: row;

    input {
      flex: 1;
    }
  }

  .operationArea {
    display: flex;
    flex-direction: row;
  }
}
</style>
