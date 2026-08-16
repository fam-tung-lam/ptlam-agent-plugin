# Synchronized State Model

This reference owns the synchronized step model for lessons with time or state.
A static artifact has no state model to implement.

## One model drives everything

Drive active nodes, active edges, observable values, captions, counters, and
paired analogy and literal views from one step model.

## Controls

Provide Back, Next, Play/Pause, and Reset. Never auto-play.

| Control | Must do |
| --- | --- |
| Back | Restore the exact previous state |
| Reset | Restore step 1 |
| Play | Stop at the end, and be able to replay |

Preserve the current step across viewport changes. Stop playback while the
document is hidden.

## Scripts stay an enhancement

Use inline classic or module scripts according to your scoping needs. Import no
runtime dependency.

Put a useful default state in the HTML, and a complete ordered fallback for
every step, so JavaScript enhances the explanation rather than owning it.

## Finish

Finish when every control causes one deterministic transition, and the document
still explains every step with scripts disabled.
