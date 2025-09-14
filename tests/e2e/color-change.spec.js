/**
 * 色変更のE2Eテスト
 * 1分ごとの色変更機能のテスト
 */

describe('色変更機能', () => {
    beforeEach(async () => {
        // アプリケーションを開く
        await page.goto('file:///Users/komoriissei/src/github.com/icck/3-clock-timer-for-kids/index.html');
        
        // ページの読み込み完了を待つ
        await page.waitForLoadState('networkidle');
        
        // タイマーを開始
        await page.click('[data-testid="start-button"]');
    });

    test('1分目（0-59秒）は緑色のブロックが表示される', async () => {
        // 1分目のセクションが緑色であることを確認
        const firstSection = page.locator('.block-section[data-minute="0"]');
        await expect(firstSection).toHaveClass(/active/);
        
        // 1分目のブロックが緑色であることを確認
        const firstBlock = page.locator('.block-section[data-minute="0"] .block').first();
        await expect(firstBlock).toHaveCSS('background-color', 'rgb(76, 175, 80)'); // #4CAF50
    });

    test('2分目（60-119秒）はオレンジ色のブロックが表示される', async () => {
        // 60秒待機（1分目のセクション完了）
        await page.waitForTimeout(61000);
        
        // 2分目のセクションがアクティブになることを確認
        const secondSection = page.locator('.block-section[data-minute="1"]');
        await expect(secondSection).toHaveClass(/active/);
        
        // 2分目のブロックがオレンジ色であることを確認
        const secondBlock = page.locator('.block-section[data-minute="1"] .block').first();
        await expect(secondBlock).toHaveCSS('background-color', 'rgb(255, 152, 0)'); // #FF9800
    });

    test('3分目（120-179秒）は赤色のブロックが表示される', async () => {
        // 120秒待機（2分目のセクション完了）
        await page.waitForTimeout(121000);
        
        // 3分目のセクションがアクティブになることを確認
        const thirdSection = page.locator('.block-section[data-minute="2"]');
        await expect(thirdSection).toHaveClass(/active/);
        
        // 3分目のブロックが赤色であることを確認
        const thirdBlock = page.locator('.block-section[data-minute="2"] .block').first();
        await expect(thirdBlock).toHaveCSS('background-color', 'rgb(244, 67, 54)'); // #F44336
    });

    test('色変更時にアニメーションが実行される', async () => {
        // 60秒待機（色変更タイミング）
        await page.waitForTimeout(61000);
        
        // 色変更アニメーションが実行されることを確認
        const secondSection = page.locator('.block-section[data-minute="1"]');
        await expect(secondSection).toHaveClass(/color-transition/);
    });

    test('色変更時にセクションのアクティブ状態が更新される', async () => {
        // 初期状態：1分目がアクティブ
        let firstSection = page.locator('.block-section[data-minute="0"]');
        await expect(firstSection).toHaveClass(/active/);
        
        // 60秒後：2分目がアクティブ
        await page.waitForTimeout(61000);
        let secondSection = page.locator('.block-section[data-minute="1"]');
        await expect(secondSection).toHaveClass(/active/);
        await expect(firstSection).not.toHaveClass(/active/);
        
        // 120秒後：3分目がアクティブ
        await page.waitForTimeout(61000);
        let thirdSection = page.locator('.block-section[data-minute="2"]');
        await expect(thirdSection).toHaveClass(/active/);
        await expect(secondSection).not.toHaveClass(/active/);
    });

    test('色変更時にステータスが更新される', async () => {
        // 60秒待機
        await page.waitForTimeout(61000);
        
        // ステータスに2分目の情報が含まれることを確認
        const status = await page.locator('#status').textContent();
        expect(status).toContain('2分目');
    });

    test('色変更時に進捗バーの色が更新される', async () => {
        // 60秒待機
        await page.waitForTimeout(61000);
        
        // 進捗バーの色がオレンジに変わることを確認
        const progressFill = page.locator('#progress-fill');
        await expect(progressFill).toHaveCSS('background', /rgb\(255, 152, 0\)/);
    });
});
