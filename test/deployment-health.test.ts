import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { assessDeployment } from "../src/deployment-health.js";

describe("assessDeployment", () => {
  it("accepts a ready deployment inside the five-percent SLO", () => {
    assert.equal(
      assessDeployment({ ready: true, errorRatePercent: 2.5 }),
      "healthy",
    );
  });

  it("rejects a deployment that exceeds the five-percent SLO", () => {
    assert.equal(
      assessDeployment({ ready: true, errorRatePercent: 12 }),
      "unhealthy",
    );
  });

  it("rejects a deployment that is not ready", () => {
    assert.equal(
      assessDeployment({ ready: false, errorRatePercent: 0 }),
      "unhealthy",
    );
  });

  it("rejects invalid telemetry", () => {
    assert.throws(
      () => assessDeployment({ ready: true, errorRatePercent: -1 }),
      RangeError,
    );
  });
});
