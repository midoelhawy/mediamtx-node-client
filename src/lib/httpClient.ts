import axios, { AxiosInstance } from "axios";
import YAML from "yaml";
import {
  MediamtxBaseResponseWithPagination,
  MediamtxConfig,
  MediamtxGlobalConfig,
  PlaybackItem,
  RecordingItem,
  SaveConfigAsYmlOptions,
  StreamItem,
  StreamPathConfig,
} from "../interface";

import fs from "fs/promises";

export class MediamtxNodeClient {
  config: MediamtxConfig;
  axiosClient: AxiosInstance;
  playbackAxiosClient: AxiosInstance | undefined;
  constructor(config: MediamtxConfig) {
    this.config = config;
    this.axiosClient = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 5000,
      headers: config.headers || {},
      auth: config.auth || undefined,
    });
    if (config.playbackServerBaseURL) {
      this.playbackAxiosClient = axios.create({
        baseURL: config.playbackServerBaseURL,
        timeout: config.timeout || 5000,
        headers: config.headers || {},
        auth: config.playbackAuth || undefined,
      });
    }
  }

  async listStreams(
    pagination: {
      page: number; //default 0
      itemsPerPage: number; //default 0
    } = {
      page: 0,
      itemsPerPage: 10,
    }
  ) {
    const response = await this.axiosClient.get<
      MediamtxBaseResponseWithPagination<StreamItem>
    >("/v3/paths/list", {
      params: {
        ...pagination,
      },
    });
    return response.data;
  }

  async getStreamByName(streamName: string) {
    try {
      const response = await this.axiosClient.get<StreamItem>(
        `/v3/paths/get/${streamName}`
      );
      return response.data;
    } catch (err) {
      //console.error(err);
    }
    return null;
  }

  async recordingList(
    pagination: {
      page: number; //default 0
      itemsPerPage: number; //default 0
    } = {
      page: 0,
      itemsPerPage: 10,
    }
  ) {
    const response = await this.axiosClient.get<
      MediamtxBaseResponseWithPagination<RecordingItem>
    >("/v3/recordings/list", {
      params: {
        ...pagination,
      },
    });
    return response.data;
  }

  async recordingListForPath(path: string) {
    const response = await this.axiosClient.get<RecordingItem>(
      `/v3/recordings/get/${path}`
    );
    return response.data;
  }

  async deleteRecording(path: string, start: string) {
    const response = await this.axiosClient.delete<any>(
      `/v3/recordings/deletesegment`,
      {
        params: {
          path,
          start,
        },
      }
    );
    return response.data;
  }

  async getGlobalConfig() {
    const response = await this.axiosClient.get<MediamtxGlobalConfig>(
      `/v3/config/global/get`
    );
    return response.data;
  }

  async patchGlobalConfig(patch: Partial<MediamtxGlobalConfig>) {
    const response = await this.axiosClient.patch<any>(
      `/v3/config/global/get`,
      patch
    );

    if (this.config.persistentMediaMtxConfig) {
      await this.saveConfigAsYml(this.config.persistentMediaMtxConfig);
    }

    return response.data;
  }

  async getDefaultPathConfiguration() {
    const response = await this.axiosClient.get<StreamPathConfig>(
      `/v3/config/pathdefaults/get`
    );
    return response.data;
  }

  async patchDefaultPathConfiguration(patch: Partial<StreamPathConfig>) {
    const response = await this.axiosClient.patch<any>(
      `/v3/config/pathdefaults/patch`,
      patch
    );

    if (this.config.persistentMediaMtxConfig) {
      await this.saveConfigAsYml(this.config.persistentMediaMtxConfig);
    }

    return response.data;
  }

  async getAllPathsConfigurations(
    pagination: {
      page: number; //default 0
      itemsPerPage: number; //default 0
    } = {
      page: 0,
      itemsPerPage: 10,
    }
  ) {
    const response = await this.axiosClient.get<
      MediamtxBaseResponseWithPagination<StreamPathConfig>
    >(`/v3/config/paths/list`, {
      params: {
        ...pagination,
      },
    });
    return response.data;
  }

  async getPathConfiguration(path: string) {
    const response = await this.axiosClient.get<StreamPathConfig>(
      `/v3/config/paths/get/${path}`
    );
    return response.data;
  }

  async createNewStreamingPath(name: string, body: StreamPathConfig) {
    const response = await this.axiosClient.post<StreamPathConfig>(
      `/v3/config/paths/add/${name}`,
      body
    );

    if (this.config.persistentMediaMtxConfig) {
      await this.saveConfigAsYml(this.config.persistentMediaMtxConfig);
    }

    return response.data;
  }

  async updateStreamingPathConfig(name: string, body: StreamPathConfig) {
    const response = await this.axiosClient.patch<StreamPathConfig>(
      `/v3/config/paths/patch/${name}`,
      body
    );

    if (this.config.persistentMediaMtxConfig) {
      await this.saveConfigAsYml(this.config.persistentMediaMtxConfig);
    }

    return response.data;
  }

  async deleteStreamingPath(name: string) {
    const response = await this.axiosClient.delete<any>(
      `/v3/config/paths/delete/${name}`
    );

    if (this.config.persistentMediaMtxConfig) {
      await this.saveConfigAsYml(this.config.persistentMediaMtxConfig);
    }

    return response.data;
  }

  async getRecordingSegmentationFromPlayBackServerByPath(
    path: string,
    start?: Date,
    end?: Date
  ) {
    if (!this.playbackAxiosClient) {
      throw new Error("No playback server configured");
    }
    const response = await this.playbackAxiosClient.get<PlaybackItem[]>(
      `/list`,
      {
        params: {
          path,
          start: start?.toISOString(),
          end: end?.toISOString(),
        },
      }
    );
    return response.data;
  }

  async getGlobalConfigAsYML() {
    const globalConfig = await this.getGlobalConfig();
    const yml = this.objectToYaml(globalConfig);
    return yml;
  }

  private objectToYaml(data: any) {
    return data ? YAML.stringify(data) : "";
  }

  async getPathsConfigAsYML(ignoreRpiCamera: boolean = false) {
    const pathsConfigs = (await this.getAllPathsConfigurations()).items || [];

    if (ignoreRpiCamera) {
      for (const pathConfig of pathsConfigs) {
        for (const key of Object.keys(pathConfig)) {
          if (key.startsWith("rpiCamera")) {
            // @ts-ignore
            delete pathConfig[key];
          }
        }
      }
    }

    const finalPaths: {
      paths: {
        [key: string]: StreamPathConfig;
      };
    } = {
      paths: {},
    };

    for (const pathConfig of pathsConfigs) {
      finalPaths.paths[pathConfig.name!] = pathConfig;
    }

    const yml = this.objectToYaml(finalPaths);
    return yml;
  }

  async saveConfigAsYml(options?: SaveConfigAsYmlOptions) {
    console.log("Saving config as yml");
    options = options || this.config.persistentMediaMtxConfig;

    if (!options) {
      throw new Error("No options provided");
    }

    if (!options.savePathsConfig && !options.saveGlobalConfig) {
      throw new Error(
        "At least one of savePathsConfig or saveGlobalConfig must be true"
      );
    }

    const [globalConfigYML, pathsConfigYML] = await Promise.all([
      options.saveGlobalConfig ? this.getGlobalConfigAsYML() : "",
      options.savePathsConfig
        ? this.getPathsConfigAsYML(options.ignoreRpiCamera)
        : "",
    ]);

    if (options.saveAsUniqueFile) {
      await fs.writeFile(
        options.outputFilePath,
        `${globalConfigYML}\n\n\n${pathsConfigYML}`,
        "utf-8"
      );
      console.log(`Config saved as yml in ${options.outputFilePath}`);
      return;
    }

    if (options.savePathsConfig && !options.pathsOutputFilePath) {
      throw new Error("pathsOutputFilePath is required");
    }
    if (options.saveGlobalConfig && !options.globalConfigOutputFilePath) {
      throw new Error("PathOutputFilePath is required");
    }

    await Promise.all([
      options.savePathsConfig &&
        fs.writeFile(options.pathsOutputFilePath, pathsConfigYML, "utf-8"),
      options.saveGlobalConfig &&
        fs.writeFile(
          options.globalConfigOutputFilePath,
          globalConfigYML,
          "utf-8"
        ),
    ]);
    if (options.savePathsConfig) {
      console.log(
        `Paths config saved as yml in ${options.pathsOutputFilePath}`
      );
    }
    if (options.saveGlobalConfig) {
      console.log(
        `Global config saved as yml in ${options.globalConfigOutputFilePath}`
      );
    }
  }
}
