<template>
  <label class="input-file-wrapper" :disabled="disabled">
    <input type="file" :disabled="disabled" @change="fileOnChange" hidden multiple>
    <span class="front-area"><slot/></span>
    <span class="background-area"></span>
  </label>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class CtrlFileSelector extends Vue {
  @Prop({ type: Boolean })
  private disabled: boolean | null;

  @Emit("change")
  private fileOnChange(event: any) {}
}
</script>

<style scoped lang="scss">
@import "./Ctrl.scss";

.input-file-wrapper {
  @include ctrl-button();
}
</style>
