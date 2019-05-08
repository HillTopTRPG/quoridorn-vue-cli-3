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
    // window.console.error(value);
    this.onChangeValue(value);
    this.input(value);
  }

  @Watch("value", { immediate: true })
  onChangeValue(value: string | null) {
    this.fontColor = value || this.defaultSelectable ? "#000000" : "#999999";
  }

  protected get optionValueStrList(): string[] {
    return [];
  }

  updated() {
    const optionValueStrList: string[] = this.optionValueStrList.concat();
    optionValueStrList.push("");
    const index = optionValueStrList.findIndex(
      option => option === this.localValue
    );
    if (index === -1) {
      // window.console.log(optionValueStrList);
      // window.console.log("select reset", this.localValue, "-> ''");
      this.localValue = "";
    }
  }
}
