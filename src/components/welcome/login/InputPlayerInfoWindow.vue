<template>
  <window-frame
    titleText="入室情報入力画面"
    display-property="private.display.inputPlayerInfoWindow"
    align="center"
    fixSize="375, 210"
    @open="initWindow"
    :isBanClose="true"
  >
    <div class="contents">
      <div class="welcomeMessage">部屋「{{useRoomName}}」へようこそ！<br>ユーザ情報を入力してください。</div>
      <fieldset class="playerInfo">
        <legend>あなたの情報</legend>
        <label>
          <player-type-select v-model="inputPlayerType" v-if="!isPlayerExist"/>
          <input ref="playerInput" placeholder="ユーザ名を入力（必須項目）" type="text" v-model="inputPlayerName" list="input-player-info-window-players"/>
          <datalist id="input-player-info-window-players">
            <option v-for="player in playerList" :key="player.key" :value="player.name">{{player.name}}</option>
          </datalist>
        </label>
        <label class="playerPassword">パスワード：<input type="password" v-model="inputPlayerPassword"/></label>
        <div class="description" v-if="!isPlayerExist">部屋内でのユーザ管理に使用します。パスワード忘れに注意！</div>
        <div class="description" v-if="!isPlayerExist">権限の詳細は<a @click="onClickDescription" href="javascript:void(0);">こちら</a></div>
        <div class="description" v-if="isPlayerExist">おかえりなさい。<br>照合するパスワードを指定してください。</div>
      </fieldset>
      <div class="buttonArea">
        <ctrl-button @click="commit"><i class="icon-home3"></i> 参加</ctrl-button>
      </div>
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowFrame from "../../WindowFrame.vue";
import WindowMixin from "../../WindowMixin.vue";
import PlayerTypeSelect from "@/components/parts/select/PlayerTypeSelect.vue";
import CtrlButton from "@/components/parts/CtrlButton.vue";

import { Action, Getter, Mutation } from "vuex-class";
import { Watch } from "vue-property-decorator";
import { Component, Mixins } from "vue-mixin-decorator";

@Component({
  components: {
    CtrlButton,
    WindowFrame,
    PlayerTypeSelect: PlayerTypeSelect
  }
})
export default class InputPlayerInfoWindow extends Mixins<WindowMixin>(
  WindowMixin
) {
  @Action("setProperty") private setProperty: any;
  @Action("windowClose") private windowClose: any;
  @Action("loading") private loading: any;
  @Mutation("updateIsModal") private updateIsModal: any;
  @Getter("getObj") private getObj: any;
  @Getter("playerList") private playerList: any;
  @Getter("roles") private roles: any;
  @Getter("volatileRoomName") private volatileRoomName: any;
  @Getter("volatilePlayerName") private volatilePlayerName: any;
  @Getter("volatilePlayerPassword") private volatilePlayerPassword: any;
  @Getter("volatilePlayerType") private volatilePlayerType: any;
  @Getter("volatileFontColor") private volatileFontColor: any;
  @Getter("volatileResolve") private volatileResolve: any;

  private inputPlayerName: string = "";
  private inputPlayerPassword: string = "";
  private inputPlayerType: string = "";
  private inputPlayerTypeSave: string = "";
  private useRoomName: string = "";

  private isPlayerExist: boolean = false;

  initWindow(this: any): void {
    this.useRoomName = this.volatileRoomName;
    this.inputPlayerName = this.volatilePlayerName;
    this.inputPlayerPassword = this.volatilePlayerPassword;
    this.inputPlayerType = this.volatilePlayerType;
    this.loading(false);
    this.updateIsModal(true);
    this.$refs.playerInput["focus"]();
  }

  @Watch("inputPlayerType")
  onChangeInputPlayerType(value: string) {
    if (!this.isPlayerExist) this.inputPlayerTypeSave = value;
  }

  @Watch("inputPlayerName")
  onChangeInputPlayerName(value: string) {
    const player: any = this.playerList.filter(
      (player: any) => player.name === value
    )[0];
    this.isPlayerExist = !!player;
    this.inputPlayerType = player ? player.type : this.inputPlayerTypeSave;
  }

  commit() {
    // 入力チェック
    const errorMsg = [];
    this.inputPlayerName = this.inputPlayerName.trim();
    if (!this.inputPlayerName) errorMsg.push("・ユーザ名");
    if (errorMsg.length > 0) {
      alert(
        `必須項目未入力エラー\n${errorMsg.join("\n")}\n入力をお願いします。`
      );
      return;
    }
    const player = this.playerList.filter(
      (p: any) => p.name === this.inputPlayerName
    )[0];
    if (player && player.password !== this.inputPlayerPassword) {
      alert(
        "パスワードが違います。\nパスワードを入力し直すか、別人で参加してください。"
      );
      return;
    }
    this.windowClose("private.display.inputPlayerInfoWindow");

    this.loading(true);
    this.volatileResolve({
      playerName: this.inputPlayerName,
      playerPassword: this.inputPlayerPassword,
      playerType: this.inputPlayerType,
      fontColor: this.volatileFontColor
    });
  }

  /**
   * ====================================================================================================
   * 権限に関する説明リンクをクリックした際の処理
   */
  onClickDescription(): void {
    alert(
      this.roles.filter(
        (role: any) => role.value === this.volatilePlayerType
      )[0].description
    );
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.contents {
  position: absolute;
  height: 100%;
  width: 100%;

  font-size: 12px;
}
.welcomeMessage {
  color: #e1312c;
}
.playerInfo {
  display: flex;
  flex-direction: row;
}
label {
  display: flex;
}
input {
  /*height: 1.5em;*/
  flex: 1;
}
fieldset {
  padding: 0 0.5rem 0.5rem;
}
.description {
  font-size: 10px;
  color: #444444;
}
.buttonArea {
  margin-top: 0.5em;
  text-align: center;
}
</style>
