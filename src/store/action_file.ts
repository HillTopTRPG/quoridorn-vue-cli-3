// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'bcdice-js/lib/preload-dicebots'
import Vue from "vue";
import Vuex from "vuex";
import JSZip from "jszip";
import saveAs from "file-saver";

Vue.use(Vuex);

/**
 * Store
 */
export default {
  actions: {
    /** ========================================================================
     * セーブデータ作成を開始する
     * @param dispatch
     * @param rootState
     * @param rootGetters
     */
    exportStart({
      dispatch,
      rootState,
      rootGetters
    }: {
      dispatch: Function;
      rootState: any;
      rootGetters: any;
    }) {
      if (rootGetters.members.length === 0) {
        alert("現在「保存」機能はご利用いただけません。");
        return;
      }

      // 連想配列の中身を空にする
      for (const playerKey in rootGetters.volatilePrivateData) {
        if (!rootGetters.volatilePrivateData.hasOwnProperty(playerKey))
          continue;
        delete rootGetters.volatilePrivateData[playerKey];
      }

      // privateデータのコピー
      const privateData = JSON.parse(JSON.stringify(rootState.private));

      // 開いてないディスプレイ情報は送信データに含めない
      for (const key in privateData.display) {
        if (!privateData.display.hasOwnProperty(key)) continue;
        if (key === "undefined" || !privateData.display[key].isDisplay) {
          delete privateData.display[key];
        } else {
          delete privateData.display[key].command;
          delete privateData.display[key].zIndex;
        }
      }

      // 自分のprivateデータを一時領域に保存する
      rootGetters.volatilePrivateData[rootGetters.playerKey] = privateData;

      // 1人だったら即保存処理、複数人だったらprivateデータをクリエストする
      if (rootGetters.members.length === 1) {
        dispatch("doExport");
      } else {
        dispatch("sendRoomData", { type: "REQUEST_PRIVATE_DATA", value: null });
      }
    },

    /** ========================================================================
     * セーブデータ作成を実行する
     * @param dispatch
     * @param rootState
     * @param rootGetters
     */
    doExport({
      dispatch,
      rootState,
      rootGetters
    }: {
      dispatch: Function;
      rootState: any;
      rootGetters: any;
    }) {
      // ------------------------------------------------------------
      // セーブデータのベース作成
      const saveData = JSON.parse(
        JSON.stringify({
          public: rootState.public,
          dataVersion: "1.0.0"
        })
      );
      saveData.public.room.members = [];

      // listに対する差分を取り扱う
      const addKeyList: string[] = [];
      const delKeyList: string[] = [];
      saveData.public.historyList.forEach((history: any) => {
        if (history.type === "add") addKeyList.push(history.key);
        if (history.type === "del") delKeyList.push(history.key);
      });

      for (const playerKey in rootGetters.volatilePrivateData) {
        if (!rootGetters.volatilePrivateData.hasOwnProperty(playerKey))
          continue;

        // ------------------------------------------------------------
        // セーブデータ内のplayerのリストに各プレイヤーのprivateデータを持たせる
        const playerPrivateObj: any =
          rootGetters.volatilePrivateData[playerKey];
        saveData.public.player.list.forEach((player: any) => {
          if (player.key !== playerPrivateObj.self.playerKey) return;
          player.private = playerPrivateObj;
        });
      }

      // ------------------------------------------------------------
      // 削除したデータが追加したデータに含まれている場合は双方のリストから消す
      const delKeyDelList: string[] = [];
      delKeyList.forEach((delKey: string) => {
        const index = addKeyList.findIndex(
          (addKey: string) => addKey === delKey
        );
        if (index > -1) {
          addKeyList.splice(index, 1);
          delKeyDelList.push(delKey);
        }
      });
      delKeyDelList.forEach((delKeyDel: string) =>
        delKeyList.splice(
          delKeyList.findIndex((delKey: string) => delKey === delKeyDel),
          1
        )
      );

      // ------------------------------------------------------------
      // この時点で削除リストはプリセットデータの削除のみとなっているはず
      // → 対象のkeyのリストが保存データに含まれれば、ロード時に十分なデータとなる
      saveData.delKeyList = delKeyList;

      // ============================================================

      // ここからは追加データ間の関連データを調べ、差分データとして用意する
      const imageKeyList = addKeyList.filter(
        key => key.split("-")[0] === "image"
      );

      /** -----------------------------------------------------------
       * imageKeyListに含まれるなら間接参照keyに変換する
       */
      const getAfterKey = (beforeKey: string) => {
        const index: number = imageKeyList.findIndex(
          imageKey => imageKey === beforeKey
        );
        if (index === -1) return beforeKey;
        return beforeKey.replace(/[0-9]+/, () => `$${index}`);
      };

      const addObjList: any[] = addKeyList.map(key => {
        // オブジェクトのデータを文字列化し、そこに含まれるイメージkeyを必要に応じて置換する
        let objStr = JSON.stringify(rootGetters.getObj(key));
        (objStr.match(/image-([0-9])+/g) || []).forEach((imageKey: string) => {
          objStr = objStr.replace(
            new RegExp(imageKey, "g"),
            getAfterKey(imageKey)
          );
        });
        return JSON.parse(objStr);

        // // 画像を持つオブジェクトなら "useImageList" があるはず
        // const obj = JSON.parse(JSON.stringify(rootGetters.getObj(key)));
        // let useImageList = obj.useImageList;
        // if (useImageList) {
        //   const useImageKeys = useImageList
        //     .split("|")
        //     .map((str: string) => str.replace(":R", ""));
        //   useImageKeys.forEach((uiKey: string) => {
        //     const afterKey = getAfterKey(uiKey);
        //     useImageList = useImageList.replace(uiKey, afterKey);
        //   });
        //   obj.useImageList = useImageList;
        // }
        // const imageKey = obj.imageKey;
        // if (imageKey) {
        //   obj.imageKey = getAfterKey(imageKey);
        // }
        // return obj;
      });

      addObjList.forEach(addObj => {
        const prefix = addObj.key.split("-")[0];
        if (prefix === "image") {
          addObj.key = getAfterKey(addObj.key);
        } else {
          addObj.key = addObj.key.replace(/[0-9]+/, "?");
        }
      });

      // 追加データに記録されるものは二重管理となるため削除
      delete saveData.public.character;
      delete saveData.public.chit;
      delete saveData.public.mapMask;
      delete saveData.public.image;
      delete saveData.public.bgm;
      delete saveData.public.diceSymbol;

      // お試しデータのカードデッキはとりあえず削除
      delete saveData.public.deck;

      // セーブデータに追加差分データを含める
      saveData.addObjList = addObjList;

      // zipファイルの生成
      const zip = new JSZip();
      zip.file("save.json", JSON.stringify(saveData, undefined, 2));
      zip.generateAsync({ type: "blob" }).then((blob: any) => {
        const d = new Date();
        saveAs(
          blob,
          `Quoridorn_${d.getFullYear()}${d.getMonth() +
            1}${d.getDate()}_${d.getHours()}${d.getMinutes()}${d.getSeconds()}.zip`
        );
      });
    },

    /** ========================================================================
     *
     * @param dispatch
     * @param rootState
     * @param zipFiles
     * @param isRoomCreate
     */
    importStart(
      { dispatch, rootState }: { dispatch: Function; rootState: any },
      { zipFiles, isRoomCreate }: { zipFiles: any[]; isRoomCreate: boolean }
    ) {
      const zip: any = new JSZip();
      const zipList: any[] = [];
      const promiseList: PromiseLike<any>[] = zipFiles.map(
        zipFile =>
          new Promise(resolve => {
            zip.loadAsync(zipFile).then((zip: any) => {
              // you now have every files contained in the loaded zip
              zip
                .file("save.json")
                .async("string")
                .then((jsonStr: string) => {
                  const saveData = JSON.parse(jsonStr);
                  if (!isRoomCreate) {
                    delete saveData.public.room.name;
                    delete saveData.public.room.members;
                    delete saveData.public.room.password;
                    delete saveData.public.player;
                    delete saveData.public.chat;
                  }
                  zipList.push({
                    fileName: zipFile.name,
                    saveData: saveData
                  });
                  resolve();
                });
            });
          })
      );
      Promise.all(promiseList).then(() => {
        rootState.private.display.dropZipWindow.zipList = zipList;
        rootState.private.display.dropZipWindow.isRoomCreate = isRoomCreate;
        dispatch("windowOpen", "private.display.dropZipWindow");
      });
    },

    /** ========================================================================
     *
     * @param dispatch
     * @param commit
     * @param rootState
     * @param rootGetters
     * @param publicData
     * @param dataVersion
     * @param delKeyList
     * @param addObjList
     * @param dropZipRoomCreate
     */
    doImport(
      {
        dispatch,
        commit,
        rootState,
        rootGetters
      }: { dispatch: Function; commit: any; rootState: any; rootGetters: any },
      {
        publicData,
        dataVersion,
        delKeyList,
        addObjList,
        dropZipRoomCreate
      }: {
        publicData: any;
        dataVersion: string;
        delKeyList: string[];
        addObjList: any[];
        dropZipRoomCreate: boolean;
      }
    ) {
      const importFunc = () => {
        // FIXME チャットデータは上書きでいいの…かな？（差分方式がいい気もしている
        dispatch("setProperty", {
          property: "public",
          value: publicData,
          isNotice: true,
          logOff: true
        }).then(() => {
          dispatch("setInitiativeParams", {
            format: rootState.public.initiative.rowStr.trim()
          });
        });

        delKeyList.forEach(delKey => {
          dispatch("delObj", delKey);
        });

        // 画像のみを先行して追加し、割り振られるkeyを他のオブジェクトから参照させる
        const imageAddPromiseList: PromiseLike<any>[] = addObjList
          .filter(addObj => addObj.key.split("-")[0] === "image")
          .map(addObj =>
            dispatch("addImage", {
              tag: addObj.tag,
              data: addObj.data,
              owner: addObj.owner
            })
          );

        return Promise.all([...imageAddPromiseList]).then(
          (imageList: string[]) => {
            // 画像を全て読み込み終えたら、他のオブジェクトの追加を処理する
            const otherObjectPromiseList = addObjList
              // 画像以外を処理対象とする
              .filter(addObj => addObj.key.split("-")[0] !== "image")
              .map(addObj => {
                const type = addObj.key.split("-")[0];

                // image参照の差分ロード
                let useImageList: string = addObj.useImageList;
                if (useImageList) {
                  useImageList.split("|").forEach(useImage => {
                    const matchResult = useImage.match(/image-\$([0-9]+)/);
                    if (matchResult) {
                      useImageList = useImageList.replace(
                        matchResult[0],
                        imageList[parseInt(matchResult[1])]
                      );
                    }
                  });
                }
                addObj.useImageList = useImageList;

                // グループチャットデータのロード
                if (type === "groupTargetTab") {
                  rootGetters.groupTargetTab.list.push({
                    key: `groupTargetTab-${++rootGetters.groupTargetTab
                      .maxKey}`,
                    isSecret: addObj.isSecret,
                    name: addObj.name,
                    targetTab: addObj.targetTab,
                    isAll: addObj.isAll,
                    group: addObj.group
                  });
                  return;
                }

                delete addObj.key;

                // リストに追加
                return dispatch("addListObj", addObj);
              });
            return Promise.all(otherObjectPromiseList);
          }
        );
      };

      const roomName = publicData.room.name;
      if (!dropZipRoomCreate) {
        // 部屋を作らないシンプルなロード
        importFunc().then(() => {});
        return;
      }
      if (!publicData.room) {
        // 部屋を作る操作なのにセーブデータに部屋情報が含まれてないならここで終わり
        alert("部屋情報が含まれていません。\n処理を中断します。");
        return;
      }
      dispatch("loading", true);
      // セーブデータに部屋情報があるなら、入室処理を行う
      const checkFunc = (roomName: string) => {
        // 部屋の存在チェック
        Promise.resolve()
          .then(() => dispatch("simpleJoinRoom", { roomName: roomName }))
          .then(peerId => {
            // const logTexts = [];
            // logTexts.push(`create room by peer:"${peerId}"`);
            // logTexts.push(`本番: ${rootGetters.peerId(false)}`);
            // logTexts.push(`待ち: ${rootGetters.peerId(true)}`);
            // window.console.log(logTexts.join(", "));
            return dispatch("checkRoomName", { roomName: roomName });
          })
          .then((isExist: boolean) => {
            if (isExist) {
              // 既存部屋と部屋名が衝突しちゃったら回避する
              const msg: string[] = [];
              msg.push(`部屋「${roomName}」は既に存在します。`);
              msg.push(`部屋名を変更して再挑戦しますか？`);
              const result = window.confirm(msg.join("\n"));
              if (result) {
                const inputRoomNameFunc = (): string | null => {
                  const inputStr: string | null = window.prompt("新規部屋名");
                  if (inputStr === null) {
                    if (window.confirm("ロードを中止しますか？")) return null;
                  }
                  return inputStr || inputRoomNameFunc();
                };
                const newRoomName = inputRoomNameFunc();
                if (!newRoomName) return;

                checkFunc(newRoomName);
              }
              return;
            }

            // データインポート
            importFunc()
              .then(
                () =>
                  new Promise((resolve: Function) => {
                    // プレイヤー情報を入力してもらう
                    dispatch("setProperty", {
                      property: "private.display.inputPlayerInfoWindow",
                      value: {
                        roomName: roomName,
                        playerName: "",
                        playerPassword: "",
                        playerType: "PL",
                        fontColor: "#000000",
                        resolve: resolve
                      },
                      logOff: true
                    });
                    dispatch(
                      "windowOpen",
                      "private.display.inputPlayerInfoWindow"
                    );
                  })
              )
              // プレイヤー情報を入力してもらったら部屋を新規作成して入室する
              .then((payload: any) =>
                dispatch("doNewRoom", {
                  roomName: roomName,
                  roomPassword: publicData.room.password || "",
                  playerName: payload.playerName,
                  playerPassword: payload.playerPassword,
                  playerType: payload.playerType || "PL",
                  fontColor: payload.fontColor
                })
              )
              .then(() => dispatch("loading", false))
              .catch(() => dispatch("loading", false));
          });
      };
      checkFunc(roomName);
    }
  }
};
