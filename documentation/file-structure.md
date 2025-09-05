# File structure

This file describes the file structure we will aim to follow. We will aim to
follow a module based approach.

## What is a module?

A module encompasses files related to one domain concept, for example: property-listing,
notifications, agent-dashboard, etc.

## Structure

- `app`: The core module for the app. Contains our src code.
- `app/client`: Frontend / browser code
  - `library-modules`: Modules which contain functionalities not directly related to the UI for the app.
    - `apis`: Contains the api interface. Repositories call this to get the raw api data before mapping it to a domain model
    - `domain-models`: Contain the domain models for the app. Domain models represent a business concept with business fields/attributes.
  - `ui-modules`: Modules for the UI of the app.
    - `<module>/state`: Contain business logic state management and logic. This is where the redux slices and
      state objects sit for that domain.
    - `themed`: Shared components specific to our figma designs
    - `common`: Shared components not specific to our figma designs
- `app/server`: Server code. Code that interacts securely with our data store (DB)
  - `database`: Contains the problem domains and their associated MongoDB definitions (i.e. collection & model definitions)
  - `methods`: The APIs the server exposes. Called by the frontend API interfaces defined in `app/client/library-modules/apis`.
- `scripts`: Any shell scripts go here
- `documentation`: Any documentation for the project goes here
- `patches`: Patches for dependency installations

Here is a visual representation of our folder structure:

├── app/
│ ├── client/
│ │ ├── library-modules/
│ │ │ ├── apis/ # Frontend interfaces to server APIs
│ │ │ └── domain-models/ # Business models (e.g. Property, Agent, Notification)
│ │ ├── ui-modules/
│ │ │ ├── <module>/state/ # Redux slices and business logic for each module
│ │ │ ├── themed/ # Reusable components styled per Figma designs
│ │ │ └── common/ # Reusable generic components (buttons, inputs, etc.)
│ │
│ ├── server/
│ │ ├── database/ # Mongo collections and model definitions
│ │ └── methods/ # Meteor methods (backend API functions)
│
├── scripts/ # Project-specific shell scripts
├── documentation/ # Internal docs (architecture, setup, workflows)
├── patches/ # Dependency installation patches

More details on a folder by folder basis:
app/
Root Source directory for the client and server code
app/client/
Client side logic (Browser executed code)
library-modules/
Shared, non-UI modules including
apis/
API interfaces used by the UI modules to interact with the backend Meteor methods
domain-models/
Domain models representing core business entities (Agent, Property)
ui-modules/
UI and state logic, grouped by feature module
module>/state
This is the Redux slices or local state logic for the given feature (module)
themed/:
Shared components specific to Figma design
common/:
Shared components not specific to Figma
app/server/
Server side Meteor code
database/
MongoDB Collections, schemas, model setup
methods/
Meteor methods (server side APIs) that perform logic and return data
These are client/library-modules/apis
Scripts/
Shell scripts for environment setup, seeding, deployment
