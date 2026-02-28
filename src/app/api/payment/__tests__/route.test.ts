import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from "../route";
import { waafipayService } from "@/services/waafipay";

// Mock the waafipay service
vi.mock("@/services/waafipay", () => ({
    waafipayService: {
        purchase: vi.fn(),
        hppPurchase: vi.fn(),
    },
}));

describe("Payment API Route Security", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Setup generic mock implementation for purchase
        vi.mocked(waafipayService.purchase).mockResolvedValue({
            schemaVersion: "1.0",
            timestamp: "2026-02-28",
            responseId: "123",
            errorCode: "0",
            responseCode: "2001",
            responseMsg: "Success",
            params: { transactionId: "TEST_TXN_ID", referenceId: "REF_123", state: "APPROVED", accountNo: "123", accountType: "test", merchantCharges: "0" }
        });
    });

    it("should fail if description is missing", async () => {
        const request = new Request("http://localhost:3000/api/payment", {
            method: "POST",
            body: JSON.stringify({
                accountNo: "252610000000",
                subscriptionType: "monthly"
            }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe("Missing required fields: description");
    });

    it("should automatically use 49.0 for monthly subscription and NOT trust frontend", async () => {
        const request = new Request("http://localhost:3000/api/payment", {
            method: "POST",
            body: JSON.stringify({
                accountNo: "252610000000",
                description: "Monthly subscription",
                subscriptionType: "monthly",
                amount: 0.1 // Malicious amount attempt
            }),
        });

        const response = await POST(request);

        expect(response.status).toBe(200);

        // Verify the waafipay service was called with the SERVER verified price (49.0), NOT 0.1
        expect(waafipayService.purchase).toHaveBeenCalledWith(
            expect.objectContaining({
                amount: 49.0, // Should ignore the 0.1 sent in the payload
                accountNo: "252610000000",
            })
        );
    });

    it("should correctly calculate prices for yearly and lifetime subscriptions", async () => {
        const request = new Request("http://localhost:3000/api/payment", {
            method: "POST",
            body: JSON.stringify({
                accountNo: "252610000000",
                description: "Yearly subscription",
                subscriptionType: "yearly",
            }),
        });

        const response = await POST(request);
        expect(response.status).toBe(200);

        expect(waafipayService.purchase).toHaveBeenCalledWith(
            expect.objectContaining({
                amount: 99.99, // The verified yearly price
            })
        );
    });
});
