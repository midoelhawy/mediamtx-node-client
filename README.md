# mediamtx-node-client

`mediamtx-node-client` is a Node.js client library for interacting with MediaMTX API. It provides various methods to interact with streams, recordings, and configurations, allowing you to manage and automate tasks with ease.

## Installation

To install the library, run the following npm command:

```bash
npm install mediamtx-node-client
```

## Usage

### Create a new instance of the `MediamtxNodeClient`

To use the client, create a new instance of `MediamtxNodeClient` by passing a configuration object containing the base URL, authentication credentials (username/password), and other optional configurations.

```javascript
import { MediamtxNodeClient } from "mediamtx-node-client";

const mediaMtxClient = new MediamtxNodeClient({
  baseURL: "http://localhost:9997/",
  auth: {
    username: "your-username",
    password: "your-password",
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

#### `getGlobalConfig()`

Gets the global configuration for MediaMTX.

```javascript
const globalConfig = await mediaMtxClient.getGlobalConfig();
console.log(globalConfig);
```

#### `patchGlobalConfig(patch: Partial<MediamtxGlobalConfig>)`

Updates the global configuration with the provided patch.à


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
        sourceOnDemand:true
      });
console.log(newStream);
```

#### `updateStreamingPathConfig(name: string, body: StreamPathConfig)`

Updates an existing streaming path configuration.

```javascript
const updatedStream = await mediaMtxClient.updateStreamingPathConfig("/my-stream", { sourceOnDemand:false,maxReaders:5 });
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
    baseURL: "http://localhost:9997/",
    auth: {
      username: "your-username",
      password: "your-password",
    },
  });

  const recordingList = await mediaMtxClient.recordingList();
  const recordingListForPath = await mediaMtxClient.recordingListForPath("path/to-recording");



    const deleteRecording = await mediaMtxClient.deleteRecording(
        "path/to-recording",
        "2025-02-08T19:39:11.768623Z" //recordingListForPath.segments[0].start
    );
    console.log("Deleted");
  

  const globalConfig = await mediaMtxClient.getGlobalConfig();
  const defaultPathConfiguration = await mediaMtxClient.getDefaultPathConfiguration();


  const newStream = await mediaMtxClient.createNewStreamingPath("test/stream-name", {
    name: "test/stream-name",
    source: "rtsp://example.com/stream",
    ...
  });


  const updatedStream = await mediaMtxClient.updateStreamingPathConfig(
    "test/stream-name",
    { sourceOnDemand: true }
  );


   const deletePath = await mediaMtxClient.deleteStreamingPath("test/stream-name");

  const allPathsConfigurations = await mediaMtxClient.getAllPathsConfigurations();
  if (allPathsConfigurations.items.length) {
    const pathConfig = await mediaMtxClient.getPathConfiguration(
      allPathsConfigurations.items[0].name!
    );
    console.log(pathConfig);
  }

  setInterval(async () => {
    const streamList = await mediaMtxClient.listStreams();
    console.log(streamList);
  }, 1000);

  setInterval(async () => {
    const streamItem = await mediaMtxClient.getStreamByName(
      "stream-name"
    );
    console.log(streamItem);
  }, 1000);
})();
```

