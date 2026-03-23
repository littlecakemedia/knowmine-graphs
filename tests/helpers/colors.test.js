import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';
import { gradient, fill, palette, solidColor, gradientColor, fadeToTransparent } from '../../src/helpers/colors.js';

describe('gradient presets', () => {
  test('blue gradient is a Gradient ColorSpec', () => {
    assert.equal(gradient.blue.type, 'Gradient');
    assert.equal(typeof gradient.blue.primaryColor, 'string');
    assert.equal(typeof gradient.blue.secondaryColor, 'string');
  });

  test('all gradient keys have correct structure', () => {
    for (const [key, value] of Object.entries(gradient)) {
      assert.equal(value.type, 'Gradient', `gradient.${key} should have type Gradient`);
      assert.ok(value.primaryColor, `gradient.${key} should have primaryColor`);
      assert.ok(value.secondaryColor, `gradient.${key} should have secondaryColor`);
    }
  });
});

describe('fill presets', () => {
  test('white fill is a Fill ColorSpec', () => {
    assert.equal(fill.white.type, 'Fill');
    assert.equal(fill.white.primaryColor, '#FFFFFF');
  });
});

describe('palette keys', () => {
  test('palette.primary is primary_color', () => {
    assert.equal(palette.primary, 'primary_color');
  });
});

describe('solidColor', () => {
  test('creates a Fill ColorSpec', () => {
    const c = solidColor('#FF0000');
    assert.equal(c.type, 'Fill');
    assert.equal(c.primaryColor, '#FF0000');
  });
});

describe('gradientColor', () => {
  test('creates a Gradient ColorSpec', () => {
    const c = gradientColor('#AA00FF', '#0000FF');
    assert.equal(c.type, 'Gradient');
    assert.equal(c.primaryColor, '#AA00FF');
    assert.equal(c.secondaryColor, '#0000FF');
  });
});

describe('fadeToTransparent', () => {
  test('creates a gradient ending in transparent', () => {
    const c = fadeToTransparent('#00FFFF');
    assert.equal(c.type, 'Gradient');
    assert.equal(c.primaryColor, '#00FFFF');
    assert.equal(c.secondaryColor, '#00000000');
  });
});
