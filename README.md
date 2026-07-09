# Bluro Proxy

Bluro Proxy is a lightweight API proxy for the Bluro server that helps fetch and serve Discord member profile avatars in real time.

It acts as a small serverless-friendly middleware layer between your app and the Discord API, making it easier to retrieve member profile images securely using a bot token.

## Features

- Fetches Discord user data through the bot API
- Redirects to the correct avatar image URL
- Falls back to Discord's default avatar when a custom avatar is not available
- Designed to work as a simple proxy service for Bluro server integrations

## Endpoint

### `GET /avatar/:userId`

Returns a redirect to the user's Discord avatar.

#### Parameters

- `userId` — The Discord user ID

#### Behavior

- If the user has a custom avatar, the response redirects to the avatar image on Discord's CDN
- If the user does not have a custom avatar, the response redirects to the default Discord avatar

## Environment Variables

Create an environment variable named:

- `BOT_TOKEN` — Your Discord bot token

## Installation

```bash
npm install
```

## Usage

Start the app in your preferred Node.js runtime or serverless platform.

For example, if you are running it locally with a custom entry point:

```bash
node index.js
```

> Note: this project currently exports an Express app and is ready to be deployed in a serverless environment such as Vercel.

## Example Request

```bash
GET /avatar/123456789012345678
```

## Error Handling

If `BOT_TOKEN` is missing, the server returns an error.
If the Discord API request fails, the server returns a generic avatar fetch error.

## Tech Stack

- Node.js
- Express
- Axios

## License

ISC
