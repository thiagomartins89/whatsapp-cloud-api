# WhatsApp Cloud API

Projeto de webhook para WhatsApp utilizando a Cloud API.

## Instalação

1. Clone o repositório.
2. Instale as dependências com `npm install`.
3. Crie um arquivo `.env` na raiz do projeto e preencha as variáveis de ambiente necessárias (consulte `src/config/env.js`).
4. Inicie o servidor com `npm start`.

## Configuração

1. Atribua uma chave de valor arbitrário à variável de ambiente `VERIFY_TOKEN`.
2. Informe a chave definida na página de configuração do webhook no portal *Meta for Developers*.

## Uso

Enquanto o servidor estiver em execução, ele estará ouvindo as mensagens do WhatsApp no endpoint `/webhook`.

## Estrutura dos eventos de notificação

https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/components

### Mensagem de texto

```javascript
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "", // The WhatsApp Business Account ID for the business that is subscribed to the webhook.
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "", // The phone number that is displayed for a business.
              "phone_number_id": "" // ID for the phone number. A business can respond to a message using this ID.
            },
            "contacts": [
              {
                "profile": {
                  "name": "" // The customer's name.
                },
                "wa_id": "" // New WhatsApp ID for the customer when their phone number is updated. Available on webhook versions v12.0 and later.
              }
            ],
            "messages": [
              {
                "from": "", // The WhatsApp ID for the customer who replied to an inbound message.
                "id": "", // The message ID for the sent message for an inbound reply.
                "timestamp": "", // Unix timestamp indicating when the WhatsApp server received the message from the customer.
                "text": {
                  "body": "" // The text of the message.
                },
                "type": "text"
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
}
```
