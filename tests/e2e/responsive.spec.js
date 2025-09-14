/**
 * レスポンシブデザインのE2Eテスト
 * 異なる画面サイズでの動作テスト
 */

describe('レスポンシブデザイン', () => {
    beforeEach(async () => {
        // アプリケーションを開く
        await page.goto('file:///Users/komoriissei/src/github.com/icck/3-clock-timer-for-kids/index.html');
        
        // ページの読み込み完了を待つ
        await page.waitForLoadState('networkidle');
    });

    test('デスクトップ（1200px以上）で適切に表示される', async () => {
        // デスクトップサイズに設定
        await page.setViewportSize({ width: 1200, height: 800 });
        
        // コンテナが適切なサイズで表示されることを確認
        const container = page.locator('.container');
        await expect(container).toBeVisible();
        
        // ブロックが適切なサイズで表示されることを確認
        const blocks = page.locator('.block');
        const firstBlock = blocks.first();
        const blockWidth = await firstBlock.evaluate(el => el.offsetWidth);
        expect(blockWidth).toBeGreaterThan(600); // デスクトップ用のサイズ
        
        // フォントサイズが適切であることを確認
        const fontSize = await firstBlock.evaluate(el => 
            window.getComputedStyle(el).fontSize
        );
        expect(parseInt(fontSize)).toBeGreaterThan(24); // デスクトップ用のフォントサイズ
    });

    test('タブレット（768px-1024px）で適切に表示される', async () => {
        // タブレットサイズに設定
        await page.setViewportSize({ width: 768, height: 1024 });
        
        // コンテナが適切に調整されることを確認
        const container = page.locator('.container');
        await expect(container).toBeVisible();
        
        // ブロックサイズが調整されることを確認
        const blocks = page.locator('.block');
        const firstBlock = blocks.first();
        const blockWidth = await firstBlock.evaluate(el => el.offsetWidth);
        expect(blockWidth).toBeLessThan(800); // タブレット用のサイズ
        expect(blockWidth).toBeGreaterThan(400);
        
        // フォントサイズが調整されることを確認
        const fontSize = await firstBlock.evaluate(el => 
            window.getComputedStyle(el).fontSize
        );
        expect(parseInt(fontSize)).toBeLessThan(48); // タブレット用のフォントサイズ
        expect(parseInt(fontSize)).toBeGreaterThan(16);
    });

    test('スマートフォン（480px以下）で適切に表示される', async () => {
        // スマートフォンサイズに設定
        await page.setViewportSize({ width: 375, height: 667 });
        
        // コンテナが適切に調整されることを確認
        const container = page.locator('.container');
        await expect(container).toBeVisible();
        
        // ブロックサイズが調整されることを確認
        const blocks = page.locator('.block');
        const firstBlock = blocks.first();
        const blockWidth = await firstBlock.evaluate(el => el.offsetWidth);
        expect(blockWidth).toBeLessThan(400); // スマートフォン用のサイズ
        
        // フォントサイズが調整されることを確認
        const fontSize = await firstBlock.evaluate(el => 
            window.getComputedStyle(el).fontSize
        );
        expect(parseInt(fontSize)).toBeLessThan(32); // スマートフォン用のフォントサイズ
    });

    test('横画面モードで適切に表示される', async () => {
        // 横画面サイズに設定
        await page.setViewportSize({ width: 1024, height: 600 });
        
        // コンテナが適切に調整されることを確認
        const container = page.locator('.container');
        await expect(container).toBeVisible();
        
        // ブロックが横画面に適応されることを確認
        const blocks = page.locator('.block');
        const firstBlock = blocks.first();
        const blockHeight = await firstBlock.evaluate(el => el.offsetHeight);
        expect(blockHeight).toBeLessThan(100); // 横画面用の高さ
    });

    test('画面サイズ変更時に動的に調整される', async () => {
        // デスクトップサイズから開始
        await page.setViewportSize({ width: 1200, height: 800 });
        
        const firstBlock = page.locator('.block').first();
        const desktopWidth = await firstBlock.evaluate(el => el.offsetWidth);
        
        // スマートフォンサイズに変更
        await page.setViewportSize({ width: 375, height: 667 });
        
        const mobileWidth = await firstBlock.evaluate(el => el.offsetWidth);
        
        // サイズが動的に調整されることを確認
        expect(mobileWidth).toBeLessThan(desktopWidth);
    });

    test('タッチデバイスで適切に操作できる', async () => {
        // タッチデバイスサイズに設定
        await page.setViewportSize({ width: 768, height: 1024 });
        
        // ボタンがタッチしやすいサイズであることを確認
        const startButton = page.locator('[data-testid="start-button"]');
        const buttonHeight = await startButton.evaluate(el => el.offsetHeight);
        expect(buttonHeight).toBeGreaterThan(44); // タッチしやすい最小サイズ
        
        // ボタンがタッチで操作できることを確認
        await startButton.tap();
        
        // タイマーが開始されることを確認
        const status = await page.locator('#status').textContent();
        expect(status).toContain('タイマーが開始されました');
    });

    test('高DPIディスプレイで適切に表示される', async () => {
        // 高DPIディスプレイをシミュレート
        await page.setViewportSize({ width: 1200, height: 800 });
        await page.evaluate(() => {
            Object.defineProperty(window, 'devicePixelRatio', {
                value: 2,
                writable: true
            });
        });
        
        // コンテナが適切に表示されることを確認
        const container = page.locator('.container');
        await expect(container).toBeVisible();
        
        // ブロックが適切に表示されることを確認
        const blocks = page.locator('.block');
        await expect(blocks).toBeVisible();
    });
});
