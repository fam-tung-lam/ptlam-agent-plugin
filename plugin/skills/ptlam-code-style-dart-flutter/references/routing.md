# Routing

How Flutter declares and invokes application routes.

Keep routes in `app_router.dart`. Declare them with
[`go_router`](https://pub.dev/packages/go_router) and
[`go_router_builder`](https://pub.dev/packages/go_router_builder), so route
names and parameters are checked at compile time.

Navigate through generated route objects. Never construct a route from a
hand-written path string.

Regenerate route output through the shared command in
[SKILL.md](../SKILL.md#shared-toolchain) after changing a route annotation.
