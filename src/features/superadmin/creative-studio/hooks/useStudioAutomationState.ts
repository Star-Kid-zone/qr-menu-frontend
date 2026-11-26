'use client';

import { useState, useCallback } from 'react';
import {
  superadminService,
  type PlatformMarketingAsset,
} from '@/services/superadmin.service';
import { toast } from '@/components/ui';
import type { ScriptDownloadItem } from '../types';
import { getApiErrorMessage } from "@/utils/errors";

interface UseStudioAutomationStateProps {
  onIngestSuccess: () => Promise<void>;
}

export function useStudioAutomationState({ onIngestSuccess }: UseStudioAutomationStateProps) {
  const [automationScript, setAutomationScript] = useState('chatgpt-attach.js');
  const [automationPrompt, setAutomationPrompt] = useState(
    'Close-up aesthetic photo of steaming Hyderabadi Dum Biryani in traditional clay pot with fresh mint garnish, warm ambient restaurant lighting'
  );
  const [automationTitle, setAutomationTitle] = useState('');
  const [autoIngest, setAutoIngest] = useState(true);
  const [runningScript, setRunningScript] = useState(false);
  const [scriptLog, setScriptLog] = useState('');
  const [lastIngestedAsset, setLastIngestedAsset] = useState<PlatformMarketingAsset | null>(null);
  const [scriptDownloads, setScriptDownloads] = useState<ScriptDownloadItem[]>([]);
  const [loadingDownloads, setLoadingDownloads] = useState(false);
  const [ingestingDownload, setIngestingDownload] = useState<string | null>(null);

  const loadDownloads = useCallback(async () => {
    try {
      setLoadingDownloads(true);
      const res = await superadminService.listScriptDownloads();
      setScriptDownloads(res.files || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDownloads(false);
    }
  }, []);

  const handleRunAutomation = async () => {
    if (!automationPrompt.trim()) {
      toast.warning('Please enter a prompt for the AI image');
      return;
    }
    try {
      setRunningScript(true);
      setScriptLog('Connecting to backend runner...\n');
      setLastIngestedAsset(null);

      const res = await superadminService.runAutomationScript(
        {
          script: automationScript,
          prompt: automationPrompt.trim(),
          title: automationTitle.trim() || undefined,
          autoIngest,
        },
        (chunk) => {
          setScriptLog((prev) => prev + chunk);
        }
      );

      if (res.ingestedAsset) {
        setLastIngestedAsset(res.ingestedAsset);
        toast.success(`Image generated and automatically committed to Vault! (ID #${res.ingestedAsset.id})`);
        await onIngestSuccess();
      } else {
        toast.info('Script execution completed.');
      }
      await loadDownloads();
    } catch (err: unknown) {
      console.error(err);
      const errObj = err as Error;
      toast.error(errObj.message || 'Script execution failed');
      setScriptLog((prev) => prev + `\n[CLIENT ERROR] ${errObj.message || String(err)}\n`);
    } finally {
      setRunningScript(false);
    }
  };

  const handleIngestDownload = async (filename: string) => {
    try {
      setIngestingDownload(filename);
      await superadminService.ingestScriptDownload({ filename });
      toast.success(`"${filename}" imported into Vault!`);
      await onIngestSuccess();
      await loadDownloads();
    } catch (err: unknown) {
      console.error(err);
      toast.error(getApiErrorMessage(err, 'Failed to import file'));
    } finally {
      setIngestingDownload(null);
    }
  };

  return {
    automationScript,
    setAutomationScript,
    automationPrompt,
    setAutomationPrompt,
    automationTitle,
    setAutomationTitle,
    autoIngest,
    setAutoIngest,
    runningScript,
    scriptLog,
    lastIngestedAsset,
    scriptDownloads,
    loadingDownloads,
    loadDownloads,
    handleRunAutomation,
    handleIngestDownload,
    ingestingDownload,
  };
}
