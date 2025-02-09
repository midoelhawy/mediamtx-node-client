import axios, { AxiosInstance } from "axios";
import {
  MediamtxBaseResponseWithPagination,
  MediamtxConfig,
  MediamtxGlobalConfig,
  RecordingItem,
  StreamItem,
  StreamPathConfig,
} from "../interface";

export class MediamtxNodeClient {
  config: MediamtxConfig;
  axiosClient: AxiosInstance;

  constructor(config: MediamtxConfig) {
    this.config = config;
    this.axiosClient = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 5000,
      headers: config.headers || {},
      auth: config.auth || undefined,
    });
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
    return response.data;
  }

  async updateStreamingPathConfig(name: string, body: StreamPathConfig) {
    const response = await this.axiosClient.patch<StreamPathConfig>(
      `/v3/config/paths/patch/${name}`,
      body
    );
    return response.data;
  }

  async deleteStreamingPath(name: string) {
    const response = await this.axiosClient.delete<any>(
      `/v3/config/paths/delete/${name}`
    );
    return response.data;
  }
}
