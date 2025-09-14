/**
 * タイマー状態管理クラス
 * 3分間のタイマー機能を提供
 */
class Timer {
    constructor() {
        this.duration = 180; // 3分 = 180秒
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
        
        // 完了時の特別な処理
        this.handleCompletion();
        
        if (this.onComplete) {
            this.onComplete();
        }

        console.log('タイマーが完了しました');
    }

    /**
     * 完了時の特別な処理
     */
    handleCompletion() {
        // 完了音を再生
        this.playCompletionSound();
        
        // 完了アニメーションを開始
        this.startCompletionAnimation();
        
        // ステータスを更新
        this.updateCompletionStatus();
    }

    /**
     * 完了音を再生
     */
    playCompletionSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // 3つの音で完了を表現
            oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.2); // E5
            oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.4); // G5
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.8);
        } catch (error) {
            console.log('完了音の再生に失敗しました:', error);
        }
    }

    /**
     * 完了アニメーションを開始
     */
    startCompletionAnimation() {
        const container = document.querySelector('.container');
        if (container) {
            container.classList.add('timer-complete');
            
            // 3秒後にアニメーションを削除
            setTimeout(() => {
                container.classList.remove('timer-complete');
            }, 3000);
        }
    }

    /**
     * 完了ステータスを更新
     */
    updateCompletionStatus() {
        const statusElement = document.getElementById('status');
        if (statusElement) {
            statusElement.innerHTML = '🎉 <strong>タイマー完了！</strong><br>お疲れ様でした！';
            statusElement.style.fontSize = '1.3rem';
            statusElement.style.color = '#FFD700';
        }
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
