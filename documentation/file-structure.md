# File structure
This file describes the file structure we will aim to follow. We have decided 
to move foward with a module based approach, which is the most common approach 
to file structure in the industry.

## What is a module?
A module encompasses files related to one domain concept, for example: property-listing, 
notifications, agent-dashboard, etc.

## Structure
* `app`: The core module for the app. Contains the entry points for both the client and server
* `library-modules`: Modules which contain functionality for the ui-module modules.
* `ui-modules`: Modules for the UI of the app
* `scripts`: Any shell scripts go here
* `documentation`: Any documentation for the project goes here
* `patches`: Patches for dependency installations
