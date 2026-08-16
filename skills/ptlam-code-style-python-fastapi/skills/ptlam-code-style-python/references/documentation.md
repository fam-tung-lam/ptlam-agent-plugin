# Python Docstrings

Python syntax and tool mechanics for the documentation standard owned by the
`ptlam-code-style` foundation.

Use the repository's established docstring convention and documentation tool.
Do not introduce Google, NumPy, Sphinx, or another section style into a project
that already chose one.

When the repository is silent, use a PEP 257-compatible triple-double-quoted
docstring: one summary sentence, a blank line, then the required detail. Put it
as the first statement of the documented module, class, or callable. Let type
annotations carry types instead of repeating them in prose.

Use parameter, return, exception, attribute, and example sections only in the
syntax the configured renderer recognizes. Treat a doctest as executable only
when the repository collects it.

Finish when the docstring parses under the configured tool and, when the
repository generates API documentation, the rendered contract matches the
implementation and tests.
