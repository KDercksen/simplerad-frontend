simplerad-frontend

###

To start the frontend:

```bash
npm run start
```

Install necessary packages:

```bash
npm i
```

### Configuration

Make sure to put the following environment variables in a file like `.env.local`:

```bash
REACT_APP_API_DOMAIN=http://localhost:8000 # url of backend API
REACT_APP_ENTITIES_ENDPOINT=$REACT_APP_API_DOMAIN/entities/
REACT_APP_SUMMARIZE_ENDPOINT=$REACT_APP_API_DOMAIN/summarize/
REACT_APP_SEARCH_ENDPOINT=$REACT_APP_API_DOMAIN/search/
REACT_APP_FREQUENCY_ENDPOINT=$REACT_APP_API_DOMAIN/frequency/
REACT_APP_EXPLANATION_ENDPOINT=$REACT_APP_API_DOMAIN/explanation/
```

In order to add sample reports for ease of e.g. testing, create a json file
`src/assets/sample_reports.json` containing a list of objects with a `text` field.

For example:

```json
[
  { "text": "Sample report text numero uno" },
  { "text": "Sample report text numero dos" }
]
```
