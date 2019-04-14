<template>
  <fieldset class="root">
    <legend>部屋名を指定して入室する／新しい部屋をつくる</legend>

    <div class="description" v-if="!paramRoomName">すでに部屋が作られているかどうかをチェックします。</div>
    <div class="existMsg" v-if="!!paramRoomName">チェック完了：部屋名「{{paramRoomName}}」{{isRoomExist ? "に入室可能です" :
      "はまだ作られていません"}}
    </div>

    <label class="roomName">部屋名：<input ref="roomNameInput" type="text" v-model="roomName" placeholder="必須項目" @keypress.enter="commitRoomName"/>
      <button @click="commitRoomName" type="button">チェック</button>
    </label>

    <!----------------------
     ! 部屋ができるのを待つ
     !--------------------->
    <sub-block-title @open="openWaitRoom" text="部屋ができるのを待つ" v-if="!isRoomExist"/>
    <div class="indentDescription description" v-if="paramRoomName && !isRoomExist">部屋が作られたら自動で入室します。それまでは仮部屋での待機となります。</div>
    <div class="subBlock waitRoom" v-if="isViewWait && !isRoomExist">
      <label class="roomPassword">入室パスワード：<input type="password" v-model="roomPassword"/></label>
      <fieldset class="playerInfo">
        <legend>あなたの情報</legend>
        <div>
          <label>
            <player-type-select v-model="inputPlayerType"/>
            <input placeholder="プレイヤー名を入力（必須項目）" type="text" v-model="playerName"/>
          </label>
        </div>
        <label class="playerPassword">パスワード：<input type="password" v-model="playerPassword"/></label>
        <div class="description">部屋内でのプレイヤー管理に使用します。パスワード忘れに注意！</div>
      </fieldset>
      <button @click="doWaitRoom" type="button"><i class="icon-home3"></i> 仮入室</button>
    </div>

    <!----------------------
     ! この部屋に入る
     !--------------------->
    <sub-block-title @open="openNewRoom" text="この部屋に入る" v-if="isRoomExist"/>
    <div class="subBlock joinRoom isShow" v-if="isRoomExist">
      <label class="roomPassword">入室パスワード：<input type="password" v-model="roomPassword" @keypress.enter="roomProcess(false)"/></label>
      <!--
      <fieldset class="playerInfo">
        <legend>あなたの情報</legend>
        <div>
          <label>権限：<player-type-select v-model="inputPlayerType"/><input placeholder="ユーザ名を入力（必須項目）" type="text" v-model="playerName"/></label>
        </div>
        <label class="playerPassword">パスワード：<input type="password" v-model="playerPassword"/></label>
        <div class="description">部屋内でのユーザ管理に使用します。パスワード忘れに注意！</div>
        <div class="description">権限の詳細は<a @click="onClickDescription" href="javascript:void(0);">こちら</a></div>
      </fieldset>
      -->
      <button @click="roomProcess(false)" type="button"><i class="icon-home3"></i> 入室</button>
    </div>

    <!----------------------
     ! 新しい部屋をつくる
     !--------------------->
    <sub-block-title @open="openNewRoom" text="新しい部屋をつくる"/>
    <div class="indentDescription description" v-if="paramRoomName && !isRoomExist">「{{paramRoomName}}」は作成可能です。</div>
    <div class="indentDescription description" v-if="paramRoomName && isRoomExist">「{{paramRoomName}}」はすでに作成済みです。<br>同じ名前の部屋はひとつのサーバでひとつしか作成できません。<br>部屋名を変更して、もう一度チェックしてください。
    </div>
    <div class="subBlock newRoom" v-if="isViewNewRoom && !isRoomExist">
      <label class="roomPassword">入室パスワード：<input type="password" v-model="roomPassword"/></label>
      <label class="roomSystem">システム：
        <dice-bot-select :outputFlg="true" v-model="currentSystem"/>
      </label>
      <fieldset class="playerInfo">
        <legend>あなたの情報</legend>
        <div>
          <label><player-type-select v-model="inputPlayerType"/><input placeholder="プレイヤー名を入力（必須項目）" type="text" v-model="playerName"/></label>
        </div>
        <label class="playerPassword">パスワード：<input type="password" v-model="playerPassword"/></label>
        <div class="description">部屋内でのプレイヤー管理に使用します。パスワード忘れに注意！</div>
        <div class="description">権限の詳細は<a @click="onClickDescription" href="javascript:void(0);">こちら</a></div>
      </fieldset>
      <button @click="roomProcess(true)" type="button"><i class="icon-home3"></i> 作成</button>
    </div>
  </fieldset>
</template>

<script lang="ts">
import SubBlockTitle from "./SubBlockTitle.vue";
import { Component, Vue, Watch } from "vue-property-decorator";

import DiceBotSelect from "@/components/parts/select/DiceBotSelect.vue";
import PlayerTypeSelect from "@/components/parts/select/PlayerTypeSelect.vue";

import { Action, Getter, Mutation } from "vuex-class";

@Component({
  components: {
    SubBlockTitle,
    DiceBotSelect,
    PlayerTypeSelect
  }
})
export default class CreateNewRoom extends Vue {
  @Action("setProperty") private setProperty: any;
  @Action("checkRoomName") private checkRoomName: any;
  @Action("emptyMember") private emptyMember: any;
  @Action("windowClose") private windowClose: any;
  @Action("windowOpen") private windowOpen: any;
  @Action("loading") private loading: any;
  @Action("simpleJoinRoom") private simpleJoinRoom: any;
  @Action("addChatLog") private addChatLog: any;
  @Action("doNewRoom") private doNewRoom: any;
  @Action("doJoinRoom") private doJoinRoom: any;
  @Mutation("updateIsWait") private updateIsWait: any;
  @Mutation("updateIsModal") private updateIsModal: any;
  @Mutation("updateIsJoined") private updateIsJoined: any;
  @Getter("paramRoomName") private paramRoomName: any;
  @Getter("paramRoomPassword") private paramRoomPassword: any;
  @Getter("paramPlayerName") private paramPlayerName: any;
  @Getter("paramPlayerPassword") private paramPlayerPassword: any;
  @Getter("paramPlayerType") private paramPlayerType: any;
  @Getter("isRoomExist") private isRoomExist: any;
  @Getter("peerId") private peerId: any;
  @Getter("roles") private roles: any;
  @Getter("systemLog") private systemLog: any;

  /*
   * data
   */
  static ENTRANCE_ROOM_NAME = "の待機部屋";
  private roomName: string = "";
  private roomPassword: string = "";
  private playerName: string = "";
  private playerPassword: string = "";
  private playerType: string = "";
  private inputPlayerType: string = "";
  private currentSystem: string = "DiceBot";
  private isViewWait: boolean = false;
  private isViewNewRoom: boolean = false;

  /** ====================================================================================================
   * ライフサイクルメソッド
   */
  created() {
    this.roomName = this.paramRoomName;
    this.roomPassword = this.paramRoomPassword;
    this.playerName = this.paramPlayerName;
    this.playerPassword = this.paramPlayerPassword;
    this.inputPlayerType = this.paramPlayerType || "PL";
    setTimeout(() => {
      this.playerType = this.paramPlayerType;
    });
  }

  /** ====================================================================================================
   * ライフサイクルメソッド
   */
  mounted(this: any) {
    // TODO 本質的にはここじゃダメ
    this.$refs.roomNameInput["focus"]();
  }

  @Watch("inputPlayerType")
  onChangeInputPlayerType(inputPlayerType: string) {
    this.playerType = inputPlayerType;
  }

  openWaitRoom() {
    this.isViewWait = !this.isViewWait;
    this.isViewNewRoom = false;
  }

  openNewRoom() {
    this.isViewNewRoom = !this.isViewNewRoom;
    this.isViewWait = false;
  }

  /**
   * ====================================================================================================
   * 部屋名を入力してチェックボタンを押下した際の処理
   */
  commitRoomName() {
    /* ------------------------------
     * 入力チェック
     */
    const errorMsg = [];
    if (!this.roomName) errorMsg.push("・部屋名");
    if (errorMsg.length > 0) {
      alert(
        `必須項目未入力エラー\n${errorMsg.join("\n")}\n入力をお願いします。`
      );
      return;
    }

    /* ------------------------------
     * URLを書き換える（リロードなし）
     */
    const paramList: string[] = [];
    paramList.push(`roomName=${this.roomName}`);
    if (this.roomPassword !== null)
      paramList.push(`roomPassword=${this.roomPassword}`);
    if (this.currentSystem !== null)
      paramList.push(`system=${this.currentSystem}`);
    if (this.playerName !== null)
      paramList.push(`playerName=${this.playerName}`);
    if (this.playerPassword !== null)
      paramList.push(`playerPassword=${this.playerPassword}`);
    if (this.playerType !== null)
      paramList.push(`playerType=${this.playerType}`);
    const newUrl = `?${paramList.join("&")}`;
    window.history.replaceState("", "", newUrl);

    // パラメータ更新
    this.setProperty({
      property: `param.roomName`,
      value: this.roomName,
      logOff: true
    });

    /* ------------------------------
     * 部屋存在チェック
     */
    this.loading(true);
    Promise.resolve()
      .then(() => this.simpleJoinRoom({ roomName: this.roomName }))
      .then((peerId: string) => {
        // const logTexts = [];
        // logTexts.push(`create room by peer:"${peerId}"`);
        // logTexts.push(`本番: ${this.peerId(false)}`);
        // logTexts.push(`待ち: ${this.peerId(true)}`);
        // window.console.log(logTexts.join(", "));
        return this.checkRoomName({ roomName: this.roomName });
      })
      .then(isExist => {
        if (!this.playerName) return null;
        const baseArg: any = {
          roomName: this.roomName,
          roomPassword: this.roomPassword,
          playerName: this.playerName,
          playerPassword: this.playerPassword,
          playerType: this.playerType,
          fontColor: "#000000",
          system: this.currentSystem
        };
        if (!isExist && this.roomPassword !== null) {
          baseArg.system = undefined;
          return this.doNewRoom(baseArg);
        }
        if (isExist) {
          baseArg.useWindow = true;
          baseArg.useAlert = true;
          return this.doJoinRoom(baseArg);
        }
        return null;
      })
      .then(() => this.loading(false))
      .catch(() => this.loading(false));
    // end of 部屋存在チェック
  }

  /**
   * ====================================================================================================
   * 部屋建て・入室振り分け
   */
  roomProcess(isNewRoom: boolean) {
    // 入力チェック
    const errorMsg = [];
    if (!this.roomName) errorMsg.push("・部屋名");
    if (isNewRoom && !this.playerName) errorMsg.push("・ユーザ名");
    if (errorMsg.length > 0) {
      alert(
        `必須項目未入力エラー\n${errorMsg.join("\n")}\n入力をお願いします。`
      );
      return;
    }

    // 存在チェックしてから決める
    this.loading(true);
    Promise.resolve()
      .then(() => this.checkRoomName({ roomName: this.roomName }))
      .then((isExist: boolean) => {
        const baseArg: any = {
          roomName: this.roomName,
          roomPassword: this.roomPassword || "",
          playerName: this.playerName,
          playerPassword: this.playerPassword,
          playerType: this.playerType,
          fontColor: "#000000",
          system: this.currentSystem
        };
        if (!isExist && isNewRoom) {
          baseArg.system = this.currentSystem;
          baseArg.playerPassword = baseArg.playerPassword || "";
          baseArg.playerType = baseArg.playerType || "PL";
          return this.doNewRoom(baseArg);
        }
        if (isExist && !isNewRoom) {
          baseArg.useWindow = true;
          baseArg.useAlert = true;
          return this.doJoinRoom(baseArg);
        }
        return null;
      })
      .then(() => this.loading(false))
      .catch(() => this.loading(false));
  }

  /**
   * ====================================================================================================
   * 部屋ができるのを待つ
   */
  doWaitRoom() {
    // 入力チェック
    const errorMsg = [];
    if (!this.roomName) errorMsg.push("・部屋名");
    if (errorMsg.length > 0) {
      alert(
        `必須項目未入力エラー\n${errorMsg.join("\n")}\n入力をお願いします。`
      );
      return;
    }

    // まず目的の部屋の存在チェックする
    Promise.resolve()
      .then(() => this.checkRoomName({ roomName: this.roomName }))
      .then((isExist: boolean) => {
        window.console.log(`部屋${this.roomName}の存在チェック完了。`);
        const joinArg = {
          roomName: this.roomName,
          roomPassword: this.roomPassword,
          playerName: this.playerName,
          playerPassword: this.playerPassword || "",
          playerType: this.playerType,
          fontColor: "#000000",
          useWindow: true,
          useAlert: true
        };
        if (isExist) {
          // 存在したら普通に入室する
          alert(
            `部屋${
              this.roomName
            }は今しがた作成されたところです。\nご入室ください。`
          );
          this.loading(true);
          return this.doJoinRoom(joinArg);
        } else {
          // 存在しなかったら待合室に入りつつ、目的の部屋ができるのをチェックしながら待つ

          // 再帰呼び出しでチェックし続け、部屋ができたら入室する
          const checkFunc = () => {
            Promise.resolve()
              .then(() => this.checkRoomName({ roomName: this.roomName }))
              .then((isExist: boolean) => {
                if (isExist) {
                  alert(
                    `部屋${this.roomName}が作成されました。\nご入室ください。`
                  );

                  const endFunc = () => {
                    this.loading(false);
                    this.updateIsWait(false);
                  };

                  this.loading(true);
                  this.updateIsJoined(false);
                  this.doJoinRoom(joinArg)
                    .then(endFunc)
                    .catch(endFunc);
                  return;
                }
                setTimeout(() => {
                  checkFunc();
                }, 5000);
              });
          };
          checkFunc();

          // モーダル状態の解除
          this.updateIsModal(false);

          // エントランス部屋に接続する
          this.loading(true);
          const entranceRoomName =
            this.roomName + CreateNewRoom.ENTRANCE_ROOM_NAME;
          Promise.resolve()
            .then(() =>
              this.simpleJoinRoom({ roomName: entranceRoomName, isWait: true })
            )
            .then((peerId: string) => {
              // const logTexts = [];
              // logTexts.push(`create room by peer:"${peerId}"`);
              // logTexts.push(`本番: ${this.peerId(false)}`);
              // logTexts.push(`待ち: ${this.peerId(true)}`);
              // window.console.log(logTexts.join(", "));
              return this.checkRoomName({
                roomName: entranceRoomName,
                isWait: true
              });
            })
            .then((isExist: boolean) => {
              const baseArg: any = {
                roomName: entranceRoomName,
                roomPassword: "",
                playerName: this.playerName,
                playerPassword: this.playerPassword,
                playerType: this.playerType,
                fontColor: "#000000",
                isWait: true,
                system: this.currentSystem
              };
              const loadingEnd = this.loading.bind(this, false);
              this.updateIsWait(true);
              if (!isExist) {
                baseArg.system = this.currentSystem;
                return this.doNewRoom(baseArg);
              } else {
                baseArg.useWindow = true;
                baseArg.useAlert = true;
                return this.doJoinRoom(baseArg);
              }
            })
            .then(() => this.loading(false))
            .catch(() => this.loading(false));
        }
      });
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

<style scoped src="./login.css">
</style>

<style scoped lang="scss">
fieldset.root,
fieldset.root > legend {
  background-color: #cceecc;
}

.roomName {
  margin: 0.5rem 0;
}

.subBlock {
  overflow: hidden;
  transition-timing-function: linear;
  transition-delay: 0s;
  text-align: center !important;
  margin-bottom: 0.5em;

  > button {
    margin-top: 0.5rem;
  }

  > *:not(button) {
    text-align: left;
    margin-left: 4rem;
  }
}

.indentDescription {
  margin-left: 4rem;
}

.roomPassword input {
  width: 15em;
}

.existMsg {
  word-wrap: break-word;
  white-space: normal;
  padding: 0 1em;
  color: #e1312c;
}

label {
  &.roomPassword {
    display: block;
  }

  &:not(.roomPassword) {
    display: flex;

    > input {
      flex: 1;
    }
  }

  button {
    padding: 0 5px;
    font-size: 11px;
  }

  select {
    padding: 1px 2px;
    font-size: 13px;
  }
}
</style>
