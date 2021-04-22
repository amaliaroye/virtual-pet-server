curl "http://localhost:4741/pets" \
  --include \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}"

echo
