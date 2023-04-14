import bunyan from "bunyan";

const log = bunyan.createLogger({
  name: "ezforu2",
  streams: [
    {
      level: "info",
      stream: process.stdout,
    },
    {
      level: "error",
      stream: process.stdout,
    },
    {
      level: "info",
      path: "./log/ezforu2.log",
    },
    {
      level: "error",
      path: "./log/ezforu2.log",
    },
  ],
});
log.info("Logger initialized");

export default log;
