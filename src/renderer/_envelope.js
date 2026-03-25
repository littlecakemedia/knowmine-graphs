/**
 * Builds the standard KnowMine widget response envelope.
 * All renderer functions use this internally.
 * @internal
 */
export function buildEnvelope({
  name = null,
  type,
  version = '1.0',
  payload,
  refreshInterval = 30,
  backgroundColor = null,
  backgroundType = 'NONE',
  borderColor = null,
  shadowColor = null,
}) {
  return {
    nome: name,
    type,
    version,
    payload,
    refreshInterval,
    backgroundColor,
    backgroundType,
    borderColor,
    shadowColor,
  };
}
