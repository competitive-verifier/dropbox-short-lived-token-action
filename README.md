# Dropbox short-lived token action

Provide Dropbox Short-lived token

## Get started

1. Create Your own dropbox app. https://www.dropbox.com/developers
2. Get a refresh token. See below.

```yaml
- name: Dropbox Action
  id: dropbox
  uses: competitive-verifier/dropbox-short-lived-token-action
  with:
    app-key: ${{ secrets.APP_KEY }}
    app-secret: ${{ secrets.APP_SECRET }}
    refresh-token: ${{ secrets.DROPBOX_REFRESH_TOKEN }}

- name: Call Dropbox API
  id: call
  run: |
    curl https://api.dropboxapi.com/2/files/list_folder \
      -d '{"path":"","shared_link":{"url":"https://www.dropbox.com/sh/nx3tnilzqz7df8a/AAAYlTq2tiEHl5hsESw6-yfLa"}}' \
      -H 'Content-Type:application/json' \
      -H "Authorization:Bearer $DROPBOX_TOKEN"

- name: Verify
  uses: competitive-verifier/actions/verify@v2
  with:
    destination: ${{runner.temp}}/result.json
    timeout: 1800
  env:
    DROPBOX_TOKEN: ${{env.DROPBOX_TOKEN}}
```

## Refresh token

### Auth code

Replace the `APP_KEY` in the URL below with your own app's one to access it. You
will get an auth code.

https://www.dropbox.com/oauth2/authorize?client_id=APP_KEY&response_type=code&token_access_type=offline

### Refresh token

Replace `AUTH_CODE` with the code you obtained and execute the following code.

```sh
curl https://api.dropbox.com/oauth2/token \
    -d code=JX3XOd6n8AoAAAAAAAAAHx-6ZRPtSkznY50nb5uv3IM \
    -d grant_type=authorization_code \
    -u APP_KEY:APP_SECRET | jq -r '.["refresh_token"]'
```
