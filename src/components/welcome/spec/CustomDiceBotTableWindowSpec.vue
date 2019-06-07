<template>
  <spec-frame
    property="customDiceBotTableWindowSpec"
    label-str="ダイスボット用表管理"
    lastVersion="1.0.0b12"
    :isSpecFixed="false"
  >
    <!----------------------
     ! 起動操作
     !--------------------->
    <spec-item class-str="operation" label-str="起動操作">
      <li>チャット画面のアイコン<span class="icon-dice"></span>をクリック</li>
    </spec-item>
    <!----------------------
     ! 仕様
     !--------------------->
    <spec-item class-str="spec" label-str="仕様 - 操作">
      <li>
        新規作成ボタンでサンプルダイスボットを追加して編集画面を開く
      </li>
      <li>
        コピー作成ボタンで表の選択中のダイスボットを表末尾にコピーして、それを編集する編集画面を開く
      </li>
      <li>
        変更ボタンで表の選択中のダイスボットを編集する編集画面を開く
      </li>
      <li>
        削除ボタンで表の選択中のダイスボットを削除
      </li>
      <li>↑ボタンで選択した行を上に移動</li>
      <li>↓ボタンで選択した行を下に移動</li>
      <li>閉じるボタンでその画面を閉じる</li>
      <li>
        チャットされたら、独自ダイスボット表の上から順に一致（全角半角大文字小文字の違いは無視）するものを探して利用する
      </li>
    </spec-item>
    <!----------------------
     ! 仕様
     !--------------------->
    <spec-item class-str="spec" label-str="仕様 - 自鯖設定">
      <li>
        設定ファイル「conf/system/[ダイスボットのkey]/customDiceBot.yaml」を設置しておく。
      </li>
      <li>
        部屋のダイスボット」（チャット欄ではない）で、設置した設定ファイルに対応するダイスボットを選択する。
      </li>
      <li>
        表の区切り線の下にその設定ファイルに記載されているダイスボットが登録される。
      </li>
      <li>
        設定ファイル由来のダイスボットは編集しても、部屋のダイスボットが変更される度に初期化される（設定ファイルの内容を改めて利用する）
      </li>
      <li>
        部屋のダイスボットが変更されても設定ファイル由来のダイスボットが初期化されないデータを作るには、そのダイスボットのコピーを作成すること。
      </li>
      <li>
        設定ファイルに対応したダイスボットが「部屋のダイスボット」（チャット欄ではない）に設定されると、表の区切り線の下にその設定ファイルに記載されているダイスボットが登録される。
      </li>
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
    <!----------------------
     ! 関連項目
     !--------------------->
    <spec-item class-str="ref" label-str="関連項目">
      <li>
        <spec-link property="chatWindowSpec" title-str=""
          >チャット画面</spec-link
        >
      </li>
      <li>
        <spec-link property="editCustomDiceBotTableWindowSpec" title-str=""
          >ダイスボット表変更</spec-link
        >
      </li>
    </spec-item>
  </spec-frame>
</template>

<script>
import SpecMixin from "./SpecMixin";
export default { mixins: [SpecMixin] };
</script>

<style scoped src="./spec.css"></style>
