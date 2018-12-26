<template>
  <fieldset class="root">
    <legend>新しい部屋をつくる</legend>
    <div class="roomInfo">
      <label class="roomName">部屋名：
        <input class="roomNameInput" type="text" v-model="roomName" placeholder="必須項目" />
      </label>
      <label class="roomNameCheckBtn"><button @click="checkRoomExist">部屋存在確認</button></label>
      <span class="existMsg" v-show="existCheckMessage !== ''">{{existCheckMessage}}</span>
      <label class="roomPassword">パスワード：<input class="passwordInput" type="password" v-model="password"/></label>
      <label class="roomSystem">システム：
        <select class="systemSelect" v-model="currentSystem">
          <option v-for="systemObj in diceBotSystems" :key="systemObj.value" :value="systemObj.value">{{systemObj.name}}</option>
        </select>
      </label>
    </div>
    <fieldset class="playerInfo">
      <legend>あなたの情報</legend>
      <div>
        <label>権限：<!--
       --><select class="playerTypeSelect" v-model="playerType">
            <option value="PL">プレイヤー</option>
            <option value="GM">ゲームマスター</option>
            <option value="SubGM">サブGM</option>
            <option value="見学">見学者</option>
          </select>
          <input class="playerNameInput" type="text" v-model="playerName" placeholder="名前（必須項目）" />
        </label>
      </div>
      <label class="passwordLabel">パスワード：<input class="passwordInput" type="password" v-model="playerPassword"/></label>
      <div class="description">部屋内でのユーザ管理に使用します。パスワード忘れに注意！ 権限の詳細は<a href="#" @click="onClickDescription">こちら</a></div>
    </fieldset>
    <button type="button" @click="commit"><i class="icon-home3"></i> 作成</button>
  </fieldset>
</template>

<script lang="ts">
import { Action } from "vuex-class";

import { Component, Vue, Watch } from "vue-property-decorator";

@Component<CreateNewRoom>({
  name: "createNewRoom"
})
export default class CreateNewRoom extends Vue {
  @Action("setProperty") setProperty: any;
  @Action("emptyMember") emptyMember: any;
  @Action("createPeer") createPeer: any;
  @Action("windowClose") windowClose: any;
  @Action("checkRoomName") checkRoomName: any;

  /*
   * data
   */
  private roomName: string = "";
  private playerName: string = "";
  private password: string = "";
  private playerPassword: string = "";
  private currentSystem: string = "DiceBot";
  private diceBotSystems: any[] = [];
  private existCheckMessage: string = "";
  private playerType: string = "PL";
  private roleText: any = {
    PL: "部屋の設定や他のプレイヤーの設定の一部が変更不可です。",
    GM: "すべての部屋設定とプレイヤーの設定を変更可能です。",
    SubGM: "見た目が異なるだけで、ゲームマスターと同等の権限です。",
    見学: "部屋の設定、プレイヤーたちの設定は一切変更できません。"
  };

  /*
   * lifecycle hook
   */
  created(): void {
    this.diceBotSystems.push({
      name: "指定なし",
      value: "DiceBot"
    });
    const _: any = this;

    /* bcdice-js を Dynamic import */
    import(/* webpackChunkName: "bcdice-js" */ "bcdice-js").then(module => {
      const DiceBotLoader = module.DiceBotLoader;
      DiceBotLoader["collectDiceBots"]().forEach(
        (diceBot: any): void => {
          // window.console.qLog(`"${diceBot.gameType()}" : "${diceBot.gameName()}"`)
          _.diceBotSystems.push({
            name: diceBot["gameName"](),
            value: diceBot.gameType()
          });
        }
      );
    });
  }

  @Watch("roomName")
  onChangeRoomName() {
    this.existCheckMessage = "";
  }

  // この画面を開いた時
  onOpen(): void {
    this.roomName = "";
    this.password = "";
    this.playerName = "";
    this.playerType = "PL";
    this.existCheckMessage = "";
    this.playerPassword = "";
    this.currentSystem = "DiceBot";
  }

  onClickDescription(): void {
    alert(this.roleText[this.playerType]);
  }

  /**
   * 確定ボタン押下時
   */
  commit(): void {
    // 入力チェック
    const errorMsg = [];
    if (this.roomName === "") errorMsg.push("・部屋名は必須項目です。");
    if (this.playerName === "") errorMsg.push("・あなたの名前は必須項目です。");
    if (errorMsg.length > 0) {
      alert(`${errorMsg.join("\n")}\n入力をお願いします。`);
      return;
    }

    // 利用システムの設定
    this.setProperty({
      property: "public.room.system",
      value: this.currentSystem
    });

    // 利用者情報の設定
    this.setProperty({
      property: "private.self",
      value: {
        password: this.password,
        playerPassword: this.playerPassword,
        playerName: this.playerName,
        playerType: this.playerType,
        currentChatName: `${this.playerName}(${this.playerType})`
      },
      logOff: true
    });

    // メンバーのリセット
    this.emptyMember();

    // 部屋に接続する
    this.createPeer({
      roomId: this.roomName
    });

    // この画面を閉じる
    this.windowClose("private.display.createRoomWindow");
  }

  /**
   * キャンセルボタン押下時
   */
  cancel(): void {
    // この画面を閉じる
    this.windowClose("private.display.createRoomWindow");
  }

  /**
   * 部屋の存在チェック
   */
  checkRoomExist(): void {
    if (this.roomName === "") {
      this.existCheckMessage = "部屋名を入力してください。";
      return;
    }
    this.existCheckMessage = "存在確認中です...";
    this.checkRoomName({
      roomName: this.roomName,
      roomFindFunc: (message: string) => (this.existCheckMessage = message),
      roomNonFindFunc: () =>
        (this.existCheckMessage = "この部屋は存在しません。")
    });
  }
}
</script>

<style scoped src="./login.css">
</style>

<style scoped>
fieldset.root,
fieldset.root > legend {
  background-color: #cec;
}
.roomInfo {
  display: grid;
  grid-template-columns: 1fr 15em;
  grid-template-rows: auto auto auto auto;
  grid-template-areas:
    " roomName     roomNameCheckBtn "
    " roomPassword existMsg         "
    " roomSystem   roomSystem       ";
}
.playerInfo label {
  margin-right: 8em;
}
.roomName {
  grid-area: roomName;
}
.roomNameCheckBtn {
  grid-area: roomNameCheckBtn;
  padding: 0 1em;
}
.roomPassword {
  grid-area: roomPassword;
}
.existMsg {
  grid-area: existMsg;
  word-wrap: break-word;
  white-space: normal;
  padding: 0 1em;
}
.roomSystem {
  grid-area: roomSystem;
}
label {
  display: flex;
  flex-direction: row;
}
label > input {
  flex: 1;
}
</style>
