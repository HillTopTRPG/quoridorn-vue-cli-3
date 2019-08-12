<template>
  <spec-frame
    property="publicMemoSpec"
    label-str="共有メモ"
    lastVersion="1.0.0"
    :isSpecFixed="true"
  >
    <!----------------------
     ! 起動操作
     !--------------------->
    <spec-item class-str="operation" label-str="追加・設定方法">
      <li>
        画面上部メニューの「共有メモ」を選択することで画面上に１つ追加
      </li>
      <li>
        表示されたチップを右クリックして「編集」を選択
      </li>
      <li>
        「追加タブの名前」欄にタブの名前を入力してタブを追加
      </li>
      <li>
        赤背景に黒い歯車のボタンをクリックして追加する項目を追加
      </li>
      <li>
        閲覧許可を出すアクター（プレイヤー、もしくはキャラクター）を選択（誰も選択しなければ全員閲覧可能）
        <br />キャラクターだけ選べば、その所有者は自動的に閲覧可能。
        <br />プレイヤーが選べるのはGMや見学者への配慮
      </li>
    </spec-item>
    <!----------------------
     ! 仕様
     !--------------------->
    <spec-item class-str="spec" label-str="仕様">
      <li>タブを追加可能</li>
      <li>表裏がある</li>
      <li>表裏に閲覧権限を付与</li>
      <li>
        内容として以下の項目を追加できる
        <ul>
          <li>大見出し</li>
          <li>小見出し</li>
          <li>テキスト</li>
          <li>チェックボックス</li>
          <li>区切り線</li>
          <li>画像欄</li>
        </ul>
      </li>
    </spec-item>
    <!----------------------
     ! ユーザ要望
     !--------------------->
    <spec-item class-str="request" label-str="ユーザ要望">
      <li>表裏をつけてほしい</li>
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
