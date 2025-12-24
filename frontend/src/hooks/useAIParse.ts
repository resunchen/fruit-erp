import { useState, useCallback } from 'react';
import { aiParseService } from '../services/aiParse.service';
import type { AIParsePurchaseResult } from '../types/aiParse';

interface UseAIParseState {
  parseResult: AIParsePurchaseResult | null;
  isLoading: boolean;
  error: string | null;
}

export function useAIParse() {
  const [state, setState] = useState<UseAIParseState>({
    parseResult: null,
    isLoading: false,
    error: null,
  });

  /**
   * 解析采购文本
   */
  const parseText = useCallback(async (text: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const result = await aiParseService.parsePurchaseText({ text });
      setState(prev => ({ ...prev, parseResult: result, isLoading: false }));
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '解析失败';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      throw err;
    }
  }, []);

  /**
   * 清除解析结果
   */
  const clearResult = useCallback(() => {
    setState({
      parseResult: null,
      isLoading: false,
      error: null,
    });
  }, []);

  /**
   * 重置状态
   */
  const reset = useCallback(() => {
    setState({
      parseResult: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    parseText,
    clearResult,
    reset,
  };
}
