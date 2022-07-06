# Group Assistant

# Message [/api/message]

## Interprete Message [GET]

Message interpretation route by IBM Watson.

It receives a string of text corresponding to the message sent by the client and interprets it, returning the corresponding response.

The context is an object owned by Watson. Only in the first message, the user's id must be sent in the context, to search the API. After Watson's first response, you must send it to ensure that all interactions in the same conversation are related and avoid duplicate responses.

-   Request (application/json)

    -   Body

        ```{
        	"input": {
        		"text": "i want to go out at a pub"
        	},
        	"context": {...}
        ```

-   Response 200 (application/json)

    -   Body

                {
            	"intents": [
            		{
            			"intent": "FunActivities_GoOut",
            			"confidence": 0.5525730133056641
            		}
            	],
            	"entities": [
            		{
            			"entity": "Events",
            			"location": [
            				0,
            				3
            			],
            			"value": "pub",
            			"confidence": 1
            		}
            	],
            	"input": {
            		"text": "i want to go out at a pub"
            	},
            	"output": {
            		"text": [
            			"message"
            		],
            		"nodes_visited": [
            			"node_1_1523559198203"
            		],
            		"log_messages": []
            	},
            	"context": {...}
            }
