import axios from 'axios';

export async function httpRequestUtil(url, body = null, requestType = 'GET') {
    let responseData = [];
    try {
        // トークンを取得する（例: ローカルストレージから）
        const token = localStorage.getItem('token');

        // デフォルトのリクエストヘッダーを定義
        let headers = {
            ...(token && { Authorization: `Bearer ${token}` }) // トークンがあれば設定
        };

        // PUTリクエストならmultipart/form-data、それ以外はapplication/jsonを使う
        if (requestType === 'PUT') {
            headers['Content-Type'] = 'multipart/form-data';
        } else {
            headers['Content-Type'] = 'application/json';
        }

        // axiosのリクエスト設定
        let response;
        if (requestType === 'GET') {
            // GETリクエストはクエリパラメータのみ。bodyは不要。
            response = await axios.get(url, { headers });
        } else {
            // POST, PUT, DELETEなどはbodyを含める
            response = await axios({
                method: requestType,
                url: url,
                data: body,
                headers: headers,
            });
        }

        // レスポンスデータを取得
        if (response.data) {
            responseData = response.data;
        }
    } catch (err) {
        console.error('Error URL:' + url, err);
        throw err
    }

    return responseData;
}
