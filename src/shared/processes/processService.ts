import { exec } from "child_process";

export class ProcessService {
  public static killProcessOnPort(port: number, cb: any) {
    const killCommand =
      process.platform === "win32" ? `netstat -ano | findstr :${port} | findstr LISTENING` : `lsof -i:${port} -t`;

    exec(killCommand, (error: any, stdout: any, stderr: any) => {
      if (error) {
        return cb ? cb() : "";
      }

      if (stderr) {
        return cb ? cb() : "";
      }

      const processId = stdout.trim();
      if (processId) {
        const killProcessCommand = process.platform === "win32" ? `taskkill /F /PID ${processId}` : `kill ${processId}`;

        exec(killProcessCommand, (error: any, _stdout: any, _stderr: any) => {
          if (error) {
            return cb ? cb() : "";
          }
          return cb ? cb() : "";
        });
      } else {
        return cb ? cb() : "";
      }
    });
  }
}
