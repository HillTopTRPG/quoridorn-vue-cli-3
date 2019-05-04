<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from "vue-property-decorator";

@Component
export default class SelectMixin extends Vue {
  @Prop({ type: String, default: "" })
  private value!: string;

  @Prop({ type: String, default: "" })
  protected defaultLabel!: string;

  private fontColor: string = "";

  @Emit("input")
  private input(value: string | null) {}

  private get localValue(): string | null {
    return this.value || "";
  }

  private set localValue(value: string | null) {
    this.onChangeValue(value);
    this.input(value);
  }

  @Watch("value", { immediate: true })
  onChangeValue(value: string | null) {
    // window.console.error("###", "$" + value + "$");
    this.fontColor = value ? "#000000" : "#999999";
  }

  updated() {
    const selectElm: HTMLSelectElement = this.$refs.select as HTMLSelectElement;
    if (selectElm) {
      const options: HTMLOptionElement[] = Array.prototype.slice.call(
        selectElm.querySelectorAll("option")
      ) as Array<HTMLOptionElement>;
      const index = options.findIndex(
        option => option.value === this.localValue
      );
      if (index === -1) this.localValue = null;
    }
  }
}
</script>
