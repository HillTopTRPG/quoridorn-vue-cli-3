<template>
  <select v-model="localValue" :style="{ webkitTextFillColor: fontColor, mozTextFillColor: fontColor }">
    <option disabled value="">{{defaultLabel}}</option>
    <slot/>
  </select>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import SelectMixin from "./SelectMixin.vue";

@Component<SelectBase>({
  name: "selectBase",
  mixins: [SelectMixin]
})
export default class SelectBase extends Vue {
  @Prop() public defaultLabel!: string;
}
</script>
