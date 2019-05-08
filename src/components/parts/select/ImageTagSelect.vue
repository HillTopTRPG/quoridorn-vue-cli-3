<template>
  <select-base
    :defaultLabel="defaultLabel"
    v-model="localValue"
    :optionValueList="optionValueStrList"
  >
    <option :key="tagObj.key" :value="tagObj.key" v-for="tagObj in imageTagList">{{tagObj.name}}</option>
  </select-base>
</template>

<script lang="ts">
import SelectMixin from "./base/SelectMixin.ts";
import SelectBase from "./base/SelectBase.vue";

import { Prop } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({ components: { SelectBase } })
export default class SelfActorSelect extends Mixins<SelectMixin>(SelectMixin) {
  @Getter("imageTagList") private imageTagList: any;

  @Prop({ type: String, default: "画像タグ" })
  protected defaultLabel!: string;

  protected get optionValueStrList(): string[] {
    return this.imageTagList.map(status => status.system);
  }
}
</script>
