# Learning Sequence

Read this when composing or reordering an explainer's sections. It owns the
order the document teaches in.

## Order the page top to bottom

Put orientation before mechanism, then progressively deeper views. A learner
who scrolls straight through should never meet a term the page has not yet
introduced.

Keep the primary view before observable state and shared controls, in both DOM
order and narrow-screen order. Those two orders drift apart easily when a
layout uses grid placement, so check the narrow rendering rather than assuming.

## Keep the main sequence visible

Keep the main sequence on the page rather than behind tabs. Tabs hide the shape
of the explanation, and a learner cannot tell what they have not read.

Use progressive disclosure for supporting detail — a caveat, a full data table,
an alternate path — not for a step in the main sequence.

## Finish

Finish when the static document teaches the whole sequence in order, and no
step of the main explanation is hidden behind a control.
