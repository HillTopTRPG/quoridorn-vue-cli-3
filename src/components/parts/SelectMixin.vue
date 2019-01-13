<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from "vue-property-decorator";

@Component<SelectMixin>({
  name: "selectMixin"
})
export default class SelectMixin extends Vue {
  @Prop() public value!: string;
  @Prop() public defaultLabel!: string;

  private fontColor: string = "";

  @Emit("input")
  public input(value: string) {}

  @Watch("value", { immediate: true })
  onChangeValue(value: string) {
    this.fontColor = value ? "#000" : "#999";
  }

  private get localValue(): string {
    return this.value || "";
  }

  private set localValue(value: string) {
    this.onChangeValue(value);
    this.input(value);
  }
}
</script>
