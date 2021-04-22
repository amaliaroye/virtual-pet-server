curl "http://localhost:4741/pets/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "pet": {
      "'"${KEY}"'": "'"${VALUE}"'"
    }
  }'

echo
