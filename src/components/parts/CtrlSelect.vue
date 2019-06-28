<template>
  <label class="ctrl-select-wrapper" :disabled="disabled" @contextmenu.prevent>
    <select
      v-model="localValue"
      ref="select"
      :disabled="disabled"
      :style="{
        webkitTextFillColor: fontColor,
        mozTextFillColor: fontColor,
        maxWidth: maxWidth ? `${maxWidth}em` : undefined
      }"
    >
      <option
        v-for="optionInfo in optionInfoList"
        :key="optionInfo.key"
        :value="optionInfo.value"
        :disabled="optionInfo.disabled"
      >
        {{ optionInfo.text }}
      </option>
    </select>
    <div class="background-area"></div>
  </label>
</template>

<script lang="ts">
import SelectMixin from "@/components/parts/select/base/SelectMixin";

import { Prop, Watch } from "vue-property-decorator";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({})
export default class CtrlSelect extends Mixins<SelectMixin>(SelectMixin) {
  @Prop({ type: Boolean, default: false })
  private disabled!: boolean;

  @Prop({ type: Array, required: true })
  private optionInfoList!: any[];

  @Prop({ type: Number, default: 0 })
  private maxWidth!: number;

  private fontColor: string = "";

  @Watch("optionInfoList", { immediate: true })
  onChangeOptionInfoList(optionInfoList: any[]) {
    if (this["test"]) {
      window.console.log(optionInfoList);
    }
  }

  @Watch("value", { immediate: true })
  onChangeValue(value: string | null) {
    const optionInfo: any = this.optionInfoList.filter(
      optionInfo => optionInfo.value === value
    )[0];
    this.fontColor = optionInfo && optionInfo.disabled ? "#999999" : "#000000";
  }
}
</script>

<style scoped lang="scss">
@import "./Ctrl.scss";

.ctrl-select-wrapper {
  @include ctrl-select();
}
</style>
