# mediamtx-node-client

`mediamtx-node-client` is a Node.js client library for interacting with the MediaMTX API. It provides various methods to interact with streams, recordings, and configurations, allowing you to manage and automate tasks with ease.  

Now, it also includes **Playback Server** support, enabling direct access to audio/video playback links.  

## Installation  

To install the library, run the following npm command:  

```bash
npm install mediamtx-node-client
```

## Usage  

### Create a new instance of `MediamtxNodeClient`  

To use the client, create a new instance of `MediamtxNodeClient` by passing a configuration object containing the base URL, authentication credentials (username/password), and other optional configurations.  

If you are using a **Playback Server**, provide the `playbackServerBaseURL` and authentication details.  

```javascript
import { MediamtxNodeClient } from "mediamtx-node-client";

const mediaMtxClient = new MediamtxNodeClient({
  baseURL: "http://mymediamtxserver:9997/",
  playbackServerBaseURL: "http://mymediamtxserver:9996/",
  auth: {
    username: "user",
    password: "-01",
  },
});
```

### Available Methods  

#### `listStreams()`  

Lists all available streams.  

```javascript
const streamList = await mediaMtxClient.listStreams();
console.log(streamList);
```

#### `getStreamByName(streamName: string)`  

Gets information about a specific stream by name.  

```javascript
const streamItem = await mediaMtxClient.getStreamByName("stream-name");
console.log(streamItem);
```

#### `recordingList(pagination?: { page: number, itemsPerPage: number })`  

Lists all recordings, with optional pagination.  

```javascript
const recordingList = await mediaMtxClient.recordingList();
```

#### `recordingListForPath(path: string)`  

Lists all recordings for a specific path.  

```javascript
const recordingListForPath = await mediaMtxClient.recordingListForPath("path-to-recording");
```

#### `deleteRecording(path: string, start: string)`  

Deletes a recording segment.  

```javascript
const deleteRecording = await mediaMtxClient.deleteRecording("path-to-recording", "start-time");
console.log("Recording deleted");
```

### **Playback Server Methods**  

#### `getRecordingSegmentationFromPlayBackServerByPath(path: string)`  

Retrieves recording segments from the Playback Server, including direct URLs for playback.  

```javascript
const playbackSegments =
  await mediaMtxClient.getRecordingSegmentationFromPlayBackServerByPath(
    "speaker/c5d02c51-cb34-40a6-8c9f-47ddee7ad4f4"
  );

console.log(playbackSegments);
```

Example response:  

```json
[
  {
    "start": "2025-02-23T18:47:41.138693Z",
    "duration": 139.301,
    "url": "http://http://mymediamtxserver:9996/get?duration=139.301&path=speaker/c5d02c51-cb34-40a6-8c9f-47ddee7ad4f4&start=2025-02-23T18%3A47%3A41.138693Z"
  }
]
```

### **Configuration Methods**  

#### `getGlobalConfig()`  

Gets the global configuration for MediaMTX.  

```javascript
const globalConfig = await mediaMtxClient.getGlobalConfig();
console.log(globalConfig);
```

#### `patchGlobalConfig(patch: Partial<MediamtxGlobalConfig>)`  

Updates the global configuration with the provided patch.  

```javascript
const updatedConfig = await mediaMtxClient.patchGlobalConfig({ /* your config patch */ });
console.log(updatedConfig);
```

#### `getDefaultPathConfiguration()`  

Gets the default path configuration.  

```javascript
const defaultPathConfig = await mediaMtxClient.getDefaultPathConfiguration();
console.log(defaultPathConfig);
```

#### `patchDefaultPathConfiguration(patch: Partial<StreamPathConfig>)`  

Updates the default path configuration with the provided patch.  

```javascript
const updatedPathConfig = await mediaMtxClient.patchDefaultPathConfiguration({ /* your config patch */ });
console.log(updatedPathConfig);
```

### **Stream Path Management**  

#### `getAllPathsConfigurations(pagination?: { page: number, itemsPerPage: number })`  

Lists all path configurations, with optional pagination.  

```javascript
const allPathsConfigurations = await mediaMtxClient.getAllPathsConfigurations();
console.log(allPathsConfigurations);
```

#### `getPathConfiguration(path: string)`  

Gets the configuration for a specific path.  

```javascript
const pathConfig = await mediaMtxClient.getPathConfiguration("stream-name");
console.log(pathConfig);
```

#### `createNewStreamingPath(name: string, body: StreamPathConfig)`  

Creates a new streaming path with the provided configuration.  

```javascript
const newStream = await mediaMtxClient.createNewStreamingPath("/my-stream", {
  name: "/my-stream",
  source: "rtsp://test:544/stream/test",
  sourceOnDemand: true
});
console.log(newStream);
```

#### `updateStreamingPathConfig(name: string, body: StreamPathConfig)`  

Updates an existing streaming path configuration.  

```javascript
const updatedStream = await mediaMtxClient.updateStreamingPathConfig("/my-stream", { 
  sourceOnDemand: false, 
  maxReaders: 5 
});
console.log(updatedStream);
```

#### `deleteStreamingPath(name: string)`  

Deletes a streaming path.  

```javascript
const deletedPath = await mediaMtxClient.deleteStreamingPath("/my-stream");
console.log(deletedPath);
```

## Example Code  

```javascript
import { MediamtxNodeClient } from "mediamtx-node-client";

(async () => {
  const mediaMtxClient = new MediamtxNodeClient({
    baseURL: "http://mymediamtxserver:9997/",
    playbackServerBaseURL: "https://mymediamtxserver:9996/",
    auth: {
      username: "user",
      password: "-01",
    },
  });

  const recordingList = await mediaMtxClient.recordingList();
  const recordingListForPath = await mediaMtxClient.recordingListForPath("path/to-recording");

  const deleteRecording = await mediaMtxClient.deleteRecording(
    "path/to-recording",
    "2025-02-08T19:39:11.768623Z"
  );
  console.log("Deleted");

  const globalConfig = await mediaMtxClient.getGlobalConfig();
  const defaultPathConfiguration = await mediaMtxClient.getDefaultPathConfiguration();

  const newStream = await mediaMtxClient.createNewStreamingPath("test/stream-name", {
    name: "test/stream-name",
    source: "rtsp://example.com/stream",
    sourceOnDemand: true
  });

  const updatedStream = await mediaMtxClient.updateStreamingPathConfig(
    "test/stream-name",
    { sourceOnDemand: true }
  );

  const deletePath = await mediaMtxClient.deleteStreamingPath("test/stream-name");

  const allPathsConfigurations = await mediaMtxClient.getAllPathsConfigurations();
  if (allPathsConfigurations.items.length) {
    const pathConfig = await mediaMtxClient.getPathConfiguration(
      allPathsConfigurations.items[0].name
    );
    console.log(pathConfig);
  }

  setInterval(async () => {
    const streamList = await mediaMtxClient.listStreams();
    console.log(streamList);
  }, 1000);

  setInterval(async () => {
    const streamItem = await mediaMtxClient.getStreamByName("stream-name");
    console.log(streamItem);
  }, 1000);

  const playbackSegments =
    await mediaMtxClient.getRecordingSegmentationFromPlayBackServerByPath(
      "speaker/c5d02c51-cb34-40a6-8c9f-47ddee7ad4f4"
    );

  console.log(playbackSegments);
})();
```

