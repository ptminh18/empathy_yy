import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const API_BASE = "http://127.0.0.1:8080";

// =============================================================
// Props:
//   amount        — string USD e.g. "25.00"
//   orderInfo     — { customer_id, customer_name, yoyo_id, yoyo_name, quantity, total_price }
//   onSuccess(details) — called when payment + order saved
//   onError(err)       — called on failure
// =============================================================

const PayPalButton = ({ amount, orderInfo = {}, onSuccess, onError }) => {
  return (
    <PayPalScriptProvider
      options={{
        "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: "USD",
      }}
    >
      <PayPalButtons
        style={{
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "pay",
        }}
        // Step 1: Create PayPal order
        createOrder={async () => {
          try {
            const res = await fetch(`${API_BASE}/api/paypal/create-order`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ amount, currency: "USD" }),
            });
            const data = await res.json();
            if (!data.id) throw new Error("Failed to create PayPal order");
            return data.id;
          } catch (err) {
            console.error("createOrder error:", err);
            if (onError) onError(err);
          }
        }}
        // Step 2: Capture + save order to DB
        onApprove={async (data) => {
          try {
            const res = await fetch(`${API_BASE}/api/paypal/capture-order`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderID: data.orderID,
                ...orderInfo, // customer_id, customer_name, yoyo_id, yoyo_name, quantity, total_price
              }),
            });
            const result = await res.json();
            if (result.success) {
              if (onSuccess) onSuccess(result);
            } else {
              throw new Error("Capture failed: " + result.status);
            }
          } catch (err) {
            console.error("onApprove error:", err);
            if (onError) onError(err);
          }
        }}
        onError={(err) => {
          console.error("PayPal button error:", err);
          if (onError) onError(err);
        }}
        onCancel={() => {
          console.log("Payment cancelled by user");
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;