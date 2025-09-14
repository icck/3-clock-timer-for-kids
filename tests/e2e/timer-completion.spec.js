/**
 * タイマー完了のE2Eテスト
 * タイマー完了時の動作テスト
 */

describe('タイマー完了機能', () => {
    beforeEach(async () => {
        // アプリケーションを開く
        await page.goto('file:///Users/komoriissei/src/github.com/icck/3-clock-timer-for-kids/index.html');
        
        // ページの読み込み完了を待つ
        await page.waitForLoadState('networkidle');
        
        // タイマーを開始
        await page.click('[data-testid="start-button"]');
    });

    test('3分後にタイマーが完了する', async () => {
        // 3分（180秒）待機
        await page.waitForTimeout(181000);
        
        // タイマーが完了状態になることを確認
        const status = await page.locator('#status').textContent();
        expect(status).toContain('タイマー完了');
        
        // 完了アニメーションが表示されることを確認
        const container = page.locator('.container');
        await expect(container).toHaveClass(/timer-complete/);
    });

    test('完了時にすべてのブロックが削除される', async () => {
        // 3分（180秒）待機
        await page.waitForTimeout(181000);
        
        // すべてのブロックが削除されることを確認
        const visibleBlocks = await page.locator('.block:not(.removed)').count();
        expect(visibleBlocks).toBe(0);
        
        // 削除されたブロックが180個であることを確認
        const removedBlocks = await page.locator('.block.removed').count();
        expect(removedBlocks).toBe(180);
    });

    test('完了時に進捗バーが100%になる', async () => {
        // 3分（180秒）待機
        await page.waitForTimeout(181000);
        
        // 進捗バーが100%になることを確認
        const progressText = page.locator('#progress-text');
        await expect(progressText).toHaveText('100%');
        
        const progressFill = page.locator('#progress-fill');
        await expect(progressFill).toHaveCSS('width', '100%');
    });

    test('完了時に完了音が再生される', async () => {
        // 音声再生の監視
        let audioPlayed = false;
        await page.evaluateOnNewDocument(() => {
            const originalPlay = HTMLAudioElement.prototype.play;
            HTMLAudioElement.prototype.play = function() {
                audioPlayed = true;
                return originalPlay.call(this);
            };
        });
        
        // 3分（180秒）待機
        await page.waitForTimeout(181000);
        
        // 完了音が再生されることを確認
        expect(audioPlayed).toBe(true);
    });

    test('完了時に「もう一度」ボタンが表示される', async () => {
        // 3分（180秒）待機
        await page.waitForTimeout(181000);
        
        // 「もう一度」ボタンが表示されることを確認
        const restartButton = page.locator('[data-testid="restart-button"]');
        await expect(restartButton).toBeVisible();
        await expect(restartButton).toHaveText('もう一度');
        
        // スタートボタンが非表示になることを確認
        const startButton = page.locator('[data-testid="start-button"]');
        await expect(startButton).not.toBeVisible();
    });

    test('完了時にステータスが更新される', async () => {
        // 3分（180秒）待機
        await page.waitForTimeout(181000);
        
        // ステータスが完了メッセージに更新されることを確認
        const status = page.locator('#status');
        await expect(status).toContainText('🎉');
        await expect(status).toContainText('タイマー完了');
        await expect(status).toContainText('お疲れ様でした');
    });

    test('完了時に完了アニメーションが実行される', async () => {
        // 3分（180秒）待機
        await page.waitForTimeout(181000);
        
        // 完了アニメーションが実行されることを確認
        const container = page.locator('.container');
        await expect(container).toHaveClass(/timer-complete/);
        
        // アニメーション要素が表示されることを確認
        const animationElements = page.locator('.completion-animation');
        await expect(animationElements).toBeVisible();
    });

    test('「もう一度」ボタンでタイマーをリセットできる', async () => {
        // 3分（180秒）待機
        await page.waitForTimeout(181000);
        
        // 「もう一度」ボタンをクリック
        await page.click('[data-testid="restart-button"]');
        
        // タイマーがリセットされることを確認
        const status = await page.locator('#status').textContent();
        expect(status).toContain('スタートボタンを押して');
        
        // 進捗バーが0%にリセットされることを確認
        const progressText = page.locator('#progress-text');
        await expect(progressText).toHaveText('0%');
        
        // すべてのブロックが再表示されることを確認
        const blocks = await page.locator('.block:not(.removed)').count();
        expect(blocks).toBe(180);
    });
});
