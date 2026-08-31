/**
 * ALAT Open API client scaffold.
 * Register at https://playground.alat.ng/ for real keys.
 */

export type AlatClientConfig = {
  subscriptionKey: string;
  apiKey: string;
  baseUrl?: string;
};

export class AlatClient {
  private subscriptionKey: string;
  private apiKey: string;
  private baseUrl: string;

  constructor(config: AlatClientConfig) {
    this.subscriptionKey = config.subscriptionKey;
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl ?? "https://api.alat.ng";
  }

  private headers() {
    return {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": this.subscriptionKey,
      "x-api-key": this.apiKey,
    };
  }

  async nameEnquiry(accountNumber: string, bankCode: string) {
    const res = await fetch(`${this.baseUrl}/name-enquiry`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({ accountNumber, bankCode }),
    });
    if (!res.ok) throw new Error(`Name enquiry failed: ${res.status}`);
    return res.json();
  }

  async createWallet(payload: {
    firstName: string;
    lastName: string;
    phone: string;
  }) {
    const res = await fetch(`${this.baseUrl}/wallets`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Create wallet failed: ${res.status}`);
    return res.json();
  }

  async getStatement(accountId: string) {
    const res = await fetch(`${this.baseUrl}/accounts/${accountId}/statement`, {
      headers: this.headers(),
    });
    if (!res.ok) throw new Error(`Statement failed: ${res.status}`);
    return res.json();
  }
}
