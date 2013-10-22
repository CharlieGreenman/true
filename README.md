True
====

*Verb*

1. To make true; shape, adjust, place, etc., exactly or accurately:
  *True the wheels of a bicycle after striking a pothole.*
2. To make even, symmetrical, level, etc. (often followed by *up*):
  *True up the sides of a door.*
3. To test your Sass/Compass code; debug, perfect, etc. (often using *True*):
  *True your sweet plugin before you deploy.*

At this point
True can only test values,
not property/value output.
I'm working on output tests as well.
For now,
use True for logical unit tests,
and use version-control for integration testing
by comparing changes in output files.

Install
-------

in command line:

`gem install true`

in config.rb:

`require 'true'`

Usage
-----

Production example from
[Susy Next](https://github.com/ericam/susy/blob/susy-next/test/scss/math/_columns.scss):

```scss
@import "true";

// Column Math Tests
// =================

@include test-module('Column Math') {

  // Is Symmetrical
  // --------------

  @include test('[function] is-symmetrical()') {
    $sym: 12;
    $asym: 1 2 4 1 2 1;
    $baz: compact(4);

    // 12 is a symmetrical grid.
    $s: is-symmetrical($sym);
    @include assert-true($s,
      'Simple number should be symmetrical grid.');

    // (1 2 4 1 2 1) is not a symmetrical grid.
    $a: is-symmetrical($asym);
    @include assert-false($a,
      'List should be asymmetrical grid.');

    // compact(4) is not a symmetrical grid (because it is a list).
    $b: is-symmetrical($baz);
    @include assert-false($b,
      'Single-item list should be asymmetrical grid.');
  }


  // Column Count
  // ------------

  @include test('[function] column-count()') {
    $sym: 12;
    $asym: 1 2 4 1 2 1;

    // A symmetrical grid is equal to its column count.
    $s-count: column-count($sym);
    @include assert-equal($s-count, $sym,
      'Symmetrical grid-count should equal $columns setting.');

    // An asymmetrical grid has a column-count equal to its length.
    $a-count: column-count($asym);
    $a-length: length($asym);
    @include assert-equal($a-count, $a-length,
      'Asymmetrical grid-count should equal $columns length.');
  }


  // Column Sum
  // ----------

  @include test('[function] symmetrical column-sum()') {
    $cols   : 9;
    $guts   : .5;
    $sum    : column-sum($cols, $guts);
    $outer  : column-sum($cols, $guts, outer);

    @include assert-equal($sum, 13,
      'Column-sum for "9 .5" should be "13".');

    @include assert-equal($outer, 13.5,
      'Outer column-sum for "9 .5" should be "13.5".');
  }

  @include test('[function] asymmetrical column-sum()') {
    $sum    : column-sum(1 2 3 1 2, .25);
    $outer  : column-sum(1 2 3 1 2, .25, outer);

    @include assert-equal($sum, 10,
      'Column-sum for "(1 2 3 1 2) .25" should be "10".');

    @include assert-equal($outer, 10.25,
      'Outer column-sum for "(1 2 3 1 2) .25" should be "10.25".');
  }


  // Get Columns
  // -----------

  @include test('[function] symmetrical get-columns()') {
    $span: 3;
    $context: 12;
    $sub: get-columns($span, 4, $context);

    @include assert-equal($sub, $span,
      'Symmetrical get-columns subset should be equal to its span.');
  }

  @include test('[function] asymmetrical get-columns()') {
    $span: 3;
    $context: 1 2 3 1 2;
    $sub: get-columns($span, 2, $context);

    @include assert-equal($sub, 2 3 1,
      'Get-columns subset for "3 of (1 2 3 1 2) at 2" should be "2 3 1".');
  }


  // Get Column Span Sum
  // -------------------

  @include test('[function] symmetrical get-column-span-sum()') {
    $cols: 12;
    $guts: 1/8;

    $sum: get-column-span-sum(3, 2, $cols, $guts);
    @include assert-equal($sum, 3.25,
      'Inner span-sum for "3 of 12 1/8 at 2" should be "3.25"');

    $sum: get-column-span-sum(3, last, $cols, $guts, outer);
    @include assert-equal($sum, 3.375,
      'Outer span-sum for "last 3 of 12 1/8" should be "3.375".');
  }

  @include test('[function] asymmetrical get-column-span-sum()') {
    $cols: 1 2 3 2 1 2 3;
    $guts: 1/4;

    $sum: get-column-span-sum(3, 2, $cols, $guts);
    @include assert-equal($sum, 7.5,
      'Inner span-sum for "3 at 2 of (1 2 3 2 1 2 3)" should be "7.5".');

    $sum: get-column-span-sum(3, last, $cols, $guts, outer);
    @include assert-equal($sum, 6.75,
      'Outer span-sum for "last 3 of (1 2 3 2 1 2 3)" should be "6.75".');
  }

}
```

**True** will report detailed results in the terminal,
and a summary of results in the output css.

Here's the Susy "Column Math" CSS output:

```css
/*

### Column Math ------ */
/*  - [function] is-symmetrical() (3 Assertions, 3 Passed, 0 Failed) */
/*  - [function] column-count() (2 Assertions, 2 Passed, 0 Failed) */
/*  - [function] symmetrical column-sum() (2 Assertions, 2 Passed, 0 Failed) */
/*  - [function] asymmetrical column-sum() (2 Assertions, 2 Passed, 0 Failed) */
/*  - [function] symmetrical get-columns() (1 Assertions, 1 Passed, 0 Failed) */
/*  - [function] asymmetrical get-columns() (1 Assertions, 1 Passed, 0 Failed) */
/*  - [function] symmetrical get-column-span-sum() (2 Assertions, 2 Passed, 0 Failed) */
/*  - [function] asymmetrical get-column-span-sum() (2 Assertions, 2 Passed, 0 Failed) */
/*
    8 Tests:
    - 8 Passed
    - 0 Failed */
```
