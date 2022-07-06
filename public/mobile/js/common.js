/* eslint-disable */
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}

HTMLElement.prototype.toggle = function () {
    this.style.display = this.style.display == 'none' ? '' : 'none';
    return this;
};

HTMLElement.prototype.fadeIn = function (milisseconds, display) {
    this.style.display = display || 'block';
    this.style.opacity = 0;

    const next = function () {
        const _this = this;

        this.style.opacity = parseFloat(this.style.opacity) + 0.01;
        if (this.style.opacity < 1)
            setTimeout(() => next.call(_this), milisseconds / 100);
        else return this;
    };

    next.call(this);
};

const common = (() => {
    const scrollToChatBottom = () => {
        const scrollingChat = document.getElementById('log');

        const elements = document.getElementsByClassName('chat-msg');
        const element = elements[elements.length - 1];

        if (element) {
            scrollingChat.scrollTop = element.offsetTop;
        }
    };

    const removeElement = (element) => {
        element.parentNode.removeChild(element);
    };

    const removeElementById = (elementId) => {
        const element = document.getElementById(elementId);
        removeElement(element);
    };

    const removeElementByClassName = (className) => {
        const elements = document.getElementsByClassName(className);
        for (let i = elements.length; i--;) {
            removeElement(elements[i]);
        }
    };

    const insertElement = (parentId, element) => {
        const parent = document.getElementById(parentId);
        return parent.appendChild(element);
    };

    const buildDomElementFromJson = (domJson) => {
        // Criando um elemento DOM com o nome de tag fornecido
        const element = document.createElement(domJson.tagName);

        // Preenchendo o "conteúdo" do elemento
        if (domJson.text) {
            element.innerHTML = domJson.text;
        } else if (domJson.html) {
            element.insertAdjacentHTML('beforeend', domJson.html);
        }

        // Adicionar classes ao elemento
        if (domJson.classNames) {
            for (let i = 0; i < domJson.classNames.length; i++) {
                element.classList.add(domJson.classNames[i]);
            }
        }

        // Adicionar atributos ao elemento
        if (domJson.attributes) {
            for (let i = 0; i < domJson.attributes.length; i++) {
                const currentAttribute = domJson.attributes[i];
                element.setAttribute(
                    currentAttribute.name,
                    currentAttribute.value
                );
            }
        }

        // Adicionar elementos filhos ao elemento
        if (domJson.children) {
            for (let i = 0; i < domJson.children.length; i++) {
                const currentChild = domJson.children[i];
                element.appendChild(buildDomElementFromJson(currentChild));
            }
        }

        return element;
    };

    const customChat = () => {
        const element = document.getElementById('chat-box');

        if (element.classList.contains('closed')) {
            element.classList.remove('closed');
            document.querySelector('#chat-box-toggle i').innerText = 'close';
            document.querySelector('.chat-header-text').innerText =
                'Theo, Assistente Virtual do Sicredi';
            document.querySelector('.chat-header-text').style.textAlign =
                'left';
            document.querySelector('.chat-box-img').classList.add('hide');
        } else {
            element.classList.add('closed');
            document.querySelector('#chat-box-toggle i').innerText =
                'keyboard_arrow_up';
            document.querySelector('.chat-header-text').innerText =
                'Olá! Eu sou o Theo, posso ajudar?';
            document.querySelector('.chat-header-text').style.textAlign =
                'center';
            document.querySelector('.chat-box-img').classList.remove('hide');
            document.getElementById('newConversation-box').style.display =
                'none';
            document.getElementById('input-box').style.display = 'flex';

            conversation.setInitialized(false);
            clearLogs();
        }
    };

    const chatToggle = (type) => {
        if (!conversation.getInitialized()) {
            conversation.init();
        }

        if (!type) {
            customChat();
        }

        parent.postMessage('chatToggle', '*');
    };

    const removeOptions = () => {
        const messageWithOptions =
            document.getElementsByClassName('withOptions')[0];

        if (messageWithOptions) {
            const message = messageWithOptions.parentElement;

            if (message && message.children.length > 2) {
                message.removeChild(message.children[2]);
                messageWithOptions.classList.remove('withOptions');
                messageWithOptions.classList.add('text');
            }
        }
    };

    const inputFocus = () => {
        const input = document.getElementById('chat-input');
        input.focus();
    };

    const getTimeRandom = (min, max) => Math.random() * (max - min) + min;

    const formatDate = (date, justTime, justDate) => {
        const hours = date.getHours();
        let minutes = date.getMinutes();
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        const strTime = `${hours}:${minutes}`;
        const strDate = `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
            }/${date.getMonth() + 1 < 10
                ? `0${date.getMonth() + 1}`
                : date.getMonth() + 1
            }/${date.getFullYear()}`;

        if (justTime) {
            return strTime;
        }
        if (justDate) {
            return strDate;
        }

        return `${strDate} ${strTime}`;
    };

    const clearLogs = () => {
        document.getElementById('log').innerHTML = '';
    };

    const getUrlParam = (param) => {
        const url_string = window.location.href;
        const url = new URL(url_string);
        const data = url.searchParams.get(param);
        return data;
    };

    const toggleChatInput = (disable, placeholder, bloqueiaInput) => {
        const chatInput = document.getElementById('chat-input');
        const chatSubmit = document.getElementById('chat-submit');

        if (bloqueiaInput) {
            chatInput.placeholder =
                placeholder || 'Selecione uma opção acima...';
            chatInput.disabled = true;
            chatSubmit.disabled = true;
        } else {
            chatInput.placeholder = placeholder || 'Enviar uma mensagem...';
            chatInput.disabled = false;
            chatSubmit.disabled = false;
        }
    };

    return {
        removeElement,
        removeElementById,
        removeElementByClassName,
        insertElement,
        scrollToChatBottom,
        buildDomElementFromJson,
        chatToggle,
        removeOptions,
        inputFocus,
        getTimeRandom,
        formatDate,
        clearLogs,
        toggleChatInput,
        getUrlParam,
    };
})();
