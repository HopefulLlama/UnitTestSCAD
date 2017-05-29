# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Fixed
- `openScadFunction().outputToBe('...')` now performs a strict equality check, rather than weak containment check.

## [1.1.0] - 2017-05-28
### Added
- `not()` function to both `openScadFunction()` and `openScadModule`. Inverts the expectation of the next chained assertion.

## [1.0.1] - 2017-05-09
### Fixed
- Clean up of temporary files should be consistent after each run.

## [1.0.0] - 2017-05-07
### Added
- Initial release hype!

[Unreleased]: https://github.com/HopefulLlama/UnitTestSCAD/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/HopefulLlama/UnitTestSCAD/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/HopefulLlama/UnitTestSCAD/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/HopefulLlama/UnitTestSCAD/compare/15ab1edb7d358de72afc3d664f776a2cf1e7e720...v1.0.0