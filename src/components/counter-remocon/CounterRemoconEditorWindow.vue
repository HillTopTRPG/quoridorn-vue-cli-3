<template>
  <window-frame
    titleText="カウンターリモコンエディター"
    display-property="private.display.counterRemoconEditorWindow"
    align="left-top"
    fixSize="360, 200"
    ref="window"
    @open="initWindow"
    @reset="initWindow"
  >
    <div class="contents" @contextmenu.prevent>
      <label>
        <span class="label">ボタン名:</span>
        <input type="text" v-model="buttonName">
      </label>
      <label>
        <span class="label">カウンター名{1}:</span>
        <counter-select v-model="counterName" class="full"/>
      </label>
      <label>
        <span class="label">修正値{2}:</span>
        <select v-model="modifyType">
          <option :value="COUNTER_REMOCON_TYPE.PLUS">＋</option>
          <option :value="COUNTER_REMOCON_TYPE.MINUS">ー</option>
          <option :value="COUNTER_REMOCON_TYPE.EQUALS">＝</option>
          <option :value="COUNTER_REMOCON_TYPE.PLUS_MINUS">±</option>
        </select>
        <input type="text" v-model="modifyValue">
      </label>
      <label>
        <span class="label">表示メッセージ:</span>
        <input type="text" v-model="message">
      </label>
      <label>
        <span class="label">例:</span>
        <span class="label">{{exampleText}}</span>
      </label>
      <div class="operationArea">
        <button @click="commit">設定</button>
        <button>キャンセル</button>
      </div>
    </div>
  </window-frame>
</template>

<script lang="ts">
import CounterSelect from "@/components/parts/select/CounterSelect.vue";
import WindowMixin from "../WindowMixin.vue";
import WindowFrame from "../WindowFrame.vue";

import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: {
    CounterSelect,
    WindowFrame
  }
})
export default class CounterRemoconEditorWindow extends Mixins<WindowMixin>(
  WindowMixin
) {
  @Action("changeListInfo") private changeListInfo: any;
  @Action("addCounterRemocon") private addCounterRemocon: any;
  @Action("windowClose") private windowClose: any;
  @Getter("propertyList") private propertyList: any;
  @Getter("counterRemoconEditorKey") private counterRemoconEditorKey: any;
  @Getter("getObj") private getObj: any;

  private buttonName: string = "";
  private counterName: string = "";
  private modifyType: number = 0;
  private modifyValue: string = "";
  private message: string = "{0}の{1}を{2}した";
  private exampleText: string = "";

  /**
   * ライフサイクルメソッド
   */
  private created() {
    this.modifyType = this.COUNTER_REMOCON_TYPE.PLUS;
  }

  private initWindow() {
    const counterRemocon = this.getObj(this.counterRemoconEditorKey);
    window.console.log(this.counterRemoconEditorKey, counterRemocon);
    if (counterRemocon) {
      this.buttonName = counterRemocon.buttonName;
      this.counterName = counterRemocon.counterName;
      this.modifyType = counterRemocon.modifyType;
      this.modifyValue = counterRemocon.modifyValue;
      this.message = counterRemocon.message;
      this.exampleText = counterRemocon.exampleText;
    } else {
      const firstProperty = this.propertyList[0];
      this.buttonName = "";
      this.counterName = firstProperty
        ? firstProperty.property
        : "イニシアティブ";
      this.modifyType = this.COUNTER_REMOCON_TYPE.PLUS;
      this.modifyValue = "";
      this.message = "{0}の{1}を{2}した";
      this.exampleText = `の${this.counterName}をした`;
    }
  }

  private commit() {
    // 入力チェック
    const messageList: string[] = [];
    if (!this.buttonName) messageList.push("ボタン名は必須です。");
    if (!this.counterName) messageList.push("カウンター名は必須です。");
    if (messageList.length) {
      alert(messageList.join("\n"));
      return;
    }

    // 情報更新
    const counterRemocon = this.getObj(this.counterRemoconEditorKey);
    if (counterRemocon) {
      this.changeListInfo({
        key: this.counterRemoconEditorKey,
        isNotice: true,
        buttonName: this.buttonName,
        counterName: this.counterName,
        modifyType: this.modifyType,
        modifyValue: this.modifyValue,
        message: this.message,
        exampleText: this.exampleText
      });
    } else {
      this.addCounterRemocon({
        buttonName: this.buttonName,
        counterName: this.counterName,
        modifyType: this.modifyType,
        modifyValue: this.modifyValue,
        message: this.message,
        exampleText: this.exampleText
      });
    }
    this.windowClose("private.display.counterRemoconEditorWindow");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.contents {
  position: absolute;
  height: 100%;
  width: 100%;
  font-size: 12px;
  display: flex;
  flex-direction: column;

  > label {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 2.2em;

    > span:first-child {
      width: 8em;
      text-align: right;
      padding-right: 1em;
    }

    > select {
      /*height: 2em;*/
    }

    > input,
    > .full {
      flex: 1;
    }
  }

  > .operationArea {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    > button {
      &:not(:first-child) {
        margin-left: 0.5em;
      }
    }
  }
}
</style>
