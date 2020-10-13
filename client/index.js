console.log("client.js !");

fetch("twitch?api=users&call=getMe&args=true")
  .then(response => {
    return response.json();
  })
  .then(json => {
    console.log({ json });
  })
  .catch(error => {
    console.error(error);
  });
