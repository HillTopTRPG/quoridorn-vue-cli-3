<template>
  <div class="button-wrapper" :disabled="disabled">
    <button
      @click="buttonOnClick"
      :disabled="disabled"
    >
      <slot/>
    </button>
    <div class="background-area"></div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class CtrlButton extends Vue {
  @Emit("click")
  private buttonOnClick() {}

  @Prop({ type: String })
  private disabled: string | null;
}
</script>

<style scoped lang="scss">
@import "../common.scss";

$disabledOpacity: 0.4;
.button-wrapper {
  @include inline-flex-box(column, flex-start, center);
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
  padding: 0;
  border-radius: 5px;
  height: 1.8em;
  background: linear-gradient(to bottom, #b5b8ba 0%, #5e6061 100%);

  &[disabled="disabled"] {
    opacity: $disabledOpacity;
  }

  &:not([disabled="disabled"]):hover {
    background: linear-gradient(to bottom, #008efd 0%, #005eba 100%);

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

  &:active {
    background: linear-gradient(to bottom, #008efd 0%, #005eba 100%);

    .background-area {
      background: linear-gradient(
        to bottom,
        #ddf3fe 0%,
        #bee5fe 40%,
        #9dd9fe 100%
      );
    }
  }

  button {
    z-index: 3;
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

    &:disabled + .background-area {
      opacity: $disabledOpacity;
    }
  }
}
</style>
