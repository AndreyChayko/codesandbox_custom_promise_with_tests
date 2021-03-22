const CustomPromise = require("./index");

describe("Custom Promise", () => {
  const successResult = 10;
  const errorResult = "I'm error from promise";
  let customPromise;
  let executorSpy;

  beforeEach(() => {
    const func = (resolve) => setTimeout(() => resolve(successResult), 1000);
    executorSpy = jest.fn(func);
    customPromise = new CustomPromise(executorSpy);
  });

  test("should exists and type of is function", () => {
    expect(CustomPromise).toBeDefined();
    expect(typeof CustomPromise).toBe("function");
  });

  test("instance should have methos: then, catch, finally", () => {
    expect(customPromise.then).toBeDefined();
    expect(customPromise.catch).toBeDefined();
    expect(customPromise.finally).not.toBeUndefined();
  });

  test("should call executor function", () => {
    expect(executorSpy).toHaveBeenCalled();
  });

  test("should get data in then block and chain them", async () => {
    const result = await customPromise
      .then((num) => num)
      .then((num) => num * 2);
    expect(result).toBe(successResult * 2);
  });

  test("should catch error", () => {
    const errorExecutor = (_, reject) =>
      setTimeout(() => reject(errorResult), 150);
    const errorPromise = new CustomPromise(errorExecutor);

    return new Promise((resolve) => {
      errorPromise.catch((error) => {
        expect(error).toBe(errorResult);
        resolve();
      });
    });
  });
});
