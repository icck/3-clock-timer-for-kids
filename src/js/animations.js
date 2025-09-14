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
        this.setupCSSAnimations();
        this.isInitialized = true;
        console.log('アニメーション管理を初期化しました');
    }

    /**
     * CSSアニメーションを設定
     */
    setupCSSAnimations() {
        // 動的にCSSアニメーションを追加
        const style = document.createElement('style');
        style.textContent = `
            @keyframes blockFadeOut {
                0% { 
                    opacity: 1; 
                    transform: scale(1) rotate(0deg); 
                }
                50% { 
                    opacity: 0.5; 
                    transform: scale(1.1) rotate(180deg); 
                }
                100% { 
                    opacity: 0; 
                    transform: scale(0.8) rotate(360deg); 
                }
            }
            
            @keyframes blockPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            @keyframes blockBounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                60% { transform: translateY(-5px); }
            }
            
            @keyframes colorTransition {
                0% { background-color: var(--old-color); }
                100% { background-color: var(--new-color); }
            }
            
            @keyframes completionCelebration {
                0% { transform: scale(1) rotate(0deg); }
                25% { transform: scale(1.1) rotate(5deg); }
                50% { transform: scale(1.2) rotate(-5deg); }
                75% { transform: scale(1.1) rotate(5deg); }
                100% { transform: scale(1) rotate(0deg); }
            }
            
            .block-fade-out {
                animation: blockFadeOut 0.5s ease-in-out forwards;
            }
            
            .block-pulse {
                animation: blockPulse 0.3s ease-in-out;
            }
            
            .block-bounce {
                animation: blockBounce 0.6s ease-in-out;
            }
            
            .color-transition {
                animation: colorTransition 0.5s ease-in-out forwards;
            }
            
            .completion-celebration {
                animation: completionCelebration 1s ease-in-out;
            }
        `;
        
        document.head.appendChild(style);
    }

    /**
     * ブロックのフェードアウトアニメーション
     * @param {HTMLElement} block 対象ブロック
     * @param {number} duration アニメーション時間（ミリ秒）
     * @returns {Promise} アニメーション完了のPromise
     */
    fadeOutBlock(block, duration = 500) {
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
    pulseBlock(block, duration = 300) {
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
    bounceBlock(block, duration = 600) {
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
    animateColorChange(block, newColor, duration = 500) {
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
    animateMultipleColorChange(blocks, newColor, delay = 100, duration = 500) {
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
    celebrationAnimation(container, duration = 1000) {
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
    chainAnimation(blocks, animationType = 'pulse', delay = 50) {
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
    animateProgress(progressBar, progress, duration = 300) {
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
