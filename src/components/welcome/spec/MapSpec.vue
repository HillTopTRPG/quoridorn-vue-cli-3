<template>
  <spec-frame
    property="mapSpec"
    label-str="マップ"
    lastVersion="1.0.0"
    :isSpecFixed="true"
  >
    <!----------------------
     ! 起動操作
     !--------------------->
    <spec-item class-str="operation" label-str="起動操作1">
      <li>画面上部メニューの「マップ」を選択</li>
      <li>「マップ変更」を選択</li>
    </spec-item>
    <!----------------------
     ! 起動操作
     !--------------------->
    <spec-item class-str="operation" label-str="起動操作2">
      <li>マップを右クリック</li>
      <li>
        表示されたメニューの「マップ変更」を選択
      </li>
    </spec-item>
    <!----------------------
     ! 仕様
     !--------------------->
    <spec-item class-str="spec" label-str="仕様">
      <li>
        画像選択 → 後述の「画像選択」の項参照
      </li>
      <li>縦横のマス数の指定</li>
      <li>マス目の色の指定</li>
      <li>余白部分のマス数の指定（縦横同じ）</li>
      <li>余白に付く罫線の太さの調整</li>
      <li>
        余白部分にマップ画像をぼかした画像を表示させるオプション
      </li>
      <li>
        余白部分に被せるカラーマスクの色（＋透明度）の選択
      </li>
      <li>
        余白部分に表示する方眼罫線の有無と色の選択
      </li>
      <li>最背面の背景の色の選択</li>
      <li>白地図にする</li>
      <li>マス目間隔の指定</li>
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
      <li>
        白地図にする<br />→ 色を選べる背景とする。初回リリースには含めない。
      </li>
      <li>マス目間隔の指定<br />→ 初回リリースには含めない</li>
    </spec-item>
    <!----------------------
     ! 実装しない機能
     !--------------------->
    <spec-item class-str="unSupport" label-str="実装しない機能">
      <li>どどんとふの「マス目を交互に」機能</li>
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
