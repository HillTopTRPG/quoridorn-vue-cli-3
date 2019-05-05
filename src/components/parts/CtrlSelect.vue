<template>
  <label class="select-wrapper" :disabled="disabled">
    <select
      v-model="localValue"
      ref="select"
      :disabled="disabled"
    ><slot/></select>
    <div class="background-area"></div>
  </label>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class CtrlSelect extends Vue {
  @Prop({ type: Boolean })
  private disabled: boolean | null;

  @Prop({ type: String, default: "" })
  public value!: string;

  @Emit("input")
  public input(value: string | null) {}

  private get localValue(): string | null {
    return this.value || "";
  }

  private set localValue(value: string | null) {
    this.input(value);
  }

  public get optionValueList(): string[] {
    const selectElm: HTMLSelectElement = this.$refs.select as HTMLSelectElement;
    if (selectElm) {
      const options: HTMLOptionElement[] = Array.prototype.slice.call(
        selectElm.querySelectorAll("option")
      ) as Array<HTMLOptionElement>;

      return options.map(option => option.value);
    }

    return [];
  }
}
</script>

<style scoped lang="scss">
@import "./Ctrl.scss";

.select-wrapper {
  @include ctrl-select();
}
</style>
