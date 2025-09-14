/**
 * ブロック管理クラス
 * タイマーの視覚的表現としてブロックを管理
 */
class BlockManager {
    constructor() {
        this.container = document.getElementById('blocks-container');
        this.blocks = [];
        this.totalBlocks = 36; // 3分 = 180秒 ÷ 5秒 = 36ブロック
        this.removedBlocks = 0;
        this.currentMinute = 0;
        this.colorManager = null;
    }

    /**
     * ブロック管理を初期化
     */
    init() {
        this.createBlocks();
        this.setupColorManager();
        console.log(`${this.totalBlocks}個のブロックを作成しました`);
    }

    /**
     * ブロックを作成
     */
    createBlocks() {
        this.container.innerHTML = '';
        this.blocks = [];

        for (let i = 0; i < this.totalBlocks; i++) {
            const block = this.createBlock(i);
            this.blocks.push(block);
            this.container.appendChild(block);
        }
    }

    /**
     * 個別のブロック要素を作成
     * @param {number} index ブロックのインデックス
     * @returns {HTMLElement} ブロック要素
     */
    createBlock(index) {
        const block = document.createElement('div');
        block.className = 'block';
        block.dataset.index = index;
        block.textContent = index + 1;
        
        // 初期色を設定
        block.style.backgroundColor = this.getColorForMinute(0);
        
        return block;
    }

    /**
     * 色管理システムを設定
     */
    setupColorManager() {
        if (typeof ColorManager !== 'undefined') {
            this.colorManager = new ColorManager();
        }
    }

    /**
     * 色管理システムを外部から設定
     * @param {ColorManager} colorManager 色管理インスタンス
     */
    setColorManager(colorManager) {
        this.colorManager = colorManager;
    }

    /**
     * アニメーション管理システムを外部から設定
     * @param {AnimationManager} animationManager アニメーション管理インスタンス
     */
    setAnimationManager(animationManager) {
        this.animationManager = animationManager;
    }

    /**
     * 5秒ごとにブロックを1つ削除
     */
    removeBlock() {
        if (this.removedBlocks >= this.totalBlocks) {
            return;
        }

        const blockIndex = this.removedBlocks;
        const block = this.blocks[blockIndex];
        
        if (block) {
            // アニメーション管理システムを使用してブロックを削除
            if (this.animationManager && typeof this.animationManager.fadeOutBlock === 'function') {
                this.animationManager.fadeOutBlock(block, 500).then(() => {
                    block.style.display = 'none';
                });
            } else {
                // フォールバック: 通常のフェードアウト
                block.classList.add('fade-out');
                setTimeout(() => {
                    block.style.display = 'none';
                }, 300);
            }

            this.removedBlocks++;
            console.log(`ブロック ${blockIndex + 1} を削除しました (残り: ${this.totalBlocks - this.removedBlocks})`);
        }
    }

    /**
     * 1分ごとにブロックの色を変更
     * @param {number} minute 現在の分（0-2）
     */
    updateBlockColors(minute) {
        if (minute === this.currentMinute) {
            return;
        }

        this.currentMinute = minute;
        const newColor = this.getColorForMinute(minute);

        // 残っているブロックの色を更新（アニメーション付き）
        const remainingBlocks = this.blocks.filter((block, index) => 
            index >= this.removedBlocks && block.style.display !== 'none'
        );

        if (this.colorManager && typeof this.colorManager.animateMultipleColorChange === 'function') {
            // アニメーション付きで色を変更
            this.colorManager.animateMultipleColorChange(remainingBlocks, newColor, 100, 500);
        } else {
            // 通常の色変更
            remainingBlocks.forEach(block => {
                block.style.backgroundColor = newColor;
            });
        }

        console.log(`ブロックの色を分 ${minute} の色に変更しました`);
    }

    /**
     * 分に応じた色を取得
     * @param {number} minute 分（0-2）
     * @returns {string} 色の値
     */
    getColorForMinute(minute) {
        const colors = [
            '#4CAF50', // 0分: 緑
            '#FF9800', // 1分: オレンジ
            '#F44336'  // 2分: 赤
        ];
        
        return colors[minute] || colors[0];
    }

    /**
     * すべてのブロックをリセット
     */
    reset() {
        this.removedBlocks = 0;
        this.currentMinute = 0;
        this.createBlocks();
        console.log('ブロックをリセットしました');
    }

    /**
     * 残りのブロック数を取得
     * @returns {number} 残りのブロック数
     */
    getRemainingBlocks() {
        return this.totalBlocks - this.removedBlocks;
    }

    /**
     * ブロックの進捗を取得（0-1の値）
     * @returns {number} 進捗（0=開始、1=完了）
     */
    getProgress() {
        return this.removedBlocks / this.totalBlocks;
    }

    /**
     * ブロックがすべて削除されたかチェック
     * @returns {boolean} すべて削除された場合true
     */
    isComplete() {
        return this.removedBlocks >= this.totalBlocks;
    }
}
