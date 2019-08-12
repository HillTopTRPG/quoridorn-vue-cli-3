<template>
  <spec-frame
    property="counterRemoconSpec"
    label-str="カウンターリモコン"
    lastVersion="1.0.0"
    :isSpecFixed="true"
  >
    <!----------------------
     ! 起動操作
     !--------------------->
    <spec-item class-str="operation" label-str="起動操作">
      <li>画面上部メニューの「表示」を選択</li>
      <li>「ウィンドウ」にカーソルをあてる</li>
      <li>「カウンターリモコン表示」を選択</li>
    </spec-item>
    <!----------------------
     ! 仕様
     !--------------------->
    <spec-item class-str="spec" label-str="仕様">
      <li>
        イニシアティブ表のカウンター（数値）を変更するためのボタン
      </li>
      <li>数値の変更をチャットに出力する</li>
      <li>ボタンを右クリックで内容を変更</li>
      <li>
        セーブ・ロードで個別にデータを扱う（どどんとふと互換性あり）
      </li>
      <li>
        修正値にはダイスロール（「2D8+2」など）が利用可能
      </li>
    </spec-item>
    <!----------------------
     ! ユーザ要望
     !--------------------->
    <spec-item class-str="request" label-str="ユーザ要望">
      <li>チャット出力先のタブを設定したい</li>
      <li>
        人数が多い時にキャラクター選択が画面からはみ出す
        <br />→ リモコンにキャラクターを設定できるようにすることで対応
      </li>
      <li>
        マップにカウンターリモコンボタンを配置したい
      </li>
    </spec-item>
    <!----------------------
     ! 未実装事項
     !--------------------->
    <spec-item class-str="unImplemented" label-str="未実装事項">
      <li>
        チャット出力先のタブを設定したい
        <br />→ 対応するが優先度低。初回リリースには含めない。
      </li>
      <li>
        マップにカウンターリモコンボタンを配置したい
        <br />→ 対応するが優先度低。初回リリースには含めない。
      </li>
      <li>
        セーブ・ロードで個別にデータを扱う（どどんとふと互換性あり）
        <br />→ 初回リリースには含めない。
      </li>
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
        <spec-link property="menuBar" title-str="">メインメニュー</spec-link>
      </li>
    </spec-item>
  </spec-frame>
</template>

<script>
import SpecMixin from "./SpecMixin";
export default { mixins: [SpecMixin] };
</script>

<style scoped src="./spec.css"></style>
