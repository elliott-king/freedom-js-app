# Status
MVP
https://d3w3kga4a1s0nc.cloudfront.net/

# Todos

### Goals for alpha and beta testing:
| Goal                          | Tag          | Priority | In Progress |                Done |
| ----------------------------- | ------------ | :------: | ----------: | ------------------: |
| React Components              | qol, js      |   low    |             |                     |
| Filter public art by class    | js           |   high   |         yes | unnecessary for MVP |
| Flag public art               | graphql, js  |   high   |         yes |                 MVP |
| Get photos & show info window | graphql, js  |   high   |         yes |                 MVP |
| Upload new location           | graphql, js  |   high   |         yes |                     |
| UI & QOL improvements         | qol, css, js |   low    |             |                     |

| React components                                               | Status |
| -------------------------------------------------------------- | ------ |
| Turn map itself into React component (google-maps-react)       |        |
| Have info window content be component that then contains form  | done   |
| Forms should handle changes in multiple inputs with one method |        |

| Filter public art by class                                        | Status |
| ----------------------------------------------------------------- | ------ |
| Add options                                                       | done   |
| Ability to select multiple options                                |        |
| Store types as list in dynamoDB (currently only one type allowed) |        |
| Make types an enum in Appsync GraphQL API                         |        |

| Flag public art/event                                                   | Status |
| ----------------------------------------------------------------------- | ------ |
| Seperate DynamoDB table                                                 | done   |
| Authentication for users                                                | done   |
| Seperate classes for public/private                                     |        |
| Make flags enum in Appsync GraphQL API                                  |        |
| Store with location ID instead of just art name                         |        |
| Show error when user does not select reason (currently only in console) |        |

| Get photos & Info Window                                | Status            |
| ------------------------------------------------------- | ----------------- |
| Download from DB                                        | done              |
| Close old info window when a new one is opened          | done              |
| Upload resized photos to db (400 x 400?)                |                   |
| Upload photos from app (mobile app only?)               | URGENT FOR PUBLIC |
| Enforce Google Places API from app/site only            | done              |
| Error if photo doesn't exist: info window does not open | URGENT            |

| Upload new Location                                               | Status |
| ----------------------------------------------------------------- | ------ |
| Upload to DB                                                      | URGENT |
| Should suggest user's current location                            |        |
| Each upload submission creates duplicate empty divs (bugfix)      |        |
| Only create new upload div if the old one does not exist (bugfix) | URGENT |

| UI & QOL improvements                                   | Status                       |
| ------------------------------------------------------- | ---------------------------- |
| Resize image window to a standard size                  |                              |
| Place 'Report location' in own div                      |                              |
| Main dropdown menu size more consistent                 |                              |
| All code to call AWS client should be in one file (-_-) | done                         |
| Change name "flag form" -> "report form"                | MVP - not changed in graphql |
| Fix problem with 'amplify publish'                      | HUGELY ANNOYING              |
| Google uses 'lng', ES uses 'lon' -> inconsistent        |                              |
| Revert aws-appsync package to official npm              | done                         |
| Revert to default network fetch policy (currently always fetches)                 |                              |

| non-code
| Create Some user journeys |  |


### Possible extensions
- Use AWS Rekognition to reject images that do not meet decency guidelines
- Add user auth:
   - credit images
   - allow upload only if user is logged in