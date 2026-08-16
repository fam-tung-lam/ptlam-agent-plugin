# Python Testing

Pytest mechanics underneath the behavior, level, placement, and double rules
owned by the `ptlam-code-style` foundation. Use the repository's existing test
runner when it is not pytest.

## Express the behavior

- Use plain assertions and let pytest show the value diff.
- Use `pytest.raises` with the specific type and `match=` for a stable promised
  message. Use `pytest.warns` for a promised warning.
- Parameterize cases that exercise one rule with different inputs. Split cases
  that require different setup, action, or outcome.

## Own setup and cleanup

Keep one-test setup in the test. Promote repeated setup to the narrowest fixture
scope that contains its real consumers. A fixture that acquires a resource uses
`yield` and releases it after the yield, including when the test body fails.
Register cleanup immediately after each successful acquisition with a context
manager, `ExitStack`, or a finalizer so failure before `yield` cannot leak an
earlier resource.

Read the installed async pytest plugin and its configured mode before adding a
marker. Do not add a redundant async marker when automatic mode already owns
collection.

Use `monkeypatch` or a spec-constrained mock at an external boundary. Patch the
name where the code under test looks it up. Use `AsyncMock` only for an awaited
contract, and keep one-off patches in the test that needs them.

Use pytest fixtures such as `tmp_path`, `monkeypatch`, `capsys`, and `caplog`
for the boundaries selected by the foundation instead of creating shared
mutable test globals.

The official [pytest fixture guide](https://docs.pytest.org/en/stable/how-to/fixtures.html)
owns current fixture execution and cleanup behavior. Recheck it when the
installed major or fixture teardown behavior changes.

Finish when the focused test fails for the broken behavior, passes for the
implemented contract, and leaves no state for the next test.
