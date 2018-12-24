<template>
  <WindowFrame titleText="入室画面" display-property="private.display.createRoomWindow" align="center" fixSize="370, 286" @open="open">
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
import { DiceBotLoader } from "bcdice-js"; // ES Modules
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
    setTimeout((): void => {
      DiceBotLoader["collectDiceBots"]().forEach(
        (diceBot: any): void => {
          // window.console.qLog(`"${diceBot.gameType()}" : "${diceBot.gameName()}"`)
          _.diceBotSystems.push({
            name: diceBot["gameName"](),
            value: diceBot.gameType()
          });
        }
      );
    }, 0);
  }

  @Watch("roomName")
  onChangeRoomName() {
    this.existCheckMessage = "";
  }

  open(): void {
    this.roomName = "";
    this.password = "";
    this.playerName = "";
    this.playerType = "PL";
    this.existCheckMessage = "";
    this.playerPassword = "";
    this.currentSystem = "DiceBot";
  }

  commit(): void {
    const errorMsg = [];
    if (this.roomName === "") {
      errorMsg.push("・部屋名は必須項目です。");
    }
    if (this.playerName === "") {
      errorMsg.push("・あなたの名前は必須項目です。");
    }
    if (errorMsg.length > 0) {
      alert(`${errorMsg.join("\n")}\n入力をお願いします。`);
      return;
    }
    this.setProperty({
      property: "public.room.system",
      value: this.currentSystem
    });
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
    this.emptyMember();
    this.createPeer({
      roomId: this.roomName
    });
    this.windowClose("private.display.createRoomWindow");
  }

  cancel(): void {
    this.windowClose("private.display.createRoomWindow");
  }
  checkRoomExist(): void {
    if (this.roomName === "") {
      this.existCheckMessage = "部屋名を入力してください。";
      return;
    }
    this.existCheckMessage = "存在確認中です...";
    const _ = this;
    this.checkRoomName({
      roomName: this.roomName,
      roomFindFunc: (message: string) => (_.existCheckMessage = message),
      roomNonFindFunc: () => (_.existCheckMessage = "この部屋は存在しません。")
    });
  }
}
</script>

<!--
<script>
import { mapActions } from "vuex";
import { DiceBotLoader } from "bcdice-js"; // ES Modules
import WindowFrame from "../WindowFrame";
import WindowMixin from "../WindowMixin";

export default {
  name: "createRoomWindow",
  mixins: [WindowMixin],
  components: {
    WindowFrame
  },
  data() {
    return {
      roomName: "",
      playerName: "",
      password: "",
      playerPassword: "",
      currentSystem: "DiceBot",
      diceBotSystems: [],
      existCheckMessage: "",
      playerType: "PL",
      roleText: {
        "PL": "部屋の設定や他のプレイヤーの設定の一部が変更不可です。",
        "GM": "すべての部屋設定とプレイヤーの設定を変更可能です。",
        "SubGM": "見た目が異なるだけで、ゲームマスターと同等の権限です。",
        "見学": "部屋の設定、プレイヤーたちの設定は一切変更できません。"
      }
    };
  },
  created() {
    this.diceBotSystems.push({
      name: "指定なし",
      value: "DiceBot"
    });
    setTimeout(
      function() {
        DiceBotLoader["collectDiceBots"]().forEach(
          function(diceBot) {
            // window.console.qLog(`"${diceBot.gameType()}" : "${diceBot.gameName()}"`)
            this.diceBotSystems.push({
              name: diceBot["gameName"](),
              value: diceBot.gameType()
            });
          }.bind(this)
        );
      }.bind(this),
      0
    );
  },
  watch: {
    roomName() {
      this.existCheckMessage = "";
    }
  },
  methods: {
    ...mapActions([
      "windowClose",
      "createPeer",
      "setProperty",
      "checkRoomName",
      "emptyMember"
    ]),
    open() {
      this.roomName = "";
      this.password = "";
      this.playerName = "";
      this.playerType = "PL";
      this.existCheckMessage = "";
      this.playerPassword = "";
      this.currentSystem = "DiceBot";
    },
    commit() {
      const errorMsg = [];
      if (this.roomName === "") {
        errorMsg.push("・部屋名は必須項目です。");
      }
      if (this.playerName === "") {
        errorMsg.push("・あなたの名前は必須項目です。");
      }
      if (errorMsg.length > 0) {
        alert(`${errorMsg.join("\n")}\n入力をお願いします。`);
        return;
      }
      this.setProperty({
        property: "public.room.system",
        value: this.currentSystem
      });
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
      this.emptyMember();
      this.createPeer({
        roomId: this.roomName
      });
      this.windowClose("private.display.createRoomWindow");
    },
    cancel() {
      this.windowClose("private.display.createRoomWindow");
    },
    checkRoomExist() {
      if (this.roomName === "") {
        this.existCheckMessage = "部屋名を入力してください。";
        return;
      }
      this.existCheckMessage = "存在確認中です...";
      const _ = this;
      this.checkRoomName({
        roomName: this.roomName,
        roomFindFunc: message => (_.existCheckMessage = message),
        roomNonFindFunc: () =>
          (_.existCheckMessage = "この部屋は存在しません。")
      });
    }
  }
};
</script>
-->

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
