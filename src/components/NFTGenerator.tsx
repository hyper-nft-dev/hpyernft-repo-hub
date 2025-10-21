import React, { useState, useEffect } from 'react';
import { NFTGenerationRequest, NFTMetadata, GenerationStyle } from '@types/nft';
import './NFTGenerator.css';

interface NFTGeneratorProps {
  onGenerate?: (request: NFTGenerationRequest) => Promise<NFTMetadata>;
  onMint?: (metadata: NFTMetadata) => Promise<string>;
  showAdvanced?: boolean;
}

interface GenerationStats {
  totalGenerated: number;
  totalMinted: number;
  averageGenerationTime: number;
  currentQueueSize: number;
  successRate: number;
  storageUsed: number;
}

const NFTGenerator: React.FC<NFTGeneratorProps> = ({ 
  onGenerate,
  onMint,
  showAdvanced = false
}) => {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [style, setStyle] = useState<GenerationStyle>('cyberpunk');
  const [resolution, setResolution] = useState<'512x512' | '1024x1024' | '2048x2048'>('1024x1024');
  const [cfgScale, setCfgScale] = useState(7.5);
  const [steps, setSteps] = useState(50);
  const [seed, setSeed] = useState<number | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
  const [mintedSignature, setMintedSignature] = useState<string | null>(null);
  
  const [stats, setStats] = useState<GenerationStats>({
    totalGenerated: 0,
    totalMinted: 0,
    averageGenerationTime: 2.3,
    currentQueueSize: 0,
    successRate: 98.5,
    storageUsed: 1247
  });

  const styles: GenerationStyle[] = [
    'cyberpunk', 'minimalism', '3d-realism', 'pixel-art', 
    'vaporwave', 'abstract', 'anime'
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || !onGenerate || isGenerating) return;

    setIsGenerating(true);
    setGeneratedImage(null);
    setMetadata(null);
    setMintedSignature(null);

    try {
      const request: NFTGenerationRequest = {
        prompt: prompt.trim(),
        negativePrompt: negativePrompt.trim() || undefined,
        style,
        resolution,
        cfgScale,
        steps,
        seed: seed || Math.floor(Math.random() * 1000000)
      };

      const result = await onGenerate(request);
      setMetadata(result);
      setGeneratedImage(result.image);
      
      setStats(prev => ({
        ...prev,
        totalGenerated: prev.totalGenerated + 1
      }));
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMint = async () => {
    if (!metadata || !onMint || isMinting) return;

    setIsMinting(true);

    try {
      const signature = await onMint(metadata);
      setMintedSignature(signature);
      
      setStats(prev => ({
        ...prev,
        totalMinted: prev.totalMinted + 1
      }));
    } catch (error) {
      console.error('Minting failed:', error);
    } finally {
      setIsMinting(false);
    }
  };

  const handleRandomize = () => {
    setSeed(Math.floor(Math.random() * 1000000));
  };

  return (
    <div className="nft-generator">
      <div className="generator-header">
        <h2>AI NFT Generator</h2>
        <div className="stats-summary">
          <span>Generated: {stats.totalGenerated}</span>
          <span>Minted: {stats.totalMinted}</span>
          <span>Success Rate: {stats.successRate}%</span>
        </div>
      </div>

      <div className="generator-content">
        <div className="generation-controls">
          <div className="control-group">
            <label>Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your NFT artwork... (e.g., 'futuristic cyberpunk cityscape with neon lights')"
              rows={4}
              disabled={isGenerating}
            />
          </div>

          <div className="control-group">
            <label>Negative Prompt (Optional)</label>
            <textarea
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="What to avoid in the image..."
              rows={2}
              disabled={isGenerating}
            />
          </div>

          <div className="control-row">
            <div className="control-group">
              <label>Style</label>
              <select 
                value={style} 
                onChange={(e) => setStyle(e.target.value as GenerationStyle)}
                disabled={isGenerating}
              >
                {styles.map(s => (
                  <option key={s} value={s}>
                    {s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label>Resolution</label>
              <select 
                value={resolution} 
                onChange={(e) => setResolution(e.target.value as any)}
                disabled={isGenerating}
              >
                <option value="512x512">512x512</option>
                <option value="1024x1024">1024x1024</option>
                <option value="2048x2048">2048x2048</option>
              </select>
            </div>
          </div>

          {showAdvanced && (
            <div className="advanced-controls">
              <h4>Advanced Settings</h4>
              
              <div className="control-group">
                <label>CFG Scale: {cfgScale}</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.5"
                  value={cfgScale}
                  onChange={(e) => setCfgScale(parseFloat(e.target.value))}
                  disabled={isGenerating}
                />
              </div>

              <div className="control-group">
                <label>Steps: {steps}</label>
                <input
                  type="range"
                  min="20"
                  max="150"
                  step="10"
                  value={steps}
                  onChange={(e) => setSteps(parseInt(e.target.value))}
                  disabled={isGenerating}
                />
              </div>

              <div className="control-row">
                <div className="control-group">
                  <label>Seed (Optional)</label>
                  <input
                    type="number"
                    value={seed || ''}
                    onChange={(e) => setSeed(e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="Random"
                    disabled={isGenerating}
                  />
                </div>
                <button 
                  onClick={handleRandomize}
                  disabled={isGenerating}
                  className="btn-secondary"
                >
                  Randomize
                </button>
              </div>
            </div>
          )}

          <div className="action-buttons">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="btn-primary btn-generate"
            >
              {isGenerating ? 'Generating...' : 'Generate NFT'}
            </button>

            {metadata && (
              <button 
                onClick={handleMint}
                disabled={isMinting || mintedSignature !== null}
                className="btn-primary btn-mint"
              >
                {isMinting ? 'Minting...' : mintedSignature ? 'Minted ✓' : 'Mint to Solana'}
              </button>
            )}
          </div>
        </div>

        <div className="generation-output">
          <div className="preview-container">
            {isGenerating && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Generating AI artwork...</p>
              </div>
            )}

            {generatedImage && !isGenerating && (
              <div className="generated-image">
                <img src={generatedImage} alt="Generated NFT" />
              </div>
            )}

            {!generatedImage && !isGenerating && (
              <div className="placeholder-state">
                <p>Your generated NFT will appear here</p>
              </div>
            )}
          </div>

          {metadata && (
            <div className="metadata-display">
              <h4>NFT Metadata</h4>
              <div className="metadata-fields">
                <div className="field">
                  <label>Name:</label>
                  <span>{metadata.name}</span>
                </div>
                <div className="field">
                  <label>Symbol:</label>
                  <span>{metadata.symbol}</span>
                </div>
                <div className="field">
                  <label>Description:</label>
                  <span>{metadata.description}</span>
                </div>
                <div className="field">
                  <label>Attributes:</label>
                  <div className="attributes">
                    {metadata.attributes?.map((attr, idx) => (
                      <span key={idx} className="attribute-tag">
                        {attr.trait_type}: {attr.value}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {mintedSignature && (
            <div className="mint-success">
              <h4>Successfully Minted!</h4>
              <div className="signature-display">
                <label>Transaction Signature:</label>
                <code>{mintedSignature.slice(0, 16)}...{mintedSignature.slice(-16)}</code>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTGenerator;
