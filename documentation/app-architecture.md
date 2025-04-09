# App architecture
**Attempt to follow the patterns listed here**

This architecture is inspired by clean architecture and domain centric design, 
which is a popular philosophy for complicated apps in the industry. These
philosophies allow for easy adjustments to the codebase when implementation
details change (e.g. API structure).

## Overall dependency structure
* **Api data model** --(mapped to)--> **Domain model** <--(depends on)-- **Repository** <--(depends on)-- **Pages** <--(depends on)-- **Components**

## Server data flow structure 
The following represents the UDF (unidirectional data flow) pattern. This 
pattern prevents components from becoming a mess, and helps prevent code blocks
when we need to integrate multiple components that require data from a server.

* **DB** --(gives)--> **Repository data** --(is fetched by)--> **Pages** --(passed as props to)--> **Components**
* **Components** --(by calling a function argument e.g. onClick(), sends event to)--> **Pages** --(calls a function defined in)--> **Repository** --(updates)--> **DB**