const mentionUser = (text) => {
  var startAt;
  var endAt;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "@") startAt = i;
  }
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ",") endAt = i;
  }
  return { startAt, endAt };
};
export default mentionUser;
