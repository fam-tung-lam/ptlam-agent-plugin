# Python Typing

Type mechanics for Python code. The repository's minimum Python version and
configured checker decide which syntax and features are available.

## Type changed production code

Annotate every parameter and return of a callable you add or substantively
change. Add attribute and local annotations when inference does not make the
contract clear. Preserve an existing public signature unless the requested
change owns its compatibility impact.

- Prefer precise domain types over `Any`. Use `object` and narrow it when the
  input is genuinely unknown.
- For callable inputs, accept useful abstractions such as `Iterable`,
  `Sequence`, `Mapping`, or a small `Protocol`; return the concrete type the
  caller receives. Validation and serialization models may need concrete
  containers.
- Use builtin generics and `X | None` only when every supported interpreter
  accepts them. Otherwise follow the project's compatibility syntax.
- Use `TypedDict` for a fixed dictionary shape and a dataclass or model when
  behavior, validation, or identity gives the value a stronger owner.
- Make a new API keyword-only when positional order is easy to confuse. Do not
  retrofit keyword-only arguments onto a public API without a compatibility
  plan.

Never use a mutable object as a function default. Use `None` as a sentinel or a
factory owned by the data-model mechanism.

## Keep static and runtime guarantees distinct

Type hints do not validate untrusted input. Validate at the boundary that owns
the data and raise a useful runtime exception. Never rely on `assert` for
correctness, caller validation, or a promised failure because optimized Python
can remove it. Reserve it for a debug-only internal check whose removal is
harmless.

Use casts and ignores only after narrowing cannot express a fact the checker
misses. Keep a suppression on the smallest expression, include the exact error
code when supported, and state the reason the checker cannot prove it.

For a package that promises downstream type information, include and publish the
repository's `py.typed` marker. Test the built artifact rather than assuming the
source-tree configuration reaches consumers.

Finish when the configured checker reports no new failure in changed code and
the annotations describe values the runtime really returns.
