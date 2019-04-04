# Todos

### Goals for alpha-mom testing:
| Goal                          | Tag         | Priority | In Progress | Done |
| ----------------------------- | ----------- | :------: | ----------: | ---: |
| React Components              | qol, js     |   low    |             |      |
| Filter public art by class    | js          |   high   |         yes |  MVP |
| Flag public art               | graphql, js |   high   |             |      |
| Get photos & show info window | graphql, js |   high   |         yes |  MVP |

| React components                   | Status |
| ---------------------------------- | ------ |
| Dropdown menu size more consistent |        |
| Move to another file               |        |

| Filter public art by class                                        | Status |
| ----------------------------------------------------------------- | ------ |
| Add options                                                       | done   |
| Ability to select multiple options                                |        |
| Store types as list in dynamoDB (currently only one type allowed) |        |
| Make types an enum in Appsync GraphQL API                         |        |

| Flag public art/event                  | Status            |
| -------------------------------------- | ----------------- |
| Seperate DynamoDB table                |                   |
| Authentication for users               | URGENT FOR PUBLIC |
| Seperate classes for public/private    |                   |
| Make flags enum in Appsync GraphQL API |                   |

| Get photos & Info Window                       | Status            |
| ---------------------------------------------- | ----------------- |
| Download from DB                               | done              |
| Close old info window when a new one is opened | done              |
| Upload resized photos to db (400 x 400?)       |                   |
| Upload photos (mobile app only?)               |                   |
| Enforce Google Places API from app/site only   | URGENT FOR PUBLIC |