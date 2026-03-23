import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';
import { makeRadialGaugeLarge } from '../../src/renderer/radialGaugeLarge.js';
import { gradient, fill } from '../../src/helpers/colors.js';

const gauge = (label) => ({
  value: 50,
  minValue: 0,
  maxValue: 100,
  gaugeColor: gradient.blue,
  gaugeBackgroundColor: fill.dimWhiteLow,
  valueTextColor: fill.white,
  gapAngle: 120,
  lineWidth: 14,
  label,
  thresholds: [],
  glowColor: null,
  tickColor: null,
  showTicks: false,
  showGlow: false,
});

describe('makeRadialGaugeLarge', () => {
  test('produces correct type', () => {
    const dto = makeRadialGaugeLarge({ gauge1: gauge('CPU'), gauge2: gauge('RAM') });
    assert.equal(dto.type, 'RadialGaugeLarge');
  });

  test('2-gauge layout: gauge3 not present in payload', () => {
    const dto = makeRadialGaugeLarge({ gauge1: gauge('A'), gauge2: gauge('B') });
    assert.equal('gauge3' in dto.payload, false);
  });

  test('3-gauge layout: gauge3 present in payload', () => {
    const dto = makeRadialGaugeLarge({ gauge1: gauge('A'), gauge2: gauge('B'), gauge3: gauge('C') });
    assert.ok('gauge3' in dto.payload);
  });
});
