export type GenerationStyle = 
  | 'cyberpunk'
  | 'minimalism'
  | '3d-realism'
  | 'pixel-art'
  | 'vaporwave'
  | 'abstract'
  | 'anime';

export type Resolution = '512x512' | '1024x1024' | '2048x2048';

export interface NFTGenerationRequest {
  prompt: string;
  negativePrompt?: string;
  style: GenerationStyle;
  resolution: Resolution;
  cfgScale?: number;
  steps?: number;
  seed?: number;
  batchSize?: number;
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

export interface NFTCollection {
  name: string;
  family: string;
}

export interface NFTCreator {
  address: string;
  share: number;
  verified?: boolean;
}

export interface NFTFile {
  uri: string;
  type: string;
}

export interface NFTProperties {
  files: NFTFile[];
  category: string;
  creators: NFTCreator[];
}

export interface NFTMetadata {
  name: string;
  symbol: string;
  description: string;
  seller_fee_basis_points: number;
  image: string;
  external_url?: string;
  attributes?: NFTAttribute[];
  collection?: NFTCollection;
  properties: NFTProperties;
}

export interface GenerationResult {
  image: string;
  metadata: NFTMetadata;
  seed: number;
  generationTime: number;
  model: string;
}

export interface MintingRequest {
  metadata: NFTMetadata;
  walletAddress: string;
  collectionAddress?: string;
  royaltyBasisPoints?: number;
}

export interface MintingResult {
  signature: string;
  mintAddress: string;
  metadata: NFTMetadata;
  explorerUrl: string;
}

export interface CompressedNFTRequest {
  metadata: NFTMetadata[];
  walletAddress: string;
  treeAddress?: string;
}

export interface NFTGenerationStats {
  totalGenerated: number;
  totalMinted: number;
  successRate: number;
  averageGenerationTime: number;
  storageUsed: number;
  queueSize: number;
}

export interface AIModelConfig {
  modelName: string;
  version: string;
  baseModel: string;
  trainingDataset: string;
  supportedStyles: GenerationStyle[];
  maxResolution: Resolution;
  defaultCfgScale: number;
  defaultSteps: number;
}

export interface StorageMetadata {
  arweaveId?: string;
  ipfsHash?: string;
  uploadTimestamp: number;
  fileSize: number;
  mimeType: string;
}

export interface CollectionConfig {
  name: string;
  symbol: string;
  description: string;
  sellerFeeBasisPoints: number;
  creators: NFTCreator[];
  collectionAddress?: string;
}

export enum MintStatus {
  PENDING = 'pending',
  GENERATING = 'generating',
  UPLOADING = 'uploading',
  MINTING = 'minting',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export interface MintJob {
  id: string;
  request: NFTGenerationRequest;
  status: MintStatus;
  result?: GenerationResult;
  mintResult?: MintingResult;
  error?: string;
  createdAt: number;
  completedAt?: number;
}
