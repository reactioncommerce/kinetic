![Screenshot](https://user-images.githubusercontent.com/72819/188587709-94e25136-8a77-4d52-8774-ead032d7eaf4.png)


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
## Example:
### Add a custom plugin
There is an example Customer plugin inside [examples](./src/examples/Customers/) folder. We're going to disable the default customer feature and replace with this custom plugin.

All the features entry points are declared inside the [routes](./src/routes.tsx) file.

To include our custom plugin into the app, we need to declare the entry point in the routes file. Please modify the routes file:

```diff
// in routes.tsx

// ... other import statements

+ import SupportAgentIcon from "@mui/icons-material/SupportAgent";
+ import { CORE_FEATURES, FEATURE_KEYS, ItemProps } from "@components/Sidebar";

// import our feature as a lazy imported components for code splitting
+ const Customers = lazy(() => import("./examples/Customers"));

export const routes: RouteObject[] = [
  {
    // ... routes object
    path: "/",
-    element: <AppLayout/>,
// define custom plugin sidebar item and turn off default customer feature in the sidebar
+    element:
+      <AppLayout
+          sidebar={{
+            plugins: [{
+              text: "Plugins",
+              key: "custom-plugins",
+              subItems: [
+                {
+                  key: "customers",
+                  icon: <SupportAgentIcon fontSize="small"/>,
+                  text: "Customers",
+                  to: "plugins/customers"
+                }
+              ]
+            }],
+            coreFeatures: CORE_FEATURES.filter((sidebarItem) => sidebarItem.key !== FEATURE_KEYS.customers)
+          }}
+      />,
    children: [
+      {
+        path: "plugins/customers",
+        element: <Customers />
+      },
      // ... other routes,
    ]
  }
]

```

Now, start the application and you will see the Customer option under the Plugins sidebar item. Click on that option and you should see the example custom plugin.

### Permissions for Custom Plugins

Every registered user belongs to a dedicated group with configured permissions (except the admin who is the first user of the system, this user is automatically assigned to multiple groups with special permissions). We can change the permissions of a group on the group setting page.

When you add custom pages, they are accessible to the users by default. To make them only accessible to users with proper permissions, you can use the `PermissionGuard` component.

For example, only users with reading accounts permission can access the Customers page, add the permission check at the route level.

```diff
// in routes.tsx

// ... other import statements

import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { CORE_FEATURES, FEATURE_KEYS, ItemProps } from "@components/Sidebar";
+ import { PermissionGuard } from "@components/PermissionGuard";

const Customers = lazy(() => import("./examples/Customers"));

export const routes: RouteObject[] = [
  {
    // ... routes object
    path: "/",
    element:
      <AppLayout
          sidebar={{
            plugins: [{
              text: "Plugins",
              key: "custom-plugins",
              subItems: [
                {
                  key: "customers",
                  icon: <SupportAgentIcon fontSize="small"/>,
                  text: "Customers",
                  to: "plugins/customers"
                }
              ]
            }],
            coreFeatures: CORE_FEATURES.filter((sidebarItem) => sidebarItem.key !== FEATURE_KEYS.customers)
          }}
      />,
    children: [
      {
        path: "plugins/customers",
-       element: <Customers />
+       element: <PermissionGuard permissions={["accounts/read"]}><Customers /></PermissionGuard>
      },
      // ... other routes,
    ]
  }
]

```
*Please note that, we can use `PermissionGuard` at any level of the app to guard the UI components. Normally, we would want to add at the entry point in the route definition.*

Alternatively, if you would prefer modifying the component itself, you can call the hook `usePermission` in the custom page. For example, we want to enforce only users with adding accounts permission can see the `Add` button in the customers page.

```diff
// in src/examples/Customers/index.tsx

// ... other import statements
+ import { usePermission } from "@components/PermissionGuard";


const Customers = () => {
  const { pagination, handlePaginationChange } = useTableState();
+  const canAddCustomer = usePermission(["accounts/create"]);

  ...

  return (
    <Container maxWidth={false} sx={{ padding: "20px 30px" }}>
      <TableContainer>
-        <TableHeader title="Customers" action={<TableAction>Add</TableAction>}/>
+        <TableHeader title="Customers" action={canAddCustomer ? <TableAction>Add</TableAction> : undefined}/>
        ...
      </TableContainer>
    </Container>
  );
};

```

## Developer Certificate of Origin
We use the [Developer Certificate of Origin (DCO)](https://developercertificate.org/) in lieu of a Contributor License Agreement for all contributions to Reaction Commerce open source projects. We request that contributors agree to the terms of the DCO and indicate that agreement by signing all commits made to Reaction Commerce projects by adding a line with your name and email address to every Git commit message contributed:
```
Signed-off-by: Jane Doe <jane.doe@example.com>
```

You can sign your commit automatically with Git by using `git commit -s` if you have your `user.name` and `user.email` set as part of your Git configuration.

We ask that you use your real name (please no anonymous contributions or pseudonyms). By signing your commit you are certifying that you have the right have the right to submit it under the open source license used by that particular Reaction Commerce project. You must use your real name (no pseudonyms or anonymous contributions are allowed.)

We use the [Probot DCO GitHub app](https://github.com/apps/dco) to check for DCO signoffs of every commit.

If you forget to sign your commits, the DCO bot will remind you and give you detailed instructions for how to amend your commits to add a signature.

## License
This Project is [Apache 2.0 Licensed](./LICENSE.md)
