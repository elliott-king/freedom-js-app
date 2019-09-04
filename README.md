# Status
MVP
https://master.d32yf79oq8yspa.amplifyapp.com/

# Todos

### Goals for alpha and beta testing:
| Goal                          | Tag          | Priority | In Progress |                Done |
| ----------------------------- | ------------ | :------: | ----------: | ------------------: |
| React Components              | qol, js      |   low    |             |                     |
| Filter public art by class    | js           |   med    |         yes | unnecessary for MVP |
| Flag public art               | graphql, js  |   high   |         yes |                 MVP |
| Get photos & show info window | graphql, js  |   high   |         yes |                 MVP |
| Upload new location           | graphql, js  |   high   |         yes |                     |
| UI & QOL improvements         | qol, css, js |   low    |             |                     |
| Long-term support             |              |  medium  |             |                     |

| React/Components                                                                | Status |
| ------------------------------------------------------------------------------- | ------ |
| Have info window content be component that then contains form                   | done   |
| Forms should handle changes in multiple inputs with one method                  |        |
| Info window should be contained w/in google map screen (negates need to scroll) |        |

| Filter public art by class                                        | Status | Priority |
| ----------------------------------------------------------------- | ------ | -------- |
| Add options                                                       |        | low      |
| Ability to select multiple options                                |        | lowest   |
| Store types as list in dynamoDB (currently only one type allowed) |        | low      |
| Make types an enum in Appsync GraphQL API                         |        | med      |
| Check 'type' is chosen by user when uploading new location        |        | low      |

| Flag public art/event                                                   | Status |
| ----------------------------------------------------------------------- | ------ |
| Seperate DynamoDB table                                                 | done   |
| Authentication for users                                                | done   |
| Store with location ID instead of just art name                         | done   |
| Show error when user does not select reason (currently only in console) |        |

| Get photos & Info Window                                                      | Status                        |
| ----------------------------------------------------------------------------- | ----------------------------- |
| Download from DB                                                              | done                          |
| Close old info window when a new one is opened                                | done                          |
| Upload resized photos to db (400 x 400?)                                      | done - max dimension of 250px |
| Enforce Google Places API from app/site only                                  |                               |
| Error if photo doesn't exist: info window does not open                       | URGENT                        |
| throttles many requests: photo should only be rendered if infoWindow is shown |                               |
| leave googleusercontent & store photos from google on S3 (being throttled)    |                               |
| google places api key currently has zero restrictions                         |                               |

| Upload new Location (and photo)                                         | Status             |
| ----------------------------------------------------------------------- | ------------------ |
| Upload to DB                                                            | done               |
| Upload photos from app (mobile app only?)                               | URGENT             |
| Should suggest user's current location (app only)                       |                    |
| Each upload submission creates duplicate empty divs (bugfix)            | low priority       |
| Upload new image should also add link in DynamoDB image list            | done               |
| Only create new upload div if the old one does not exist (bugfix)       | done               |
| Upload to ES after dynamodb                                             | done - @searchable |
| PublicArt in DynamoDb should have version to [prevent double writes][0] |                    |
| Should image list be list of 'url' GraphQL type?                        |                    |


| UI & QOL improvements                                                  | Status                       |
| ---------------------------------------------------------------------- | ---------------------------- |
| Resize image window to a standard size                                 |                              |
| Place 'Report location' in own div                                     |                              |
| Main dropdown menu size more consistent                                |                              |
| All code to call AWS client should be in one file (-_-)                | done                         |
| Change name "flag form" -> "report form"                               | MVP - not changed in graphql |
| Fix problem with 'amplify publish'                                     | done - using Amplify console |
| Google uses 'lng', ES uses 'lon' -> inconsistent                       |                              |
| Revert aws-appsync package to official npm                             | done                         |
| Revert to default network fetch policy (currently always fetches)      |                              |
| Make PublicArt schema @searchable (will then automatically push to ES) | in progress                  |
| Put Data Sources into api/CustomResources.json for eternal use         | done - mostly pre-generated  |
| Consider making sidebar collapsible                                    | done                         |
| Collapsing sidebar should not move center of map                       |                              |
| Sign up should not care about phone number                             |                              |
| Sign up should show error messages                                     | HIGH PRIORITY                |

| Long-term Support                                  | Status | Priority              |
| -------------------------------------------------- | ------ | --------------------- |
| Backup data - 3 formats, 3 locations               |        | immediately after MVP |
| Create amplify 'dev' env w/ seperate ES & DynamoDB |        | Necessary for MVP     |
| Unit tests                                         |        | Immediately after MVP |

| non-code                  | Status |
| ------------------------- | ------ |
| Create some user journeys |        |

[0]: https://docs.aws.amazon.com/appsync/latest/devguide/tutorial-dynamodb-resolvers.html#modifying-the-updatepost-resolver-dynamodb-updateitem

### Possible extensions
- Use AWS Rekognition to reject images that do not meet decency guidelines
- Use Auth to credit images (like Google does)