# FastAPI Request Pipeline

The default boundary for a new feature-first service. Preserve an existing
coherent architecture, but do not introduce a second request path inside it.

```text
router -> use case -> repository -> session or HTTP client
```

Every request follows this path. A router imports no repository, session, or
integration client. A repository imports no use case. Reads and writes use the
same lane, including a read whose use case only maps absence to a domain error.

The short use cases required by simple reads are the deliberate cost of making
the boundary predictable. Do not create a direct read path that future handlers
must distinguish from the write path.

## Give each boundary one responsibility

| Boundary | Owns | Does not own |
| --- | --- | --- |
| Router | HTTP input, auth, response schema, status | Policy, queries, transaction decisions |
| Use case | One operation, orchestration, transaction boundary | `Request`, `Depends`, `HTTPException` |
| Domain | Business values, rules, and failures | FastAPI or persistence mechanics |
| Repository | One persistence or remote-data contract | Transport schemas, HTTP errors, commit policy |
| Pydantic schema | Request and response validation and serialization | Database writes or orchestration |

Dependencies assemble the path at the framework boundary. Convert transport,
persistence, vendor, and domain values where their meaning changes. Framework
types stop at the router and dependency provider.

## Review the pipeline mechanically

Search every changed router for repository, session, SQLAlchemy, and integration
imports. Search every use-case package for FastAPI and Starlette imports. Search
routers for commits and repositories for unconditional or hidden commit calls.
Each result must either be removed or be an already-owned legacy exception
outside the requested change.

Finish when every changed route reaches data through one use case, every use
case owns one transaction decision, and no lower boundary imports its caller.
