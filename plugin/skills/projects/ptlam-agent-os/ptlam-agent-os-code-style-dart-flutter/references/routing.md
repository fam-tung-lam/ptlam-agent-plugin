# Routing

How a feature declares its routes and how the app composes them into one router.
The loaded skill keeps every route in `app_router.dart`; in this monorepo a
feature package declares its own routes and the app composes them.

## The feature declares, the app composes

| Owner   | File                                                | Holds                                                                                     |
| ------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Feature | `lib/src/presentation/routes/<feature>_routes.dart` | Typed route data classes for its pages and the generated route list                       |
| Feature | `lib/ptlam_agent_os_<feature>.dart`                 | Exports the route data classes and the list under a feature-specific name                 |
| App     | `lib/app/app_router.dart`                           | One `GoRouter`: initial location, shells, redirects, error page, and every feature's list |

Every generated route file exposes its list under the same name, so a feature
re-exports it as `ordersRoutes`, `tasksRoutes`, and so on; the app spreads those
lists into one `routes:` argument. Shell routes, authentication redirects, and
the not-found page belong to the app because they span features. Check the
installed `go_router_builder` major before copying an example; the generated
names changed across majors.

## Navigating

Inside a feature, navigate through its own generated route objects. To reach
another feature's page, declare a navigator port in the feature's
`application/ports/` and let the app implement it, as
[composition.md](composition.md#joining-features-in-the-app) describes.

Regenerate route output inside the feature package after changing a route
annotation.
