# Setup
This document describes how to get started with development.

## Pre-requisites
* IDE: Visual studio code
* Node.js >v22.0.0 installed (https://nodejs.org/en/download/)
* Meteor installed (https://docs.meteor.com/about/install.html)
* Project cloned

## Steps
### Step 1: Installing the dependencies
1. Open up a terminal (powershell or linux terminal) in the root of the cloned project
2. Run `npm install`

### Step 2: Install the following extensions
1. On the left hand side, click on the 'Extensions' tab. Then search for and install the
   following extensions:
    * Tailwind CSS Intellisense
    * Prettier
    * ESLint
    * vscode-icons (optional)
3. Configure ESLint for linting by following the section immediately below.

#### Configuring ESLint
1. Enter the settings for ESLint by clicking the cog icon next to the ESLint extension 
in the 'Extensions' tab of vscode
3. Find the `Eslint: Use Flat Config` option and enable it.

### Step 3: Configure vscode settings
1. Enter the settings of vscode by clicking on the cog on the bottom left of your screen.
2. Search for the `Editor: Tab Size` option and set it to `2`.

### Step 4: Testing your configuration
1. Open up a terminal at the root of the project and run `meteor run`
2. Check to see that the app successfully builds.