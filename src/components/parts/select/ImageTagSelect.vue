<template>
  <select-base :defaultLabel="defaultLabel" v-model="localValue">
    <option :key="tagObj.key" :value="tagObj.key" v-for="tagObj in imageTagList">{{tagObj.name}}</option>
  </select-base>
</template>

<script lang="ts">
import SelectMixin from "./base/SelectMixin.vue";
import SelectBase from "./base/SelectBase.vue";

import { Prop } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({ components: { SelectBase } })
export default class SelfActorSelect extends Mixins<SelectMixin>(SelectMixin) {
  @Getter("imageTagList") private imageTagList: any;

  @Prop({ type: String, default: "画像タグ" })
  protected defaultLabel!: string;
}
</script>
