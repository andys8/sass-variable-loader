/* globals it,describe,context */
import { expect } from 'chai';
import getVariables from '../src/get-variables';
import parseVariables from '../src/parse-variables';

context('without comments', () => {
  const sass = '$gray-base: #000 !default;\n$gray-darker: lighten($gray-base, 13.5%) !default; // #222\n$gray-dark: lighten($gray-base, 20%) !default;  // #333\n$gray:  lighten($gray-base, 33.5%) !default; // #555\n$gray-light:  lighten($gray-base, 46.7%) !default; // #777\n$gray-lighter:  lighten($gray-base, 93.5%) !default; // #eee';
  const variables = getVariables(sass);

  describe('getVariables()', () => {
    it('should return an array with 6 items', () => {
      expect(variables).to.be.a('array').and.have.length(6);
    });
  });

  describe('parseVariables()', () => {
    it('should return an object with the key grayBase', () => {
      const result = parseVariables(variables);
      expect(result).to.be.a('object');
      expect(result).to.include.keys('grayBase');
      expect(result.grayBase).to.equal('#000');
    });

    it('should return undefined for unkown keys', () => {
      expect(parseVariables(variables, 'develop').notExistingProp).to.equal(undefined);
    });
  });
});

context('with comments', () => {
  const sass = `$one: 123;
$x: $one;
// $y: $two; // ERROR - $two not existed, but it's commented`;
  const variables = getVariables(sass);

  describe('getVariables()', () => {
    it('should return an array with 2 items', () => {
      expect(variables).to.be.a('array').and.have.length(2);
    });
  });

  describe('parseVariables()', () => {
    it('should return an object with the key one', () => {
      const result = parseVariables(variables);
      expect(result).to.be.a('object');
      expect(result).to.include.keys('one');
    });
    it('should not return an object with the key y', () => {
      const result = parseVariables(variables);
      expect(result).to.be.a('object');
      expect(result).to.not.include.keys('y');
    });
  });
});

context('variable with pixel unit', () => {
  const sass = '$width: 100px;';
  const variables = getVariables(sass);

  describe('getVariables()', () => {
    it('should return an array with 1 item', () => {
      expect(variables).to.be.a('array').and.have.length(1);
    });
  });

  describe('parseVariables()', () => {
    it('should return a parsed value without unit', () => {
      const result = parseVariables(variables);
      expect(result.width).to.equal(100);
    });

    it('should return a value with unit', () => {
      const result = parseVariables(variables);
      expect(result.widthPx).to.equal('100px');
    });
  });
});

context('variable with em unit', () => {
  const sass = '$width: 123.45em;';
  const variables = getVariables(sass);

  describe('getVariables()', () => {
    it('should return an array with 1 item', () => {
      expect(variables).to.be.a('array').and.have.length(1);
    });
  });

  describe('parseVariables()', () => {
    it('should return a parsed value without unit', () => {
      const result = parseVariables(variables);
      expect(result.width).to.equal(123.45);
    });

    it('should return a value with unit', () => {
      const result = parseVariables(variables);
      expect(result.widthEm).to.equal('123.45em');
    });
  });
});

context('variable containing integer', () => {
  const sass = '$width: 100;';
  const variables = getVariables(sass);

  describe('getVariables()', () => {
    it('should return an array with 1 item', () => {
      expect(variables).to.be.a('array').and.have.length(1);
    });
  });

  describe('parseVariables()', () => {
    it('should return a parsed value without unit', () => {
      const result = parseVariables(variables);
      expect(result.width).to.equal(100);
    });
  });
});

context('variable containing float', () => {
  const sass = '$width: 100.1;';
  const variables = getVariables(sass);

  describe('getVariables()', () => {
    it('should return an array with 1 item', () => {
      expect(variables).to.be.a('array').and.have.length(1);
    });
  });

  describe('parseVariables()', () => {
    it('should return a parsed value without unit', () => {
      const result = parseVariables(variables);
      expect(result.width).to.equal(100.1);
    });
  });
});
