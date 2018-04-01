const items = ['January', 'February', 'March', 'April', 'September', 'December'];
let queue = items[0];
let queueIndex = -1;
let interval = 0;

function setNextQueueItem() {
  queueIndex = (queueIndex + 1) % items.length;
  queue = items[queueIndex];
}

function activateInterval(io) {
  interval = setInterval(setNextQueueItem, 2000);
  io.emit('broadcast-queue', { for: 'everyone' });
}

module.exports = { activateInterval };
