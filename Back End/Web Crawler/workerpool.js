const { AsyncResource } = require('async_hooks');
const { EventEmitter } = require('events');
const { Worker, MessageChannel } = require('worker_threads');
const path = require('path');

const kTaskInfo = Symbol('kTaskInfo');
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent');

//this file is modified from Node's official documentation 
//uses async_hooks & worker_threads modules to implement thread pool

class WorkerPoolTaskInfo extends AsyncResource {
  constructor(callback) {
    super('WorkerPoolTaskInfo');
    this.callback = callback;
  }

  done(err, result) {
    this.runInAsyncScope(this.callback, null, err, result);
    this.emitDestroy();  // `TaskInfo`s are used only once.
  }
}

class WorkerPool extends EventEmitter {
  constructor(numThreads, path, verbose=false) {
    super();
    this.numThreads = numThreads;
    this.workers = [];
    this.freeWorkers = [];
    this.tasks = [];
    this.channel = new MessageChannel();
    this.path = path;
    this.verbose = verbose;

    for (let i = 0; i < numThreads; i++) {
      this.addNewWorker();
    }

    // Any time the kWorkerFreedEvent is emitted, dispatch
    // the next task pending in the queue, if any.
    this.on(kWorkerFreedEvent, () => {
      if (this.tasks.length > 0) {
        if (this.verbose) {
          console.log("Popping task off list");
        }
        const { task, callback } = this.tasks.shift();
        this.runTask(task, callback);
      }
    });
  }

  getChannel() {
    return this.channel;
  }

  //pushes new Worker thread to list of workers
  //registers message, error listener events
  addNewWorker() {
    const worker = new Worker(path.resolve(__dirname, this.path));
    if (this.verbose) {
      console.log("Worker " + worker.threadId + " created");
    }
    worker.on('message', (result) => {
      // success: Call callback passed to `runTask`,
      // remove `TaskInfo` associated with Worker, and mark it free again.
      worker[kTaskInfo].done(null, result);
      worker[kTaskInfo] = null;
      this.freeWorkers.push(worker);
      this.emit(kWorkerFreedEvent);
    });
    worker.on('error', (err) => {
      // uncaught exception: Call callback passed to`runTask` with the error.
      // remove worker from thread pool and replace it with a new one
      if (worker[kTaskInfo]) {
        worker[kTaskInfo].done(err, null);
      }
      this.workers.splice(this.workers.indexOf(worker), 1);
      this.addNewWorker();
    });
    this.workers.push(worker);
    this.freeWorkers.push(worker);
    this.emit(kWorkerFreedEvent);
  }

  //attempt to run a task from task list with a worker from the freeworker list
  //if none, push task back and try again later
  //if present, pop worker from free worker list
  runTask(task, callback) {
    if (this.freeWorkers.length === 0) {
      // No free threads, wait until a worker thread becomes free.
      if (this.verbose) {
        console.log("no free workers, task pushed back to task list");
      }
      this.tasks.push({ task, callback });
      return;
    }
    const worker = this.freeWorkers.pop();
    if (this.verbose) {
      console.log("Worker " + worker.threadId + " assigned to begin task");
    }
    worker[kTaskInfo] = new WorkerPoolTaskInfo(callback);
    worker.postMessage(task);
  }

  close() {
    console.log("closed");
    for (const worker of this.workers) {
      worker.terminate();
    }
  }
}

module.exports = {
    WorkerPool
};