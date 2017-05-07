# UnitTestSCAD
Unit Testing for OpenSCAD

![UnitTestSCAD](../master/docs/banner.png)

UnitTestSCAD brings forth unit testing capabilities to OpenSCAD. Unit testing enables you to check for regressions, accuracy and robustness of code in a fast, repeatable manner. Speed of development increases as unit tests will worry about your regressions, and allow you to plow ahead with your vision.

# Contents
- [Getting Started](#getting-started)
- [Usage](#usage)
- [API Reference](#api-reference)
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

```
usage: unittestscad <file>
The supplied path to the configuration file does not point to a valid configuration file.
```

Congratulations! UnitTestSCAD has successfully been installed.

# Usage
## Configuration File
To use UnitTestSCAD, you will first need a configuration file which will specify which files to run. The configuration file should be in the JSON format, and contain the following properties:

- `openScadDirectory`: This should be a string which points to the directory containing your OpenSCAD files. This can be a relative path (from the configuration file), or an absolute path.
- `testFiles`: This should be an array of strings, which points to JavaScript specification files. These are the files which run your tests. These can be relative paths (from the configuration file), or an absolute path.

Some example configuration files are provided.

```javascript
// Relative paths
{
  "openScadDirectory": "../../JointSCAD/dist",
  "testFiles": [
    "./jointScadSpec.js",
    "./shoulderSpec.js",
    "./dowelJointSpec.js"
  ]
}
```

```javascript
// Absolute paths
{
  "openScadDirectory": "E:/Developer/JointSCAD/dist",
  "testFiles": [
    "E:/Developer/JointSCAD/spec/jointScadSpec.js",
    "E:/Developer/JointSCAD/spec/shoulderSpec.js",
    "E:/Developer/JointSCAD/spec/dowelJointSpec.js"
  ]
}
```

## Specification Files
Specification detail what assertions and tests to run. Let's look at the example below, before deconstructing it.

```javascript
testSuite("JointSCAD", {
    "use": [],
    "include": ["JointSCAD.scad"]
}, function() {
    it("should plot a shoulder's corners correctly", function() {
        assert.openScadFunction("getShoulderCorners([5, 5, 5])").outputToBe("[[0, 0, 0], [5, 0, 0], [5, 0, 5], [0, 5, 0], [5, 5, 0], [5, 5, 5]]");
        assert.openScadFunction("getShoulderCorners([3, 3, 3])").outputToBe("[[0, 0, 0], [3, 0, 0], [3, 0, 3], [0, 3, 0], [3, 3, 0], [3, 3, 3]]");
    });

    it("should model a shoulder correctly", function() {
        assert.openScadModule("shoulder([3, 3, 3])")
        .toHaveVertexCountOf(6)
        .and.toHaveTriangleCountOf(8)
        .and.toBeWithinBoundingBox([[0, 0, 0], [3, 3, 3]]);
    });
});
```

A specification begins with the declaration of a `testSuite`, which takes three parameters. A name, some options, and a callback function.

A test suite is used to describe a set of tests, thus a meaningful name is recommended.

The options contains a `use` and an `include`. Both of these are arrays of strings, which specify which OpenSCAD files should be imported as `use` and `include` respectively. See [OpenSCAD User Manual](https://en.wikibooks.org/wiki/OpenSCAD_User_Manual/Include_Statement) for more details.

Within the callback function, we can declare as many tests as we like using the `it` function. This function takes a string which describes the test to be done, and a callback function which executes the test itself.

Inside the test, we can test the outcome of an OpenSCAD function or module using `assert.openScadFunction` or `assert.openScadModule`. Both of these functions take a string which should be the OpenSCAD function or module respectively. They can then be chained with another function to test and assert the result with an expected outcome.

While specific details can be found in the [API Reference](#api-reference).

# API Reference
## General
### `testSuite(name, options, callback)`

| Parameter | Data Type | Description |
|---|---|---|
| name | String | The name of the test suite. Used to report failures. A descriptive name which describes the collection of tests is recommended. |
| options | Object | Specifies which files to `use` and `include` for each test in the given test suite. | 
| callback | Function | A function which is used to specify the execution of the test suite. |

### `it(name, callback)`

| Parameter | Data Type | Description |
|---|---|---|
| name | String | The name of the test. Used ot report failures. A descriptive name which describes the test is recommended. |
| callback | Function |  A function which is used to specify the execution of the test. |


## OpenSCAD Function Assertions
### `assert.openScadFunction(openScadFunction)`

**Returns:**

```javascript
{
  'outputToBe': function(expectedOutput) {
    ...
  }
}
```

| Parameter | Data Type | Description |
|---|---|---|
| openScadFunction | String | The OpenSCAD function to be run (excluding the line-ending semi-colon). e.g. `getShoulderCorners([3, 3, 3])` |

### `outputToBe(expectedOutput)`

**Returns:**
```javascript
{
  'and': {
    'outputToBe': function(expectedOutput) {
      ...
    }
  }
}
```

| Parameter | Data Type | Description |
|---|---|---|
| expectedOutput | String | The expected output of the previously specified OpenSCAD function as a string. |

## OpenSCAD Module Assertions
### `assert.openScadModule(openScadModule)`

**Returns:**

```javascript
{
  'stlFileToBe': function(expectedFile) {
    ...
  },
  'toHaveTriangleCountOf': function(expectedTriangles) {
    ...
  },
  'toHaveVertexCountOf': function(expectedVertices) {
    ...
  },
  'toBeWithinBoundingBox': function(bounds) {
    ...
  }
}
```

| Parameter | Data Type | Description |
|---|---|---|
| openScadModule | String | The OpenSCAD module to be run (excluding the line-ending semi-colon). e.g. `shoulder([3, 3, 3])` |

### `stlFileToBe(expectedFilePath)`

**Returns:**

```javascript
{
  'and': {
    'stlFileToBe': function(expectedFilePath) {
      ...
    },
    'toHaveVertexCountOf': function(expectedVertices) {
      ...
    },
    'toHaveTriangleCountOf': function(expectedTriangles) {
      ...
    },
    'toBeWithinBoundingBox': function(bounds) {
      ...
    }
  }
}
```

| Parameter | Data Type | Description |
|---|---|---|
| expectedFilePath | String | Path to an STL file. The OpenSCAD module will be converted to an STL, and the compared to the given file for equality. |

### `toHaveVertexCountOf(expectedVertices)`

**Returns:**

```javascript
{
  'and': {
    'stlFileToBe': function(expectedFilePath) {
      ...
    },
    'toHaveVertexCountOf': function(expectedVertices) {
      ...
    },
    'toHaveTriangleCountOf': function(expectedTriangles) {
      ...
    },
    'toBeWithinBoundingBox': function(bounds) {
      ...
    }
  }
}
```

| Parameter | Data Type | Description |
|---|---|---|
| expectedVertices | Integer | The expected number of vertices, to be compared against the model created by the given OpenSCAD module. |

### `toHaveTriangleCountOf(expectedTriangle)`

**Returns:**

```javascript
{
  'and': {
    'stlFileToBe': function(expectedFilePath) {
      ...
    },
    'toHaveVertexCountOf': function(expectedVertices) {
      ...
    },
    'toHaveTriangleCountOf': function(expectedTriangles) {
      ...
    },
    'toBeWithinBoundingBox': function(bounds) {
      ...
    }
  }
}
```

| Parameter | Data Type | Description |
|---|---|---|
| expectedTriangles | Integer | The expected number of triangles, to be compared against the model created by the given OpenSCAD module. Triangles in this case refers to the number of facets used to create the surfaces of the model. |

### `toBeWithinBoundingBox(bounds)`

**Returns:**

```javascript
{
  'and': {
    'stlFileToBe': function(expectedFilePath) {
      ...
    },
    'toHaveVertexCountOf': function(expectedVertices) {
      ...
    },
    'toHaveTriangleCountOf': function(expectedTriangles) {
      ...
    },
    'toBeWithinBoundingBox': function(bounds) {
      ...
    }
  }
}
```

| Parameter | Data Type | Description |
|---|---|---|
| bounds | Array<Integer[3]>[2] | The bounds, described by an array, of two arrays of three integers. The array follows the format of `[[minX, minY, minZ], [maxX, maxY, maxZ]]`. The model will be considered within bounds if ALL vertices are within or equal to either bounds. |

# Uninstalling
To uninstall UnitTestSCAD, run the command:

`npm uninstall -g unittestscad`

Upon completion of the command, UnitTestSCAD will be uninstalled from the machine.

# Contributing
See the [Contributing](../master/CONTRIBUTING.md) document for more information on contributing.

# License
See the [License](../master/LICENSE) document for more information on licensing.