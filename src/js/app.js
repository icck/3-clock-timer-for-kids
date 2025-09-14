/**
 * メインアプリケーションクラス
 * すべてのシステムを統合して管理
 */
class TimerApp {
    constructor() {
        this.timer = null;
        this.blockManager = null;
        this.colorManager = null;
        this.controlManager = null;
        this.animationManager = null;
        this.isInitialized = false;
    }

    /**
     * アプリケーションを初期化
     */
    init() {
        try {
            // 各システムを初期化
            this.initializeSystems();
            
            // システム間の連携を設定
            this.setupSystemIntegration();
            
            // イベントリスナーを設定
            this.setupEventListeners();
            
            this.isInitialized = true;
            console.log('タイマーアプリケーションを初期化しました');
            
        } catch (error) {
            console.error('アプリケーションの初期化に失敗しました:', error);
        }
    }

    /**
     * 各システムを初期化
     */
    initializeSystems() {
        // タイマーシステム
        this.timer = new Timer();
        
        // ブロック管理システム
        this.blockManager = new BlockManager();
        this.blockManager.init();
        
        // 色管理システム
        this.colorManager = new ColorManager();
        
        // ブロック管理に色管理システムを設定
        this.blockManager.setColorManager(this.colorManager);
        
        // アニメーション管理システム
        this.animationManager = new AnimationManager();
        this.animationManager.init();
        
        // ブロック管理にアニメーション管理システムを設定
        this.blockManager.setAnimationManager(this.animationManager);
        
        // コントロール管理システム
        this.controlManager = new ControlManager();
        this.controlManager.init(this.timer, this.blockManager);
    }

    /**
     * システム間の連携を設定
     */
    setupSystemIntegration() {
        // タイマーのコールバックを設定
        this.timer.onTick = (remainingTime) => {
            this.handleTimerTick(remainingTime);
        };
        
        this.timer.onComplete = () => {
            this.handleTimerComplete();
        };
    }

    /**
     * イベントリスナーを設定
     */
    setupEventListeners() {
        // ページの可視性変更を監視
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
        
        // ページの読み込み完了を監視
        window.addEventListener('load', () => {
            this.handlePageLoad();
        });
        
        // エラーハンドリング
        window.addEventListener('error', (event) => {
            this.handleError(event.error);
        });
    }

    /**
     * タイマーの1秒ごとの処理
     * @param {number} remainingTime 残り時間
     */
    handleTimerTick(remainingTime) {
        // 進捗を更新
        this.updateProgress();
        
        // 1分ごとに色を変更
        const currentMinute = this.timer.getCurrentMinute();
        if (currentMinute !== this.blockManager.currentMinute) {
            this.blockManager.updateBlockColors(currentMinute);
        }
    }

    /**
     * タイマー完了の処理
     */
    handleTimerComplete() {
        // ブロックがすべて削除されたことを確認
        if (this.blockManager.isComplete()) {
            // 完了アニメーションを実行
            this.animationManager.celebrationAnimation(
                document.querySelector('.container')
            );
            
            // ステータスを更新
            this.controlManager.updateStatus('🎉 タイマー完了！お疲れ様でした！');
            
            // リスタートボタンを表示
            this.controlManager.updateUI();
            
            // 完了音を再生
            this.playCompletionSound();
        }
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
     * 進捗を更新
     */
    updateProgress() {
        if (this.controlManager) {
            this.controlManager.updateProgress();
        }
        
        // 進捗バーを更新
        this.updateProgressBar();
    }

    /**
     * 進捗バーを更新
     */
    updateProgressBar() {
        if (!this.timer) return;

        const progress = this.timer.getProgress();
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        if (progressFill) {
            progressFill.style.width = `${progress * 100}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${Math.round(progress * 100)}%`;
        }
    }

    /**
     * ページの可視性変更を処理
     */
    handleVisibilityChange() {
        if (document.hidden) {
            console.log('ページが非表示になりました');
        } else {
            console.log('ページが表示されました');
        }
    }

    /**
     * ページの読み込み完了を処理
     */
    handlePageLoad() {
        console.log('ページの読み込みが完了しました');
        
        // 初期状態を設定
        if (this.controlManager) {
            this.controlManager.updateStatus('スタートボタンを押してタイマーを開始してください');
        }
    }

    /**
     * エラーを処理
     * @param {Error} error エラーオブジェクト
     */
    handleError(error) {
        console.error('アプリケーションエラー:', error);
        
        if (this.controlManager) {
            this.controlManager.updateStatus('エラーが発生しました。ページを再読み込みしてください。');
        }
    }

    /**
     * アプリケーションを開始
     */
    start() {
        if (!this.isInitialized) {
            this.init();
        }
        
        console.log('タイマーアプリケーションを開始しました');
    }

    /**
     * アプリケーションを停止
     */
    stop() {
        if (this.timer) {
            this.timer.stop();
        }
        
        console.log('タイマーアプリケーションを停止しました');
    }

    /**
     * アプリケーションをリセット
     */
    reset() {
        if (this.timer) {
            this.timer.reset();
        }
        
        if (this.blockManager) {
            this.blockManager.reset();
        }
        
        if (this.colorManager) {
            this.colorManager.reset();
        }
        
        console.log('タイマーアプリケーションをリセットしました');
    }

    /**
     * アプリケーションを破棄
     */
    destroy() {
        this.stop();
        
        if (this.controlManager) {
            this.controlManager.destroy();
        }
        
        if (this.animationManager) {
            this.animationManager.destroy();
        }
        
        this.isInitialized = false;
        console.log('タイマーアプリケーションを破棄しました');
    }
}

// アプリケーションを開始
document.addEventListener('DOMContentLoaded', () => {
    const app = new TimerApp();
    app.start();
    
    // グローバルに公開（デバッグ用）
    window.timerApp = app;
});
