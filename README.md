# Kinetic

Kinetic introduces a suite of opinionated admin tools that internal teams can use to manage and run their stores on Open Commerce.


## Run Locally

Clone the project

```bash
  git clone https://github.com/reactioncommerce/kinetic.git
```

Install pnpm

```bash
  npm install -g pnpm
```

Go to the project directory

```bash
  cd kinetic
```

Install dependencies

```bash
  pnpm install
```

Start the server

```bash
  pnpm run dev
```

## Environment Variables

To run this project, you will need to add API endpoint environment variable to your .env file. For example:

```bash
 VITE_API_URL=http://localhost:3000/graphql
```
## Running Tests

To run tests, run the following command

```bash
  pnpm run test
```

## Add Custom Plugins

Kinetic have a level of extensibility and allow users to add custom plugins as well as enable and disable built-in features.

### Steps to add a custom plugin:

- Create a new folder inside the [pages](./src/pages/) directory, this folder should contain all of your plugin implementations.
- Define a new `RouteObject` inside the [routes definition](./src/routes.tsx).
- To add your plugin to the application sidebar, provide a custom sidebar props for `AppLayout` component inside the routes object.

*Note: The `AppLayout` component is used to render the `Sidebar`, `AppBar`, and `PageLayout`. It all comes with a default value to render core features of Kinetic*

Example:

```javascript
// routes.tsx

{
  // ... routes object
  path: "/",
  element:
    <AppLayout
      sidebar={{
        plugins: [
          {
            text: "Plugins",
            key: "plugins",
            subItems: [
              {
                text: "Store Pickup",
                icon: <AbcOutlined fontSize = "small" />,
                to: "/pickup",
                key: "storePickup"
              }
            ]
          }
        ]
      }}
    />
}
```
- If you want to disable or custom a core feature in the sidebar, extends the `CORE_FEATURES` from the `Sidebar` component, modify it and apply to the `AppLayout`. For example, we want to hide the default Orders from the core features and provide our custom Orders page

```javascript
// routes.tsx

import { CORE_FEATURES, FEATURE_KEYS } from "@components/Sidebar";

{
  // ... routes object
  path: "/",
  element:
    <AppLayout
        sidebar={{
           coreFeatures: CORE_FEATURES.filter((sidebarItem) => sidebarItem.key !== FEATURE_KEYS.orders),
           plugins: [
            {
              text: "Plugins",
              key: "plugins",
              subItems: [
                {
                  text: "Custom Orders",
                  icon: <AbcOutlined fontSize = "small" />,
                  to: "/pickup",
                  key: "storePickup"
                }
              ]
            }
        ]
        }}
    />
}
```