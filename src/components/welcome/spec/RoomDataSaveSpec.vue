<template>
  <spec-frame
    property="roomDataSaveSpec"
    label-str="部屋データ保存機能"
    lastVersion="1.0.0"
    :isSpecFixed="true"
  >
    <!----------------------
     ! 起動操作
     !--------------------->
    <spec-item class-str="operation" label-str="起動操作１">
      <li>画面上部メニューの「ファイル」を選択</li>
      <li>「セーブ」を選択</li>
    </spec-item>
    <spec-item class-str="operation" label-str="起動操作２">
      <li>
        ショートカットで起動
        <ul>
          <li>Windowsの場合：Ctrl + s</li>
          <li>Macの場合：Command + s</li>
        </ul>
      </li>
    </spec-item>
    <!----------------------
     ! 仕様
     !--------------------->
    <spec-item class-str="spec" label-str="仕様">
      <li>
        その時点でのQuoridornの状態をzipファイルでダウンロード
      </li>
      <li>
        メニューから選択できるオプション
        <a href="#ref_menuOption_selectSaveData">「セーブデータの選択」</a>
        が有効の場合、zipファイルに含めるデータを選ぶ画面
        <a href="#ref_selectSaveDataWindow">「セーブデータ選択画面」</a>
        を表示する
      </li>
      <li>
        セーブデータを選択しない場合、すべての状態をzipファイルとしてダウンロードする
      </li>
      <li>
        画像や音楽のデータ部分、秘匿チャットの内容については暗号化を施す
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
      <li>Macの場合のショートカット<br />→ Macが買えたら実装する</li>
      <li>
        <a href="#ref_selectSaveDataWindow">「セーブデータ選択画面」</a>
        が未実装のため、画面表示機能がない
        <br />→ 初回リリースには含めない機能。
      </li>
      <li>データの暗号化<br />→ 初回リリースに含める機能。</li>
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
