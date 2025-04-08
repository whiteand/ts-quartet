import { e as v } from "./e";
import { ValidatedBy } from "./infer";

const x = v.and(42);
const t = v(x);

type A = ValidatedBy<typeof t>;
const t2 = v(t);
type B = ValidatedBy<typeof t2>;

export const ALL_PURCHASE_STATUSES = [
  "Created",
  "Initiated",
  "Confirmed"
] as const;

export const ALL_KYC_STATUSES = [
  "Incomplete",
  "Requested",
  "UnderReview",
  "Completed"
] as const;

const isValidRowData = v({
  id: v.string,
  accessCode: [v.string, null],
  email: [v.string, null],
  fullName: [v.string, null],
  address: [v.string, null],
  proofOfIdentityUrl: [v.string, null],
  proofOfResidenceUrl: [v.string, null],
  kycStatus: ALL_KYC_STATUSES,
  purchases: [
    v.arrayOf({
      id: v.string,
      currency: ["USDT", "BTC", "ETH", "USD", "USDC"],
      amount: v.number,
      amountUsd: v.number,
      tokenPrice: v.number,
      allocation: v.number,
      status: ALL_PURCHASE_STATUSES,
      rawSAFT: [v.string, null],
      saftLink: [v.string, null],
      explorerLink: [v.string, null],
      creationTimeUtc: v.string,
      updateTimeUtc: v.string
    }),
    null
  ],
  activationTimeUtc: [v.string, null],
  lastLoginTimeUtc: [v.string, null]
});

const value: unknown = 42;

if (isValidRowData(value)) {
  const x = value.purchases;
}
