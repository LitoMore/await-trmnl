import { Image } from "await";

type JsonObject = Record<string, unknown>;

const imageUrlStoreKey = "trmnl.imageUrl";

// @panel
const trmnlDeviceApiKey = "";
// @panel
const apiBaseUrl = "https://trmnl.com";

function objectValue(value: unknown): JsonObject | undefined {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as JsonObject;
  }
  return undefined;
}

function stringValue(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  return undefined;
}

function firstString(
  object: JsonObject | undefined,
  keys: string[],
): string | undefined {
  if (!object) {
    return undefined;
  }
  for (const key of keys) {
    const value = stringValue(object[key]);
    if (value) {
      return value;
    }
  }
  return undefined;
}

function storeImageUrl(imageUrl: string | undefined): void {
  if (imageUrl) {
    AwaitStore.set(imageUrlStoreKey, imageUrl);
  } else {
    AwaitStore.delete(imageUrlStoreKey);
  }
}

async function loadCurrentScreen() {
  const apiKey = trmnlDeviceApiKey.trim();
  if (!apiKey) {
    return;
  }

  try {
    const baseUrl = apiBaseUrl.replace(/\/+$/, "");
    const response = await AwaitNetwork.request(
      `${baseUrl}/api/display/current`,
      {
        headers: {
          "Access-Token": apiKey,
          Accept: "application/json",
        },
      },
    );

    if (response.code === 200) {
      const payload = JSON.parse(response.data) as unknown;
      const root = objectValue(payload);
      const imageUrl = firstString(root, ["image_url", "imageUrl"]);
      if (imageUrl) {
        storeImageUrl(imageUrl);
      }
    }
  } catch {
    // Do nothing on error
  }
}

function widget() {
  const imageUrl = AwaitStore.string(imageUrlStoreKey);
  return (
    <Image
      url={imageUrl}
      resizable
      maxSides
      aspectRatio="fit"
      maxSides_
      background={1}
    />
  );
}

async function widgetTimeline(): Promise<Timeline> {
  await loadCurrentScreen();
  return {
    entries: [
      {
        date: new Date(),
      },
    ],
  };
}

Await.define({
  widget,
  widgetTimeline,
});
