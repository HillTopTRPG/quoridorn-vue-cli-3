<script lang="ts">
import CtrlSelect from "@/components/parts/CtrlSelect.vue";
import { Component, Vue, Prop, Emit, Watch } from "vue-property-decorator";

@Component
export default class SelectMixin extends Vue {
  @Prop({ type: String, default: "" })
  private value!: string;

  @Prop({ type: String, default: "" })
  protected defaultLabel!: string;

  @Prop({ type: Boolean, default: false })
  private defaultSelectable!: boolean;

  private fontColor: string = "";

  @Emit("input")
  private input(value: string | null) {}

  private get localValue(): string | null {
    return this.value || "";
  }

  private set localValue(value: string | null) {
    // window.console.log(value);
    this.onChangeValue(value);
    this.input(value);
  }

  @Watch("value", { immediate: true })
  onChangeValue(value: string | null) {
    this.fontColor = value || this.defaultSelectable ? "#000000" : "#999999";
  }

  updated() {
    const selectElm: CtrlSelect = this.$refs.select as CtrlSelect;
    if (selectElm) {
      const index = selectElm.optionValueList.findIndex(
        option => option === this.localValue
      );
      if (index === -1) this.localValue = null;
    }
  }
}
</script>
