# Status
MVP
https://d3w3kga4a1s0nc.cloudfront.net/

# Todos

### Goals for alpha and beta testing:
| Goal                          | Tag          | Priority | In Progress | Done |
| ----------------------------- | ------------ | :------: | ----------: | ---: |
| React Components              | qol, js      |   low    |             |      |
| Filter public art by class    | js           |   high   |         yes |  MVP |
| Flag public art               | graphql, js  |   high   |         yes |  MVP |
| Get photos & show info window | graphql, js  |   high   |         yes |  MVP |
| UI & QOL improvements         | qol, css, js |   low    |             |      |

| React components                                              | Status |
| ------------------------------------------------------------- | ------ |
| Move to another file                                          |        |
| Turn map itself into React component (google-maps-react)      |        |
| Have info window content be component that then contains form |        |

| Filter public art by class                                        | Status |
| ----------------------------------------------------------------- | ------ |
| Add options                                                       | done   |
| Ability to select multiple options                                |        |
| Store types as list in dynamoDB (currently only one type allowed) |        |
| Make types an enum in Appsync GraphQL API                         |        |

| Flag public art/event                  | Status                    |
| -------------------------------------- | ------------------------- |
| Seperate DynamoDB table                |                           |
| Authentication for users               | (KINDA) URGENT FOR PUBLIC |
| Seperate classes for public/private    |                           |
| Make flags enum in Appsync GraphQL API |                           |

| Get photos & Info Window                       | Status            |
| ---------------------------------------------- | ----------------- |
| Download from DB                               | done              |
| Close old info window when a new one is opened | done              |
| Upload resized photos to db (400 x 400?)       |                   |
| Upload photos from app (mobile app only?)      | URGENT FOR PUBLIC |
| Enforce Google Places API from app/site only   | done              |

| UI & QOL improvements                                   | Status          |
| ------------------------------------------------------- | --------------- |
| Resize image window to a standard size                  |                 |
| Place 'Report location' in own div                      |                 |
| Main dropdown menu size more consistent                 |                 |
| All code to call AWS client should be in one file (-_-) |                 |
| Change name "flag form" -> "report form"                |                 |
| Fix problem with 'amplify publish'                      | HUGELY ANNOYING |
