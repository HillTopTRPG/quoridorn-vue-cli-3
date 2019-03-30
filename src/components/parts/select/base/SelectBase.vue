<template>
  <select
    v-model="localValue"
    :style="{ webkitTextFillColor: fontColor, mozTextFillColor: fontColor }"
    ref="select"
    @contextmenu.prevent
  >
    <option :disabled="!defaultSelectable" value="" v-if="defaultLabel !== undefined">{{defaultLabel}}</option>
    <slot/>
  </select>
</template>

<script lang="ts">
import SelectMixin from "./SelectMixin.vue";

import { Prop } from "vue-property-decorator";
import { Component, Mixins } from "vue-mixin-decorator";

@Component
export default class SelectBase extends Mixins<SelectMixin>(SelectMixin) {
  @Prop({ type: Boolean, default: false })
  private defaultSelectable!: boolean;
}
</script>
