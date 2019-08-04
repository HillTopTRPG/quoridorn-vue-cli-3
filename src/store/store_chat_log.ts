// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import "bcdice-js/lib/preload-dicebots"
import Vue from "vue";
import Vuex from "vuex";
import statePublic from "@/store/state_public_chat_log";
import stateSetting from "@/store/state_setting";

Vue.use(Vuex);

/**
 * Store
 * @type {Store}
 */
export default new Vuex.Store({
  modules: {
    setting: stateSetting,
    public: statePublic
  },
  state: {},
  actions: {
    /**
     * =================================================================================================================
     * 起動時の最初の処理
     * @param dispatch
     * @param commit
     * @param state
     * @param rootState
     * @param rootGetters
     */
    onMount({ dispatch, commit, state, rootState, rootGetters }) {
      commit("setChatLogs", (window as any)!["chatLogs"]);
      commit("setChatTabs", (window as any)!["chatTabList"]);
      commit("setGroupTargetTabList", (window as any)!["groupTargetTabList"]);
      commit("initPlayer");
      commit("initCharacter");
    }
  },
  mutations: {},
  getters: {
    getObj: (state: any, getters: any, rootState: any, rootGetters: any) => (
      key: string
    ): any => {
      if (!key) return null;
      const kind = key.split("-")[0];
      const filterFunc: Function = (obj: any) => obj.key === key;
      if (kind === "groupTargetTab") {
        // グループチャットタブ
        return rootGetters.groupTargetTabList.filter(filterFunc)[0];
      } else if (kind === "chatTab") {
        // チャットタブ
        return rootGetters.chatTabList.filter(filterFunc)[0];
      } else if (kind === "imgTag") {
        // イメージタグ
        return rootGetters.imageTagList.filter(filterFunc)[0];
      } else {
        // その他
        return (window as any)!["actors"].filter(filterFunc)[0];
      }
    },
    getViewName: (state: any, getters: any) => (key: string): string => {
      const obj = getters.getObj(key);
      if (!obj) {
        if (key.split("-")[0] === "chatTab") return "削除済";
        return key;
      }
      const kind = obj.key.split("-")[0];
      if (kind === "player") {
        return `${obj.name}(${obj.type})`;
      } else {
        return obj.name;
      }
    }
  }
});
