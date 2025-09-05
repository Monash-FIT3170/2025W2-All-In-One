# App architecture

The architecture we are following is **clean architecture + layered architecture**.

We will also follow the **UDF (unidirectional data flow)** pattern.
UDF states that data should only flow from higher to lower levels, whilst events
should only flow from lower to higher levels.

For the architectural diagram, see
[here](https://app.diagrams.net/#G1KfvI2l3sSw60OnoCoiyBvBQL2PPhB4ps)


AppRoot />: The root component of our application. It is the entry point for React’s rendering and is located in main.tsx
main.tsx: File serving as the entry point for a Meteor application’s frontend
Components: React components
Client: Meteor’s frontend code, consisting of tsx and ts files
Db schema: Our database collection and documents structure
Domain model: Model representing a business object. Serves to decouple business concepts from low level technical details such as API data models 
DTO: Data transfer object. A data model for communicating information between applications, in this case between the server and the client.
Interface: The type definitions for the parameters and output of the functions
MongoDB: NoSQL Database
Pages: Page react components representing one singular page
Repository: Interface for interacting with the server and data layer, except data revolves around the business models (i.e. domain models). This decouples the API implementation from the business ideas which is beneficial for scalability.
Redux: 
Redux is a container for storing page state. A container is represented by a .ts file containing slices. Redux slices are smaller containers which segregate data for different domains.
Business logic sits in Redux slices which involve data and domain layer interactions
Pages read from the state present in a Redux slice and re-render themselves when that state updates
Actions (events) are dispatched to Redux slices which update the page state and hence cause page re-renders.
Server: The Meteor server running off node.js, located in app/server. 

Benefits of the architecture: The following benefits are crucial for large apps
Decoupling of the business concepts with the underlying infrastructure such as our API layer and DB
Prevents refactoring across multiple layers if one layer was to change 
Easier to test as layers are segregated and components each have one functionality (i.e. follows SRP)

Disadvantages of the architecture
More boilerplate and overhead
The team needs to understand and learn the relevant theory
