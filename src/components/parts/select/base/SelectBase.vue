<template>
  <ctrl-select
    v-model="localValue"
    :style="{ webkitTextFillColor: fontColor, mozTextFillColor: fontColor }"
    ref="select"
    :disabled="disabled"
  >
    <option :disabled="!defaultSelectable" value="" v-if="defaultLabel !== undefined">{{defaultLabel}}</option>
    <slot/>
  </ctrl-select>
</template>

<script lang="ts">
import SelectMixin from "./SelectMixin.ts";
import CtrlSelect from "@/components/parts/CtrlSelect.vue";

import { Prop, Watch } from "vue-property-decorator";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({ components: { CtrlSelect } })
export default class SelectBase extends Mixins<SelectMixin>(SelectMixin) {
  @Prop({ type: Boolean, default: false })
  private disabled!: boolean;

  @Prop({ type: Array, required: true })
  private optionValueList!: string[];

  protected get optionValueStrList(): string[] {
    return this.optionValueList;
  }
}
</script>
