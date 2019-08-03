import state_public_bgm from "@/store/chat-log/state_public_bgm";
import state_public_map from "@/store/chat-log/state_public_map";
import state_public_image from "@/store/chat-log/state_public_image";
import state_public_initiative from "@/store/chat-log/state_public_initiative";
import state_public_public_memo from "@/store/chat-log/state_public_public_memo";
import state_public_chat from "@/store/chat-log/state_public_chat";
import state_public_chit from "@/store/chat-log/state_public_chit";
import state_public_character from "@/store/chat-log/state_public_character";
import state_public_map_mask from "@/store/chat-log/state_public_map_mask";
import state_public_dice_symbol from "@/store/chat-log/state_public_dice_symbol";

export default {
  modules: {
    bgm: state_public_bgm,
    map: state_public_map,
    image: state_public_image,
    initiative: state_public_initiative,
    publicMemo: state_public_public_memo,
    chat: state_public_chat,
    chit: state_public_chit,
    character: state_public_character,
    mapMask: state_public_map_mask,
    diceSymbol: state_public_dice_symbol
  },
  state: {},
  actions: {},
  mutations: {},
  getters: {}
};
