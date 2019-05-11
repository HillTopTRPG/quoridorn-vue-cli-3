<template>
  <window-frame
    titleText="カウンターリモコンエディター"
    display-property="private.display.counterRemoconEditorWindow"
    align="left-top"
    fixSize="360, 220"
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
        <span class="label">キャラクター{0}:</span>
        <character-select v-model="target" class="full" :placeList="[]"/>
      </label>
      <label>
        <span class="label">カウンター名{1}:</span>
        <counter-select v-model="counterName" class="full"/>
      </label>
      <label>
        <span class="label">修正値{2}:</span>
        <ctrl-select v-model="modifyType" :optionInfoList="modifyTypeOptionInfoList"/>
        <input type="text" v-model="modifyValue">
      </label>
      <label>
        <span class="label">表示メッセージ:</span>
        <input type="text" v-model="message">
      </label>
      <label>
        <span class="label">例:</span>
        <span class="full example">{{exampleText}}</span>
      </label>
      <div class="operationArea">
        <ctrl-button @click="commitButtonOnClick">設定</ctrl-button>
        <ctrl-button @click="cancelButtonOnClick">キャンセル</ctrl-button>
      </div>
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowMixin from "../WindowMixin.vue";
import WindowFrame from "../WindowFrame.vue";
import CounterSelect from "@/components/parts/select/CounterSelect.vue";
import CharacterSelect from "@/components/parts/select/CharacterSelect.vue";
import CtrlButton from "@/components/parts/CtrlButton.vue";
import CtrlSelect from "@/components/parts/CtrlSelect.vue";

import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";
import { Watch } from "vue-property-decorator";

@Component({
  components: {
    CtrlSelect,
    CtrlButton,
    WindowFrame,
    CounterSelect,
    CharacterSelect
  }
})
export default class CounterRemoconEditorWindow extends Mixins<WindowMixin>(
  WindowMixin
) {
  @Action("changeListObj") private changeListObj: any;
  @Action("addCounterRemocon") private addCounterRemocon: any;
  @Action("windowClose") private windowClose: any;
  @Action("sendBcdiceServer") private sendBcdiceServer: any;
  @Getter("propertyList") private propertyList: any;
  @Getter("counterRemoconEditorKey") private counterRemoconEditorKey: any;
  @Getter("getObj") private getObj: any;

  private buttonName: string = "";
  private target: string = "";
  private counterName: string = "";
  private modifyType: string = "0";
  private modifyValue: string = "";
  private sampleValue: number = 0;
  private sampleDiceValue: string = "";
  private message: string = "{0}の{1}を{2}した{4}";
  private exampleText: string = "";

  /*********************************************************************************************************************
   * 子画面表示時
   */
  private initWindow() {
    const counterRemocon = this.getObj(this.counterRemoconEditorKey);
    if (counterRemocon) {
      this.buttonName = counterRemocon.buttonName;
      this.target = counterRemocon.target;
      this.counterName = counterRemocon.counterName;
      this.modifyType = counterRemocon.modifyType;
      this.modifyValue = counterRemocon.modifyValue;
      this.message = counterRemocon.message;
      this.exampleText = counterRemocon.exampleText;
    } else {
      const firstProperty = this.propertyList[0];
      this.buttonName = "";
      this.target = "";
      this.counterName = firstProperty
        ? firstProperty.property
        : "イニシアティブ";
      this.modifyType = this.COUNTER_REMOCON_TYPE.PLUS;
      this.modifyValue = "";
      this.message = "{0}の{1}を{2}した{4}";
      this.exampleText = `の${this.counterName}をした`;
    }
  }

  /*********************************************************************************************************************
   * コミットボタン押下時
   */
  private commitButtonOnClick() {
    // 入力チェック
    const messageList: string[] = [];
    if (!this.buttonName) messageList.push("ボタン名は必須です。");
    if (messageList.length) {
      alert(messageList.join("\n"));
      return;
    }

    // 情報更新
    const counterRemocon = this.getObj(this.counterRemoconEditorKey);
    if (counterRemocon) {
      this.changeListObj({
        key: this.counterRemoconEditorKey,
        isNotice: true,
        buttonName: this.buttonName,
        target: this.target,
        counterName: this.counterName,
        modifyType: this.modifyType,
        modifyValue: this.modifyValue,
        message: this.message,
        exampleText: this.exampleText
      });
    } else {
      this.addCounterRemocon({
        buttonName: this.buttonName,
        target: this.target,
        counterName: this.counterName,
        modifyType: this.modifyType,
        modifyValue: this.modifyValue,
        message: this.message,
        exampleText: this.exampleText
      });
    }
    this.windowClose("private.display.counterRemoconEditorWindow");
  }

  /*********************************************************************************************************************
   * キャンセルボタン押下時
   */
  private cancelButtonOnClick() {
    this.windowClose("private.display.counterRemoconEditorWindow");
  }

  /*********************************************************************************************************************
   * 実行例の更新
   */
  @Watch("counterName")
  @Watch("modifyType")
  @Watch("sampleValue")
  @Watch("message")
  onChangeValues() {
    const useSampleValue: number =
      this.modifyType === this.COUNTER_REMOCON_TYPE.MINUS
        ? -this.sampleValue
        : this.sampleValue;

    const afterValue: number =
      this.modifyType === this.COUNTER_REMOCON_TYPE.EQUALS
        ? useSampleValue
        : 3 + useSampleValue;

    const character: any = this.getObj(this.target);
    const characterName: string = character ? character.name : "";

    this.exampleText = this.message
      .replace("{0}", characterName || "[選択キャラ]")
      .replace("{1}", this.counterName || "[選択項目]")
      .replace(
        "{2}",
        `${
          !(this.modifyType === this.COUNTER_REMOCON_TYPE.EQUALS) &&
          useSampleValue > 0
            ? "+"
            : ""
        }${useSampleValue}` +
          (this.sampleDiceValue ? `（${this.sampleDiceValue}）` : "")
      )
      .replace(
        "{3}",
        `${useSampleValue}` +
          (this.sampleDiceValue ? `（${this.sampleDiceValue}）` : "")
      )
      .replace(
        "{4}",
        `（${this.counterName || "[選択項目]"}：${3}->${afterValue}）`
      );
  }

  /*********************************************************************************************************************
   * 変更値の評価
   */
  @Watch("modifyValue")
  onChangeModifyValue() {
    if (/^-?[0-9]+$/.test(this.modifyValue)) {
      this.sampleValue = parseInt(this.modifyValue, 10);
      this.sampleDiceValue = "";
    } else {
      this.sendBcdiceServer({
        system: "DiceBot",
        command: this.modifyValue
      }).then((json: any) => {
        if (json.ok) {
          // bcdiceとして結果が取れた場合
          const resultValue = json.result.replace(/^.+＞ /, "");
          if (/^-?[0-9]+$/.test(resultValue)) {
            // 数値として応答された
            const matchResult = json.result.match(/^.+＞ ([^＞]+) ＞ [^＞]+$/);
            this.sampleValue = parseInt(resultValue, 10);
            this.sampleDiceValue = `${this.modifyValue}=${matchResult[1]}`;
            return;
          }
        }
        this.sampleValue = 0;
        this.sampleDiceValue = "";
      });
    }
  }

  private get modifyTypeOptionInfoList(): any[] {
    const resultList: any[] = [];
    resultList.push({
      key: 0,
      value: this.COUNTER_REMOCON_TYPE.PLUS,
      text: "＋",
      disabled: false
    });
    resultList.push({
      key: 1,
      value: this.COUNTER_REMOCON_TYPE.MINUS,
      text: "ー",
      disabled: false
    });
    resultList.push({
      key: 2,
      value: this.COUNTER_REMOCON_TYPE.EQUALS,
      text: "＝",
      disabled: false
    });
    resultList.push({
      key: 3,
      value: this.COUNTER_REMOCON_TYPE.PLUS_MINUS,
      text: "±",
      disabled: false
    });
    return resultList;
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
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    /*height: 2.2em;*/
    padding: 0.2em 0;

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

    > .example {
      white-space: normal;
      height: 3em;
      display: flex;
      align-items: center;
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
