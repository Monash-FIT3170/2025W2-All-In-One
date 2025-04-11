# App architecture
The architecture we are following is **clean architecture + layered architecture**.

We will also follow the **UDF (unidirectional data flow)** pattern. This 
pattern prevents components from becoming a mess by preventing data
flows in all directions which can cause a need to use bad patterns or
roundabout methods when creating new components. UDF states that data
should only flow from higher to lower levels, whilst events should only
flow from lower to higher levels.

For the architectural diagram, see 
[here](https://app.diagrams.net/#G1KfvI2l3sSw60OnoCoiyBvBQL2PPhB4ps)