
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { l as lib } from './index-41ff57ee.js';

const socket = lib();

socket.on("twitch.chat.onMessage", chatMessage => {
  console.log("onMessage:", chatMessage);
});

var client = {

};

export default client;
//# sourceMappingURL=index.js.map
