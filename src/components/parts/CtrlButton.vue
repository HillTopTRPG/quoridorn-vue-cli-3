<template>
  <label class="ctrl-button-wrapper" :disabled="disabled">
    <input type="button" :disabled="disabled" @click="buttonOnClick" hidden>
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
  private buttonOnClick() {}
}
</script>

<style scoped lang="scss">
@import "./Ctrl.scss";

.ctrl-button-wrapper {
  @include ctrl-button();
}
</style>
