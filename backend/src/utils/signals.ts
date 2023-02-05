process.on("SIGINT", () => {
  console.info("Interrupted");
  process.exit(0);
});
