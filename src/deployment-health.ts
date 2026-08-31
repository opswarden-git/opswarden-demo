export interface DeploymentSignal {
  ready: boolean;
  errorRatePercent: number;
}

export type DeploymentState = "healthy" | "unhealthy";

/**
 * A deployment is healthy only while it is ready and its error rate does not
 * exceed the operational SLO of five percent.
 */
export function assessDeployment(signal: DeploymentSignal): DeploymentState {
  if (
    !Number.isFinite(signal.errorRatePercent) ||
    signal.errorRatePercent < 0
  ) {
    throw new RangeError("errorRatePercent must be a finite positive number");
  }

  if (!signal.ready || signal.errorRatePercent > 5) {
    return "unhealthy";
  }

  return "healthy";
}
