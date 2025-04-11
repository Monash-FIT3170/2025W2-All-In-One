# App architecture
**Attempt to follow the patterns listed here**

The architecture we are following is clean architecture + layered.

## Dependency direction
* **Api data model** --(mapped to)--> **Domain model** <--(depends on)-- **Repository** <--(depends on)-- **Pages** <--(depends on)-- **Components**

## Data flow structure 
The following represents the UDF (unidirectional data flow) pattern. This 
pattern prevents components from becoming a mess, and helps prevent code blocks
when we need to integrate multiple components that require data from a server.

* **DB** --(gives)--> **Repository data** --(is fetched by)--> **Pages** --(passed as props to)--> **Components**
* **Components** --(by calling a function argument e.g. onClick(), sends event to)--> **Pages** --(calls a function defined in)--> **Repository** --(updates)--> **DB**