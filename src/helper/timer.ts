export function twirlTimer() {
  const P = ["\\", "|", "/", "-"];
  let x = 0;
  const timer = setInterval(() => {
    process.stdout.write("\r" + P[x++] + "Loading, please wait...");
    x &= 3;
  }, 250);
  return timer;
}
