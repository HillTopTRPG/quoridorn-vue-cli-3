import state_private_display from "@/store/private/state_private_display";
import state_private_map from "@/store/private/state_private_map";
import state_private_self from "@/store/private/state_private_self";
import state_private_chat from "@/store/private/state_private_chat";
import state_private_setting from "@/store/private/state_private_setting";

export default {
  // privateデータは、データ保存時に public.room.members に含める
  modules: {
    display: state_private_display,
    map: state_private_map,
    self: state_private_self,
    chat: state_private_chat,
    setting: state_private_setting
  },
  state: {},
  actions: {},
  mutations: {},
  getters: {}
};
