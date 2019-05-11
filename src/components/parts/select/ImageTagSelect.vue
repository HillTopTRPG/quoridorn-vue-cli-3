<template>
  <ctrl-select
    v-model="localValue"
    :optionInfoList="optionInfoList"
  />
</template>

<script lang="ts">
import SelectMixin from "./base/SelectMixin.ts";
import CtrlSelect from "@/components/parts/CtrlSelect.vue";

import { Prop } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({ components: { CtrlSelect } })
export default class SelfActorSelect extends Mixins<SelectMixin>(SelectMixin) {
  @Getter("imageTagList") private imageTagList: any;

  @Prop({ type: String, default: "画像タグ" })
  protected defaultLabel!: string;

  private get optionInfoList(): any[] {
    const resultList = this.imageTagList.map((tagObj, index) => ({
      key: tagObj.key,
      value: tagObj.key,
      text: tagObj.name,
      disabled: false
    }));
    resultList.unshift({
      key: null,
      value: "",
      text: this.defaultLabel,
      disabled: true
    });
    return resultList;
  }
}
</script>
