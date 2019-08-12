<template>
  <spec-frame
    property="playerBoxSpec"
    label-str="プレイヤーボックス"
    lastVersion="1.0.0"
    :isSpecFixed="false"
  >
    <!----------------------
     ! 起動操作
     !--------------------->
    <spec-item class-str="operation" label-str="起動操作">
      <li>画面上部メニューの「表示」を選択</li>
      <li>「ウィンドウ」にカーソルをあてる</li>
      <li>「プレイヤーボックス表示」を選択</li>
    </spec-item>
    <!----------------------
     ! 仕様
     !--------------------->
    <spec-item class-str="spec" label-str="仕様">
      <li>
        セレクトボックスからプレイヤーを選ぶことで、そのプレイヤーが所持するオブジェクトの一覧を表示する。
      </li>
      <li>プレイヤーのチャット文字色を変更できる</li>
      <li>
        プレイヤーが所持するキャラクターのチャット文字色を変更できる
      </li>
      <li>「キャラクター待合室」を兼ねる</li>
      <li>「墓場」を兼ねる</li>
      <li>
        その他簡易的な設定変更機能を随時追加していく予定
      </li>
    </spec-item>
    <!----------------------
     ! ユーザ要望
     !--------------------->
    <spec-item class-str="request" label-str="ユーザ要望">
      <li>
        キャラクター待合室にいるキャラクターを編集したい
      </li>
    </spec-item>
    <!----------------------
     ! 未実装事項
     !--------------------->
    <spec-item class-str="unImplemented" label-str="未実装事項">
      <li>
        その他簡易的な設定変更機能<br />→ 便利そうな機能があれば追加していく。
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
