# Synchronized state model

This file covers the step model for a replayable timeline. A static page,
including one that only displays observable state, has no stepper to build.

## One model drives everything

Drive active nodes, active edges, observable values, captions, counters, and
paired analogy and literal views from one step model.

## Controls

Provide Back, Next, Play/Pause, and Reset. Never auto-play.

| Control | Must do                                |
| ------- | -------------------------------------- |
| Back    | Restore the exact previous state       |
| Reset   | Restore step 1                         |
| Play    | Stop at the end, and be able to replay |

Keep the current step across viewport changes. Stop playback while the document
is hidden.

## Scripts stay an enhancement

Use inline classic or module scripts as your scoping needs require. Import no
runtime dependency.

Put a useful default state in the HTML, and a complete ordered fallback for
every step, so JavaScript improves the explanation rather than owning it.

Done when every control causes one predictable transition and the page still
explains every step with scripts disabled.
