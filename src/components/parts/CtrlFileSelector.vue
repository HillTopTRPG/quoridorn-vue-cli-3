<template>
  <label
    class="ctrl-input-file-wrapper"
    :disabled="disabled"
    @contextmenu.prevent
  >
    <input
      type="file"
      :disabled="disabled"
      @change.stop.prevent="fileOnChange"
      multiple
    />
    <span class="front-area"><slot /></span>
    <span class="background-area"></span>
  </label>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class CtrlFileSelector extends Vue {
  @Prop({ type: Boolean, default: false })
  private disabled!: boolean;

  @Emit("change")
  private fileOnChange(event: any) {}
}
</script>

<style scoped lang="scss">
@import "./Ctrl.scss";

.ctrl-input-file-wrapper {
  @include ctrl-button();
}
</style>
