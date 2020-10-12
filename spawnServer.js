import { spawn } from "child_process";
import chokidar from "chokidar";

export default function spawnServer(bin) {
  let server = null;

  const kill = () => {
    server.stdin.pause();
    server.kill();
  };

  const start = () => {
    server = spawn("node", [bin]);

    server.stdout.on("data", data => {
      console.log(`[server] ${data.toString().trim()}`);
    });

    server.stderr.on("data", data => {
      console.error(`[server:error] ${data}`);
    });

    server.on("close", code => {
      console.log(`[server] exited with code ${code || 0}`);
    });
  };

  const watcher = chokidar.watch("server/**/*");

  watcher.on("ready", () => {
    watcher.on("change", path => {
      console.log(`[server] file changed: ${path}`);
      if (server) kill();
      start();
    });
  });

  return {
    writeBundle() {
      if (server) return;
      start();
    }
  };
}
