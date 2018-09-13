# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Changed
- Entire API has been reworked.
- Removed all assertion methods.
- Removed test runner, test suite handling and associated reporting capabilities.
- UnitTestSCAD now exposes `Function`, `ThreeDModule`, `TwoDModule` and `Types`. This should be used in conjunction with other testing frameworks to build up test suites.
- Changed documentation from markdown to JSDoc. This can be found at [docs/index.html](docs/index.html).

## [2.2.0] 2017-07-29
### Added
- Added `toContainVertices` and `toHaveExactVertices`.

### Changes
- Arrays/Vectors now print nicer to console.

## [2.1.1] 2017-07-27
### Fixed
- Finding vertices also works on floats.
- Minor internal improvements.

## [2.1.0] 2017-07-16
### Added
- `typeToBe` assertion added to `openScadFunction` tests.

## [2.0.1] 2017-06-28
### Added
- Can now invoke `unittestscad` through NodeJS `require`.

### Fixed
- Exceptions from user specs now correctly bubble up.

## [2.0.0] 2017-06-08
### Added
- `assert` now has an optional `withSetup(setupText)` to allow insertion of OpenSCAD code, prior to the test. Chains with both `openScadFunction()` and `openScadModule()`.
- `assert.openScad2DModule()` now available, along with assertions for 2D modules.
- `xml` reporter now available.

### Changed
- Now allow for trailing semi-colons in assertion definitions.
- `assert.openScad3DModule()` available as an alias to `assert.openScadModule()`.

## [1.2.1] 2017-07-23
### Fixed
- Finding vertices also works on floats.

## [1.2.0] 2017-06-01
### Added
- Added reporters, and ability to add custom reporters.

### Fixed
- `openScadFunction().outputToBe('...')` now performs a strict equality check, rather than weak containment check.

## [1.1.0] 2017-05-28
### Added
- `not()` function to both `openScadFunction()` and `openScadModule`. Inverts the expectation of the next chained assertion.

## [1.0.1] 2017-05-09
### Fixed
- Clean up of temporary files should be consistent after each run.

## [1.0.0] 2017-05-07
### Added
- Initial release hype!

[Unreleased]: https://github.com/HopefulLlama/UnitTestSCAD/compare/v2.2.0...HEAD
[2.2.0]: https://github.com/HopefulLlama/UnitTestSCAD/compare/v2.1.1...v2.2.0
[2.1.1]: https://github.com/HopefulLlama/UnitTestSCAD/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/HopefulLlama/UnitTestSCAD/compare/v2.0.1...v2.1.0
[2.0.1]: https://github.com/HopefulLlama/UnitTestSCAD/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/HopefulLlama/UnitTestSCAD/compare/v1.2.0...v2.0.0
[1.2.1]: https://github.com/HopefulLlama/UnitTestSCAD/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/HopefulLlama/UnitTestSCAD/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/HopefulLlama/UnitTestSCAD/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/HopefulLlama/UnitTestSCAD/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/HopefulLlama/UnitTestSCAD/compare/15ab1edb7d358de72afc3d664f776a2cf1e7e720...v1.0.0
