var CODE = process.env.COVER ? '../lib-cov/' : '../lib/';

var expect = require('chai').expect;
var main = require(CODE + 'main.js');

describe('#parse', function () {
  it('parses a passing non-output test', function () {
    var css = [
      '[data-module="M"] [data-test="T"] .assert-equal {',
      '  -result: PASS;',
      "  -description: 'Desc';",
      '}'
    ].join('\n');
    var expected = [{
      module: "M",
      tests: [{
        test: "T",
        assertions: [{
          description: "Desc",
          assert: "equal",
          passed: true,
        }],
      }],
    }];

    expect(main.parse(css)).to.deep.equal(expected);
  });

  it('parses a failing non-output test', function () {
    var css = [
      '[data-module="M"] [data-test="T"] .assert-equal {',
      '  -result: FAIL;',
      "  -description: 'Desc';",
      '  -expected--string: one;',
      '  -returned--string: two;',
      '}'
    ].join('\n');
    var expected = [{
      module: "M",
      tests: [{
        test: "T",
        assertions: [{
          description: "Desc",
          assert: "equal",
          passed: false,
          expected: 'string: one',
          returned: 'string: two',
        }],
      }],
    }];

    expect(main.parse(css)).to.deep.equal(expected);
  });

  it('parses a passing output test', function () {
    var css = [
      '[data-module="M"] [data-test="T"] [data-assert="A"] .input {',
      '  color: green;',
      '}',
      '[data-module="M"] [data-test="T"] [data-assert="A"] .expect {',
      '  color: green;',
      '}'
    ].join('\n');
    var expected = [{
      module: "M",
      tests: [{
        test: "T",
        assertions: [{
          description: "A",
          passed: true,
          expected: [['color', 'green']],
          returned: [['color', 'green']],
        }],
      }],
    }];

    expect(main.parse(css)).to.deep.equal(expected);
  });

  it('parses a failing output test', function () {
    var css = [
      '[data-module="M"] [data-test="T"] [data-assert="A"] .input {',
      '  color: green;',
      '}',
      '[data-module="M"] [data-test="T"] [data-assert="A"] .expect {',
      '  color: red;',
      '}'
    ].join('\n');
    var expected = [{
      module: "M",
      tests: [{
        test: "T",
        assertions: [{
          description: "A",
          passed: false,
          expected: [['color', 'red']],
          returned: [['color', 'green']],
        }],
      }],
    }];

    expect(main.parse(css)).to.deep.equal(expected);
  });

  it('respects declaration order in output tests', function () {
    var css = [
      '[data-module="M"] [data-test="T"] [data-assert="A"] .input {',
      '  color: green;',
      '  background: white;',
      '}',
      '[data-module="M"] [data-test="T"] [data-assert="A"] .expect {',
      '  background: white;',
      '  color: green;',
      '}'
    ].join('\n');
    var expected = [{
      module: "M",
      tests: [{
        test: "T",
        assertions: [{
          description: "A",
          passed: false,
          expected: [['background', 'white'], ['color', 'green']],
          returned: [['color', 'green'], ['background', 'white']],
        }],
      }],
    }];

    expect(main.parse(css)).to.deep.equal(expected);
  });

  it('ignores comments', function () {
    expect(main.parse('/* foo */')).to.deep.equal([]);
  });

  it('handles double selectors', function () {
    var css = [
      '[data-module="M"] [data-test="T"] [data-assert="A"] .input,',
      '[data-module="M"] [data-test="T"] [data-assert="A"] .expect',
      '{ color: green; }',
    ].join(' ');
    var expected = [{
      module: "M",
      tests: [{
        test: "T",
        assertions: [{
          description: "A",
          passed: true,
          expected: [['color', 'green']],
          returned: [['color', 'green']],
        }],
      }],
    }];

    expect(main.parse(css)).to.deep.equal(expected);
  });

  it('throws an error on bad selector', function () {
    var attempt = function () {
      main.parse('[data-foo="bar"] { color: red; }');
    };

    expect(attempt).to.throw(/Can\'t understand selector: \[data-foo="bar"\]/);
  });
});


describe('#parseSelector', function () {
  it('parses non-output test selector', function () {
    var sel = '[data-module="M"] [data-test="T"] .assert-equal';
    var exp = {
      output: false,
      module: "M",
      test: "T",
      assert: "equal",
    };

    expect(main.parseSelector(sel)).to.deep.equal(exp);
  });

  it('handles spaces in selectors', function () {
    var sel = '[data-module="M 1"] [data-test="T 2"] .assert-equal';
    var exp = {
      output: false,
      module: "M 1",
      test: "T 2",
      assert: "equal",
    };

    expect(main.parseSelector(sel)).to.deep.equal(exp);
  });

  it('parses output test selector', function () {
    var sel = '[data-module="M"] [data-test="T"] [data-assert="A"] .input';
    var exp = {
      output: true,
      module: "M",
      test: "T",
      assert: "A",
      type: 'input',
    };

    expect(main.parseSelector(sel)).to.deep.equal(exp);
  });

  it('returns undefined on badly-quoted attr selector', function () {
    var attempt = function () {
      main.parseSelector('[data-module=A]');
    };

    expect(attempt()).to.be.undefined();
  });

  it('returns undefined on unknown attr selector', function () {
    var attempt = function () {
      main.parseSelector('[data-foo="bar"]');
    };

    expect(attempt()).to.be.undefined();
  });

  it('returns undefined on unknown class selector', function () {
    var attempt = function () {
      main.parseSelector('.foo');
    };

    expect(attempt()).to.be.undefined();
  });

  it('returns undefined on unknown selector type', function () {
    var attempt = function () {
      main.parseSelector('#foo');
    };

    expect(attempt()).to.be.undefined();
  });
});
