/* eslint-disable */
const _extends = Object.assign || function (target) { for (let i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const conversation = (() => {
    let contextLocal = {};
    let initialized = false;
    let inactivityCounter;
    const transcription = [];

    const getInitialized = () => initialized;

    const setInitialized = (value) => {
        if (!value) contextLocal = {};

        initialized = value;
    };

    const setParams = (params) => {
        contextLocal = { ...contextLocal, ...params };

        if (params.startOpen === true) {
            init();
            common.chatToggle();
        }
    };

    const downloadConversation = () => {
        const head = [['Autor', 'Mensagem']];
        const body = [];
        const today = new Date();
        const dia = today.getDay();
        const mes = today.getMonth() + 1;
        const ano = today.getFullYear();

        Array.from(transcription).forEach((elem) => {
            const who =
                elem.type == 'from-chatbot' || elem.type == 'from-watson'
                    ? 'chatbot'
                    : 'usuário';
            body.push([who, elem.text]);
        });

        const doc = new jsPDF('l', null, 'letter');

        doc.autoTable({
            head,
            body,
            bodyStyles: { valign: 'top' },
            styles: {
                cellWidth: 'wrap',
                halign: 'justify',
                overflow: 'linebreak',
                fontSize: 10,
            },
            columnStyles: {
                1: { cellWidth: 'auto' },
            },
        });
        doc.save(`conversa_${dia}_${mes}_${ano}.pdf`);
    };

    const init = () => {
        setInitialized(true);
        sendMessage('');
    };

    const sendMessage = (text) => {
        displayTextOutput('', 'from-chatbot-loading');

        api.sendRequestMessage(text, contextLocal)
            .then((response) => {
                if (!response.output.generic.length) {
                    common.removeElementByClassName('from-chatbot-loading');
                }

                contextLocal = response.context;
                const messageQueue = response.output.generic;
                displayResponse(0, messageQueue);
            })
            .catch((err) => {
                console.log(err);
                displayTextOutput(
                    'Não consigo me conectar ao meu servidor no momento. Por favor, tente novamente mais tarde!',
                    'from-chatbot'
                );
            });
    };

    const displayResponse = (index, messageList) => {
        const withOptions =
            messageList.filter((item) => item.response_type == 'option')[0] !=
            undefined;

        common.toggleChatInput(
            withOptions,
            contextLocal.placeholder,
            contextLocal.bloqueiaInput
        );

        if (index < messageList.length) {
            const pauseTime = common.getTimeRandom(200, 1200);
            const message = messageList[index++];

            if (message.response_type == 'pause') pauseTime = message.time;

            setTimeout(() => {
                switch (message.response_type) {
                    case 'text':
                        displayTextOutput(message.text, 'from-chatbot');
                        break;

                    case 'option':
                        displayTextOutput(
                            message.title,
                            'from-chatbot',
                            message.options
                        );
                        break;

                    case 'image':
                        displayTextOutput(
                            message.title,
                            'from-chatbot',
                            null,
                            message.source
                        );
                        break;
                }

                if (
                    index < messageList.length &&
                    message.response_type != 'pause'
                ) {
                    displayTextOutput('', 'from-chatbot-loading');
                }

                return displayResponse(index, messageList);
            }, pauseTime);
        }
    };

    const closedConversation = function () {
        if (inactivityCounter) clearTimeout(inactivityCounter);

        // Comentado pelo fato de não considerarem mais abandono quando tiver timeout,
        // caso voltem a querer, só descomentar abaixo
        // contextLocal.abandono = true;
        const newConversation = document.getElementById('newConversation-box');
        const input = document.getElementById('input-box');
        input.toggle();
        newConversation.fadeIn(1500, 'flex');
    };

    const restartInactivityCounter = function () {
        if (inactivityCounter) clearTimeout(inactivityCounter);

        inactivityCounter = setTimeout(() => {
            closedConversation();

            const msgInactivity =
                'Conversa encerrada por inatividade, clique em "Iniciar nova conversa" para falar novamente.';
            displayTextOutput(msgInactivity, 'from-watson');
            api.sendRequestMessage(msgInactivity, contextLocal);

            if (inactivityCounter) clearTimeout(inactivityCounter);
        }, 270000); // 4:30 Min 270000
    };

    const displayTextOutput = (text, type, options, imageSource) => {
        restartInactivityCounter();

        if (type === 'from-user') {
            // text = text.escape();
        }

        if (type != 'from-chatbot-loading') {
            transcription.push({
                type,
                text,
                time: new Date(),
                chapa_emplid: contextLocal.chapa || contextLocal.emplid || '',
            });
        }

        common.removeElementByClassName('from-chatbot-loading');
        common.removeOptions();

        const messageJson = {
            tagName: 'div',
            classNames: ['chat-msg', type],
            children: new Array(),
        };

        const lastMessage = document.getElementById('log').lastChild;

        const url = window.location.href.includes('mobile');

        if (
            type.startsWith('from-chatbot') &&
            (!lastMessage || lastMessage.classList.contains('from-user'))
        ) {
            messageJson.children.push({
                tagName: 'span',
                classNames: ['msg-avatar'],
                children: [
                    {
                        tagName: 'img',
                        attributes: [
                            { name: 'src', value: 'images/theo.png' },
                        ],
                    },
                ],
            });
        }

        let optionJson = {};

        if (options) {
            optionJson = createJSONOptions(options);
        }

        let timeSpanJson = {};

        if (type != 'from-chatbot-loading') {
            timeSpanJson = createJSONTimeSpan();
        }

        if (imageSource) {
            text = `${text || ''
                }<img class="img-small" src="${imageSource}" onClick="conversation.showImage('${imageSource}')" >`;
        }

        messageJson.children.push({
            tagName: 'div',
            classNames: ['cm-msg-text'],
            children: [
                {
                    tagName: 'div',
                    classNames: [
                        type == 'from-chatbot-loading'
                            ? 'ball'
                            : options
                                ? 'withOptions'
                                : 'text',
                        type == 'from-user'
                            ? `background-default`
                            : 'a',
                    ],
                    text: `${text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`,
                },
                timeSpanJson,
                optionJson,
            ],
        });

        const element = common.buildDomElementFromJson(messageJson);
        common.insertElement('log', element);

        element.toggle().fadeIn(400);
        common.scrollToChatBottom();
        common.inputFocus();
    };

    const createJSONOptions = (options) => {
        const optionJson = {
            tagName: 'li',
            classNames: ['options'],
            children: [],
        };

        for (let i = 0; i < options.length; i++) {
            const option = options[i];

            if (option.value.input.text.indexOf('http') != -1) {
                optionJson.children.push({
                    tagName: 'ul',
                    text: option.label,
                    attributes: [
                        {
                            name: 'onclick',
                            value: `window.open('${option.value.input.text}','_blank')`,
                        },
                    ],
                });
            } else if (
                option.value.input.text.indexOf(
                    'data:application/octet-stream'
                ) != -1
            ) {
                optionJson.children.push({
                    tagName: 'ul',
                    classNames: [
                        'down-button',
                        `down-default`,
                    ],
                    children: [
                        {
                            tagName: 'a',
                            text: option.label,
                            attributes: [
                                {
                                    name: 'href',
                                    value: option.value.input.text,
                                },
                                {
                                    name: 'download',
                                    value: 'arquivo.pdf',
                                },
                            ],
                        },
                    ],
                });
            } else {
                optionJson.children.push({
                    tagName: 'ul',
                    classNames: [
                        `border-default`,
                        `hover-default`,
                    ],
                    text: option.label,
                    attributes: [
                        {
                            name: 'onClick',
                            value: `conversation.optionClick("${option.value.input.text}");`,
                        },
                    ],
                });
            }
        }

        return optionJson;
    };

    const createJSONTimeSpan = () => ({
        tagName: 'span',
        classNames: ['timespan'],
        text: common.formatDate(new Date(), true),
    });

    const optionClick = (value) => {
        common.removeOptions();

        displayTextOutput(value, 'from-user');
        sendMessage(value);
    };

    const showImage = (source) => {
        parent.postMessage(`showImage-${source}`, '*');
    };

    return {
        setParams,
        init,
        setInitialized,
        getInitialized,
        displayTextOutput,
        sendMessage,
        optionClick,
        showImage,
        downloadConversation,
    };
})();
