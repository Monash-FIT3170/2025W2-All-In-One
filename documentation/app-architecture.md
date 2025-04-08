# App architecture
App architecture can be ignored for smaller apps, but is extremely important 
for larger apps, and is crucial for maintaining a scalable application.

This architecture is inspired by clean architecture and domain centric design, 
which is the most used philosophy for complicated apps in the industry. These
philosophies allow for easy adjustments to the codebase when requirements change.

## Structure
**Api data model** --(mapped to)--> **Domain model** <--(depends on)-- **Repository** <--(depends on)-- **Pages & Components**
