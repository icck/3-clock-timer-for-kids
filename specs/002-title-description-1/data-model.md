# Data Model: 幼稚園児向け直感的タイマー

## エンティティ定義

### Timer
**目的**: 3分間のカウントダウン機能を管理

**属性**:
- `duration`: number (180秒)
- `remainingTime`: number (残り時間)
- `isRunning`: boolean (動作状態)
- `currentMinute`: number (現在の分 0-2)
- `startTime`: Date (開始時刻)

**状態遷移**:
- STOPPED → RUNNING (start)
- RUNNING → STOPPED (stop/reset)
- RUNNING → COMPLETED (timeout)

### Block
**目的**: 時間の経過を視覚的に表現する個別要素

**属性**:
- `id`: string (一意識別子)
- `minute`: number (所属する分 0-2)
- `index`: number (分内での位置 0-59)
- `isVisible`: boolean (表示状態)
- `color`: string (色コード)

**関係**:
- BlockSection に属する (1:1)

### BlockSection
**目的**: 1分間を表す60個のブロックの集合体

**属性**:
- `minute`: number (分 0-2)
- `color`: string (セクション色)
- `blocks`: Block[] (60個のブロック)
- `isActive`: boolean (現在アクティブか)

**関係**:
- Timer に属する (1:3)
- Block を含む (1:60)

### ColorScheme
**目的**: 各分に対応する色の定義

**属性**:
- `minute0`: string (1分目の色)
- `minute1`: string (2分目の色)
- `minute2`: string (3分目の色)

**定数値**:
- minute0: "#4CAF50" (緑)
- minute1: "#FF9800" (オレンジ)
- minute2: "#F44336" (赤)

## データフロー

### タイマー開始時
1. Timer.isRunning = true
2. Timer.startTime = now()
3. Timer.remainingTime = 180
4. BlockSection[0].isActive = true
5. 全Block.isVisible = true

### 1秒経過時
1. Timer.remainingTime -= 1
2. 現在のBlockSectionから1個のBlockを削除
3. Block.isVisible = false

### 分の切り替え時
1. 前のBlockSection.isActive = false
2. 次のBlockSection.isActive = true
3. 新しいBlockSectionの色を適用

### タイマー完了時
1. Timer.isRunning = false
2. 全BlockSection.isActive = false
3. 完了アニメーション実行

## バリデーションルール

### Timer
- duration: 180秒固定
- remainingTime: 0-180の範囲
- currentMinute: 0-2の範囲

### Block
- index: 0-59の範囲
- minute: 0-2の範囲
- color: 有効なCSS色コード

### BlockSection
- blocks配列: 正確に60個
- minute: 0-2の範囲
- color: ColorSchemeで定義された色

## 状態管理

### アプリケーション状態
```javascript
{
  timer: {
    duration: 180,
    remainingTime: 180,
    isRunning: false,
    currentMinute: 0,
    startTime: null
  },
  blockSections: [
    {
      minute: 0,
      color: "#4CAF50",
      isActive: true,
      blocks: [/* 60個のBlock */]
    },
    {
      minute: 1,
      color: "#FF9800", 
      isActive: false,
      blocks: [/* 60個のBlock */]
    },
    {
      minute: 2,
      color: "#F44336",
      isActive: false,
      blocks: [/* 60個のBlock */]
    }
  ]
}
```

### イベント駆動更新
- タイマー開始: 状態リセット
- 1秒経過: ブロック削除
- 分切り替え: セクション変更
- タイマー完了: 完了状態
