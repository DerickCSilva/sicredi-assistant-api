const api = (() => {
    const endpoints = {
        message: '/api/message',
    };

    const makeRequest = (url, body) =>
        new Promise((resolve, reject) => {
            const http = new XMLHttpRequest(); // eslint-disable-line

            http.open(body ? 'POST' : 'GET', url, true);
            http.setRequestHeader('Content-type', 'application/json');
            http.send(body ? JSON.stringify(body) : null);
            http.onreadystatechange = () => {
                if (http.readyState === 4 && http.status === 200 && http.responseText) {
                    const response = JSON.parse(http.responseText);
                    resolve(response);
                }
            };

            http.onerror = (err) => reject(err);
        });

    const sendRequestMessage = (text, context) => {
        const payloadToChatbot = {};

        if (text) {
            payloadToChatbot.input = {
                text,
            };
        }

        if (context) {
            payloadToChatbot.context = context;
        }

        return makeRequest(endpoints.message, payloadToChatbot);
    };

    return { sendRequestMessage };
})();
