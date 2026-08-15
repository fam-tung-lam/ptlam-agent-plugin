---
name: ptlam-explaining
description:
  Explain a concept, mechanism, or system so the learner can use it, by
  establishing the literal model first and then selecting the explanatory device
  that fits the learner's difficulty. Use when the user asks to explain,
  clarify, teach, or break down something; when an earlier explanation did not
  land and needs a different approach; or when another skill needs a verified
  literal model before rendering it. Owns the learning goal, depth, literal
  model, device selection, composition order, and verification. Do not use for
  reference documentation, API listings, status reporting, or answering a direct
  factual question that needs no mental model.
disable-model-invocation: true
---

# PTLam Explaining

Build the learner's mental model of one concept, then check that they can use
it. This foundation owns the learning goal, the literal model, device selection,
composition order, and verification. A device specialization owns only the
machinery of the device it names.

## Decision ownership

| Decision | Source of truth |
| --- | --- |
| Learning goal, depth, literal model, device selection, verification | This foundation skill |
| Facts about the concept | The authoritative source for that domain |
| Internal rules of a selected device | That device's specialization skill |
| Rendering and delivery format | The calling skill, or the learner's request |

When a specialization and this skill disagree about the explanation's shape,
follow this skill. When they disagree about the device's own rules, follow the
specialization.

## 1. Resolve the learning goal

Identify:

- the concept to explain;
- what the learner already knows that you can build from;
- the specific mechanism that is confusing;
- the depth, language, and output constraints; and
- any device the learner asked for or ruled out.

Ask only when the concept is missing or too vague to explain accurately. Infer
ordinary presentation choices and continue.

Complete this step when the concept, prior knowledge, confusing mechanism,
depth, language, and requested or excluded devices are known or safely inferred.

## 2. Establish the literal model

Capture the real structure before choosing how to present it:

- essential actors, objects, and boundaries;
- ownership, containment, dependencies, and cardinality;
- inputs, outputs, order, handoffs, and causal rules;
- relevant states, transitions, lifetimes, and failure behavior; and
- exact constraints, facts, and names that must stay literal.

Cover only the mechanism needed at the requested depth. Verify a claim when the
request or the risk requires it. Exclude an uncertain detail rather than
inventing one that makes the explanation tidier.

Complete this step when every material relationship within scope is captured and
uncertain claims are verified or excluded.

## 3. Select the explanatory device

Choose from the learner's difficulty, not from the concept's subject:

| The learner cannot | Device |
| --- | --- |
| Picture the mechanism, and asked for an analogy | `ptlam-explaining-with-analogy` |
| Picture the mechanism, with no analogy requested | One concrete instance, then generalize from it |
| Tell two neighboring concepts apart | Contrast on the single dimension that separates them |
| Follow or operate the process | Walk the causal chain in execution order |
| See why it is built this way | Name the constraint that forced it and the alternative it rejected |
| Hold the whole system in mind | Whole first, then one level of parts at a time |

Route to the analogy specialization only when the learner explicitly asks for an
analogy. Combine two devices only when the first leaves a named gap the second
closes.

Complete this step when one device is selected and any learner-supplied or
learner-excluded device is honored, or refused for a named reason.

## 4. Compose the explanation

Order the material so every sentence is understandable from what came before it:

- Open with the one-sentence literal answer, before any device.
- Build from what the learner already knows toward what they do not.
- Introduce one new idea at a time, and name it where it is first needed.
- Give the simple version first and the precise qualifier immediately after.
- Keep exact facts, names, and constraints literal wherever the device pulls
  toward paraphrase.
- End with what the explanation does not cover.

When a calling skill invoked this one, return the literal answer, the body, and
the limits as separate components, and let the caller own their rendering.

Complete this step when the explanation carries no forward reference, every term
is defined where it first appears, and its limits are stated.

## 5. Verify the explanation

Run the reconstruction test: name a case the explanation did not cover, then
check whether its own content predicts the behavior. When it does not, the model
is incomplete — return to step 2 instead of adding more words.

Then confirm that:

- every term is defined at first use;
- no step depends on something introduced later;
- exact facts survived the device intact; and
- every material simplification is named as a limit.

Complete this step when the reconstruction test passes and each check holds.

## 6. Handle follow-ups

| The learner asks for | Response |
| --- | --- |
| More depth | Extend the literal model first, then re-select the device for the new depth |
| A simpler version | Narrow the learning goal; do not delete the qualifiers |
| A different device | Re-enter step 3 with the used device excluded |
| A related concept | Build a new literal model, and link back only where the mechanism is shared |
| A challenge to the explanation | Name the limitation and its structural reason, then offer the device that closes it |

Complete a follow-up when its new scope passes steps 2 through 5.
