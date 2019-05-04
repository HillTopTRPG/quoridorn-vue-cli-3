<template>
  <window-frame titleText="隠しダイスロール結果" display-property="private.display.secretDiceWindow" align="center" fixSize="400, 200" :isBanClose="true">
    <div class="contents" @contextmenu.prevent>
      <div class="secret-unit" v-for="(secretDiceObj, index) in secretDiceList" :key="index">
        <label><textarea :value="createTextAreaValue(secretDiceObj)"></textarea></label>
        <ctrl-button type="button" @click="publish(index)">結果公開</ctrl-button>
        <ctrl-button type="button" @click="delSecretDice(index)">削除</ctrl-button>
      </div>
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowFrame from "../WindowFrame.vue";
import WindowMixin from "../WindowMixin.vue";
import CtrlButton from "@/components/parts/CtrlButton.vue";

import { Action, Getter, Mutation } from "vuex-class";
import { Vue, Watch } from "vue-property-decorator";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: {
    CtrlButton,
    WindowFrame
  }
})
export default class SecretDiceWindow extends Mixins<WindowMixin>(WindowMixin) {
  @Action("windowOpen") private windowOpen: any;
  @Action("windowClose") private windowClose: any;
  @Action("addChatLog") private addChatLog: any;
  @Mutation("addSecretDice") private addSecretDice: any;
  @Mutation("delSecretDice") private delSecretDice: any;
  @Getter("secretDiceList") private secretDiceList: any;

  publish(index: number): void {
    const secretDiceObj = this.secretDiceList[index];
    // プレイヤー発言
    this.addChatLog({
      name: secretDiceObj.name,
      text: secretDiceObj.text,
      color: secretDiceObj.color,
      tab: secretDiceObj.tab,
      from: secretDiceObj.from,
      actorKey: secretDiceObj.chatActorKey,
      statusName: secretDiceObj.statusName,
      target: secretDiceObj.target,
      owner: secretDiceObj.owner
    });
    // ダイスロール結果
    this.addChatLog({
      name: secretDiceObj.diceBot,
      text: secretDiceObj.diceRollResult,
      color: secretDiceObj.color,
      tab: secretDiceObj.tab,
      from: secretDiceObj.from,
      actorKey: secretDiceObj.chatActorKey,
      statusName: secretDiceObj.statusName,
      target: secretDiceObj.target,
      owner: secretDiceObj.owner
    });
    this.delSecretDice(index);
  }

  createTextAreaValue(secretDiceObj: any): string {
    const text: string[] = [];
    text.push(secretDiceObj.text);
    text.push(`${secretDiceObj.diceBot}：${secretDiceObj.diceRollResult}`);
    return text.join("\n");
  }

  @Watch("secretDiceList")
  onChangeSecretDiceList(secretDiceList: any[]): void {
    // シークレットダイスの結果のリストの変動を感知して、表示内容があればこの画面を表示する
    if (secretDiceList.length) {
      this.windowOpen("private.display.secretDiceWindow");
    } else {
      this.windowClose("private.display.secretDiceWindow");
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.contents {
  position: absolute;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  font-size: 12px;
}
.secret-unit {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  &:not(:first-child) {
    margin-top: 0.5em;
  }
}
textarea {
  resize: none;
  padding: 0.2em;
  overflow: hidden;
  line-height: 1.2em;
  flex: 1;
}
label {
  height: 4em;
  box-sizing: border-box;
  flex: 1;
  display: flex;
}
button {
  margin-left: 1em;
  height: 4.4em;
  border-radius: 6px;
}
</style>
