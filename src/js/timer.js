/**
 * タイマー状態管理クラス
 * 3分間のタイマー機能を提供
 */
class Timer {
    constructor() {
        this.duration = config.TIMER_DURATION; // 3分 = 180秒
        this.remainingTime = this.duration;
        this._isRunning = false;
        this.intervalId = null;
        this.onTick = null;
        this.onComplete = null;
        this.startTime = null;
    }

    /**
     * タイマーを開始する
     */
    start() {
        if (this._isRunning) {
            return;
        }

        this._isRunning = true;
        this.startTime = Date.now();
        
        // 1秒ごとにタイマーを更新
        this.intervalId = setInterval(() => {
            this.tick();
        }, 1000);

        console.log('タイマーを開始しました');
    }

    /**
     * タイマーを停止する
     */
    stop() {
        if (!this._isRunning) {
            return;
        }

        this._isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        console.log('タイマーを停止しました');
    }

    /**
     * タイマーをリセットする
     */
    reset() {
        this.stop();
        this.remainingTime = this.duration;
        this.startTime = null;
        console.log('タイマーをリセットしました');
    }

    /**
     * タイマーの1秒ごとの処理
     */
    tick() {
        if (!this._isRunning) {
            return;
        }

        this.remainingTime--;
        
        // コールバック関数を呼び出し
        if (this.onTick) {
            this.onTick(this.remainingTime);
        }

        // タイマー完了チェック
        if (this.remainingTime <= 0) {
            this.complete();
        }
    }

    /**
     * タイマー完了処理
     */
    complete() {
        this.stop();
        
        if (this.onComplete) {
            this.onComplete();
        }

        console.log('タイマーが完了しました');
    }

    /**
     * タイマーが動作中かどうか
     * @returns {boolean} 動作中の場合true
     */
    isRunning() {
        return this._isRunning;
    }

    /**
     * 残り時間を取得
     * @returns {number} 残り時間（秒）
     */
    getRemainingTime() {
        return this.remainingTime;
    }

    /**
     * 経過時間を取得
     * @returns {number} 経過時間（秒）
     */
    getElapsedTime() {
        if (!this.startTime) {
            return 0;
        }
        return Math.floor((Date.now() - this.startTime) / 1000);
    }

    /**
     * タイマーの進捗を取得（0-1の値）
     * @returns {number} 進捗（0=開始、1=完了）
     */
    getProgress() {
        return (this.duration - this.remainingTime) / this.duration;
    }

    /**
     * 現在の分を取得
     * @returns {number} 現在の分（0-2）
     */
    getCurrentMinute() {
        return Math.floor((this.duration - this.remainingTime) / 60);
    }
}
