import type { Pipeline } from '@/types/pipeline';
import { buildPipelineRun, pipelineTemplates } from '@/lib/pipeline-presets';

export interface PipelineDataSource {
  getPipeline(id: string): Promise<Pipeline | null>;
}

const DEFAULT_PIPELINE_ID = pipelineTemplates[0]?.id ?? 'wes-germline';

export class MockPipelineDataSource implements PipelineDataSource {
  constructor(private fallbackId: string = DEFAULT_PIPELINE_ID) {}

  async getPipeline(id: string): Promise<Pipeline | null> {
    const resolved = id || this.fallbackId;
    return buildPipelineRun(resolved) ?? null;
  }
}

export interface RealBackendOptions {
  baseUrl: string;
  authToken?: string;
}

export class RealBackendDataSource implements PipelineDataSource {
  constructor(private options: RealBackendOptions) {}

  async getPipeline(_id: string): Promise<Pipeline | null> {
    throw new Error('RealBackendDataSource is not implemented yet');
  }
}

export function getPipelineDataSource(): PipelineDataSource {
  // 暂时只返回 Mock 数据源，未来可根据环境变量切换到真实后端
  return new MockPipelineDataSource();
}

export function getDefaultPipelineId() {
  return DEFAULT_PIPELINE_ID;
}
