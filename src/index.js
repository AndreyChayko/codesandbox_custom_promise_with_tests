function handler() {}

class CustomPromise {
  constructor(executor) {
    this.queue = [];
    this.errorHandler = handler;
    this.finallyHandler = handler;
    try {
      executor.call(null, this.onResolve.bind(this), this.onReject.bind(this));
    } catch (e) {
      this.errorHandler(e);
    } finally {
      this.finallyHandler();
    }
  }

  onResolve(data) {
    this.queue.forEach((cb) => {
      data = cb(data);
    });
    this.finallyHandler();
  }

  onReject(error) {
    this.errorHandler(error);
    this.finallyHandler();
  }

  then(fn) {
    this.queue.push(fn);
    return this;
  }

  catch(fn) {
    this.errorHandler = fn;
    return this;
  }

  finally(fn) {
    this.finallyHandler = fn;
    return this;
  }
}

const prom = new CustomPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("Promise resolved: test data recived");
  }, 1000);
});

prom
  .then((data) => {
    return data + " another then mutated the data";
  })
  .then((data) => console.log(data))
  .catch((e) => console.error(e))
  .finally(() => console.log("Finally has been called"));

module.exports = CustomPromise;
