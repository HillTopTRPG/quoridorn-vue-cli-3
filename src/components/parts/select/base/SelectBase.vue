<template>
  <select v-model="localValue" :style="{ webkitTextFillColor: fontColor, mozTextFillColor: fontColor }" ref="select">
    <option :disabled="!defaultSelectable" value="" v-if="defaultLabel">{{defaultLabel}}</option>
    <slot/>
  </select>
</template>

<script lang="ts">
import SelectMixin from "./SelectMixin.vue";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component<SelectBase>({
  name: "selectBase",
  mixins: [SelectMixin]
})
export default class SelectBase extends Vue {
  @Prop({ type: String })
  private defaultLabel: string | undefined;

  @Prop({ type: Boolean, default: false })
  private defaultSelectable!: boolean;
}
</script>
