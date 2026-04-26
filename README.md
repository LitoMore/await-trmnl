# Await TRMNL

An Await widget that shows the current TRMNL display image using a device API key.

## Configuration

Open the widget panel and set:

- `trmnlDeviceApiKey`: a TRMNL device API key
- `apiBaseUrl`: the TRMNL API base URL

The widget requests `GET https://trmnl.com/api/display/current` with:

```http
Access-Token: device_xxxxx
Accept: application/json
```

## Development

See https://github.com/await-widget/skills.

## License

MIT
