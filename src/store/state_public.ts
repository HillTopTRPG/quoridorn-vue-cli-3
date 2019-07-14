import state_public_bgm from "@/store/public/state_public_bgm";
import state_public_setting from "@/store/public/state_public_setting";
import state_public_map from "@/store/public/state_public_map";
import state_public_deck from "@/store/public/state_public_deck";
import state_public_counter_remocon from "@/store/public/state_public_counter_remocon";
import state_public_room from "@/store/public/state_public_room";
import state_public_custom_dice_bot from "@/store/public/state_public_custom_dice_bot";
import state_public_image from "@/store/public/state_public_image";
import state_public_initiative from "@/store/public/state_public_initiative";
import state_public_public_memo from "@/store/public/state_public_public_memo";
import state_public_chat from "@/store/public/state_public_chat";
import state_public_player from "@/store/public/state_public_player";
import state_public_chit from "@/store/public/state_public_chit";
import state_public_character from "@/store/public/state_public_character";
import state_public_map_mask from "@/store/public/state_public_map_mask";
import state_public_dice_symbol from "@/store/public/state_public_dice_symbol";

export default {
  modules: {
    bgm: state_public_bgm,
    setting: state_public_setting,
    map: state_public_map,
    deck: state_public_deck,
    counterRemocon: state_public_counter_remocon,
    room: state_public_room,
    customDiceBot: state_public_custom_dice_bot,
    image: state_public_image,
    initiative: state_public_initiative,
    publicMemo: state_public_public_memo,
    chat: state_public_chat,
    player: state_public_player,
    chit: state_public_chit,
    character: state_public_character,
    mapMask: state_public_map_mask,
    diceSymbol: state_public_dice_symbol
  },
  state: {
    /** 操作履歴 */
    historyList: []
  },
  actions: {},
  mutations: {},
  getters: {
    /**
     * すべての障害物を取得
     * @param state
     * @param getters
     * @param rootState
     * @param rootGetters
     */
    getAllObstacle: (
      state: any,
      getters: any,
      rootState: any,
      rootGetters: any
    ) => {
      // TODO 衝突属性判定(isObstacle)
      return rootGetters.characterList
        .filter((o: any) => o.place === "field")
        .concat(rootGetters.chitList.filter((o: any) => o.place === "field"))
        .concat(
          rootGetters.mapMaskList.filter((o: any) => o.place === "field")
        );
    },

    getSelfActors: (
      state: any,
      getters: any,
      rootState: any,
      rootGetters: any
    ) => {
      const player = rootGetters.playerList.filter(
        (p: any) => p.key === rootGetters.playerKey
      )[0];
      if (player) {
        return [
          player,
          ...rootGetters.characterList.filter(
            (character: any) => character.owner === player.key
          )
        ];
      } else {
        return [{ name: "名無し", type: "PL" }, ...rootGetters.characterList];
      }
    },

    getAllActors: (
      state: any,
      getters: any,
      rootState: any,
      rootGetters: any
    ) => {
      const actorList: any[] = [];

      rootGetters.playerList.forEach((player: any) => {
        actorList.push(player);
        Array.prototype.push.apply(
          actorList,
          rootGetters.characterList.filter(
            (character: any) => character.owner === player.key
          )
        );
      });

      return actorList;
    },

    getObj: (state: any, getters: any, rootState: any, rootGetters: any) => (
      key: string
    ): any => {
      if (!key) return null;
      const kind = key.split("-")[0];
      const filterFunc: Function = (obj: any) => obj.key === key;
      if (kind === "groupTargetTab") {
        // グループチャットタブ
        return rootGetters.groupTargetTabList.filter(filterFunc)[0];
      } else if (kind === "imgTag") {
        // イメージタグ
        return rootGetters.imageTagList.filter(filterFunc)[0];
      } else {
        // その他
        return rootState.public[kind]
          ? rootState.public[kind].list.filter(filterFunc)[0]
          : undefined;
      }
    },

    delObj: (state: any, getters: any, rootState: any, rootGetters: any) => (
      key: string
    ): void => {
      if (!key) return;
      const kind = key.split("-")[0];
      let list: any[] = [];
      const findIndexFunc: Function = () =>
        list.findIndex(obj => obj.key === key);
      if (kind === "groupTargetTab") {
        // グループチャットタブ
        list = rootGetters.groupTargetTabList;
      } else {
        // その他
        list = rootState.public[kind].list;
      }
      const index = findIndexFunc(list);
      if (index > -1) {
        list.splice(index, 1);
      }
    },

    getViewName: (state: any, getters: any) => (key: string): string => {
      const obj = getters.getObj(key);
      if (!obj) return "名無し(PL)";
      const kind = obj.key.split("-")[0];
      if (kind === "player") {
        return `${obj.name}(${obj.type})`;
      } else {
        return obj.name;
      }
    },

    getMapObjectList: (state: any, getters: any, rootState: any) => ({
      kind,
      place = "",
      playerKey = ""
    }: {
      kind: string;
      place: string;
      playerKey: string;
    }): any[] => {
      const list: any[] = rootState.public[kind].list;
      if (!place && !playerKey) return list;
      return list.filter((target: any) => {
        if (playerKey && target.owner !== playerKey) return false;
        return !(place && target.place !== place);
      });
    },

    getMembers: (
      state: any,
      getters: any,
      rootState: any,
      rootGetters: any
    ) => (playerKey: string): any[] => {
      const player = getters.getObj(playerKey);
      if (!player) return [];
      return rootGetters.members.filter(
        (member: any) => member.playerKey === player.key
      );
    },

    getOwnerKey: (state: any, getter: any) => (actorKey: string) => {
      let ownerKey: string | undefined = undefined;

      if (actorKey) {
        const kind = actorKey.split("-")[0];
        if (kind === "player") {
          ownerKey = actorKey;
        } else if (kind === "character") {
          ownerKey = getter.getObj(actorKey).owner;
        } else {
          ownerKey = undefined;
        }
      }
      return ownerKey;
    },
    historyList: (state: any) => state.historyList
  }
};
