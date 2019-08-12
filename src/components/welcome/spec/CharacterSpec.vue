<template>
  <spec-frame
    property="characterSpec"
    label-str="キャラクター"
    lastVersion="1.0.0"
    :isSpecFixed="true"
  >
    <!----------------------
     ! 起動操作
     !--------------------->
    <spec-item class-str="operation" label-str="起動操作１">
      <li>画面上部メニューの「コマ」を選択</li>
      <li>「キャラクター追加」を選択</li>
    </spec-item>
    <spec-item class-str="operation" label-str="起動操作２">
      <li>マップを右クリック</li>
      <li>
        表示されたメニューの「キャラクター追加」を選択
      </li>
    </spec-item>
    <!----------------------
     ! 仕様
     !--------------------->
    <spec-item class-str="spec" label-str="仕様">
      <li>
        画像選択 → 後述の「画像選択」の項参照
      </li>
      <li>
        画像切替設定（コマダブルクリックで画像を切替えるための設定）
      </li>
      <li>名前入力</li>
      <li>サイズ設定</li>
      <li>参照URLの指定</li>
      <li>マップマスクの下に隠す設定</li>
      <li>その他情報の指定</li>
      <li>イニシアティブ表の情報の入力</li>
      <li>
        「射界」の設定 → 後述の「射界」の項参照
      </li>
      <li>追加後に編集可能</li>
      <li>追加後に削除可能</li>
      <li>追加後にGMはオーナー権限を変更可</li>
    </spec-item>
    <!----------------------
     ! ユーザ要望
     !--------------------->
    <spec-item class-str="request" label-str="ユーザ要望">
      <li>
        画像指定時に回転させたい（画像を用意する枚数削減）
        <br />→ いずれ作りたい
      </li>
      <li>
        キャラに「ステータス」を持たせて、それをコマに表示させたい
        <br />→ いずれ作りたい
      </li>
    </spec-item>
    <!----------------------
     ! 未実装事項
     !--------------------->
    <spec-item class-str="unImplemented" label-str="未実装事項">
      <li>イニシアティブ表の情報の入力<br />→ いずれ作りたい</li>
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
