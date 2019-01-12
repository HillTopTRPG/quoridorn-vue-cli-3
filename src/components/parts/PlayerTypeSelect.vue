<template>
  <select v-model="localValue" :style="{ webkitTextFillColor: fontColor, mozTextFillColor: fontColor }">
    <option disabled value="">権限</option>
    <option :key="role.value" :value="role.value" v-for="role in roles">{{role.label}}</option>
  </select>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from "vue-property-decorator";
import { Getter } from "vuex-class";

@Component<PlayerTypeSelect>({
  name: "createNewRoom"
})
export default class PlayerTypeSelect extends Vue {
  @Prop() public value!: string;
  @Getter("roles") roles: any;

  private fontColor: string = "#999";

  @Emit("input")
  public input(value: string) {}

  @Watch("value", { immediate: true })
  onChangeValue(value: string) {
    this.fontColor = value ? "#000" : "#999";
  }

  private get localValue(): string {
    return this.value || "";
  }

  private set localValue(value: string) {
    window.console.log(value);
    this.onChangeValue(value);
    this.input(value);
  }
}
</script>

<style scoped lang="scss">
</style>
