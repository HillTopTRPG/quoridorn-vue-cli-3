<template>
  <WindowFrame
    titleText="入室情報入力画面"
    display-property="private.display.inputPlayerInfoWindow"
    align="center"
    fixSize="375, 199"
    @open="initWindow"
    :isBanClose="true"
  >
    <div class="contents">
      <div class="welcomeMessage">部屋「{{roomName}}」へようこそ！<br>ユーザ情報を入力してください。</div>
      <fieldset class="playerInfo">
        <legend>あなたの情報</legend>
        <label>
          権限：<select v-model="inputPlayerType">
            <option :key="role.value" :value="role.value" v-for="role in roles">{{role.label}}</option>
          </select>
          <input placeholder="ユーザ名を入力（必須項目）" type="text" v-model="inputPlayerName"/>
        </label>
        <label class="playerPassword">パスワード：<input type="password" v-model="inputPlayerPassword"/></label>
        <div class="description">部屋内でのユーザ管理に使用します。パスワード忘れに注意！</div>
        <div class="description">権限の詳細は<a @click="onClickDescription" href="javascript:void(0);">こちら</a></div>
      </fieldset>
      <div class="buttonArea">
        <button @click="commit" type="button"><i class="icon-home3"></i> 参加</button>
      </div>
    </div>
  </WindowFrame>
</template>

<script lang="ts">
import WindowFrame from "../../WindowFrame.vue";
import WindowMixin from "../../WindowMixin.vue";

import { Action, Getter } from "vuex-class";

import { Component, Vue, Watch } from "vue-property-decorator";

@Component<InputPlayerInfoWindow>({
  name: "inputPlayerInfoWindow",
  mixins: [WindowMixin],
  components: {
    WindowFrame
  }
})
export default class InputPlayerInfoWindow extends Vue {
  @Action("setProperty") setProperty: any;
  @Action("windowClose") windowClose: any;
  @Action("joinPlayer") joinPlayer: any;
  @Getter("getObj") getObj: any;
  @Getter("playerList") playerList: any;
  @Getter("roles") roles: any;

  private inputPlayerName: string = "";
  private inputPlayerPassword: string = "";
  private inputPlayerType: string = "";

  initWindow(): void {
    this.inputPlayerName = this.playerName;
    this.inputPlayerPassword = this.playerPassword;
    this.inputPlayerType = this.playerType;
  }

  commit() {
    // 入力チェック
    const errorMsg = [];
    if (!this.inputPlayerName) errorMsg.push("・ユーザ名");
    if (errorMsg.length > 0) {
      alert(`必須項目未入力エラー\n${errorMsg.join("\n")}\n入力をお願いします。`);
      return;
    }
    const player = this.playerList.filter((p: any) =>
      p.name === this.inputPlayerName
    );
    if (player && player.password !== this.inputPlayerPassword) {
      alert("パスワードが違います。\nパスワードを入力し直すか、別人で参加してください。");
      return;
    }
    // モーダル状態の解除
    this.setProperty({
      property: "isMordal",
      value: false,
      logOff: true
    });
    this.windowClose("private.display.inputPlayerInfoWindow");
    this.joinPlayer({
      peerId: "",
      roomName: this.roomName,
      playerName: this.inputPlayerName,
      playerPassword: this.inputPlayerPassword,
      playerType: this.inputPlayerType
    })
  }

  get roomName(this: any): string {
    return this.windowParam(this).roomName;
  }
  get playerName(this: any): string {
    return this.windowParam(this).playerName;
  }
  get playerPassword(this: any): string {
    return this.windowParam(this).playerPassword;
  }
  get playerType(this: any): string {
    return this.windowParam(this).playerType;
  }

  /**
   * ====================================================================================================
   * 権限に関する説明リンクをクリックした際の処理
   */
  onClickDescription(): void {
    alert(
      this.roles.filter((role: any) => role.value === this.playerType)[0]
        .description
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
  overflow-y: scroll;

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
  color: #444;
}
.buttonArea {
  margin-top: 0.5em;
  text-align: center;
}
</style>
