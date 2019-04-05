<template>
  <window-frame
    titleText="ようこそ"
    display-property="private.display.welcomeWindow"
    align="center"
    fixSize="500, 500"
    :fontSizeBar="tabNum !== '1'"
    :is-ban-close="!isRoomJoined"
  >
    <div class="contents" id="welcomeWindowContents">
      <!----------------------------------------------------------------------------------
       ! ロゴ
       !--------------------------------------------------------------------------------->
      <div id="logo-container">
        <div>
          <logo/>
          <div>Ver.{{version}}</div>
        </div>
      </div>

      <!----------------------------------------------------------------------------------
       ! タブ
       !--------------------------------------------------------------------------------->
      <div class="tab_wrap">
        <input id="welcomeWindow-tab1" type="radio" name="tab_btn" value="1" v-model="tabNum">
        <input id="welcomeWindow-tab2" type="radio" name="tab_btn" value="2" v-model="tabNum">
        <input id="welcomeWindow-tab3" type="radio" name="tab_btn" value="3" v-model="tabNum">
        <input id="welcomeWindow-tab4" type="radio" name="tab_btn" value="4" v-model="tabNum">

        <div class="tab_area" @contextmenu.prevent>
          <label class="tab1_label" for="welcomeWindow-tab1">ログイン</label>
          <label class="tab2_label" for="welcomeWindow-tab2">仕様一覧</label>
          <label class="tab3_label" for="welcomeWindow-tab3">出典元情報</label>
          <label class="tab4_label" for="welcomeWindow-tab4">開発支援</label>
        </div>
        <div class="panel_area">
          <!--------------------------------
           ! タブ１ - ログイン
           !------------------------------->
          <div id="panel1" class="tab_panel">
            <login/>
          </div>
          <!--------------------------------
           ! タブ２ - 仕様一覧
           !------------------------------->
          <div id="panel2" class="tab_panel">
            <div class="spec-header">
              <button class="open" @click="specAll(true)">全て開く</button>
              <button class="close" @click="specAll(false)">全て閉じる</button>
            </div>
            <div class="menu">
              <environment/><!-- 動作環境 -->
              <menu-bar/><!-- メインメニュー -->
              <save/><!-- セーブ機能 -->
              <load/><!-- ロード機能 -->
              <chat-window/><!-- チャット画面 -->
              <dice-window/><!-- ダイス画面 -->
              <player-box-window/><!-- プレイヤーボックス画面 -->
              <initiative-window/><!-- イニシアティブ画面 -->
              <counter-remocon-window-spec/><!-- カウンターリモコン画面 -->
              <change-font-size-window/><!-- フォントサイズ調整画面 -->
              <reset-all-window/><!-- ウィンドウ配置初期化機能 -->
              <add-character-window/><!-- キャラクター追加画面 -->
              <add-range-window/><!-- 範囲追加画面 -->
              <add-chit-window/><!-- チット追加画面 -->
              <graveyard-window/><!-- 墓場画面 -->
              <waiting-room-window/><!-- キャラクター待合室画面 -->
              <edit-map-window/><!-- マップ変更画面 -->
              <edit-floor-tile-mode/><!-- フロアタイル変更モード -->
              <add-map-mask-window/><!-- マップマスク追加機能 -->
              <create-easy-map-window/><!-- 簡易マップ作成機能 -->
              <save-map-window/><!-- マップ状態保存画面 -->
              <load-map-window/><!-- マップ切り替え画面 -->
              <file-uploader-window/><!-- ファイルアップローダー画面 -->
              <edit-image-tag-window/><!-- (画像)タグ編集画面 -->
              <delete-image-window/><!-- 画像削除画面 -->
              <welcome-window-spec/><!-- ようこそ画面 -->
              <version-window/><!-- バージョン画面 -->
              <manual-window/><!-- マニュアル画面 -->
              <official-site-link/><!-- オフィシャルサイトへ -->
              <room-info-window/><!-- プレイルーム情報表示画面 -->
              <add-public-memo-window/><!-- 共有メモ追加画面 -->
              <logout/><!-- ログアウト -->
            </div>
            <span class="toTop" @click="scrollTo()"><span class="rotate90">＜</span><span>TOP</span></span>
          </div>
          <!--------------------------------
           ! タブ３ - 出典元情報
           !------------------------------->
          <div id="panel3" class="tab_panel"><Source/></div>
          <!--------------------------------
           ! タブ４ - 開発支援
           !------------------------------->
          <div id="panel4" class="tab_panel"><dev-support/></div>
        </div>
      </div>
      <!-- tab_wrap -->
    </div>
  </window-frame>
</template>

<script lang="ts">
import WindowFrame from "../WindowFrame.vue";
import WindowMixin from "../WindowMixin.vue";

import Login from "./login/Login.vue";
import Environment from "./spec/Environment.vue";
import MenuBar from "./spec/MenuBar.vue";
import Save from "./spec/Save.vue";
import Load from "./spec/Load.vue";
import ChatWindow from "./spec/ChatWindow.vue";
import DiceWindow from "./spec/DiceWindow.vue";
import PlayerBoxWindow from "./spec/PlayerBoxWindow.vue";
import ChangeFontSizeWindow from "./spec/ChangeFontSizeWindow.vue";
import ResetAllWindow from "./spec/ResetAllWindow.vue";
import AddCharacterWindow from "./spec/AddCharacterWindow.vue";
import AddRangeWindow from "./spec/AddRangeWindow.vue";
import AddChitWindow from "./spec/AddChitWindow.vue";
import GraveyardWindow from "./spec/GraveyardWindow.vue";
import WaitingRoomWindow from "./spec/WaitingRoomWindow.vue";
import EditMapWindow from "./spec/EditMapWindow.vue";
import EditFloorTileMode from "./spec/EditFloorTileMode.vue";
import AddMapMaskWindow from "./spec/AddMapMaskWindow.vue";
import CreateEasyMapWindow from "./spec/CreateEasyMapWindow.vue";
import SaveMapWindow from "./spec/SaveMapWindow.vue";
import LoadMapWindow from "./spec/LoadMapWindow.vue";
import FileUploaderWindow from "./spec/FileUploaderWindow.vue";
import EditImageTagWindow from "./spec/EditImageTagWindow.vue";
import DeleteImageWindow from "./spec/DeleteImageWindow.vue";
import WelcomeWindowSpec from "./spec/WelcomeWindowSpec.vue";
import VersionWindow from "./spec/VersionWindow.vue";
import ManualWindow from "./spec/ManualWindow.vue";
import OfficialSiteLink from "./spec/OfficialSiteLink.vue";
import RoomInfoWindow from "./spec/RoomInfoWindow.vue";
import AddPublicMemoWindow from "./spec/AddPublicMemoWindow.vue";
import Logout from "./spec/Logout.vue";
import InitiativeWindow from "./spec/InitiativeWindow.vue";

import Logo from "../simple/Logo.vue";
import Source from "./source/Source.vue";
import DevSupport from "./devSupport/DevSupport.vue";

import { Getter } from "vuex-class";
import { Component, Mixins } from "vue-mixin-decorator";
import CounterRemoconWindowSpec from "@/components/welcome/spec/CounterRemoconWindowSpec.vue";

@Component({
  components: {
    CounterRemoconWindowSpec,
    WindowFrame,
    Logo,
    Login,
    Environment,
    MenuBar,
    Save,
    Load,
    ChatWindow,
    DiceWindow,
    PlayerBoxWindow,
    InitiativeWindow,
    ChangeFontSizeWindow,
    ResetAllWindow,
    AddCharacterWindow,
    AddRangeWindow,
    AddChitWindow,
    GraveyardWindow,
    WaitingRoomWindow,
    EditMapWindow,
    EditFloorTileMode,
    AddMapMaskWindow,
    CreateEasyMapWindow,
    SaveMapWindow,
    LoadMapWindow,
    FileUploaderWindow,
    EditImageTagWindow,
    DeleteImageWindow,
    WelcomeWindowSpec,
    VersionWindow,
    ManualWindow,
    OfficialSiteLink,
    RoomInfoWindow,
    AddPublicMemoWindow,
    Logout,
    Source,
    DevSupport
  }
})
export default class WelcomeWindow extends Mixins<WindowMixin>(WindowMixin) {
  @Getter("isRoomJoined") private isRoomJoined: any;
  @Getter("version") private version: any;

  private tabNum: string = "1";

  specAll(openFlg: boolean) {
    const elms = document
      .getElementById("welcomeWindowContents")!
      .querySelectorAll("input[type=checkbox]");
    Array.prototype.slice
      .call(elms)
      .filter(elm => elm.checked !== openFlg)
      .forEach(elm => elm.click());
  }

  scrollTo(target: string | undefined) {
    const contentsElm: HTMLElement = document.getElementById(
      "welcomeWindowContents"
    )!;
    setTimeout(() => {
      contentsElm.scrollTop = 0;
    }, 0);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.contents {
  /*position: absolute;*/
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
}

#logo-container {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0.8em;
  font-size: 16px;
  pointer-events: none;

  div {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
  }
}

.tab_wrap {
  width: 100%;
  flex: 1;
  margin: 0;
  display: flex;
  flex-direction: column;
}
input[type="radio"] {
  display: none;
}
.tab_area {
  font-size: 0;
  margin: 0;
  z-index: 10;

  label {
    width: 23.5%;
    margin: 0 0 0 1.2%;
    box-sizing: border-box;
    display: inline-block;
    padding: 0.2em 0;
    color: #999;
    background: #ddd;
    text-align: center;
    font-size: 13px;
    cursor: pointer;
    /*transition: ease 0.2s opacity;*/
    border: 1px solid #777;
    border-top-left-radius: 0.5em;
    -webkit-border-top-left-radius: 0.5em;
    -moz-border-top-left-radius: 0.5em;
    border-top-right-radius: 0.5em;
    -webkit-border-top-right-radius: 0.5em;
    -moz-border-top-right-radius: 0.5em;
  }
}
/*.tab_area label:hover { opacity:0.5; }*/
.panel_area {
  /*background:#fff;*/
  /*border: 1px solid red;*/
  margin-top: -1px;
  /*padding: 0 0.5em 0.5em;*/
  flex: 1;
  display: flex;
}
.tab_panel {
  padding: 0;
  display: none;
  flex: 1;
  width: 100%;

  p {
    font-size: 14px;
    letter-spacing: 1px;
    text-align: center;
  }
}

#welcomeWindow-tab1:checked ~ .tab_area .tab1_label,
#welcomeWindow-tab2:checked ~ .tab_area .tab2_label,
#welcomeWindow-tab3:checked ~ .tab_area .tab3_label,
#welcomeWindow-tab4:checked ~ .tab_area .tab4_label {
  background: #fff;
  color: #000;
  border-bottom-color: transparent;
}
#welcomeWindow-tab1:checked ~ .panel_area #panel1,
#welcomeWindow-tab2:checked ~ .panel_area #panel2,
#welcomeWindow-tab3:checked ~ .panel_area #panel3,
#welcomeWindow-tab4:checked ~ .panel_area #panel4 {
  display: flex;
  flex-direction: column;
}

.spec-header {
  padding: 0.2rem;
  border: 1px solid #777;
  border-bottom: none;
  background-color: white;
  line-height: 1em;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-height: 1.4em;

  button {
    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 0 0 0 1em;
    margin-right: 0.5rem;
    position: relative;
    color: rgb(90, 131, 177);
    font-size: 90%;
    box-sizing: border-box;

    &:hover {
      color: rgb(231, 50, 45);
    }

    &.open:before {
      border-top: 0.4em solid rgb(90, 131, 177);
      transform: translateY(-25%);
    }

    &.close:before {
      border-bottom: 0.4em solid rgb(90, 131, 177);
      transform: translateY(-75%);
    }

    &.close:hover:before {
      border-bottom-color: rgb(231, 50, 45);
    }

    &.open:hover:before {
      border-top-color: rgb(231, 50, 45);
    }

    &:before {
      content: "";
      width: 0;
      height: 0;
      position: absolute;
      top: 50%;
      left: 0;
      border: 0.4em solid transparent;
    }
  }
}

.menu {
  padding: 0 0.5em 0.5em;
  background-color: white;
  border: 1px solid #777;
  border-top: none;
}

.toTop {
  position: absolute;
  bottom: 0.5rem;
  right: 1.5rem;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  background-color: rgb(50, 146, 246);
  color: rgb(227, 253, 255);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 1px 1px 2px #94866a;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background-color: rgb(30, 126, 226);
  }
}
.rotate90 {
  transform: rotate(90deg);
}
</style>
