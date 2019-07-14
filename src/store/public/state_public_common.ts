export default {
  state: {},
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
    },

    /**
     * ルームメンバを空にする
     * @param commit
     * @returns {*}
     */
    emptyMember: ({ commit }: { commit: Function }) => commit("emptyMember"),

    /**
     * 画像のタブの構成を変更する
     * @param commit
     * @param payload
     * @returns {*}
     */
    imageTagChange: ({ commit }: { commit: Function }, payload: any) =>
      commit("imageTagChange", payload),

    /**
     * NOTICE_INPUT
     * ルームメンバの入力中状態の通知
     * @param commit
     * @param key
     */
    noticeInput: (
      { commit }: { commit: Function },
      { key }: { key: string }
    ) => {
      // 即時入力カウントアップ
      commit("inputPeerId", { key: key, add: 1 });
      // 少し経ったらカウントダウン
      setTimeout(() => {
        commit("inputPeerId", { key: key, add: -1 });
      }, 400);
    }
  } /* end of actions */,

  mutations: {
    /**
     * ルームメンバの入力中状態の変化
     * @param state
     * @param getters
     * @param rootState
     * @param rootGetters
     * @param key
     * @param add
     */
    inputPeerId(
      this: any,
      state: any,
      getters: any,
      rootState: any,
      rootGetters: any,
      { key, add }: { key: string; add: number }
    ) {
      // プロパティが無ければ、リアクティブになる形式で登録をする
      if (!rootGetters.inputting[key]) {
        this._vm.$set(rootGetters.inputting, key, 0);
      }
      // 値の足し込み
      rootGetters.inputting[key] += add;
    },

    /**
     * 画像のタブの構成を変更する
     * @param state
     * @param getters
     * @param rootState
     * @param rootGetters
     * @param key
     * @param imageList
     */
    imageTagChange(
      state: any,
      getters: any,
      rootState: any,
      rootGetters: any,
      { key, imageList }: { key: string; imageList: any[] }
    ) {
      const useTexts: any[] = [];
      /* eslint no-control-regex: 0 */
      const regExp = new RegExp("[　\t \r\n,]+", "g");
      // window.console.log(imageList)
      imageList.forEach((imageObj: any) => {
        Array.prototype.push.apply(
          useTexts,
          imageObj.currentTag.replace(regExp, ",").split(",")
        );
      });

      let addList = useTexts.concat(); // 配列をシャロ―コピー
      const deleteList = rootGetters.imageTagList.filter((tag: any) => {
        // 「(全て)」は消させない
        if (tag.key === "imgTag-0") {
          return;
        }

        let findFlg = false;
        const filteredList = useTexts.filter(txt => txt === tag.name);
        if (filteredList.length > 0) {
          findFlg = true;
          addList = addList.filter(item => item !== filteredList[0]);
        }
        if (!findFlg) {
          rootGetters.imageList.forEach((imageObj: any) => {
            if (findFlg) return;
            const filteredList = imageObj.tag
              .split(",")
              .filter((imgTag: any) => imgTag === tag.name);
            if (filteredList.length > 0) {
              findFlg = true;
            }
          });
        }
        return !findFlg;
      });
      // 削除リストに基づいてタグを消していく
      deleteList.forEach((delTagObj: any) =>
        rootGetters.imageTagList.splice(
          rootGetters.imageTagList.indexOf(delTagObj),
          1
        )
      );
      // 追加リストに基づいてタグを追加していく
      let maxKey = rootState.public.image.tags.maxKey;
      addList.forEach(add => {
        // 欠番を埋める方式は不採用
        rootGetters.imageTagList.push({
          name: add,
          key: `imgTag-${++maxKey}`
        });
      });
      rootState.public.image.tags.maxKey = maxKey;
      // セレクトボックスに表示される項目は、入力された内容の末尾の指定を使う
      const imageObj = imageList.filter(imageObj => imageObj.key === key)[0];
      const tagTexts = imageObj.currentTag.replace(regExp, ",").split(",");
      imageObj.selectTag = tagTexts[tagTexts.length - 1];
      // リアクティブ発火
      imageList.splice(imageList.indexOf(imageObj), 1, imageObj);
    }
  } /* end of mutations */,
  getters: {}
};
