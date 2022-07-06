/* eslint-disable */
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}

HTMLElement.prototype.fadeIn = function (milisseconds, display) {
    this.style.display = display || 'block';
    this.style.opacity = 0;

    const next = function () {
        const _this = this;

        this.style.opacity = parseFloat(this.style.opacity) + 0.01;
        if (this.style.opacity < 1) setTimeout(() => next.call(_this), milisseconds / 100);
        else return this;
    };

    next.call(this);
};

const widgetChatBot = (function () {
    let iframeChatBot;
    let initialParams;

    const urlString = window.location.href;
    const url = new URL(urlString);
    const position = url.searchParams.get('position');

    const restartChat = () => {
        const element = document.getElementById('widgetChatBot');
        element.parentNode.removeChild(element);

        init({ ...initialParams, startOpen: true });
        iframeChatBot.contentWindow.postMessage('chatToggle', '*');
    };

    const receiveMessage = (event) => {
        switch (event.data) {
            case 'chatToggle':
                chatToggle();
                break;
            case 'restartChat':
                restartChat();
                break;
            case 'showImage':
                showImage(event);
                break;
        }
    };

    const init = function (params) {
        initialParams = params;

        // Deixando setado variáveis padrões caso as outras estejam vazias
        params.position = position || (params.position ? params.position : 'right');

        iframeChatBot = document.createElement('iframe');
        iframeChatBot.setAttribute('id', 'widgetChatBot');
        iframeChatBot.classList.add('closed');

        let iframeUrl = params.domain;
        iframeUrl += position ? `&position=${position}` : `&position=${params.position}`;

        iframeChatBot.setAttribute('src', iframeUrl);

        if (position) {
            iframeChatBot.style[position] = '40px';
        } else {
            iframeChatBot.style[params.position] = '40px';
        }

        document.body.appendChild(iframeChatBot);

        iframeChatBot.onload = () => {
            iframeChatBot.fadeIn(500);
            iframeChatBot.contentWindow.postMessage(`setParams${JSON.stringify(params)}`, '*');
        };

        createModalImage();

        window.addEventListener('message', receiveMessage, false);
    };

    const chatToggle = function () {
        if (iframeChatBot.classList.contains('closed')) {
            iframeChatBot.classList.remove('closed');
        } else {
            iframeChatBot.classList.add('closed');
        }
    };

    const createModalImage = function () {
        modal = document.createElement('div');
        modal.classList.add('modalImg');
        modal.onclick = function () {
            modal.style.display = 'none';
        };

        modalClose = document.createElement('span');
        modalClose.classList.add('modalImg-close');
        modalClose.onclick = function () {
            modal.style.display = 'none';
        };

        modalImg = document.createElement('img');
        modalImg.classList.add('modalImg-content');

        modal.appendChild(modalClose);
        modal.appendChild(modalImg);
        document.body.appendChild(modal);
    };

    const showImage = (event) => {
        console.log(event);
        modal.style.display = 'block';
        modalImg.src = event.data.replace('showImage-', '');
    };

    return { init };
})();
