# curriculum-lpib: SLO Curriculum Leerplan-in-beeld dataset (vakkernen, 
# vaksubkernen en vakinhouden)

This repository contains the courses curriculum dataset. The dataset is 
defined by the `context.json` JSON Schema file. The repository also 
contains the core dataset (https://github.com/slonl/curriculum-basis/) 
as a submodule.

## installation

```
git clone --recurse-submodules https://github.com/slonl/curriculum-lpib
cd curriculum-lpib
npm install
```

You can validate the dataset by running the test command:

```
npm test
```

## contents

This dataset contains the following collections:

- vakkern: A list of core topics in the courses.
- vaksubkern: A list of sub topics in the courses.
- vakinhoud: A list of granular topics in the courses.
- deprecated: A list of deprecated entities

The dataset extends the core dataset and should be used together with it. 
Entities in this dataset reference entities in the core dataset. The 
rules for the core dataset also apply to this dataset, so go read the 
core dataset Readme as well.

## validating the data

Running the test script validates the dataset:

```
npm test
```
