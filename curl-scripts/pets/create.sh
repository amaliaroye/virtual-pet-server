#!/bin/bash
curl "http://localhost:4741/pets" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "pet": {
      "name": "'"${NAME}"'",
      "type": "'"${TYPE}"'"
    }
  }'

echo
# TOKEN=token NAME=Luna TYPE=cat sh curl-scripts/pets/create.sh
