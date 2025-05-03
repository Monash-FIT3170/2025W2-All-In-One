# File structure
This file describes the file structure we will aim to follow. We will aim to
follow a module based approach.

## What is a module?
A module encompasses files related to one domain concept, for example: property-listing, 
notifications, agent-dashboard, etc.

## Structure
* `app`: The core module for the app. Contains our src code.
* `app/client`: Frontend / browser code
  * `library-modules`: Modules which contain functionalities not directly related to the UI for the app.
    * `apis`: Contains the api interface. Repositories call this to get the raw api data before mapping it to a domain model
    * `domain-models`: Contain the domain models for the app. Domain models represent a business concept with business fields/attributes.
  * `ui-modules`: Modules for the UI of the app.
    * `<module>/state`: Contain business logic state management and logic. This is where the redux slices and 
      state objects sit for that domain. 
    * `themed`: Shared components specific to our figma designs
    * `common`: Shared components not specific to our figma designs
* `app/server`: Server code. Code that interacts securely with our data store (DB)
  * `database`: Contains the problem domains and their associated MongoDB definitions (i.e. collection & model definitions)
  * `methods`: The APIs the server exposes. Called by the frontend API interfaces defined in `app/client/library-modules/apis`.
* `scripts`: Any shell scripts go here
* `documentation`: Any documentation for the project goes here
* `patches`: Patches for dependency installations
