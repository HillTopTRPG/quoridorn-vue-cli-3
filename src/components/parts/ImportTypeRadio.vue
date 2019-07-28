<template>
  <div>
    <label v-for="(optionInfo, index) in optionInfoList" :key="index">
      <input
        type="radio"
        :name="name"
        :value="optionInfo.value"
        v-model="localValue"
      />
      {{ optionInfo.text }}
    </label>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit } from "vue-property-decorator";

@Component({})
export default class ImportTypeRadio {
  @Prop({ type: String, required: true })
  protected name!: string;

  @Prop({ type: String, default: "1" })
  public value!: string;

  @Prop({ type: Boolean, default: false })
  private test!: boolean;

  @Emit("input")
  public input(value: string | null) {}

  private get localValue(): string | null {
    if (this.test)
      window.console.log("set '" + this.value + "'", this.constructor.name);
    return this.value || "";
  }

  private set localValue(value: string | null) {
    if (this.test)
      window.console.log("return '" + value + "'", this.constructor.name);
    this.input(value);
  }

  private get optionInfoList() {
    return [
      {
        text: "上書き",
        value: "1"
      },
      {
        text: "追加",
        value: "2"
      }
    ];
  }
}
</script>
