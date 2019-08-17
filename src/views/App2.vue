<template>
  <div id="app2" @wheel.passive="onWheel">
    <game-table ref="gameTable" @contextmenu.prevent />
    <div id="YoutubePlayerContainer">
      <div class="unUse"><div id="YoutubePlayer001"></div></div>
      <div class="unUse"><div id="YoutubePlayer002"></div></div>
      <div class="unUse"><div id="YoutubePlayer003"></div></div>
      <div class="unUse"><div id="YoutubePlayer004"></div></div>
    </div>
    <modal-screen />
    <loading-screen />
    <loading />
    <chat-window />
    <Menu />
    <add-map-mask-window />
    <edit-map-mask-window />
    <map-mask-context />
    <un-support-window />
    <game-table-context />
    <dev-log-window />
    <public-memo-window />
    <add-character-setting-window />
    <add-character-window />
    <character-context />
    <drop-image-window />
    <room-info-window />
    <drop-zip-window />
    <add-chit-window />
    <edit-chit-window />
    <chit-context />
    <edit-map-window />
    <edit-character-window />
    <setting-b-g-m-window />
    <jukebox-window />
    <edit-b-g-m-window />
    <add-b-g-m-window />
    <setting-chat-tab-window />
    <card-context />
    <welcome-window />
    <version-window />
    <setting-chat-target-tab-window />
    <player-box-window />
    <edit-group-chat-window />
    <deck />
    <input-player-info-window />
    <secret-dice-window />
    <stand-image-setting-window />
    <image-selector-window />
    <initiative-window />
    <initiative-setting-window />
    <counter-remocon-window />
    <counter-remocon-editor-window />
    <counter-remocon-context />
    <image-view-window />
    <template v-for="(publicMemoObj, index) in publicMemo.list">
      <public-memo-tile
        :key="`${publicMemoObj.key}`"
        :publicMemoObj="publicMemoObj"
        :index="index"
      />
      <public-memo-fukidashi
        :key="`${publicMemoObj.key}-fukidashi`"
        :publicMemoObj="publicMemoObj"
        :index="index"
      />
    </template>
    <public-memo-context />
    <add-dice-symbol-window />
    <dice-symbol-context />
    <file-uploader-window />
    <custom-dice-bot-table-window />
    <edit-custom-dice-bot-table-window />
    <dice-bot-message />
    <chat-palette-setting-window />
    <select-new-owner-window />
    <edit-chat-palette-window />
    <import-chat-palette-window />
    <import-b-g-m-window />
    <add-group-chat-window />
    <add-floor-tile-window />
    <edit-floor-tile-window />
    <floor-tile-context />
  </div>
</template>

<script lang="ts">
import GameTable from "../components/map/GameTable.vue";
import Deck from "../components/map/card/Deck.vue";

import ChatWindow from "../components/chat/ChatWindow.vue";
import Menu from "../components/menu/Menu.vue";
import AddMapMaskWindow from "../components/map/mapMask/AddMapMaskWindow.vue";
import EditMapMaskWindow from "../components/map/mapMask/EditMapMaskWindow.vue";
import MapMaskContext from "../components/map/mapMask/MapMaskContext.vue";
import UnSupportWindow from "../components/UnSupportWindow.vue";
import GameTableContext from "../components/map/GameTableContext.vue";
import DevLogWindow from "../components/simple/DevLogWindow.vue";
import PublicMemoWindow from "../components/public-memo/PublicMemoWindow.vue";
import AddCharacterSettingWindow from "../components/map/character/AddCharacterSettingWindow.vue";
import AddCharacterWindow from "../components/map/character/AddCharacterWindow.vue";
import CharacterContext from "../components/map/character/CharacterContext.vue";
import DropImageWindow from "../components/simple/DropImageWindow.vue";
import RoomInfoWindow from "../components/simple/RoomInfoWindow.vue";
import DropZipWindow from "../components/simple/DropZipWindow.vue";
import AddChitWindow from "../components/map/chit/AddChitWindow.vue";
import EditChitWindow from "../components/map/chit/EditChitWindow.vue";
import ChitContext from "../components/map/chit/ChitContext.vue";
import EditMapWindow from "../components/map/EditMapWindow.vue";
import EditCharacterWindow from "../components/map/character/EditCharacterWindow.vue";
import SettingBGMWindow from "../components/music/SettingBGMWindow.vue";
import JukeboxWindow from "../components/music/JukeboxWindow.vue";
import EditBGMWindow from "../components/music/EditBGMWindow.vue";
import AddBGMWindow from "../components/music/AddBGMWindow.vue";
import SettingChatTabWindow from "../components/chat/SettingChatTabWindow.vue";
import CardContext from "../components/map/card/CardContext.vue";
import WelcomeWindow from "../components/welcome/WelcomeWindow.vue";
import VersionWindow from "../components/simple/VersionWindow.vue";
import SettingChatTargetTabWindow from "../components/chat/SettingChatTargetTabWindow.vue";
import PlayerBoxWindow from "../components/simple/PlayerBoxWindow.vue";
import EditGroupChatWindow from "../components/chat/EditGroupChatWindow.vue";
import ModalScreen from "../components/simple/ModalScreen.vue";
import Loading from "../components/simple/Loading.vue";
import LoadingScreen from "../components/simple/LoadingScreen.vue";
import InputPlayerInfoWindow from "../components/welcome/login/InputPlayerInfoWindow.vue";
import SecretDiceWindow from "../components/chat/SecretDiceWindow.vue";
import StandImageSettingWindow from "../components/stand-image/StandImageSettingWindow.vue";
import ImageSelectorWindow from "../components/simple/ImageSelectorWindow.vue";
import InitiativeWindow from "../components/initiative/InitiativeWindow.vue";
import InitiativeSettingWindow from "@/components/initiative/InitiativeSettingWindow.vue";
import CounterRemoconWindow from "@/components/counter-remocon/CounterRemoconWindow.vue";
import CounterRemoconEditorWindow from "@/components/counter-remocon/CounterRemoconEditorWindow.vue";
import CounterRemoconContext from "@/components/counter-remocon/CounterRemoconContext.vue";

import { Component, Vue, Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import ImageViewWindow from "@/components/simple/ImageViewWindow.vue";
import PublicMemoTile from "@/components/public-memo/PublicMemoTile.vue";
import PublicMemoFukidashi from "@/components/public-memo/PublicMemoFukidashi.vue";
import PublicMemoContext from "@/components/public-memo/PublicMemoContext.vue";
import AddDiceSymbolWindow from "@/components/map/diceSymbol/AddDiceSymbolWindow.vue";
import DiceSymbolContext from "@/components/map/diceSymbol/DiceSymbolContext.vue";
import FileUploaderWindow from "@/components/simple/FileUploaderWindow.vue";
import CustomDiceBotTableWindow from "@/components/custom-dice-bot/CustomDiceBotTableWindow.vue";
import EditCustomDiceBotTableWindow from "@/components/custom-dice-bot/EditCustomDiceBotTableWindow.vue";
import DiceBotMessage from "@/components/chat/DiceBotMessage.vue";
import ChatPaletteSettingWindow from "@/components/chat-palette/ChatPaletteSettingWindow.vue";
import SelectNewOwnerWindow from "@/components/map/character/SelectNewOwnerWindow.vue";
import EditChatPaletteWindow from "@/components/chat-palette/EditChatPaletteWindow.vue";
import ImportChatPaletteWindow from "@/components/chat-palette/ImportChatPaletteWindow.vue";
import ImportBGMWindow from "@/components/music/ImportBGMWindow.vue";
import AddGroupChatWindow from "@/components/chat/AddGroupChatWindow.vue";
import AddFloorTileWindow from "@/components/map/floorTile/AddFloorTileWindow.vue";
import EditFloorTileWindow from "@/components/map/floorTile/EditFloorTileWindow.vue";
import FloorTileContext from "@/components/map/floorTile/FloorTileContext.vue";

@Component({
  components: {
    DiceSymbolContext,
    GameTable,
    ChatWindow,
    Menu,
    AddMapMaskWindow,
    EditMapMaskWindow,
    MapMaskContext,
    UnSupportWindow,
    GameTableContext,
    DevLogWindow,
    PublicMemoWindow,
    AddCharacterSettingWindow,
    AddCharacterWindow,
    CharacterContext,
    DropImageWindow,
    RoomInfoWindow,
    DropZipWindow,
    AddChitWindow,
    EditChitWindow,
    ChitContext,
    EditMapWindow,
    EditCharacterWindow,
    SettingBGMWindow,
    JukeboxWindow,
    EditBGMWindow,
    AddBGMWindow,
    SettingChatTabWindow,
    CardContext,
    WelcomeWindow,
    VersionWindow,
    SettingChatTargetTabWindow,
    PlayerBoxWindow,
    EditGroupChatWindow,
    Deck,
    ModalScreen,
    Loading,
    LoadingScreen,
    InputPlayerInfoWindow,
    SecretDiceWindow,
    StandImageSettingWindow,
    ImageSelectorWindow,
    InitiativeWindow,
    InitiativeSettingWindow,
    CounterRemoconWindow,
    CounterRemoconEditorWindow,
    CounterRemoconContext,
    ImageViewWindow,
    PublicMemoTile,
    PublicMemoFukidashi,
    PublicMemoContext,
    AddDiceSymbolWindow,
    FileUploaderWindow,
    CustomDiceBotTableWindow,
    EditCustomDiceBotTableWindow,
    DiceBotMessage,
    ChatPaletteSettingWindow,
    SelectNewOwnerWindow,
    EditChatPaletteWindow,
    ImportChatPaletteWindow,
    ImportBGMWindow,
    AddGroupChatWindow,
    AddFloorTileWindow,
    EditFloorTileWindow,
    FloorTileContext
  }
})
export default class App2 extends Vue {
  @Action("onMount") private onMount: any;
  @Action("exportStart") private exportStart: any;
  @Getter("backgroundColor") private backgroundColor: any;
  @Getter("publicMemo") private publicMemo: any;

  private mounted() {
    // bcdiceの使用準備
    this.onMount();

    // Youtubeの使用準備
    const script: HTMLScriptElement = document.createElement("script");
    script.src = "static/lib/YoutubeManager.js";
    const firstScript: HTMLScriptElement = document.getElementsByTagName(
      "script"
    )[0];
    firstScript!.parentNode!.insertBefore(script, firstScript);

    // 保存イベント
    let count = 0;
    document.onkeydown = (event: any) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        (event.keyCode === 83 || event.which === 83)
      ) {
        if (count++ === 0) this.exportStart();
        return false;
      }
      if (event.code === "Enter") {
        const gameTableElm = document.getElementById("gameTable");
        gameTableElm!.dispatchEvent(
          new KeyboardEvent("keydown", { key: event.code })
        );
      }
      return true;
    };
    document.onkeyup = (event: any) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        (event.keyCode === 83 || event.which === 83)
      ) {
        count = 0;
        return false;
      }
      if (event.code === "Enter") {
        const gameTableElm = document.getElementById("gameTable");
        gameTableElm!.dispatchEvent(
          new KeyboardEvent("keyup", { key: event.code })
        );
      }
      return true;
    };
  }

  private onWheel(this: any, event: any) {
    this.$refs["gameTable"].onWheel(event.wheelDelta);
  }

  @Watch("backgroundColor", { immediate: true })
  private onChangeBackgroundColor(backgroundColor: string): void {
    document.body.style.backgroundColor = backgroundColor;
  }
}
</script>

<style lang="scss">
html,
body {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* サイズ調整（コンテンツを比率を変えずに内側にフィット） */
img {
  object-fit: contain;
}

div.img {
  opacity: 0;
  background-size: contain;
  background: no-repeat center;
}

hr {
  margin: 3px 0;
}

.anime {
  opacity: 0;
}

#app2 {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
  width: 100%;
  height: 100%;
  perspective: 1000px;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

.selectable {
  user-select: text;
  -ms-user-select: text;
  -moz-user-select: text;
  -webkit-user-select: text;
}

.flexCenter {
  display: flex;
  justify-content: center;
  align-items: center;
}

.public-memo-tile:hover + .public-memo-fukidashi {
  visibility: visible;
}
</style>
