const TOTAL_BLOCKS = 180;
const BLOCKS_PER_MINUTE = 60;
const TOTAL_MINUTES = 3;

/**
 * ブロック管理クラス
 * タイマーの視覚的表現としてブロックを管理
 */
class BlockManager {
    constructor() {
        this.container = document.getElementById('blocks-container');
        this.blocks = [];
        this.totalBlocks = TOTAL_BLOCKS; // 3分 = 180個のブロック（1秒ごと）
        this.removedBlocks = 0;
        this.currentMinute = 0;
    }

    /**
     * ブロック管理を初期化
     */
    init() {
        this.createBlocks();
        console.log(`${this.totalBlocks}個のブロックを作成しました`);
    }

    /**
     * ブロックを作成
     */
    createBlocks() {
        this.container.innerHTML = '';
        this.blocks = [];

        // 3つのセクション（各60ブロック）を作成
        for (let minute = 0; minute < TOTAL_MINUTES; minute++) {
            const section = this.createBlockSection(minute);
            this.container.appendChild(section);
            
            // 各セクションに60個のブロックを作成
            for (let i = 0; i < BLOCKS_PER_MINUTE; i++) {
                const block = this.createBlock(minute * BLOCKS_PER_MINUTE + i, minute);
                this.blocks.push(block);
                section.appendChild(block);
            }
        }
    }

    /**
     * ブロックセクションを作成
     * @param {number} minute 分（0-2）
     * @returns {HTMLElement} セクション要素
     */
    createBlockSection(minute) {
        const section = document.createElement('div');
        section.className = 'block-section';
        section.dataset.minute = minute;
        section.dataset.testid = `block-section-${minute}`;
        
        // 1分目のみアクティブ
        if (minute === 0) {
            section.classList.add('active');
        }
        
        return section;
    }

    /**
     * 個別のブロック要素を作成
     * @param {number} index ブロックのインデックス
     * @param {number} minute 所属する分（0-2）
     * @returns {HTMLElement} ブロック要素
     */
    createBlock(index, minute) {
        const block = document.createElement('div');
        block.className = 'block';
        block.dataset.index = index;
        block.dataset.minute = minute;
        block.dataset.testid = `block-${index}`;
        
        // 初期色を設定
        block.style.background = this.getColorForMinute(minute);
        
        return block;
    }

    /**
     * アニメーション管理システムを外部から設定
     * @param {AnimationManager} animationManager アニメーション管理インスタンス
     */
    setAnimationManager(animationManager) {
        this.animationManager = animationManager;
    }

    /**
     * 1秒ごとにブロックを1つ削除（上段→中段→下段の順で、各段内では右から左へ）
     */
    removeBlock() {
        if (this.removedBlocks >= this.totalBlocks) {
            return;
        }

        // 上段→中段→下段の順で削除
        // 上段（0-59）→ 中段（60-119）→ 下段（120-179）
        let blockIndex;
        
        if (this.removedBlocks < BLOCKS_PER_MINUTE) {
            // 上段: 右から左（59, 58, 57, ..., 0）
            blockIndex = (BLOCKS_PER_MINUTE - 1) - this.removedBlocks;
        } else if (this.removedBlocks < BLOCKS_PER_MINUTE * 2) {
            // 中段: 右から左（119, 118, 117, ..., 60）
            blockIndex = (BLOCKS_PER_MINUTE * 2 - 1) - (this.removedBlocks - BLOCKS_PER_MINUTE);
        } else {
            // 下段: 右から左（179, 178, 177, ..., 120）
            blockIndex = (TOTAL_BLOCKS - 1) - (this.removedBlocks - BLOCKS_PER_MINUTE * 2);
        }
        
        const block = this.blocks[blockIndex];
        
        if (block) {
            // ブロックに削除クラスを追加
            block.classList.add('removed');
            
            // アニメーション管理システムを使用してブロックを削除
            if (this.animationManager && typeof this.animationManager.fadeOutBlock === 'function') {
                this.animationManager.fadeOutBlock(block).then(() => {
                    block.style.display = 'none';
                });
            } else {
                // フォールバック: 通常のフェードアウト
                block.classList.add('fade-out');
                setTimeout(() => {
                    block.style.display = 'none';
                }, 300); // FALLBACK_FADE_OUT_DURATION is not defined here anymore
            }

            this.removedBlocks++;
            
            // 段の情報を表示
            let rowInfo = '';
            if (this.removedBlocks <= BLOCKS_PER_MINUTE) {
                rowInfo = `上段 (${this.removedBlocks}/${BLOCKS_PER_MINUTE})`;
            } else if (this.removedBlocks <= BLOCKS_PER_MINUTE * 2) {
                rowInfo = `中段 (${this.removedBlocks - BLOCKS_PER_MINUTE}/${BLOCKS_PER_MINUTE})`;
            } else {
                rowInfo = `下段 (${this.removedBlocks - BLOCKS_PER_MINUTE * 2}/${BLOCKS_PER_MINUTE})`;
            }
            
            console.log(`ブロック ${blockIndex + 1} を削除しました (${rowInfo}, 残り: ${this.totalBlocks - this.removedBlocks})`);
        }
    }

    /**
     * 1分ごとにブロックセクションの色を変更
     * @param {number} minute 現在の分（0-2）
     */
    updateBlockColors(minute) {
        if (minute === this.currentMinute) {
            return;
        }

        this.currentMinute = minute;
        const newColor = this.getColorForMinute(minute);

        // 前のセクションを非アクティブにする
        const previousSection = document.querySelector(`.block-section[data-minute="${this.currentMinute - 1}"]`);
        if (previousSection) {
            previousSection.classList.remove('active');
        }

        // 現在のセクションをアクティブにする
        const currentSection = document.querySelector(`.block-section[data-minute="${minute}"]`);
        if (currentSection) {
            currentSection.classList.add('active');
            currentSection.classList.add('color-transition');
        }

        // 残っているブロックの色を更新（アニメーション付き）
        const remainingBlocks = this.blocks.filter((block, index) => 
            index >= this.removedBlocks && block.style.display !== 'none'
        );

        // 通常の色変更
        remainingBlocks.forEach(block => {
            block.style.background = newColor;
        });

        console.log(`ブロックの色を分 ${minute} の色に変更しました`);
    }

    /**
     * 分に応じた色を取得
     * @param {number} minute 分（0-2）
     * @returns {string} 色の値
     */
    getColorForMinute(minute) {
        const colors = [
            'linear-gradient(135deg, #4CAF50, #66BB6A)', // 0分: 緑グラデーション
            'linear-gradient(135deg, #FF9800, #FFB74D)', // 1分: オレンジグラデーション
            'linear-gradient(135deg, #F44336, #EF5350)'  // 2分: 赤グラデーション
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
