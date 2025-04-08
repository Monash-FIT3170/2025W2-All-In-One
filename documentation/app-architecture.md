# App architecture
**Always attempt to follow the patterns listed here**

App architecture can be ignored for smaller apps, but is extremely important 
for larger apps, and is crucial for maintaining a scalable application.

This architecture is inspired by clean architecture and domain centric design, 
which is the most used philosophy for complicated apps in the industry. These
philosophies allow for easy adjustments to the codebase when requirements change.

## Overall dependency structure
A dependency in the incorrect direction means you are likely performing a bad practice.
* **Api data model** --(mapped to)--> **Domain model** <--(depends on)-- **Repository** <--(depends on)-- **Pages** <--(depends on)-- **Components**

## Server data flow structure 
The following represents the UDF (unidirectional data flow) pattern. This 
pattern ensures we don't get blocked when we need to link several
components that rely on data from a server. It's happened to me before and
requires tons of time to fix.

* **DB** --(gives)--> **Repository data** --(is fetched by)--> **Pages** --(passed as props to)--> **Components**
* **Components** --(by calling a function argument e.g. onClick(), sends event to)--> **Pages** --(calls a function defined in)--> **Repository** --(updates)--> **DB**