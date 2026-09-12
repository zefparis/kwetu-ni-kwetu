/**
 * Client UniPay — intégration Mobile Money (unipaycongo.com).
 *
 * Pattern reproduit depuis unipay-congo / unipay-api :
 * - POST /v1/payment/initiate avec header X-API-Key
 * - direction: "collect" pour recevoir un paiement
 * - Sandbox via header x-unipay-mode: sandbox (succès immédiat, pas de USSD)
 * - Webhook payment.status_update avec signature HMAC-SHA256
 */

import crypto from "crypto";

export type UniPayOperator = "orange" | "airtel" | "afrimoney";
export type UniPayCurrency = "CDF" | "USD";
export type UniPayStatus = "pending" | "processing" | "success" | "failed" | "cancelled";

export interface InitiatePaymentParams {
  operator: UniPayOperator;
  phone: string;
  amount: number;
  currency: UniPayCurrency;
  reference: string;
  metadata?: Record<string, unknown>;
}

export interface InitiatePaymentResponse {
  transaction_id: string;
  status: UniPayStatus;
  amount: number;
  fee: number;
  net_amount: number;
  currency: string;
  sandbox?: boolean;
}

export interface UniPayWebhookPayload {
  event: "payment.status_update";
  timestamp: string;
  data: {
    transaction_id: string;
    avada_transaction_id: string | null;
    reference: string | null;
    status: UniPayStatus;
  };
}

function getBaseUrl(): string {
  return process.env.UNIPAY_API_URL ?? "https://api.unipaycongo.com";
}

function getApiKey(): string {
  const key = process.env.UNIPAY_API_KEY;
  if (!key) throw new Error("UNIPAY_API_KEY non configuré");
  return key;
}

function isSandbox(): boolean {
  return (process.env.UNIPAY_MODE ?? "sandbox") === "sandbox";
}

/**
 * Initie un paiement Mobile Money (collect) via l'API UniPay.
 * En sandbox, la transaction est immédiatement marquée "success".
 * En live, l'utilisateur reçoit un prompt USSD sur son téléphone.
 */
export async function initiatePayment(
  params: InitiatePaymentParams,
): Promise<InitiatePaymentResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-API-Key": getApiKey(),
  };

  if (isSandbox()) {
    headers["x-unipay-mode"] = "sandbox";
  }

  const body = {
    operator: params.operator,
    direction: "collect",
    amount: params.amount,
    currency: params.currency,
    phone: params.phone,
    reference: params.reference,
    metadata: params.metadata ?? {},
  };

  const res = await fetch(`${getBaseUrl()}/v1/payment/initiate`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      `UniPay initiate failed (${res.status}): ${data.error ?? data.message ?? "erreur inconnue"}`,
    );
  }

  return data as InitiatePaymentResponse;
}

/**
 * Vérifie la signature HMAC-SHA256 d'un webhook entrant.
 * Le header X-UniPay-Signature est au format "sha256=<hex>".
 * Comparaison en temps constant pour éviter les timing attacks.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
): boolean {
  const secret = process.env.UNIPAY_WEBHOOK_SECRET;
  if (!secret || !signatureHeader) return false;

  // Le header est "sha256=<hex>"
  const match = signatureHeader.match(/^sha256=(.+)$/);
  if (!match) return false;

  const receivedSig = match[1];
  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(receivedSig, "hex"),
      Buffer.from(expectedSig, "hex"),
    );
  } catch {
    return false;
  }
}

/**
 * Interroge le statut d'une transaction UniPay (utile pour le polling
 * si le webhook est retardé).
 */
export async function getTransactionStatus(
  transactionId: string,
): Promise<{ status: UniPayStatus; transaction_id: string }> {
  const headers: Record<string, string> = {
    "X-API-Key": getApiKey(),
  };

  if (isSandbox()) {
    headers["x-unipay-mode"] = "sandbox";
  }

  const res = await fetch(
    `${getBaseUrl()}/v1/payment/status/${transactionId}`,
    { headers, signal: AbortSignal.timeout(10_000) },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      `UniPay status check failed (${res.status}): ${data.error ?? "erreur inconnue"}`,
    );
  }

  return data;
}
