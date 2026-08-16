# Visibility

Which boundary is correct between public, internal, and private, and what a
consumer may reach. The specialization owns how the language spells each one.

## Private by default

A new symbol, file, or module is internal until a consumer outside its own unit
needs it. Widening later is cheap. Narrowing after someone depends on it is not.

Public means someone outside the unit may call it, and that changing it breaks
them. Nothing becomes public because it happened to be useful during
development.

## One published surface per unit

Each unit publishes its API through one entry point — an export file, a package
index, an explicit export list. Consumers import from that entry point.

Reaching past it into an implementation file is a defect, even when the language
allows it. When a consumer needs something the entry point does not publish,
either publish it deliberately or move the behavior.

## Name after the one thing it owns

Name a file, type, or function after the single responsibility it carries. A
name that needs "and" describes two things; split them.

Avoid `helper`, `misc`, `utils`, `common`, and `shared` as the whole name. They
attract unrelated code because nothing in the name says what belongs there.

## Depend in one direction

State which way dependencies flow between layers or packages, and keep every
import consistent with it. A cycle between units means the boundary is in the
wrong place, not that the tool needs configuring.

An outer layer may know about an inner one. An inner layer never imports its
caller.

## Create structure when the first file needs it

Add a directory when something concrete goes in it. Do not scaffold an empty
layer tree in advance; empty structure invites files that do not belong.

## Finish

Finish when every new symbol is as narrow as its real consumers allow, every
consumer reaches it through a published entry point, and no dependency runs
against the declared direction.
