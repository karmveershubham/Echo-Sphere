'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    const WebSocket = require('ws');

    const wss = new WebSocket.Server({ server: strapi.server.httpServer });

    wss.on('connection', (ws) => {
      console.log('A user connected');

      ws.on('message', async (message) => {
      try {
        // Parse the incoming message (assume JSON format)

        const data = JSON.parse(message.toString());

        console.log('Message received:', data);

        const { message: id, content, sender,timestamp} = data;

        // console.log(message.toString())
        // const data = message.toString();
       

        // console.log('Message received:', data);

        // const { message: content, sessionId, userId } = data;

        // // Save the message to Strapi's database (e.g., Chat collection)
        // const chatEntry = await strapi.entityService.create('api::chat.chat', {
        //   data: {
        //     content,
        //     session: sessionId,
        //     user: userId,
        //   },
        // });

        // // Echo the message back to the client
        ws.send(content.toString());
        } catch (error) {
          console.error('Error processing message:', error);
          ws.send(JSON.stringify({ error: 'Invalid message format' }));
        }
      });

      ws.on('close', () => {
        console.log('User disconnected');
      });
    });
    strapi.ws = wss; 
  },
};
