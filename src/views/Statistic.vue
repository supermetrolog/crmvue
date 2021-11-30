<template>
  <div class="statisctic">
    <h1>Statistic</h1>
    <button class="btn btn-primary" @click="wsConnect">
      Connect to SERVER
    </button>
    <button class="btn btn-primary" @click="getName">get ws client name</button>
  </div>
</template>

<script>
export default {
  name: "Statistic",
  methods: {
    wsConnect() {
      // let socket = new WebSocket("ws://websocket/");
      let socket = new WebSocket("ws://localhost:8082");

      socket.onopen = function () {
        console.log("Connected websocket serve!");
        let request = {
          action: "getName",
        };
        socket.send(JSON.stringify(request));
        request = {
          action: "setUserID",
          data: "2312",
        };
        socket.send(JSON.stringify(request));

        request = {
          action: "getName",
        };
        socket.send(JSON.stringify(request));
      };

      socket.onmessage = function (event) {
        console.log("Данные получены с сервера:");
        console.log(JSON.parse(event.data));
      };

      socket.onclose = function (event) {
        if (event.wasClean) {
          console.log(
            `Соединение закрыто чисто, код=${event.code} причина=${event.reason}`
          );
        } else {
          // например, сервер убил процесс или сеть недоступна
          // обычно в этом случае event.code 1006
          console.warn("Соединение прервано");
        }
      };

      socket.onerror = function (error) {
        console.error(`[error] ${error.message}`);
      };
    },
  },
};
</script>
