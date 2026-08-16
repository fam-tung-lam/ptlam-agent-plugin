# FastAPI Boundaries

The default responsibility map when an existing repository has no stronger
architecture. Create a layer only when it owns a real rule or external
boundary; do not scaffold pass-through classes to satisfy the table.

| Boundary | Owns | Does not own |
| --- | --- | --- |
| Route | HTTP input, auth dependency, status, response schema | Business policy, persistence queries |
| Application operation or service | One use case, orchestration, transaction decision | `Request`, `Depends`, response codes |
| Domain | Business values, rules, and failures | FastAPI or database types |
| Repository or adapter | One storage or external-system contract | Pydantic transport schemas, HTTP errors |
| Pydantic schema | Request and response validation and serialization | Database writes, business orchestration |

Dependencies flow from the route toward the application and infrastructure
boundaries. A lower boundary never imports its HTTP caller. Convert transport,
ORM, vendor, and domain values at the boundary that owns the change of meaning.

Follow the repository's established application boundary. Add an application
operation when it owns policy, orchestration, reuse, or a transaction decision.
For a trivial translation with none of those responsibilities, the route may
call one injected existing service or adapter directly. It still does not
construct persistence queries, choose commit policy, or pass FastAPI types
below the boundary.

Finish when each added boundary owns a concrete responsibility, framework
types stop at the HTTP edge, and reusable policy does not live in a route.
