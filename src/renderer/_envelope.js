import { APP_DEFAULT_BACKGROUND, APP_DEFAULT_BACKGROUND_TYPE } from '../helpers/colors.js';

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
  backgroundColor = APP_DEFAULT_BACKGROUND,
  backgroundType = APP_DEFAULT_BACKGROUND_TYPE,
  borderColor = null,
  shadowColor = null,
}) {
  return {
    name,
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
