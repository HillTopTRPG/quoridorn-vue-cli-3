<template>
  <fieldset class="root">
    <legend>部屋名を指定して入室する／新しい部屋をつくる</legend>

    <div class="description" v-if="!paramRoomName">すでに部屋が作られているかどうかをチェックします。</div>
    <div class="existMsg" v-if="!!paramRoomName">チェック完了：部屋名「{{paramRoomName}}」{{isRoomExist ? "に入室可能です" :
      "はまだ作られていません"}}
    </div>

    <label class="roomName">部屋名：<input type="text" v-model="roomName"/>
      <button @click="commitRoomName" type="button">チェック</button>
    </label>

    <SubBlockTitle @open="openWaitRoom" text="部屋ができるのを待つ" v-if="!isRoomExist"/>
    <div class="indentDescription description" v-if="paramRoomName && !isRoomExist">部屋が作られたら自動で入室します。それまでは仮部屋での待機となります。</div>
    <div :class="{isShow: isViewWait && !isRoomExist}" class="subBlock waitRoom">
      <label class="roomPassword">入室パスワード：<input type="password" v-model="roomPassword"/></label>
      <fieldset class="playerInfo">
        <legend>あなたの情報</legend>
        <div>
          <label>権限：<select v-model="playerType">
            <option :key="role.value" :value="role.value" v-for="role in roles">{{role.label}}</option>
          </select><input placeholder="ユーザ名を入力（必須項目）" type="text" v-model="playerName"/>
          </label>
        </div>
        <label class="playerPassword">パスワード：<input type="password" v-model="playerPassword"/></label>
        <div class="description">部屋内でのユーザ管理に使用します。パスワード忘れに注意！</div>
        <div>権限の詳細は<a @click="onClickDescription" href="javascript:void(0);">こちら</a></div>
      </fieldset>
      <button @click="doWaitRoom" type="button"><i class="icon-home3"></i> 仮入室</button>
    </div>

    <SubBlockTitle @open="openNewRoom" text="この部屋に入る" v-if="isRoomExist"/>
    <div class="subBlock joinRoom isShow" v-if="isRoomExist">
      <label class="roomPassword">入室パスワード：<input type="password" v-model="roomPassword"/></label>
      <fieldset class="playerInfo">
        <legend>あなたの情報</legend>
        <div>
          <label>権限：<select v-model="playerType">
            <option :key="role.value" :value="role.value" v-for="role in roles">{{role.label}}</option>
          </select><input placeholder="ユーザ名を入力（必須項目）" type="text" v-model="playerName"/>
          </label>
        </div>
        <label class="playerPassword">パスワード：<input type="password" v-model="playerPassword"/></label>
        <div class="description">部屋内でのユーザ管理に使用します。パスワード忘れに注意！</div>
        <div>権限の詳細は<a @click="onClickDescription" href="javascript:void(0);">こちら</a></div>
      </fieldset>
      <button @click="roomProcess" type="button"><i class="icon-home3"></i> 入室</button>
    </div>

    <SubBlockTitle @open="openNewRoom" text="新しい部屋をつくる"/>
    <div class="indentDescription description" v-if="paramRoomName && !isRoomExist">「{{paramRoomName}}」は作成可能です。</div>
    <div class="indentDescription description" v-if="paramRoomName && isRoomExist">「{{paramRoomName}}」はすでに作成済みです。<br>同じ名前の部屋はひとつのサーバでひとつしか作成できません。<br>部屋名を変更して、もう一度チェックしてください。
    </div>
    <div :class="{isShow: isViewNewRoom && !isRoomExist}" class="subBlock newRoom">
      <label class="roomPassword">入室パスワード：<input type="password" v-model="roomPassword"/></label>
      <label class="roomSystem">システム：
        <DiceBotSelect :outputFlg="true" v-model="currentSystem"/>
      </label>
      <fieldset class="playerInfo">
        <legend>あなたの情報</legend>
        <div>
          <label>権限：<select v-model="playerType">
            <option :key="role.value" :value="role.value" v-for="role in roles">{{role.label}}</option>
          </select><input placeholder="ユーザ名を入力（必須項目）" type="text" v-model="playerName"/>
          </label>
        </div>
        <label class="playerPassword">パスワード：<input type="password" v-model="playerPassword"/></label>
        <div class="description">部屋内でのユーザ管理に使用します。パスワード忘れに注意！</div>
        <div>権限の詳細は<a @click="onClickDescription" href="javascript:void(0);">こちら</a></div>
      </fieldset>
      <button @click="roomProcess" type="button"><i class="icon-home3"></i> 作成</button>
    </div>
  </fieldset>
</template>

<script lang="ts">
import { Action, Getter } from "vuex-class";
import SubBlockTitle from "./SubBlockTitle.vue";

import { Component, Vue } from "vue-property-decorator";
import DiceBotSelect from "@/components/dice/DiceBotSelect.vue";

@Component<CreateNewRoom>({
  name: "createNewRoom",
  components: {
    SubBlockTitle,
    DiceBotSelect
  }
})
export default class CreateNewRoom extends Vue {
  @Action("setProperty") setProperty: any;
  @Action("checkRoomName") checkRoomName: any;
  @Action("emptyMember") emptyMember: any;
  @Action("createPeer") createPeer: any;
  @Action("windowClose") windowClose: any;
  @Action("loading") loading: any;
  @Getter("paramRoomName") paramRoomName: any;
  @Getter("paramRoomPassword") paramRoomPassword: any;
  @Getter("paramPlayerName") paramPlayerName: any;
  @Getter("paramPlayerPassword") paramPlayerPassword: any;
  @Getter("paramPlayerType") paramPlayerType: any;
  @Getter("isRoomExist") isRoomExist: any;
  @Getter("roles") roles: any;

  /*
   * data
   */
  static ENTRANCE_ROOM_NAME = "待機部屋";
  private roomName: string = "";
  private roomPassword: string = "";
  private playerName: string = "";
  private playerPassword: string = "";
  private currentSystem: string = "DiceBot";
  private playerType: string = "PL";
  private isViewWait: boolean = false;
  private isViewNewRoom: boolean = false;

  /*
   * ====================================================================================================
   * lifecycle hook
   */
  created(): void {
    this.roomName = this.paramRoomName || "";
    this.roomPassword = this.paramRoomPassword || "";
    this.playerName = this.paramPlayerName || "";
    this.playerPassword = this.paramPlayerPassword || "";

    // 選択肢と一致していれば、権限をセットする
    if (
      this.roles.findIndex(
        (role: any) => role.value === this.paramPlayerType
      ) >= 0
    ) {
      this.playerType = this.paramPlayerType;
    }

    // if (this.paramRoomPassword !== null || this.playerName) {
    //   this.isViewWait = true;
    // }
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
    if (!this.roomName) errorMsg.push("・部屋名は必須項目です。");
    if (errorMsg.length > 0) {
      alert(`${errorMsg.join("\n")}\n入力をお願いします。`);
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
    const func = (isExist: boolean) => {
      window.console.log(
        `roomName: ${this.roomName} is ${isExist ? "" : "not "}exist.`
      );

      // 部屋存在チェックの結果を画面に反映
      this.setProperty({
        property: `room.isExist`,
        value: isExist,
        logOff: false
      });
    };
    this.checkRoomName({
      roomName: this.roomName,
      roomFindFunc: () => func(true),
      roomNonFindFunc: () => func(false)
    });
    // end of 部屋存在チェック
  }

  /**
   * ====================================================================================================
   * 部屋建て・入室振り分け
   */
  roomProcess() {
    // 入力チェック
    const errorMsg = [];
    if (!this.roomName) errorMsg.push("・部屋名は必須項目です。");
    if (!this.playerName) errorMsg.push("・プレイヤー名は必須項目です。");
    if (errorMsg.length > 0) {
      alert(`${errorMsg.join("\n")}\n入力をお願いします。`);
      return;
    }

    // URLを書き換える（リロードなし）
    const paramList: string[] = [];
    paramList.push(`roomName=${this.roomName}`);
    paramList.push(`roomPassword=${this.roomPassword}`);
    paramList.push(`playerName=${this.playerName}`);
    paramList.push(`playerPassword=${this.playerPassword}`);
    paramList.push(`playerType=${this.playerType}`);
    const newUrl = `?${paramList.join("&")}`;
    window.history.replaceState("", "", newUrl);

    // 格納しているパラメータ値を更新
    this.setProperty({
      property: "param",
      value: {
        roomName: this.roomName,
        roomPassword: this.roomPassword,
        playerPassword: this.playerPassword,
        playerName: this.playerName,
        playerType: this.playerType
      },
      logOff: true
    });

    // 利用者情報の設定
    this.setProperty({
      property: "private.self",
      value: {
        password: this.roomPassword,
        playerPassword: this.playerPassword,
        playerName: this.playerName,
        playerType: this.playerType,
        currentChatKey: `player-${this.playerName}`
      },
      logOff: true
    });

    // メンバーのリセット
    this.emptyMember();

    // 存在チェックしてから決める
    this.checkRoomName({
      roomName: this.roomName,
      roomFindFunc: this.doJoinRoom,
      roomNonFindFunc: this.doNewRoom
    });
  }

  /**
   * ====================================================================================================
   * 部屋ができるのを待つ
   */
  doWaitRoom() {
    // 入力チェック
    const errorMsg = [];
    if (!this.roomName) errorMsg.push("・部屋名は必須項目です。");
    if (errorMsg.length > 0) {
      alert(`${errorMsg.join("\n")}\n入力をお願いします。`);
      return;
    }

    // 再帰呼び出しでチェックし続け、部屋ができたら入室する
    const checkFunc = () => {
      this.checkRoomName({
        roomName: this.roomName,
        roomFindFunc: this.doJoinRoom,
        roomNonFindFunc: checkFunc,
        loadingFlg: false
      });
    };
    checkFunc.call(this);

    // モーダル状態の解除
    this.setProperty({
      property: "isMordal",
      value: false,
      logOff: true
    });

    // エントランス部屋に接続する
    this.createPeer({
      roomName: "エントランス",
      roomPassword: "",
      playerName: this.playerName,
      playerPassword: this.playerPassword,
      playerType: this.playerType,
      resolved: () => {},
      rejected: () => {}
    });
  }

  /**
   * ====================================================================================================
   * 新しい部屋をつくる
   */
  doNewRoom() {
    // 利用システムの設定
    this.setProperty({
      property: "public.room.system",
      value: this.currentSystem
    });

    // モーダル状態の解除
    this.setProperty({
      property: "isMordal",
      value: false,
      logOff: true
    });

    // 部屋に接続する
    this.createPeer({
      roomName: this.roomName,
      roomPassword: this.roomPassword,
      playerName: this.playerName,
      playerPassword: this.playerPassword,
      playerType: this.playerType,
      resolved: () => {},
      rejected: () => {}
    });
  }

  /**
   * ====================================================================================================
   * 入室処理
   */
  doJoinRoom() {
    // 部屋に接続する
    this.createPeer({
      roomName: this.roomName,
      roomPassword: this.roomPassword,
      playerName: this.playerName,
      playerPassword: this.playerPassword,
      playerType: this.playerType,
      resolved: () => {
        // モーダル状態の解除
        this.setProperty({
          property: "isMordal",
          value: false,
          logOff: true
        });
      },
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
  height: 0;
  text-align: center !important;
  margin-bottom: 0.5em;

  > button {
    margin-top: 0.5rem;
  }

  > *:not(button) {
    text-align: left;
    margin-left: 4rem;
  }

  &.waitRoom {
    transition-duration: 0.2s;

    &.isShow {
      height: 12.6em;
    }
  }

  &.joinRoom {
    &.isShow {
      height: 12.7em;
    }
  }

  &.newRoom {
    transition-duration: 0.2s;

    &.isShow {
      height: 14.3em;
    }
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
}
</style>
