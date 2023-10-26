import { cpus } from 'os';
import cluster from 'node:cluster';
import { Logger } from '@nestjs/common';

const numberOfCpus = cpus().length;

export class ClusterService {
  private static logger = new Logger(ClusterService.name);

  static clusterize(callback: Function, maxWorkers: number = numberOfCpus) {
    if (cluster.isPrimary) {
      let restartCounter = new Map();

      this.logger.debug(`Master ${process.pid} is running`);
      for (let i = 0; i < maxWorkers; i++) {
        cluster.fork();
      }

      cluster.on('fork', (worker) => {
        this.logger.log(`Worker ${worker.process.pid} is running`);
      });

      cluster.on('exit', (worker) => {
        const restartCount = restartCounter.get(worker.id) || 0;

        if (restartCount >= 5) {
          this.logger.warn(
            `Worker ${worker.process.pid} died and will not be restarted`,
          );
          restartCounter.set(worker.id, restartCount + 1);
          cluster.fork();
        } else {
          this.logger.error(
            'Worker ${worker.process.pid} died, reached the maximum number of restarts and will not be restarted',
          );
        }
      });
    } else {
      this.logger.debug(`Worker ${process.pid} started`);
      callback();
    }
  }
}
