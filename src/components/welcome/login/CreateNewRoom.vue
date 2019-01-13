<template>
  <fieldset class="root">
    <legend>部屋名を指定して入室する／新しい部屋をつくる</legend>

    <div class="description" v-if="!paramRoomName">すでに部屋が作られているかどうかをチェックします。</div>
    <div class="existMsg" v-if="!!paramRoomName">チェック完了：部屋名「{{paramRoomName}}」{{isRoomExist ? "に入室可能です" :
      "はまだ作られていません"}}
    </div>

    <label class="roomName">部屋名：<input type="text" v-model="roomName" placeholder="必須項目" @keypress.enter="commitRoomName"/>
      <button @click="commitRoomName" type="button">チェック</button>
    </label>

    <!----------------------
     ! 部屋ができるのを待つ
     !--------------------->
    <SubBlockTitle @open="openWaitRoom" text="部屋ができるのを待つ" v-if="!isRoomExist"/>
    <div class="indentDescription description" v-if="paramRoomName && !isRoomExist">部屋が作られたら自動で入室します。それまでは仮部屋での待機となります。</div>
    <div class="subBlock waitRoom" v-if="isViewWait && !isRoomExist">
      <label class="roomPassword">入室パスワード：<input type="password" v-model="roomPassword"/></label>
      <fieldset class="playerInfo">
        <legend>あなたの情報</legend>
        <div>
          <label>プレイヤー名：<input placeholder="必須項目" type="text" v-model="playerName"/></label>
        </div>
        <label class="playerPassword">パスワード：<input type="password" v-model="playerPassword"/></label>
        <div class="description">部屋内でのプレイヤー管理に使用します。パスワード忘れに注意！</div>
      </fieldset>
      <button @click="doWaitRoom" type="button"><i class="icon-home3"></i> 仮入室</button>
    </div>

    <!----------------------
     ! この部屋に入る
     !--------------------->
    <SubBlockTitle @open="openNewRoom" text="この部屋に入る" v-if="isRoomExist"/>
    <div class="subBlock joinRoom isShow" v-if="isRoomExist">
      <label class="roomPassword">入室パスワード：<input type="password" v-model="roomPassword" @keypress.enter="roomProcess(false)"/></label>
      <!--
      <fieldset class="playerInfo">
        <legend>あなたの情報</legend>
        <div>
          <label>権限：<PlayerTypeSelect v-model="playerType"/><input placeholder="ユーザ名を入力（必須項目）" type="text" v-model="playerName"/></label>
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
    <SubBlockTitle @open="openNewRoom" text="新しい部屋をつくる"/>
    <div class="indentDescription description" v-if="paramRoomName && !isRoomExist">「{{paramRoomName}}」は作成可能です。</div>
    <div class="indentDescription description" v-if="paramRoomName && isRoomExist">「{{paramRoomName}}」はすでに作成済みです。<br>同じ名前の部屋はひとつのサーバでひとつしか作成できません。<br>部屋名を変更して、もう一度チェックしてください。
    </div>
    <div class="subBlock newRoom" v-if="isViewNewRoom && !isRoomExist">
      <label class="roomPassword">入室パスワード：<input type="password" v-model="roomPassword"/></label>
      <label class="roomSystem">システム：
        <DiceBotSelect :outputFlg="true" v-model="currentSystem"/>
      </label>
      <fieldset class="playerInfo">
        <legend>あなたの情報</legend>
        <div>
          <label><PlayerTypeSelect v-model="playerType"/><input placeholder="プレイヤー名を入力（必須項目）" type="text" v-model="playerName"/></label>
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
import { Action, Getter } from "vuex-class";
import SubBlockTitle from "./SubBlockTitle.vue";

import { Component, Vue } from "vue-property-decorator";
import DiceBotSelect from "@/components/parts/DiceBotSelect.vue";
import PlayerTypeSelect from "@/components/parts/PlayerTypeSelect.vue";
import { qLog } from "@/components/common/Utility";

@Component<CreateNewRoom>({
  name: "createNewRoom",
  components: {
    SubBlockTitle,
    DiceBotSelect,
    PlayerTypeSelect
  }
})
export default class CreateNewRoom extends Vue {
  @Action("setProperty") setProperty: any;
  @Action("checkRoomName") checkRoomName: any;
  @Action("emptyMember") emptyMember: any;
  @Action("joinPlayer") joinPlayer: any;
  @Action("windowClose") windowClose: any;
  @Action("windowOpen") windowOpen: any;
  @Action("loading") loading: any;
  @Action("simpleJoinRoom") simpleJoinRoom: any;
  @Action("addPlayer") addPlayer: any;
  @Action("sendRoomData") sendRoomData: any;
  @Action("addChatLog") addChatLog: any;
  @Action("doNewRoom") doNewRoom: any;
  @Action("doJoinRoom") doJoinRoom: any;
  @Getter("paramRoomName") paramRoomName: any;
  @Getter("paramRoomPassword") paramRoomPassword: any;
  @Getter("paramPlayerName") paramPlayerName: any;
  @Getter("paramPlayerPassword") paramPlayerPassword: any;
  @Getter("paramPlayerType") paramPlayerType: any;
  @Getter("isRoomExist") isRoomExist: any;
  @Getter("peerId") peerId: any;
  @Getter("roles") roles: any;
  @Getter("systemLog") systemLog: any;

  /*
   * data
   */
  static ENTRANCE_ROOM_NAME = "待機部屋";
  private roomName: string = "";
  private roomPassword: string = null;
  private playerName: string = null;
  private playerPassword: string = null;
  private playerType: string = null;
  private currentSystem: string = "DiceBot";
  private isViewWait: boolean = false;
  private isViewNewRoom: boolean = false;

  /*
   * ====================================================================================================
   * ライフサイクルメソッド
   */
  created() {
    this.roomName = this.paramRoomName;
    this.roomPassword = this.paramRoomPassword;
    this.playerName = this.paramPlayerName;
    this.playerPassword = this.paramPlayerPassword;
    this.playerType = this.paramPlayerType;
  }

  openWaitRoom() {
    this.isViewWait = !this.isViewWait;
  }

  openNewRoom() {
    this.isViewNewRoom = !this.isViewNewRoom;
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
    if (this.paramRoomPassword !== null)
      paramList.push(`roomPassword=${this.paramRoomPassword}`);
    if (this.paramPlayerName !== null)
      paramList.push(`playerName=${this.paramPlayerName}`);
    if (this.paramPlayerPassword !== null)
      paramList.push(`playerPassword=${this.paramPlayerPassword}`);
    if (this.paramPlayerType !== null)
      paramList.push(`playerType=${this.paramPlayerType}`);
    const newUrl = `?${paramList.join("&")}`;
    window.history.replaceState("", "", newUrl);

    // パラメータ更新
    this.setProperty({
      property: `param.roomName`,
      value: this.roomName,
      logOff: false
    });

    /* ------------------------------
     * 部屋存在チェック
     */
    this.loading(true);
    Promise.resolve()
      .then(() => this.simpleJoinRoom({ roomName: this.roomName }))
      .then(() => this.checkRoomName({ roomName: this.roomName }))
      .then(isExist => {
        if (!this.playerName) return null;
        const baseArg: any = {
          roomName: this.roomName,
          roomPassword: this.roomPassword,
          playerName: this.playerName,
          playerPassword: this.playerPassword,
          playerType: this.playerType,
          fontColor: "#000000"
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

    // 利用者情報の設定
    // this.setProperty({
    //   property: "private.self",
    //   value: {
    //     password: this.roomPassword,
    //     playerPassword: this.playerPassword,
    //     playerName: this.playerName,
    //     playerType: this.playerType,
    //     currentChatKey: `player-${this.playerName}`
    //   },
    //   logOff: true
    // });

    // 存在チェックしてから決める
    this.loading(true);
    this.checkRoomName({ roomName: this.roomName })
      .then((isExist: boolean) => {
        const baseArg: any = {
          roomName: this.roomName,
          roomPassword: this.roomPassword || "",
          playerName: this.playerName,
          playerPassword: this.playerPassword,
          playerType: this.playerType,
          fontColor: "#000000"
        };
        const loadingEnd = this.loading.bind(this, false);
        if (!isExist && isNewRoom) {
          baseArg.system = this.currentSystem;
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

    // 再帰呼び出しでチェックし続け、部屋ができたら入室する
    // const checkFunc = () => {
    //   this.checkRoomName({
    //     roomName: this.roomName,
    //     roomFindFunc: this.doJoinRoom,
    //     roomNonFindFunc: checkFunc,
    //     loadingFlg: false
    //   });
    // };
    // checkFunc.call(this);

    // モーダル状態の解除
    this.setProperty({
      property: "isModal",
      value: false,
      logOff: true
    });

    // エントランス部屋に接続する
    this.joinPlayer({
      roomName: CreateNewRoom.ENTRANCE_ROOM_NAME,
      roomPassword: "",
      playerName: this.playerName,
      playerPassword: this.playerPassword,
      playerType: this.playerType,
      fontColor: "#000000",
      resolved: () => {},
      rejected: () => {}
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
  background-color: #cec;
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
