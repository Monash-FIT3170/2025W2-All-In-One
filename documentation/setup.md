# Setup
This document describes how to get started with development.

## Git Setup 
Pre-requisites: 
Please ensure you have the following setup: 
Git
Visual Studio Code
GitHub account
GitHub CLI (not mandatory but helpful) 
VSCode Extensions: 
GitHub Pull Requests and Issues
GitLens
Prettier (for formatting) 

### All In One Repository Basics: 
‘All in one’ Repository Basics: 
To join our repository, please follow this URL:
 https://github.com/Monash-FIT3170/2025W2-All-In-One
This will take you to our Git repository, "All-In-One", which contains all the code for our web application.
This repository is where all new code you write will be pushed. It allows developers to review each other's code and test it before it goes live.
Our repository uses a main branch, which reflects the current deployed state of the application.
 You should always create your personal branches from the main branch.
To start developing, the first step is to copy the HTTPS URL of the repository from the link above
 
Cloning the repository
Open VScode 
Press Control, Shift,P (Cmd, Shift, P) to open the Command Pallete
Type and select: Git: Clone
Paste the repository URL:  https://github.com/Monash-FIT3170/2025W2-All-In-One
Choose the folder you would like the repository to be stored
VSCode may ask if you want to open the cloned repository → Choose yes! 

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
2. Configure ESLint for linting by following the section immediately below.

#### Configuring ESLint
1. In vscode, Enter the settings for ESLint by clicking the cog icon next to the ESLint extension 
in the `Extensions` tab of vscode
2. Find the `Eslint: Use Flat Config` option and enable it.

### Step 3: Configure vscode settings
1. Enter the settings of vscode by clicking on the cog on the bottom left of your screen.
2. Search for the `Editor: Tab Size` option and set it to `2`.

### Step 4: Setting up debugging in vscode
1. In vscode, click the `Run` tab in the navbar, and click `Add Configuration...`
2. In the dropdown, click `Web App (Chrome)`
3. Replace the file contents with the following and save:
```
{
  "version": "0.2.0",
  "configurations": [
      {
          "type": "chrome",
          "request": "launch",
          "name": "Meteor: Chrome",
          "url": "http://localhost:3000",
          "webRoot": "${workspaceFolder}",
          "outputCapture": "std"
      },
      {
          "type": "node",
          "request": "attach",
          "name": "Attach to Meteor: Node",
          "port": 9229
      }
  ],
  "compounds": [
      {
          "name": "Meteor: All",
          "configurations": ["Attach to Meteor: Node", "Meteor: Chrome"]
      }
  ]
}
```
4. Debugging is now configured. 

#### How to debug
1. Ensure the app is running in debug mode (aka `meteor run --inspect` has been run)
2. Ensure `Meteor: All` debug mode is set by going to the 'Run & Debug tab' and selecting 
`Meteor: All` next to the green play button
3. Set a breakpoint in the code and select `Run` in the navbar and click `Start Debugging`.

### Step 5: Testing your configuration
1. Open up a terminal at the root of the project and run `meteor run`
2. Check to see that the app successfully builds.
