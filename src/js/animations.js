/**
 * アニメーション管理クラス
 * ブロックのアニメーション効果を管理
 */
class AnimationManager {
    constructor() {
        this.animations = new Map();
        this.isInitialized = false;
    }

    /**
     * アニメーション管理を初期化
     */
    init() {
        this.isInitialized = true;
        console.log('アニメーション管理を初期化しました');
    }

    /**
     * ブロックのフェードアウトアニメーション
     * @param {HTMLElement} block 対象ブロック
     * @param {number} duration アニメーション時間（ミリ秒）
     * @returns {Promise} アニメーション完了のPromise
     */
    fadeOutBlock(block, duration = config.FADE_OUT_DURATION) {
        return new Promise((resolve) => {
            if (!block) {
                resolve();
                return;
            }

            // アニメーションクラスを追加
            block.classList.add('block-fade-out');
            
            // アニメーション完了後に要素を非表示
            setTimeout(() => {
                block.style.display = 'none';
                block.classList.remove('block-fade-out');
                resolve();
            }, duration);
        });
    }

    /**
     * ブロックのパルスアニメーション
     * @param {HTMLElement} block 対象ブロック
     * @param {number} duration アニメーション時間（ミリ秒）
     */
    pulseBlock(block, duration = config.PULSE_DURATION) {
        if (!block) return;

        block.classList.add('block-pulse');
        
        setTimeout(() => {
            block.classList.remove('block-pulse');
        }, duration);
    }

    /**
     * ブロックのバウンスアニメーション
     * @param {HTMLElement} block 対象ブロック
     * @param {number} duration アニメーション時間（ミリ秒）
     */
    bounceBlock(block, duration = config.BOUNCE_DURATION) {
        if (!block) return;

        block.classList.add('block-bounce');
        
        setTimeout(() => {
            block.classList.remove('block-bounce');
        }, duration);
    }

    /**
     * 色の変化アニメーション
     * @param {HTMLElement} block 対象ブロック
     * @param {string} newColor 新しい色
     * @param {number} duration アニメーション時間（ミリ秒）
     * @returns {Promise} アニメーション完了のPromise
     */
    animateColorChange(block, newColor, duration = config.COLOR_CHANGE_DURATION) {
        return new Promise((resolve) => {
            if (!block) {
                resolve();
                return;
            }

            const oldColor = getComputedStyle(block).backgroundColor;
            
            // CSS変数を設定
            block.style.setProperty('--old-color', oldColor);
            block.style.setProperty('--new-color', newColor);
            
            // アニメーションクラスを追加
            block.classList.add('color-transition');
            
            setTimeout(() => {
                block.style.backgroundColor = newColor;
                block.classList.remove('color-transition');
                block.style.removeProperty('--old-color');
                block.style.removeProperty('--new-color');
                resolve();
            }, duration);
        });
    }

    /**
     * 複数のブロックの色を順次変更
     * @param {HTMLElement[]} blocks 対象ブロックの配列
     * @param {string} newColor 新しい色
     * @param {number} delay 各ブロック間の遅延（ミリ秒）
     * @param {number} duration アニメーション時間（ミリ秒）
     */
    animateMultipleColorChange(blocks, newColor, delay = config.MULTIPLE_COLOR_CHANGE_DELAY, duration = config.COLOR_CHANGE_DURATION) {
        blocks.forEach((block, index) => {
            setTimeout(() => {
                this.animateColorChange(block, newColor, duration);
            }, index * delay);
        });
    }

    /**
     * 完了時のお祝いアニメーション
     * @param {HTMLElement} container 対象コンテナ
     * @param {number} duration アニメーション時間（ミリ秒）
     */
    celebrationAnimation(container, duration = config.CELEBRATION_DURATION) {
        if (!container) return;

        container.classList.add('completion-celebration');
        
        setTimeout(() => {
            container.classList.remove('completion-celebration');
        }, duration);
    }

    /**
     * ブロックの連鎖アニメーション
     * @param {HTMLElement[]} blocks 対象ブロックの配列
     * @param {string} animationType アニメーションタイプ
     * @param {number} delay 各ブロック間の遅延（ミリ秒）
     */
    chainAnimation(blocks, animationType = 'pulse', delay = config.CHAIN_ANIMATION_DELAY) {
        blocks.forEach((block, index) => {
            setTimeout(() => {
                switch (animationType) {
                    case 'pulse':
                        this.pulseBlock(block);
                        break;
                    case 'bounce':
                        this.bounceBlock(block);
                        break;
                    case 'fadeOut':
                        this.fadeOutBlock(block);
                        break;
                }
            }, index * delay);
        });
    }

    /**
     * 進捗バーのアニメーション
     * @param {HTMLElement} progressBar 進捗バー要素
     * @param {number} progress 進捗値（0-1）
     * @param {number} duration アニメーション時間（ミリ秒）
     */
    animateProgress(progressBar, progress, duration = config.PROGRESS_ANIMATION_DURATION) {
        if (!progressBar) return;

        progressBar.style.transition = `width ${duration}ms ease-out`;
        progressBar.style.width = `${progress * 100}%`;
    }

    /**
     * アニメーションを停止
     * @param {HTMLElement} element 対象要素
     */
    stopAnimation(element) {
        if (!element) return;

        // すべてのアニメーションクラスを削除
        const animationClasses = [
            'block-fade-out',
            'block-pulse',
            'block-bounce',
            'color-transition',
            'completion-celebration'
        ];
        
        animationClasses.forEach(className => {
            element.classList.remove(className);
        });
        
        // インラインスタイルをリセット
        element.style.animation = 'none';
        element.style.transition = 'none';
    }

    /**
     * アニメーション管理を破棄
     */
    destroy() {
        this.animations.clear();
        this.isInitialized = false;
        console.log('アニメーション管理を破棄しました');
    }
}
