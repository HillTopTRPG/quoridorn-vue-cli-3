<template>
  <WindowFrame titleText="入室画面" display-property="private.display.createRoomWindow" align="center" fixSize="370, 286" @open="onOpen">
    <div class="contents">
      <fieldset class="roomInfo">
        <legend>部屋の情報</legend>
        <label class="roomNameLabel">部屋名：
          <input class="roomNameInput" type="text" v-model="roomName" placeholder="必須項目です。" />
        </label>
        <div>
          <button class="roomNameCheckBtn" @click="checkRoomExist">部屋存在確認</button>
          <span class="existMsg" v-show="existCheckMessage !== ''"><b>{{existCheckMessage}}</b></span>
        </div>
        <label class="passwordLabel">パスワード：<input class="passwordInput" type="password" v-model="password" placeholder="推奨項目（荒らし防止のため）" /></label>
        <label class="systemLabel">システム：
          <select class="systemSelect" v-model="currentSystem">
            <option v-for="systemObj in diceBotSystems" :key="systemObj.value" :value="systemObj.value">{{systemObj.name}}</option>
          </select>
        </label>
      </fieldset>
      <fieldset>
        <legend>あなたの情報</legend>
        <div>
          <label>
            <select class="playerTypeSelect" v-model="playerType">
              <option value="PL">プレイヤー</option>
              <option value="GM">ゲームマスター</option>
              <option value="SubGM">サブGM</option>
              <option value="見学">見学者</option>
            </select>
          </label>
          <input class="playerNameInput" type="text" v-model="playerName" placeholder="名前（必須項目）" />
        </div>
        <label class="passwordLabel">パスワード：<input class="passwordInput" type="password" v-model="playerPassword" placeholder="推奨項目（成りすまし防止のため）"/></label>
        <div v-html="roleText[playerType].replace(/\n/g, '<br>')"></div>
      </fieldset>
      <div class="operateArea">
        <button @click="commit">決定</button>
        <button @click="cancel">キャンセル</button>
      </div>
    </div>
  </WindowFrame>
</template>

<script lang="ts">
import { Action } from "vuex-class";
// import { DiceBotLoader } from "bcdice-js"; // ES Modules
import WindowFrame from "../WindowFrame.vue";
import WindowMixin from "../WindowMixin.vue";

import { Component, Vue, Watch } from "vue-property-decorator";

@Component<CreateRoomWindow>({
  name: "createRoomWindow",
  mixins: [WindowMixin],
  components: {
    WindowFrame
  }
})
export default class CreateRoomWindow extends Vue {
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
          // quoridornLog(`"${diceBot.gameType()}" : "${diceBot.gameName()}"`)
          _.diceBotSystems.push({
            name: diceBot.gameName(),
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
        currentChatKey: `player-${this.playerName}`
      },
      logOff: true
    });

    // メンバーのリセット
    this.emptyMember();

    // 部屋に接続する
    // TODO 引数修正
    this.createPeer({
      roomName: this.roomName
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.contents {
  display: flex;
  flex-direction: column;
  width: 100%;
  font-size: 12px;
}
.contents > *:not(:first-child) {
  margin-top: 0.5em;
}
.roomInfo {
  display: flex;
  flex-direction: column;
}
.role span {
  border-radius: 5px;
  border: 1px solid blue;
  background-color: blue;
  color: white;
  padding: 0 3px;
  cursor: default;
  font-size: 80%;
}
.role span:hover {
  border-color: red;
}
fieldset > label,
fieldset > div {
  width: 100%;
}
fieldset > label,
fieldset > div {
  display: flex;
  justify-content: left;
  align-items: center;
}
fieldset > label > *:last-child,
fieldset > div > *:last-child {
  flex: 1;
}
.operateArea {
  text-align: center;
}
</style>
