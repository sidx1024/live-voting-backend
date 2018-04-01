const items = ['January', 'February', 'March', 'April', 'September', 'December'];
let queue = items[0];
let queueIndex = -1;
let interval = 0;

function setNextQueueItem(io) {
  queueIndex = (queueIndex + 1) % items.length;
  queue = items[queueIndex];
  io.emit('broadcast-queue', { for: 'everyone' });
}

function activateInterval(io) {
  interval = setInterval(setNextQueueItem.bind(this, io), 2000);
}

module.exports = { activateInterval };
