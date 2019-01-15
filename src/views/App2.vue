  <template>
  <div id="app2" @wheel.passive="onWheel" @contextmenu.prevent>
    <GameTable ref="gameTable"/>
    <div id="YoutubePlayerContainer">
      <div class="unUse"><div id="YoutubePlayer001"></div></div>
      <div class="unUse"><div id="YoutubePlayer002"></div></div>
      <div class="unUse"><div id="YoutubePlayer003"></div></div>
      <div class="unUse"><div id="YoutubePlayer004"></div></div>
      <div class="unUse"><div id="YoutubePlayer005"></div></div>
    </div>
    <ModalScreen/>
    <LoadingScreen/>
    <Loading/>
    <ChatWindow/>
    <Menu/>
    <AddMapMaskWindow/>
    <EditMapMaskWindow/>
    <MapMaskContext/>
    <UnSupportWindow/>
    <GameTableContext/>
    <DevLogWindow/>
    <FunctionListWindow/>
    <PublicMemoWindow/>
    <AddCharacterSettingWindow/>
    <AddCharacterWindow/>
    <CharacterContext/>
    <DropImageWindow/>
    <RoomInfoWindow/>
    <DropZipWindow/>
    <SelectPeerWindow/>
    <InviteLinkWindow/>
    <ConfirmLoadRoomWindow/>
    <AddChitWindow/>
    <EditChitWindow/>
    <ChitContext/>
    <EditMapWindow/>
    <EditCharacterWindow/>
    <SettingBGMWindow/>
    <JukeboxWindow/>
    <EditBGMWindow/>
    <AddBGMWindow/>
    <SettingChatTabWindow/>
    <SettingChatFontWindow/>
    <CardContext/>
    <WelcomeWindow/>
    <VersionWindow/>
    <SettingChatTargetTabWindow/>
    <PlayerBoxWindow/>
    <EditGroupChatWindow/>
    <Deck/>
    <InputPlayerInfoWindow/>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

import GameTable from "../components/map/GameTable";
import Deck from "../components/map/card/Deck";

import ChatWindow from "../components/chat/ChatWindow";
import Menu from "../components/menu/Menu";
import AddMapMaskWindow from "../components/map/mapMask/AddMapMaskWindow";
import EditMapMaskWindow from "../components/map/mapMask/EditMapMaskWindow";
import MapMaskContext from "../components/map/mapMask/MapMaskContext";
import UnSupportWindow from "../components/UnSupportWindow";
import GameTableContext from "../components/map/GameTableContext";
import DevLogWindow from "../components/simple/DevLogWindow";
import FunctionListWindow from "../components/simple/FunctionListWindow";
import PublicMemoWindow from "../components/public-memo/PublicMemoWindow";
import AddCharacterSettingWindow from "../components/map/character/AddCharacterSettingWindow";
import AddCharacterWindow from "../components/map/character/AddCharacterWindow";
import CharacterContext from "../components/map/character/CharacterContext";
import DropImageWindow from "../components/simple/DropImageWindow";
import RoomInfoWindow from "../components/simple/RoomInfoWindow";
import DropZipWindow from "../components/simple/DropZipWindow";
import SelectPeerWindow from "../components/simple/SelectPeerWindow";
import InviteLinkWindow from "../components/simple/InviteLinkWindow";
import ConfirmLoadRoomWindow from "../components/simple/ConfirmLoadRoomWindow";
import AddChitWindow from "../components/map/chit/AddChitWindow";
import EditChitWindow from "../components/map/chit/EditChitWindow";
import ChitContext from "../components/map/chit/ChitContext";
import EditMapWindow from "../components/map/EditMapWindow";
import EditCharacterWindow from "../components/map/character/EditCharacterWindow";
import SettingBGMWindow from "../components/music/SettingBGMWindow";
import JukeboxWindow from "../components/music/JukeboxWindow";
import EditBGMWindow from "../components/music/EditBGMWindow";
import AddBGMWindow from "../components/music/AddBGMWindow";
import SettingChatTabWindow from "../components/chat/SettingChatTabWindow";
import SettingChatFontWindow from "../components/chat/SettingChatFontWindow";
import CardContext from "../components/map/card/CardContext";
import WelcomeWindow from "../components/welcome/WelcomeWindow";
import VersionWindow from "../components/simple/VersionWindow";
import SettingChatTargetTabWindow from "../components/chat/SettingChatTargetTabWindow";
import PlayerBoxWindow from "../components/simple/PlayerBoxWindow";
import EditGroupChatWindow from "../components/chat/EditGroupChatWindow";
import ModalScreen from "../components/simple/ModalScreen";
import Loading from "../components/simple/Loading";
import LoadingScreen from "../components/simple/LoadingScreen";
import InputPlayerInfoWindow from "../components/welcome/login/InputPlayerInfoWindow";

export default {
  name: "App2",
  components: {
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
    SelectPeerWindow,
    InviteLinkWindow,
    ConfirmLoadRoomWindow,
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
    InputPlayerInfoWindow
  },
  mounted() {
    this.onSettingMount();
    this.onMount();
    window.youtube.init();

    let count = 0;
    document.onkeydown = event => {
      if (
        (event.ctrlKey || event.metaKey) &&
        (event.keyCode === 83 || event.which === 83)
      ) {
        if (count++ === 0) {
          this.exportStart();
        }
        return false;
      }
    };
    document.onkeyup = event => {
      if (
        (event.ctrlKey || event.metaKey) &&
        (event.keyCode === 83 || event.which === 83)
      ) {
        count = 0;
        return false;
      }
    };
  },
  watch: {
    background(background) {
      document.style["background-color"] = background;
    },
    backgroundColor: {
      handler: backgroundColor => {
        document.body.style.backgroundColor = backgroundColor;
      },
      immediate: true
    }
  },
  computed: mapState({
    backgroundColor: state => {
      return state.public.map.background;
    }
  }),
  methods: {
    ...mapActions(["onSettingMount", "onMount", "exportStart"]),
    onWheel(e) {
      this.$refs["gameTable"].onWheel(e.wheelDelta);
    }
  }
};
</script>

<style>
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
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

.unSelectable {
  user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}
.flexCenter {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
