# UnitTestSCAD
Unit Testing for OpenSCAD

UnitTestSCAD brings forth unit testing capabilities to OpenSCAD. Unit testing enables you to check for regressions, accuracy and robustness of code in a fast, repeatable manner. Speed of development increases as unit tests will worry about your regressions, and allow you to plow ahead with your vision.

# Contents
- [Getting Started](#getting-started)
- Usage
- API Reference
- [Uninstalling](#uninstalling)
- [Contribuing](#contributing)
- [License](#license)

# Getting Started
## Installing OpenSCAD
UnitTestSCAD has a very strong dependency on OpenSCAD. This is because UnitTestSCAD uses some of the features from OpenSCAD to perform some of its underlying testing. 

Simply start by installing OpenSCAD if you have not done so already:

[OpenSCAD Home](http://www.openscad.org/)

## Adding OpenSCAD to PATH
In order for UnitTestSCAD to take advantage of OpenSCAD's features, the folder which contains the OpenSCAD files must be added to the PATH environment variable on your machine.

While the path will generally be the same on all platforms (Windows, Linux, Mac), the file they point to specifically is different. If you have moved the respective file manually, you will need to point at:
- Windows: `openscad.com`
- Linux: `openscad.exe`
- Mac: `openscad.exe`

These files will be in the location where you installed OpenSCAD. For example, by default on Windows: `C:/Program Files/OpenSCAD`. 

Note: **The path to the folder containing the files is to be added to the PATH environment variable.**

## Installing NodeJS and NPM
UnitTestSCAD is powered by NodeJS and distributed by NPM. They are distributed together and complement each other well.
Follow the installation from the NodeJS website if you do not have these installed:

[NodeJS Home](https://nodejs.org/en/)

## Installing UnitTestSCAD
If all has gone well, then installing UnitTestSCAD will be a simple command to run in the command line/terminal.

To install UnitTestSCAD, run the command:

`npm install -g unittestscad`

Test the installation has succeeded by executing a following command:

`unittestscad`

You should see the output:

`usage: unittestscad <file>`

`The supplied path to the configuration file does not point to a valid configuration file.`

Congratulations! UnitTestSCAD has successfully been installed.

# Uninstalling
To uninstall UnitTestSCAD, run the command:

`npm uninstall -g unittestscad`

Upon completion of the command, UnitTestSCAD will be uninstalled from the machine.

# Contributing
See the [Contributing](../master/CONTRIBUTING.md) document for more information on contributing.

# License
See the [License](../master/LICENSE) document for more information on licensing.
