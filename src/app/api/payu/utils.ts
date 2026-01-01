const EXCHANGE_RATE_API_KEY =
  process.env.EXCHANGERATE_API_KEY ?? '87862fb7860f9daccc4caa5f';

const EXCHANGE_RATE_ENDPOINT = `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/pair/USD/INR`;
const FALLBACK_USD_TO_INR_RATE = 88.44;
const REQUEST_TIMEOUT_MS = 5_000;

type ConversionResult = {
  rate: number;
  inrAmount: number;
  source: 'live' | 'fallback';
};

class CurrencyConversionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CurrencyConversionError';
  }
}

async function fetchLiveRate(): Promise<number> {
  if (!EXCHANGE_RATE_API_KEY) {
    throw new CurrencyConversionError('ExchangeRate API key is missing');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(EXCHANGE_RATE_ENDPOINT, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new CurrencyConversionError(
        `ExchangeRate request failed (${response.status})`,
      );
    }

    const payload = (await response.json()) as {
      result?: string;
      conversion_rate?: number;
      error_type?: string;
    };

    if (payload.result !== 'success' || !payload.conversion_rate) {
      throw new CurrencyConversionError(
        `ExchangeRate request returned error: ${payload.error_type ?? 'unknown'}`,
      );
    }

    return payload.conversion_rate;
  } catch (error) {
    if (error instanceof CurrencyConversionError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new CurrencyConversionError('ExchangeRate request timed out');
    }

    throw new CurrencyConversionError(
      error instanceof Error
        ? error.message
        : 'Unknown error during ExchangeRate request',
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function convertUsdToInr(
  amountUsd: number,
): Promise<ConversionResult> {
  if (!Number.isFinite(amountUsd) || amountUsd <= 0) {
    throw new Error('Invalid USD amount for conversion');
  }

  try {
    const liveRate = await fetchLiveRate();
    const inrAmount = liveRate * amountUsd;

    console.info('[convertUsdToInr] Using live FX rate', {
      rate: liveRate,
      amountUsd,
      amountInr: inrAmount,
    });

    return {
      rate: liveRate,
      inrAmount,
      source: 'live',
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown conversion failure';

    const inrAmount = FALLBACK_USD_TO_INR_RATE * amountUsd;

    console.error('[convertUsdToInr] Falling back to static FX rate', {
      amountUsd,
      amountInr: inrAmount,
      fallbackRate: FALLBACK_USD_TO_INR_RATE,
      error: message,
    });

    return {
      rate: FALLBACK_USD_TO_INR_RATE,
      inrAmount,
      source: 'fallback',
    };
  }
}

