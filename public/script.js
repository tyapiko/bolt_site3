document.getElementById('apiBtn').addEventListener('click', async () => {
    const resultDiv = document.getElementById('apiResult');
    resultDiv.textContent = '読み込み中...';

    try {
        const response = await fetch('/api/hello');
        const data = await response.json();
        resultDiv.textContent = data.message;
    } catch (error) {
        resultDiv.textContent = 'エラーが発生しました: ' + error.message;
    }
});
