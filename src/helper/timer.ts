export const twirlTimer = (function () {
  const P = ["\\", "|", "/", "-"];
  let x = 0;
  return setInterval(() => {
    process.stdout.write("\r" + P[x++]);
    x &= 3;
  }, 250);
})();
