/**
 * ブロック削除のE2Eテスト
 * 1秒ごとのブロック削除機能のテスト
 */

describe('ブロック削除機能', () => {
    beforeEach(async () => {
        // アプリケーションを開く
        await page.goto('file:///Users/komoriissei/src/github.com/icck/3-clock-timer-for-kids/index.html');
        
        // ページの読み込み完了を待つ
        await page.waitForLoadState('networkidle');
        
        // タイマーを開始
        await page.click('[data-testid="start-button"]');
    });

    test('1秒後に1個のブロックが削除される', async () => {
        // 初期状態で180個のブロックがあることを確認
        let blocks = await page.locator('.block:not(.removed)').count();
        expect(blocks).toBe(180);
        
        // 1秒待機
        await page.waitForTimeout(1100);
        
        // 1個のブロックが削除されることを確認
        blocks = await page.locator('.block:not(.removed)').count();
        expect(blocks).toBe(179);
        
        // 削除されたブロックが非表示になることを確認
        const removedBlocks = await page.locator('.block.removed').count();
        expect(removedBlocks).toBe(1);
    });

    test('5秒後に5個のブロックが削除される', async () => {
        // 初期状態で180個のブロックがあることを確認
        let blocks = await page.locator('.block:not(.removed)').count();
        expect(blocks).toBe(180);
        
        // 5秒待機
        await page.waitForTimeout(5100);
        
        // 5個のブロックが削除されることを確認
        blocks = await page.locator('.block:not(.removed)').count();
        expect(blocks).toBe(175);
    });

    test('60秒後に1分目のセクションが完了し、2分目に移行する', async () => {
        // 1分目のセクションがアクティブであることを確認
        const firstSection = page.locator('.block-section[data-minute="0"]');
        await expect(firstSection).toHaveClass(/active/);
        
        // 60秒待機（1分目のセクション完了）
        await page.waitForTimeout(61000);
        
        // 2分目のセクションがアクティブになることを確認
        const secondSection = page.locator('.block-section[data-minute="1"]');
        await expect(secondSection).toHaveClass(/active/);
        
        // 1分目のセクションが非アクティブになることを確認
        await expect(firstSection).not.toHaveClass(/active/);
        
        // 1分目のブロックがすべて削除されることを確認
        const firstSectionBlocks = await page.locator('.block-section[data-minute="0"] .block:not(.removed)').count();
        expect(firstSectionBlocks).toBe(0);
    });

    test('ブロック削除時にアニメーションが実行される', async () => {
        // ブロック削除のアニメーションを監視
        const block = page.locator('.block').first();
        
        // アニメーション開始を待つ
        await page.waitForTimeout(1000);
        
        // ブロックにアニメーションクラスが適用されることを確認
        await expect(block).toHaveClass(/fade-out|removing/);
    });

    test('進捗バーがブロック削除に合わせて更新される', async () => {
        // 初期進捗が0%であることを確認
        let progressText = await page.locator('#progress-text').textContent();
        expect(progressText).toBe('0%');
        
        // 1秒待機
        await page.waitForTimeout(1100);
        
        // 進捗が更新されることを確認
        progressText = await page.locator('#progress-text').textContent();
        expect(progressText).not.toBe('0%');
        
        // 進捗バーの幅が更新されることを確認
        const progressFill = page.locator('#progress-fill');
        const width = await progressFill.evaluate(el => el.style.width);
        expect(width).not.toBe('0%');
    });

    test('残り時間がブロック削除に合わせて更新される', async () => {
        // 初期残り時間を確認
        let status = await page.locator('#status').textContent();
        expect(status).toContain('2分59秒');
        
        // 1秒待機
        await page.waitForTimeout(1100);
        
        // 残り時間が更新されることを確認
        status = await page.locator('#status').textContent();
        expect(status).toContain('2分58秒');
    });
});
