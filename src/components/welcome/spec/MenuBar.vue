<template>
  <spec-frame property="menuBar" label-str="メインメニュー" lastVersion="1.0.0b3" :isSpecFixed="false">
    <!----------------------
     ! 起動操作
     !--------------------->
    <spec-item class-str="operation" label-str="起動操作">
      <li>画面上部に最初から表示されているメニュー</li>
    </spec-item>
    <!----------------------
     ! 仕様
     !--------------------->
    <spec-item class-str="spec" label-str="仕様">
      <li>角丸のボタンと展開型の選択肢で構成する</li>
      <li>項目は今後の機能増強に伴って増減する可能性あり<span class="unFixed">[仕様未確定事項]</span></li>
      <li>
        メニュー項目
        <ol>
          <li>
            展開型の選択肢
            <ol>
              <li>
                ファイル
                <ol>
                  <li><spec-link property="export" title-str="">セーブ</spec-link></li>
                  <li><spec-link property="import" title-str="">ロード</spec-link></li>
                </ol>
              </li>
              <li>
                表示
                <ol>
                  <li>
                    ウィンドウ
                    <ol>
                      <li><spec-link property="chatWindow" title-str="">チャット表示</spec-link></li>
                      <li><spec-link property="settingViewDice" title-str="">ダイス表示</spec-link></li>
                      <li><spec-link property="initiativeWindow" title-str="">イニシアティブ表示</spec-link></li>
                      <li><spec-link property="resourceWindow" title-str="">リソース表示</spec-link></li>
                      <li><spec-link property="chatPaletteWindow" title-str="">チャットパレット表示</spec-link></li>
                      <li><spec-link property="counterRemoteControlWindow" title-str="">カウンターリモコン表示</spec-link></li>
                    </ol>
                  </li>
                  <li><spec-link property="changeFontSizeWindow" title-str="">フォントサイズ調整</spec-link></li>
                  <li><spec-link property="resetAllWindow" title-str="">ウィンド配置初期化</spec-link></li>
                </ol>
              </li>
              <li>
                コマ
                <ol>
                  <li><spec-link property="addCharacterWindow" title-str="">キャラクター追加</spec-link></li>
                  <li><spec-link property="addRangeWindow" title-str="">範囲追加</spec-link></li>
                  <li><spec-link property="addChitWindow" title-str="">チット追加</spec-link></li>
                  <li><spec-link property="graveyardWindow" title-str="">墓場</spec-link></li>
                  <li><spec-link property="waitingRoomWindow" title-str="">キャラクター待合室</spec-link></li>
                </ol>
              </li>
              <li>
                マップ
                <ol>
                  <li><spec-link property="editMapWindow" title-str="">マップ変更</spec-link></li>
                  <li><spec-link property="editFloorTileMode" title-str="">フロアタイル変更モード</spec-link></li>
                  <li><spec-link property="addMapMaskWindow" title-str="">マップマスク追加</spec-link></li>
                  <li><spec-link property="createEasyMapWindow" title-str="">簡易マップ作成</spec-link></li>
                  <li><spec-link property="saveMapWindow" title-str="">マップ状態保存</spec-link></li>
                  <li><spec-link property="loadMapWindow" title-str="">マップ切り替え</spec-link></li>
                </ol>
              </li>
              <li>
                画像
                <ol>
                  <li><spec-link property="fileUploaderWindow" title-str="">ファイルアップローダー</spec-link></li>
                  <li><spec-link property="editImageTagWindow" title-str="">タグ編集</spec-link></li>
                  <li><spec-link property="deleteImageWindow" title-str="">画像削除</spec-link></li>
                </ol>
              </li>
              <li>
                ヘルプ
                <ol>
                  <li><spec-link property="welcomeWindowSpec" title-str="">ようこそ画面</spec-link></li>
                  <li><spec-link property="versionWindow" title-str="">バージョン</spec-link></li>
                  <li><spec-link property="manualWindow" title-str="">マニュアル</spec-link></li>
                  <li><spec-link property="officialSiteLink" title-str="">オフィシャルサイトへ</spec-link></li>
                </ol>
              </li>
            </ol>
          </li>
          <li><spec-link property="roomInfoWindow" title-str="「プレイルーム情報表示画面」の項へ">「プレイルーム情報表示」ボタン</spec-link></li>
          <li><spec-link property="addPublicMemoWindow" title-str="「共有メモ追加画面」の項へ">「共有メモ」ボタン</spec-link></li>
          <li><spec-link property="logout" title-str="「ログアウト」の項へ">「ログアウト」ボタン</spec-link></li>
        </ol>
      </li>
    </spec-item>
    <!----------------------
     ! 仕様
     !--------------------->
    <spec-item class-str="spec" label-str="展開型の選択肢の仕様">
      <li>初期表示の各項目を選択すると展開モードになる</li>
      <li>展開モード中はマウス移動に合わせて各選択肢が展開・格納される</li>
      <li>展開モードが解除されるのは初期表示の各項目を再度選択するか、画面を起動する選択肢を選択した場合</li>
    </spec-item>
    <!----------------------
     ! ユーザ要望
     !--------------------->
    <spec-item class-str="request" label-str="ユーザ要望">
      <li>なし</li>
    </spec-item>
    <!----------------------
     ! 未実装事項
     !--------------------->
    <spec-item class-str="unImplemented" label-str="未実装事項">
      <li>なし</li>
    </spec-item>
    <!----------------------
     ! 実装しない機能
     !--------------------->
    <spec-item class-str="unSupport" label-str="実装しない機能">
      <li>なし</li>
    </spec-item>
  </spec-frame>
</template>

<script>
import SpecMixin from "./SpecMixin";
export default { mixins: [SpecMixin] };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped src="./spec.css">
</style>
