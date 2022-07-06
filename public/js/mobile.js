/* eslint-disable */
(() => {
    common.chatToggle(1);
    // Configurações iniciais do chat
    (() => {
        const chatSubmit = document.getElementById('chat-submit');
        const chatBody = document.getElementById('chat-box-body');
        const chatLogs = document.getElementById('log');

        chatBody.style.height = 'calc(100vh - 51px)';
    })();

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
            if (event.data === 'chatToggle') {
                common.chatToggle();
            } else if (event.data.indexOf('setParams') !== -1) {
                const initialParams = JSON.parse(
                    event.data.replace('setParams', '')
                );
                conversation.setParams(initialParams);
            }
        },
        false
    );
})();
