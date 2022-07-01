function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, char => {
    const random = Math.floor(Math.random() * 16);
    const n = char == 'x' ? random : (random & 0x3) | 0x8;
    return n.toString(16);
  });
}

export { uuid };
