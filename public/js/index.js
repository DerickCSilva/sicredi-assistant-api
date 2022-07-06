/* eslint-disable */
(() => {
    // Configurações iniciais do chat
    (() => {
        const chatHeader = document.getElementById('chat-box-header');
        const chatSubmit = document.getElementById('chat-submit');
        const chatLogs = document.getElementById('log');
    })();

    document.getElementById('chat-box-header').onclick = (e) => {
        common.chatToggle();
    };

    document.getElementById('btnNewChat').onclick = (e) => {
        parent.postMessage('restartChat', '*');
    };

    // Descomentar o código abaixo caso eles peçam para adicionar o botão de download da conversa
    document.getElementById('btnDownloadConversation').onclick = (e) => {
        conversation.downloadConversation();
    };

    document.getElementById('chat-submit').onclick = (e) => {
        e.preventDefault();

        const input = document.getElementById('chat-input');
        const msg = input.value;
        if (msg.trim() == '') {
            return false;
        }

        input.value = '';

        conversation.displayTextOutput(msg, 'from-user');
        conversation.sendMessage(msg);
    };

    window.addEventListener(
        'message',
        (event) => {
            if (event.data == 'chatToggle') {
                common.chatToggle();
            } else if (event.data.indexOf('setParams') != -1) {
                const initialParams = JSON.parse(
                    event.data.replace('setParams', '')
                );
                conversation.setParams(initialParams);
            }
        },
        false
    );
})();
