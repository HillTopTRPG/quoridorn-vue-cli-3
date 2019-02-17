<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from "vue-property-decorator";

@Component<SelectMixin>({ name: "selectMixin" })
export default class SelectMixin extends Vue {
  @Prop() public value!: string;
  @Prop() public defaultLabel!: string;

  private fontColor: string = "";

  @Emit("input")
  public input(value: string | null) {}

  @Watch("value", { immediate: true })
  onChangeValue(value: string | null) {
    // window.console.error("###", "$" + value + "$");
    this.fontColor = value ? "#000" : "#999";
  }

  private get localValue(): string | null {
    return this.value || "";
  }

  private set localValue(value: string | null) {
    this.onChangeValue(value);
    this.input(value);
  }

  updated() {
    const selectElm: HTMLSelectElement = <HTMLSelectElement>this.$refs.select;
    if (selectElm) {
      const options: HTMLOptionElement[] = <Array<HTMLOptionElement>>(
        Array.prototype.slice.call(selectElm.querySelectorAll("option"))
      );
      const index = options.findIndex(
        option => option.value === this.localValue
      );
      if (index === -1) this.localValue = null;
    }
  }
}
</script>
