<template>
  <spec-frame
    property="standImageSpec"
    label-str="立ち絵"
    lastVersion="1.0.0"
    :isSpecFixed="false"
  >
    <!----------------------
     ! 起動操作
     !--------------------->
    <spec-item class-str="operation" label-str="起動操作">
      <li>
        チャット画面のアイコン<span class="icon-accessibility"></span>をクリック
      </li>
    </spec-item>
    <!----------------------
     ! 仕様
     !--------------------->
    <spec-item class-str="spec" label-str="仕様 - 操作">
      <li>
        アクターを選択する
      </li>
      <li>状態を選択(既存) or 入力(新規)する</li>
      <li>
        データを個別設定にすると立ち絵データを設定できるようになる。<br />
        （状態「◆」は必要最低限の設定のため編集不可）
      </li>
      <li>「ベース」の画像枠をクリックし、画像を選択する。</li>
      <li>「差分追加」ボタンをクリックし、差分画像の枠を追加する</li>
      <li>追加された差分画像の枠をクリックし、差分画像を設定する</li>
      <li>
        アニメーション全体にかかる秒数や、差分画像を表示する時間を設定する
      </li>
      <li>
        対象のアクターで該当の状態でチャットすると、立ち絵が表示される。
      </li>
    </spec-item>
    <!----------------------
     ! 仕様
     !--------------------->
    <spec-item class-str="spec" label-str="仕様 - 詳細">
      <li>
        画像ファイル名を<br />
        ベース画像：ファイル名.拡張子<br />
        差分画像：ファイル名__画像処理方法(0: 重ねる,
        1:置換)_X座標(通常)_Y座標(通常)_X座標(反転時)_Y座標(反転時)_表示時間(開始%)
        0~100_表示時間(終了%) 0~100.拡張子<br />
        としておくと、ベース画像選択時に自動的に差分画像も設定される。<br /><br />
        例）ベース画像_0_12_24_78_24_30_80.png<br />
        → 未反転状態では座標(12, 24)の位置に30%~80%の周期で重ねて表示する設定
      </li>
      <li>
        上記のようなファイル名での指定は、image.yamlの記述でも設定可能（フォーマットはimage.yaml参照）
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
    </spec-item>
  </spec-frame>
</template>

<script>
import SpecMixin from "./SpecMixin";
export default { mixins: [SpecMixin] };
</script>

<style scoped src="./spec.css"></style>
