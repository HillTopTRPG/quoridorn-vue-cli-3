<template>
  <select :title="helpMessage" v-model="currentSystem">
    <option :key="systemObj.value" :value="systemObj.value" v-for="systemObj in diceBotSystems">{{systemObj.name}}</option>
  </select>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import { Action } from "vuex-class";

@Component<DiceBotSelect>({
  name: "diceBotSelect"
})
export default class DiceBotSelect extends Vue {
  @Action("loading") loading: any;
  @Prop() public value!: string;

  /*
   * data
   */
  private diceBotSystems: any[] = [];
  /** bc-dice本体 */
  private _bcDice: any = null;
  /** ダイスボットの説明文の定型部分 */
  private baseHelpMessage: string =
    "【ダイスボット】チャットにダイス用の文字を入力するとダイスロールが可能\n" +
    "入力例）2d6+1 攻撃！\n" +
    "上記のようにダイス文字の後ろに空白を入れて発信することも可能\n" +
    "以下、使用例\n" +
    "　3D6+1>=9 ：3d6+1で目標値9以上かの判定\n" +
    "　1D100<=50 ：D100で50%目標の下方ロールの例\n" +
    "　3U6[5] ：3d6のダイス目が5以上の場合に振り足しして合計する(上方無限)\n" +
    "　3B6 ：3d6のダイス目をバラバラのまま出力する（合計しない）\n" +
    "　10B6>=4 ：10d6を振り4以上のダイス目の個数を数える\n" +
    "　(8/2)D(4+6)<=(5*3) ：個数・ダイス・達成値には四則演算も使用可能\n" +
    "　C(10-4*3/2+2) ：C(計算式)で計算だけの実行も可能\n" +
    "　choice[a,b,c] ：列挙した要素から一つを選択表示。ランダム攻撃対象決定などに\n" +
    "　S3d6 ：各コマンドの先頭に「S」を付けると他人から結果が見えないシークレットロール\n" +
    "　3d6/2 ：ダイス出目を割り算（切り捨て）。切り上げは /2U、四捨五入は /2R。\n" +
    "　D66 ：D66ダイス。順序はゲームに依存。D66N：そのまま、D66S：昇順\n";

  @Emit("input")
  input(currentSystem: string) {}

  public get currentSystem(): string {
    return this.value;
  }
  public set currentSystem(value: string) {
    const diceObj = this.diceBotSystems.filter(obj => obj.value === value)[0];

    if (!this.bcDice) return;
    this.bcDice.setDiceBot(diceObj.diceBot);

    this.input(value);
  }

  public get bcDice(): any {
    return this._bcDice;
  }
  public set bcDice(bcDice: any) {
    this._bcDice = bcDice;
  }

  /*
   * lifecycle hook
   */
  created(): void {}
  mounted(): void {
    this.diceBotSystems.push({
      name: "ダイスBot指定なし",
      value: "DiceBot",
      helpMessage:
        this.baseHelpMessage +
        `==【ダイスボット(指定なし)専用】====================\n` +
        "ゲーム固有の判定がある場合はこの場所に記載されます。"
    });
    const _: any = this;

    /* bcdice-js を Dynamic import */
    setTimeout(() => {
      _.loading(true);
      import(/* webpackChunkName: "bcdice-js" */ "bcdice-js").then(module => {
        _.bcDice = new module.BCDice();
        _.loading(false);

        const DiceBotLoader = module.DiceBotLoader;
        DiceBotLoader["collectDiceBots"]().forEach(
          (diceBot: any): void => {
            // window.console.log(`"${diceBot.gameType()}" : "${diceBot.gameName()}"`);
            _.diceBotSystems.push({
              name: diceBot["gameName"](),
              value: diceBot.gameType(),
              diceBot: diceBot,
              helpMessage:
                _.baseHelpMessage +
                `==【${diceBot.gameName()}専用】====================\n` +
                diceBot.getHelpMessage()
            });
          }
        );
      });
    });
  }
  private get helpMessage(): string {
    const diceObj = this.diceBotSystems.filter(
      obj => obj.value === this.currentSystem
    )[0];
    return diceObj ? diceObj.helpMessage : "";
  }
}
</script>

<style scoped>
</style>
