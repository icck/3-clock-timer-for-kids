/**
 * 色管理クラス
 * タイマーの分に応じてブロックの色を管理
 */
class ColorManager {
    constructor() {
        this.colors = [
            {
                minute: 0,
                name: '緑',
                value: '#4CAF50',
                description: '開始の色'
            },
            {
                minute: 1,
                name: 'オレンジ',
                value: '#FF9800',
                description: '中間の色'
            },
            {
                minute: 2,
                name: '赤',
                value: '#F44336',
                description: '終了間近の色'
            }
        ];
        
        this.currentMinute = 0;
    }

    /**
     * 指定された分の色を取得
     * @param {number} minute 分（0-2）
     * @returns {string} 色の値
     */
    getColor(minute) {
        const colorData = this.colors.find(c => c.minute === minute);
        return colorData ? colorData.value : this.colors[0].value;
    }

    /**
     * 指定された分の色情報を取得
     * @param {number} minute 分（0-2）
     * @returns {Object} 色情報オブジェクト
     */
    getColorInfo(minute) {
        return this.colors.find(c => c.minute === minute) || this.colors[0];
    }

    /**
     * 現在の分の色を取得
     * @returns {string} 現在の色の値
     */
    getCurrentColor() {
        return this.getColor(this.currentMinute);
    }

    /**
     * 現在の分を設定
     * @param {number} minute 分（0-2）
     */
    setCurrentMinute(minute) {
        if (minute !== this.currentMinute) {
            const oldColor = this.getCurrentColor();
            this.currentMinute = minute;
            const newColor = this.getCurrentColor();
            
            console.log(`色を変更: ${oldColor} → ${newColor} (分: ${minute})`);
        }
    }

    /**
     * 色の変化をアニメーション付きで適用
     * @param {HTMLElement} element 対象要素
     * @param {string} newColor 新しい色
     * @param {number} duration アニメーション時間（ミリ秒）
     */
    animateColorChange(element, newColor, duration = 500) {
        if (!element) return;

        const oldColor = element.style.backgroundColor;
        
        // 色の変化をアニメーション
        element.style.transition = `background-color ${duration}ms ease-in-out`;
        element.style.backgroundColor = newColor;
        
        // アニメーション完了後にトランジションをリセット
        setTimeout(() => {
            element.style.transition = '';
        }, duration);
    }

    /**
     * 複数の要素の色を一括変更
     * @param {HTMLElement[]} elements 対象要素の配列
     * @param {string} newColor 新しい色
     * @param {number} duration アニメーション時間（ミリ秒）
     */
    animateMultipleColorChange(elements, newColor, duration = 500) {
        elements.forEach((element, index) => {
            // 少しずつ遅延させて波のような効果を作る
            setTimeout(() => {
                this.animateColorChange(element, newColor, duration);
            }, index * 50);
        });
    }

    /**
     * 色のグラデーションを生成
     * @param {string} startColor 開始色
     * @param {string} endColor 終了色
     * @param {number} steps ステップ数
     * @returns {string[]} グラデーション色の配列
     */
    generateGradient(startColor, endColor, steps = 10) {
        const colors = [];
        
        // 色をRGBに変換
        const startRGB = this.hexToRgb(startColor);
        const endRGB = this.hexToRgb(endColor);
        
        for (let i = 0; i < steps; i++) {
            const ratio = i / (steps - 1);
            const r = Math.round(startRGB.r + (endRGB.r - startRGB.r) * ratio);
            const g = Math.round(startRGB.g + (endRGB.g - startRGB.g) * ratio);
            const b = Math.round(startRGB.b + (endRGB.b - startRGB.b) * ratio);
            
            colors.push(`rgb(${r}, ${g}, ${b})`);
        }
        
        return colors;
    }

    /**
     * 16進数色をRGBに変換
     * @param {string} hex 16進数色（#RRGGBB）
     * @returns {Object} RGB値
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    /**
     * 色の明度を調整
     * @param {string} color 色
     * @param {number} factor 明度係数（0-2、1が元の明度）
     * @returns {string} 調整された色
     */
    adjustBrightness(color, factor) {
        const rgb = this.hexToRgb(color);
        const r = Math.min(255, Math.round(rgb.r * factor));
        const g = Math.min(255, Math.round(rgb.g * factor));
        const b = Math.min(255, Math.round(rgb.b * factor));
        
        return `rgb(${r}, ${g}, ${b})`;
    }

    /**
     * すべての色情報を取得
     * @returns {Array} 色情報の配列
     */
    getAllColors() {
        return [...this.colors];
    }

    /**
     * 色管理をリセット
     */
    reset() {
        this.currentMinute = 0;
        console.log('色管理をリセットしました');
    }
}
