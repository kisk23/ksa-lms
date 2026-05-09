import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError, AxiosInstance } from 'axios';

type RequestConfig = {
  idempotencyKey?: string;
};

@Injectable()
export class MoyasarClient {
  private readonly logger = new Logger(MoyasarClient.name);
  private readonly client: AxiosInstance;

  constructor(private readonly config: ConfigService) {
    const secretKey = this.config.get<string>('MOYASAR_SECRET_KEY');
    if (!secretKey) {
      this.logger.warn('MOYASAR_SECRET_KEY is not configured. Moyasar requests will fail.');
    }

    this.client = axios.create({
      baseURL: this.config.get<string>('MOYASAR_BASE_URL', 'https://api.moyasar.com/v1'),
      timeout: 15000,
      auth: {
        username: secretKey ?? '',
        password: '',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  createPayment(payload: Record<string, unknown>, config?: RequestConfig) {
    return this.request<Record<string, unknown>>('post', '/payments', payload, config);
  }

  fetchPayment(moyasarPaymentId: string) {
    return this.request<Record<string, unknown>>('get', `/payments/${moyasarPaymentId}`);
  }

  listPayments(params: Record<string, unknown>) {
    return this.request<Record<string, unknown>>('get', '/payments', undefined, undefined, params);
  }

  updatePayment(moyasarPaymentId: string, payload: Record<string, unknown>) {
    return this.request<Record<string, unknown>>('put', `/payments/${moyasarPaymentId}`, payload);
  }

  refundPayment(
    moyasarPaymentId: string,
    payload: Record<string, unknown>,
    config?: RequestConfig,
  ) {
    return this.request<Record<string, unknown>>(
      'post',
      `/payments/${moyasarPaymentId}/refund`,
      payload,
      config,
    );
  }

  capturePayment(
    moyasarPaymentId: string,
    payload: Record<string, unknown>,
    config?: RequestConfig,
  ) {
    return this.request<Record<string, unknown>>(
      'post',
      `/payments/${moyasarPaymentId}/capture`,
      payload,
      config,
    );
  }

  voidPayment(moyasarPaymentId: string, config?: RequestConfig) {
    return this.request<Record<string, unknown>>(
      'post',
      `/payments/${moyasarPaymentId}/void`,
      undefined,
      config,
    );
  }

  private async request<T>(
    method: 'get' | 'post' | 'put',
    url: string,
    data?: Record<string, unknown>,
    requestConfig?: RequestConfig,
    params?: Record<string, unknown>,
  ): Promise<T> {
    const headers = requestConfig?.idempotencyKey
      ? { 'Idempotency-Key': requestConfig.idempotencyKey }
      : undefined;

    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        const response = await this.client.request<T>({ method, url, data, headers, params });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string; errors?: unknown }>;
        const status = axiosError.response?.status;
        const retryable = !status || status >= 500 || status === 429;

        if (!retryable || attempt === 3) {
          this.logger.error(`Moyasar ${method.toUpperCase()} ${url} failed`, {
            status,
            response: axiosError.response?.data,
          });
          throw new HttpException(
            {
              message: axiosError.response?.data?.message ?? 'Moyasar request failed',
              details: axiosError.response?.data?.errors ?? axiosError.response?.data,
            },
            status ?? HttpStatus.BAD_GATEWAY,
          );
        }

        await this.delay(250 * attempt);
      }
    }

    throw new HttpException('Moyasar request failed', HttpStatus.BAD_GATEWAY);
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
