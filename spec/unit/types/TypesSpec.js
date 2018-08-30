const Types = require('../../../src/types/Types');

describe('TypesSpec', () => {
  it('should have BOOLEAN', () => expect(Types.BOOLEAN).toBe('boolean'));
  it('should have INF', () => expect(Types.INF).toBe('inf'));
  it('should have NAN', () => expect(Types.NAN).toBe('nan'));
  it('should have NUMBER', () => expect(Types.NUMBER).toBe('number'));
  it('should have RANGE', () => expect(Types.RANGE).toBe('range'));
  it('should have STRING', () => expect(Types.STRING).toBe('string'));
  it('should have UNDEF', () => expect(Types.UNDEF).toBe('undef'));
  it('should have VECTOR', () => expect(Types.VECTOR).toBe('vector'));
});