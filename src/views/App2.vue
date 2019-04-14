  <template>
  <div id="app2" @wheel.passive="onWheel">
    <game-table ref="gameTable"/>
    <div id="YoutubePlayerContainer">
      <div class="unUse"><div id="YoutubePlayer001"></div></div>
      <div class="unUse"><div id="YoutubePlayer002"></div></div>
      <div class="unUse"><div id="YoutubePlayer003"></div></div>
      <div class="unUse"><div id="YoutubePlayer004"></div></div>
    </div>
    <modal-screen/>
    <loading-screen/>
    <loading/>
    <chat-window/>
    <Menu/>
    <add-map-mask-window/>
    <edit-map-mask-window/>
    <map-mask-context/>
    <un-support-window/>
    <game-table-context/>
    <dev-log-window/>
    <function-list-window/>
    <public-memo-window/>
    <add-character-setting-window/>
    <add-character-window/>
    <character-context/>
    <drop-image-window/>
    <room-info-window/>
    <drop-zip-window/>
    <add-chit-window/>
    <edit-chit-window/>
    <chit-context/>
    <edit-map-window/>
    <edit-character-window/>
    <setting-b-g-m-window/>
    <jukebox-window/>
    <edit-b-g-m-window/>
    <add-b-g-m-window/>
    <setting-chat-tab-window/>
    <setting-chat-font-window/>
    <card-context/>
    <welcome-window/>
    <version-window/>
    <setting-chat-target-tab-window/>
    <player-box-window/>
    <edit-group-chat-window/>
    <deck/>
    <input-player-info-window/>
    <secret-dice-window/>
    <stand-image-setting-window/>
    <image-selector-window/>
    <initiative-window/>
    <initiative-setting-window/>
    <counter-remocon-window/>
    <counter-remocon-editor-window/>
    <counter-remocon-context/>
    <image-view-window/>
    <template v-for="(publicMemoObj, index) in publicMemo.list">
      <public-memo-tile :key="`${publicMemoObj.key}`" :publicMemoObj="publicMemoObj" :index="index"/>
      <public-memo-fukidashi :key="`${publicMemoObj.key}-fukidashi`" :publicMemoObj="publicMemoObj" :index="index"/>
    </template>
    <public-memo-context/>
    <add-dice-symbol-window/>
    <dice-symbol-context/>
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
import FunctionListWindow from "../components/simple/FunctionListWindow.vue";
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
import SettingChatFontWindow from "../components/chat/SettingChatFontWindow.vue";
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
import { Action, Getter, Mutation } from "vuex-class";
import ImageViewWindow from "@/components/public-memo/ImageViewWindow.vue";
import PublicMemoTile from "@/components/public-memo/PublicMemoTile.vue";
import PublicMemoFukidashi from "@/components/public-memo/PublicMemoFukidashi.vue";
import PublicMemoContext from "@/components/public-memo/PublicMemoContext.vue";
import AddDiceSymbolWindow from "@/components/map/diceSymbol/AddDiceSymbolWindow.vue";
import DiceSymbolContext from "@/components/map/diceSymbol/DiceSymbolContext.vue";

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
    FunctionListWindow,
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
    SettingChatFontWindow,
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
    AddDiceSymbolWindow
  }
})
export default class App2 extends Vue {
  @Action("onMount") private onMount: any;
  @Action("exportStart") private exportStart: any;
  @Getter("backgroundColor") private backgroundColor: any;
  @Getter("publicMemo") private publicMemo: any;

  mounted() {
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
    };
    document.onkeyup = (event: any) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        (event.keyCode === 83 || event.which === 83)
      ) {
        count = 0;
        return false;
      }
    };
  }

  onWheel(this: any, event: any) {
    this.$refs["gameTable"].onWheel(event.wheelDelta);
  }

  @Watch("backgroundColor", { immediate: true })
  onChangeBackgroundColor(backgroundColor: string): void {
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
