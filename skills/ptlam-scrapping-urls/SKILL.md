---
name: ptlam-scrapping-urls
description:
  Batch-scrape URLs supplied in a prompt or input file into cached local
  Markdown files with configurable output, concurrency, and cache lifetime.
disable-model-invocation: true
---

# PTLam Scraping URLs

Batch-scrape HTTP and HTTPS pages into local Markdown files. Accept URLs pasted
in the prompt, a text file of URLs, or both. One failed page never aborts the
remaining queue.

Invocation authorizes creating the workspace-local configuration, the output
directory, and the scraped Markdown files. It does not authorize Git
operations, publication, credential changes, or writes outside those paths.

## At a glance

```mermaid
flowchart LR
    ResolveConfiguration["Resolve workspace and configuration"] --> CollectUrls["Collect and validate URLs"]
    CollectUrls --> PrepareJobs["Prepare output jobs"]
    PrepareJobs --> CacheCheck{"Fresh cached file?"}
    CacheCheck -->|"Yes"| RecordCached["Record CACHED"]
    CacheCheck -->|"No"| ScrapeBatches["Scrape in bounded parallel batches"]
    RecordCached --> ReportResults["Report every result"]
    ScrapeBatches --> ReportResults
```

| Concern | Owner |
| --- | --- |
| Saved defaults | Workspace-local `CONFIG.yml` |
| One-run overrides | The current user prompt |
| Page retrieval | The best available scraper, then the host's web-fetch fallback |
| File creation | This invocation, limited to the resolved config and output paths |
| Done | Every supplied URL has a reported status, and every successful file exists |

## 1. Resolve the configuration

Read [configuration](references/configuration.md) before resolving any path. It
owns the workspace root, the canonical `CONFIG.yml`, the three keys, and how a
prompt override wins.

Done when the canonical file exists and all three effective values are valid.

## 2. Collect the URL inputs

Accept either input form, without requiring positional arguments:

- **Prompt URLs.** Extract the URLs the user clearly identifies as scrape
  inputs. Accept absolute `http://` and `https://` URLs in prose, lists, or
  Markdown links. Do not treat an incidental citation in the surrounding
  instructions as a scrape input.
- **Input file.** Resolve the user-supplied path from the workspace root unless
  it is absolute. Read one candidate URL per line. Trim whitespace, and ignore
  blank lines and lines whose first non-whitespace character is `#`.

When both forms are present, combine them in prompt-then-file order and drop
exact duplicates after trimming.

Stop with the path and the reason when an explicit input file is missing,
unreadable, or empty after filtering. Record malformed or unsupported
candidates as `SKIPPED`; never turn one into a guessed URL. Stop when no valid
HTTP or HTTPS URL remains.

Done when every candidate is either one normalized input URL or one recorded
`SKIPPED` result.

## 3. Prepare the output jobs

Resolve a relative `OUTPUT_DIRECTORY` from the fixed workspace root. Create the
directory before any retrieval, and stop with the filesystem error if creation
fails.

Read [output files](references/output-files.md). It owns filename derivation,
collision handling, and the cache check that decides which URLs still need
retrieval.

Done when the output directory exists, every valid URL maps to one unique path
inside it, and each one is either `CACHED` or queued once.

## 4. Scrape the queue

Process independent URLs concurrently without exceeding `MAX_PARALLEL_TASKS`.
When the host supports subagents, give each task one resolved URL and target
path, launch at most the configured number together, and wait for that batch
before launching the next. Otherwise use the host's bounded concurrency, or run
sequentially.

Give each task this outcome and fallback order:

1. Retrieve the page with an available purpose-built page-to-Markdown scraper,
   such as Firecrawl's scrape operation with Markdown output.
2. If that tool is unavailable or fails, use the host's URL-fetch or web-open
   tool with this instruction:

   ```text
   Extract the full page content as Markdown. Preserve headings, paragraphs,
   code blocks, lists, tables, and document order. Return page content rather
   than a summary.
   ```

3. Treat access blocks, authentication requirements, empty results, and pages
   that are only an error page as failures. Never invent missing content.
4. Write a successful result to a temporary file beside the target, verify it
   is non-empty, then replace the target. This keeps an expired prior file when
   retrieval fails.
5. Return exactly one machine-readable result line:

   ```text
   OK|<url>|<filename>|<size_bytes>
   FAILED|<url>|-|-|<short_reason>
   ```

When a task fails, record it and continue through the remaining batches.

Done when every queued URL has one `OK` or `FAILED` result, and every `OK`
target exists at the reported non-zero size.

## 5. Report the run

Print one row for every supplied candidate, in the original order:

```markdown
| # | URL | Status | File | Size | Detail |
|---|-----|--------|------|------|--------|
```

Use `OK`, `FAILED`, `CACHED`, or `SKIPPED`. Put a concise failure or skip
reason in `Detail`, and leave it empty for successful and cached rows. Then
report totals as: `X succeeded, Y failed, Z cached, W skipped, N supplied.`

Complete the task when the table accounts for every candidate, the totals match
its rows, and every `OK` or `CACHED` path and size has been verified.
