<template>
  <label
    class="ctrl-button-wrapper"
    :disabled="disabled"
    @click.left.stop.prevent="buttonOnClickLeft"
    @click.right.stop.prevent="buttonOnClickRight"
    @contextmenu.prevent
  >
    <input type="button" :disabled="disabled" hidden>
    <span class="front-area"><slot/></span>
    <span class="background-area"></span>
  </label>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class CtrlButton extends Vue {
  @Prop({ type: Boolean, default: false })
  private disabled!: boolean;

  @Emit("click")
  private buttonOnClickLeft(event: any) {}

  @Emit("click-right")
  private buttonOnClickRight(event: any) {}
}
</script>

<style scoped lang="scss">
@import "./Ctrl.scss";

.ctrl-button-wrapper {
  @include ctrl-button();
}
</style>
