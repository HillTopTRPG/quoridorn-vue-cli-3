<template>
  <label class="select-wrapper">
    <select
      v-model="localValue"
    ><slot/></select>
    <div class="background-area"></div>
  </label>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class CtrlSelect extends Vue {
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
}
</script>

<style scoped lang="scss">
@import "../common.scss";

.select-wrapper {
  @include inline-flex-box(column, flex-start, center);
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
  padding: 0;
  border-radius: 5px;
  height: 1.8em;
  background: linear-gradient(to bottom, #b5b8ba 0%, #5e6061 100%);

  &:hover {
    background: linear-gradient(to bottom, #008efd 0%, #005eba 100%);

    &:after {
      border-left-color: #006ce0;
    }

    .background-area {
      background: linear-gradient(
        to bottom,
        rgb(255, 255, 255) 0%,
        rgb(250, 250, 250) 40%,
        rgb(245, 245, 245) 100%
      );
    }
  }

  .background-area {
    position: absolute;
    top: 1px;
    bottom: 1px;
    left: 1px;
    right: 1px;
    border-radius: 4px;
    z-index: 1;
    background: linear-gradient(
      to bottom,
      rgb(255, 255, 255) 0%,
      rgb(240, 240, 240) 40%,
      rgb(225, 225, 225) 100%
    );
  }

  /* 三角形 */
  &:before {
    content: "";
    position: absolute;
    top: 50%;
    bottom: 0;
    transform: translateY(-25%);
    right: 8px;
    width: 0;
    height: 0;
    padding: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 6px solid black;
    pointer-events: none;
    z-index: 2;
  }

  /* 仕切り線 */
  &:after {
    content: "";
    position: absolute;
    top: 4px;
    bottom: 4px;
    right: 22px;
    width: 1px;
    border-left: 1px solid rgba(0, 0, 0, 0.2);
    z-index: 2;
  }

  select {
    width: 100%;
    z-index: 3;
    display: block;
    position: relative;
    cursor: pointer;
    text-indent: 0.01px;
    text-overflow: ellipsis;
    border: none;
    outline: none;
    background: transparent none;
    box-shadow: none;
    -webkit-appearance: none;
    appearance: none;
    margin-right: 23px;

    /*background-color: #eeeecc;*/

    padding: 0 0.5em;
    /*color: #666666;*/

    &::-ms-expand {
      display: none;
    }
  }
}
</style>
