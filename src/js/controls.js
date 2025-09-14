/**
 * コントロール管理クラス
 * スタートボタンやリスタートボタンの機能を管理
 */
class ControlManager {
    constructor() {
        this.startButton = document.getElementById('start-button');
        this.restartButton = document.getElementById('restart-button');
        this.statusElement = document.getElementById('status');
        this.timer = null;
        this.blockManager = null;
        this.isInitialized = false;
    }

    /**
     * コントロール管理を初期化
     * @param {Timer} timer タイマーインスタンス
     * @param {BlockManager} blockManager ブロック管理インスタンス
     */
    init(timer, blockManager) {
        this.timer = timer;
        this.blockManager = blockManager;
        this.setupEventListeners();
        this.updateUI();
        this.isInitialized = true;
        
        console.log('コントロール管理を初期化しました');
    }

    /**
     * イベントリスナーを設定
     */
    setupEventListeners() {
        if (this.startButton) {
            this.startButton.addEventListener('click', () => {
                this.handleStart();
            });
        }

        if (this.restartButton) {
            this.restartButton.addEventListener('click', () => {
                this.handleRestart();
            });
        }

        // キーボードショートカット
        document.addEventListener('keydown', (event) => {
            this.handleKeyboard(event);
        });
    }

    /**
     * スタートボタンの処理
     */
    handleStart() {
        if (!this.isInitialized || !this.timer || !this.blockManager) {
            console.error('コントロール管理が初期化されていません');
            return;
        }

        if (this.timer.isRunning()) {
            console.log('タイマーは既に動作中です');
            return;
        }

        // タイマーを開始
        this.timer.start();
        
        // ブロック管理を開始
        this.startBlockRemoval();
        
        // UIを更新
        this.updateUI();
        
        // ステータスを更新
        this.updateStatus('タイマーが開始されました！');
        
        console.log('タイマーを開始しました');
    }

    /**
     * リスタートボタンの処理
     */
    handleRestart() {
        if (!this.isInitialized || !this.timer || !this.blockManager) {
            console.error('コントロール管理が初期化されていません');
            return;
        }

        // タイマーをリセット
        this.timer.reset();
        
        // ブロックをリセット
        this.blockManager.reset();
        
        // UIを更新
        this.updateUI();
        
        // ステータスを更新
        this.updateStatus('スタートボタンを押してタイマーを開始してください');
        
        console.log('タイマーをリセットしました');
    }

    /**
     * キーボードイベントの処理
     * @param {KeyboardEvent} event キーボードイベント
     */
    handleKeyboard(event) {
        // スペースキーでスタート/ストップ
        if (event.code === 'Space') {
            event.preventDefault();
            
            if (this.timer && this.timer.isRunning()) {
                this.handleRestart();
            } else {
                this.handleStart();
            }
        }
        
        // Enterキーでスタート
        if (event.code === 'Enter') {
            event.preventDefault();
            this.handleStart();
        }
        
        // Escapeキーでリセット
        if (event.code === 'Escape') {
            event.preventDefault();
            this.handleRestart();
        }
    }

    /**
     * ブロック削除を開始
     */
    startBlockRemoval() {
        // 5秒ごとにブロックを削除
        const blockInterval = setInterval(() => {
            if (!this.timer || !this.timer.isRunning()) {
                clearInterval(blockInterval);
                return;
            }

            this.blockManager.removeBlock();
            
            // 1分ごとに色を変更
            const currentMinute = this.timer.getCurrentMinute();
            this.blockManager.updateBlockColors(currentMinute);
            
            // タイマー完了チェック
            if (this.timer.getRemainingTime() <= 0) {
                clearInterval(blockInterval);
                this.handleTimerComplete();
            }
        }, 5000); // 5秒間隔
    }

    /**
     * タイマー完了の処理
     */
    handleTimerComplete() {
        this.updateStatus('🎉 タイマー完了！お疲れ様でした！');
        this.updateUI();
        
        // 完了音を再生（可能な場合）
        this.playCompletionSound();
        
        console.log('タイマーが完了しました');
    }

    /**
     * 完了音を再生
     */
    playCompletionSound() {
        try {
            // Web Audio APIを使用して音を生成
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('音の再生に失敗しました:', error);
        }
    }

    /**
     * UIを更新
     */
    updateUI() {
        if (!this.timer) return;

        const isRunning = this.timer.isRunning();
        const remainingTime = this.timer.getRemainingTime();
        
        // ボタンの表示/非表示
        if (this.startButton) {
            this.startButton.style.display = isRunning ? 'none' : 'block';
        }
        
        if (this.restartButton) {
            this.restartButton.style.display = isRunning ? 'block' : 'none';
        }
        
        // ボタンのテキストを更新
        if (this.startButton) {
            this.startButton.textContent = remainingTime === this.timer.duration ? 'スタート' : '再開';
        }
    }

    /**
     * ステータスを更新
     * @param {string} message ステータスメッセージ
     */
    updateStatus(message) {
        if (this.statusElement) {
            this.statusElement.textContent = message;
        }
    }

    /**
     * 進捗情報を更新
     */
    updateProgress() {
        if (!this.timer || !this.blockManager) return;

        const remainingTime = this.timer.getRemainingTime();
        const remainingBlocks = this.blockManager.getRemainingBlocks();
        const progress = this.timer.getProgress();
        
        const message = `残り時間: ${Math.floor(remainingTime / 60)}分${remainingTime % 60}秒 | 残りブロック: ${remainingBlocks}個 | 進捗: ${Math.round(progress * 100)}%`;
        
        this.updateStatus(message);
    }

    /**
     * コントロール管理を破棄
     */
    destroy() {
        if (this.startButton) {
            this.startButton.removeEventListener('click', this.handleStart);
        }
        
        if (this.restartButton) {
            this.restartButton.removeEventListener('click', this.handleRestart);
        }
        
        document.removeEventListener('keydown', this.handleKeyboard);
        
        this.isInitialized = false;
        console.log('コントロール管理を破棄しました');
    }
}
