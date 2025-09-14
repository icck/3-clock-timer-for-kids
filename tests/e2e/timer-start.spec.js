/**
 * タイマー開始のE2Eテスト
 * 新しいブロックシステム（180ブロック）のテスト
 */

describe('タイマー開始機能', () => {
    beforeEach(async () => {
        // アプリケーションを開く
        await page.goto('file:///Users/komoriissei/src/github.com/icck/3-clock-timer-for-kids/index.html');
        
        // ページの読み込み完了を待つ
        await page.waitForLoadState('networkidle');
    });

    test('タイマー開始時に180個のブロックが表示される', async () => {
        // スタートボタンをクリック
        await page.click('[data-testid="start-button"]');
        
        // 180個のブロックが表示されることを確認
        const blocks = await page.locator('.block').count();
        expect(blocks).toBe(180);
        
        // 3つのセクションが存在することを確認
        const sections = await page.locator('.block-section').count();
        expect(sections).toBe(3);
        
        // 各セクションに60個のブロックがあることを確認
        for (let i = 0; i < 3; i++) {
            const sectionBlocks = await page.locator(`.block-section[data-minute="${i}"] .block`).count();
            expect(sectionBlocks).toBe(60);
        }
    });

    test('タイマー開始時に1分目（緑色）のセクションがアクティブになる', async () => {
        // スタートボタンをクリック
        await page.click('[data-testid="start-button"]');
        
        // 1分目のセクションがアクティブであることを確認
        const firstSection = page.locator('.block-section[data-minute="0"]');
        await expect(firstSection).toHaveClass(/active/);
        
        // 1分目のブロックが緑色であることを確認
        const firstBlock = page.locator('.block-section[data-minute="0"] .block').first();
        await expect(firstBlock).toHaveCSS('background-color', 'rgb(76, 175, 80)'); // #4CAF50
    });

    test('タイマー開始時にボタンが「もう一度」に変わる', async () => {
        // スタートボタンをクリック
        await page.click('[data-testid="start-button"]');
        
        // ボタンのテキストが「もう一度」に変わることを確認
        const button = page.locator('[data-testid="restart-button"]');
        await expect(button).toBeVisible();
        await expect(button).toHaveText('もう一度');
        
        // スタートボタンが非表示になることを確認
        const startButton = page.locator('[data-testid="start-button"]');
        await expect(startButton).not.toBeVisible();
    });

    test('タイマー開始時にステータスが更新される', async () => {
        // スタートボタンをクリック
        await page.click('[data-testid="start-button"]');
        
        // ステータスが更新されることを確認
        const status = page.locator('#status');
        await expect(status).toContainText('タイマーが開始されました');
    });

    test('タイマー開始時に進捗バーが0%から開始される', async () => {
        // スタートボタンをクリック
        await page.click('[data-testid="start-button"]');
        
        // 進捗バーが0%であることを確認
        const progressText = page.locator('#progress-text');
        await expect(progressText).toHaveText('0%');
        
        const progressFill = page.locator('#progress-fill');
        await expect(progressFill).toHaveCSS('width', '0%');
    });
});
