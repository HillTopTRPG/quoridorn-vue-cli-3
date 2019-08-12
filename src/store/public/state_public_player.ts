export default {
  /** プレイヤー */
  state: {
    list: []
  },
  actions: {
    /**
     * プレイヤーを追加する
     * @param dispatch
     * @param commit
     * @param rootGetters
     * @param peerId
     * @param name
     * @param password
     * @param fontColor
     * @param type
     * @param isWait
     * @returns {*}
     */
    addPlayer: (
      {
        dispatch,
        commit,
        rootGetters
      }: { dispatch: Function; commit: Function; rootGetters: any },
      {
        peerId,
        name,
        password = "",
        type,
        fontColor,
        isWait
      }: {
        peerId: string;
        name: string;
        password: string;
        type: string;
        fontColor: string;
        isWait: boolean;
      }
    ): any => {
      const playerIndex: number = rootGetters.playerList.findIndex((p: any) => {
        return p.name === name;
      });
      const player =
        playerIndex > -1 ? rootGetters.playerList[playerIndex] : null;
      const playerKey: string = player ? player.key : `player-${name}`;

      const isSelf = rootGetters.peerId(isWait) === peerId;
      if (isSelf) {
        commit("updateActorKey", playerKey);
        commit("updatePlayerKey", playerKey);
      }

      rootGetters.members.push({
        peerId: peerId,
        playerKey: playerKey
      });

      if (!player) {
        // window.console.log(`Add player key:${playerKey} name:${name}`);
        rootGetters.playerList.push({
          key: playerKey,
          name,
          password,
          fontColor,
          type,
          chatPalette: {
            list: []
          },
          statusList: [
            {
              name: "◆",
              standImage: {
                ref: "",
                base: "",
                baseTag: "",
                autoResize: false,
                animationLength: 0,
                locate: 1,
                diffList: [],
                isSystemLock: true
              }
            }
          ]
        });
      } else {
        // privateデータの復元
        const privateData = player.private;
        if (privateData && isSelf) {
          const peerId = rootGetters.peerId(isWait);
          dispatch("setProperty", {
            property: "private",
            value: privateData,
            isNotice: false,
            logOff: true
          }).then(() => {
            commit("updatePeerId", { peerId: peerId, isWait: isWait });
          });
        }
      }
    }
  },
  mutations: {},
  getters: {
    playerList: (state: any): any[] => state.list,
    getPlayer: (state: any, getters: any, rootState: any, rootGetters: any) => (
      peerId: string
    ): any => {
      const member = rootGetters.members.filter(
        (member: any) => member.peerId === peerId
      )[0];
      if (!member) return null;
      return rootGetters.getObj(member.playerKey);
    }
  }
};
