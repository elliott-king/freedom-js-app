# Status
MVP
freedom.cannibaltaylor.com
https://master.d32yf79oq8yspa.amplifyapp.com/

# Todos

### Goals for alpha and beta testing:
| Goal                          | Tag          | Priority | In Progress |                Done |
| ----------------------------- | ------------ | :------: | ----------: | ------------------: |
| React Components              | qol, js      |   low    |             |                     |
| Filter public art by class    | js           |   med    |         yes | unnecessary for MVP |
| Flag public art               | graphql, js  |   high   |        done |                 MVP |
| Get photos & show info window | graphql, js  |   high   |         yes |                 MVP |
| Upload new location           | graphql, js  |   high   |         yes |                     |
| UI & QOL improvements         | qol, css, js |   low    |             |                     |
| Login process                 | UX           |  medium  |             |                     |
| Long-term support             |              |  medium  |             |                     |

| React/Components                                                                | Status         |
| ------------------------------------------------------------------------------- | -------------- |
| Have info window content be component that then contains form                   | done           |
| Forms should handle changes in multiple inputs with one method                  |                |
| Info window should be contained w/in google map screen (negates need to scroll) | done (sidebar) |
| Currently queries a location and fills the sidebar in one function (separate)   |                |

| Filter public art by class                                        | Status | Priority |
| ----------------------------------------------------------------- | ------ | -------- |
| Add options                                                       | done   | medium   |
| Ability to select multiple options                                |        | lowest   |
| Store types as list in dynamoDB (currently only one type allowed) |        | low      |
| Make types an enum in Appsync GraphQL API                         | done   |          |
| Check 'type' is chosen by user when uploading new location        | done   | low      |

| Flag public art/event                                                   | Status |
| ----------------------------------------------------------------------- | ------ |
| Seperate DynamoDB table                                                 | done   |
| Authentication for users                                                | done   |
| Store with location ID instead of just art name                         | done   |
| Show error when user does not select reason (currently only in console) | done   |

| Get photos & Info Window                                                      | Status                        |
| ----------------------------------------------------------------------------- | ----------------------------- |
| Download from DB                                                              | done                          |
| Close old info window when a new one is opened                                | done                          |
| Upload resized photos to db (400 x 400?)                                      | done - max dimension of 250px |
| Enforce Google Places API from app/site only - key has no restrictions        |                               |
| Error if photo doesn't exist: info window does not open                       | done (?)                      |
| throttles many requests: photo should only be rendered if infoWindow is shown | done (?)                      |
| leave googleusercontent & store photos from google on S3 (being throttled)    | done                          |
| search should ignore non-permenent locations that are out of date             | done                          |
| search type should be enum                                                    | done                          |
| ES console - Invalid host header requests?                                    |                               |

| Upload new Location (and photo)                                               | Status             |
| ----------------------------------------------------------------------------- | ------------------ |
| Upload to DB                                                                  | done               |
| Upload photos from app (mobile app only?)                                     | URGENT             |
| Should suggest user's current location                                        | done               |
| Each upload submission creates duplicate empty divs (bugfix)                  | low priority       |
| Upload new image should also add link in DynamoDB image list                  | done               |
| Only create new upload div if the old one does not exist (bugfix)             | done               |
| Upload to ES after dynamodb                                                   | done - @searchable |
| PublicArt in DynamoDb should have version to [prevent double writes][0]       |                    |
| Should image list be list of 'AWSURL' AppSync type?                           | done               |
| If 'close' button clicked, then sidebar reopened, image should remain         | done               |
| If any part of image upload fails, entire thing should fail                   |                    |
| Remove pin after upload                                                       | done               |
| Make most graphql fields mandatory                                            | done               |
| Unauthenticated, rejected uploads should notify the user why they have failed | URGENT             |


| UI & QOL improvements                                                  | Status                       |
| ---------------------------------------------------------------------- | ---------------------------- |
| Resize image window to a standard size                                 | done                         |
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
| Host on a readable url                                                 | done                         |
| Bottom button should not truncate text                                 | done                         |
| Make sure all requests/queries have error catching                     | done                         |
| Fix 'cannot get /with-sidebar' bug                                     |                              |

| Login Process (currently run by AWS)                         | Status        |
| ------------------------------------------------------------ | ------------- |
| User should only have to login to upload new image           | done          |
| Sign up should not care about phone number                   |               |
| Sign up should show error messages (not just console.log it) | HIGH PRIORITY |
| Log in should be self contained (not in art upload div)      | done          |

| Long-term Support                                  | Status | Priority              |
| -------------------------------------------------- | ------ | --------------------- |
| Backup data - 3 formats, 3 locations               |        | immediately after MVP |
| Create amplify 'dev' env w/ seperate ES & DynamoDB |        | immediately after MVP |
| Unit tests                                         |        | Immediately after MVP |
| Make history API usage more elegant                |        | mid/low               |

| non-code                  | Status |
| ------------------------- | ------ |
| Create some user journeys |        |

[0]: https://docs.aws.amazon.com/appsync/latest/devguide/tutorial-dynamodb-resolvers.html#modifying-the-updatepost-resolver-dynamodb-updateitem

### Possible extensions
- Use AWS Rekognition to reject images that do not meet decency guidelines
- Use Auth to credit images (like Google does)