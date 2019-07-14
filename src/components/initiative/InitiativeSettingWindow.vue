<template>
  <window-frame
    titleText="イニシアティブ表設定"
    display-property="private.display.initiativeSettingWindow"
    align="center"
    fixSize="510, 210"
    @open="initWindow"
  >
    <div class="contents">
      <div class="message" @contextmenu.prevent>
        カウンターに使用するパラメータ名をスペース区切りで入力してください。<br />
        先頭に＊（全角・半角どちらでも可）を付けて記述するとチェック欄になります。<br />
        （最小）＜カウンター名＜（最大）で上下限を設定。「？」を指定すると個別に設定可能。
      </div>
      <div class="message example">
        <span @contextmenu.prevent>例）</span>
        <span class="selectable">
          -15&lt;HP&lt;?&#12288;?&lt;MP&lt;99&#12288;AC&#12288;侵食率&#12288;ポシビリティ&#12288;*毒&#12288;＊転倒
        </span>
        <br />
      </div>
      <div class="message" @contextmenu.prevent>
        （注）この設定は同一プレイルームの全員に影響します。
      </div>
      <label @contextmenu.prevent>
        カウンター名一覧：
        <input type="text" v-model="format" />
      </label>
      <hr />
      <div class="operationArea" @contextmenu.prevent>
        <ctrl-button @click="commit">決定</ctrl-button>
        <ctrl-button @click="cancel">キャンセル</ctrl-button>
      </div>
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowMixin from "../WindowMixin.vue";
import WindowFrame from "../WindowFrame.vue";
import CtrlButton from "@/components/parts/CtrlButton.vue";

import { Action, Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: {
    CtrlButton,
    WindowFrame
  }
})
export default class InitiativeSettingWindow extends Mixins<WindowMixin>(
  WindowMixin
) {
  @Action("setProperty") private setProperty: any;
  @Action("windowClose") private windowClose: any;
  @Action("setInitiativeParams") private setInitiativeParams: any;
  @Getter("rowStr") private rowStr: any;

  private format: string = "";

  initWindow() {
    this.format = this.value;
  }

  commit() {
    this.setProperty({
      property: "public.initiative.rowStr",
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
    return this.rowStr;
  }
}
</script>

<style scoped lang="scss">
@import "../common.scss";

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
