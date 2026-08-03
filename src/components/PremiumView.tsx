import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Check, Sparkles, X, ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react';

interface PremiumViewProps {
  isPremium: boolean;
  setIsPremium: (val: boolean) => void;
}
const stripePromise = loadStripe("pk_test_51TucVoRvclTjzaMc8llZsIUzcrfc0xS3iSl0Ps6M5cIsPSW3e6n5iyphJMWfi2hhbeJpX89SD3pSOEVxV366WbWo006CTTdMh1");
export default function PremiumView({ isPremium, setIsPremium }: PremiumViewProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>("");
  const price = billingPeriod === 'monthly' ? 8 : 20;
  useEffect(() => {
  if (showTransactionModal) {
    fetch("/api/stripe/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: price * 100 }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch((err) => console.error("Error fetching clientSecret:", err));
  }
}, [showTransactionModal, price]);

  const rateLabel = billingPeriod === 'monthly' ? '/ month' : '/ year';
  const saveBadge = billingPeriod === 'yearly' && (
    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase font-display font-bold">
      Save 20%
    </span>
  );
  // Check if user was redirected back from Paystack after payment
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('reference') || urlParams.has('trxref')) {
      // 1. Set state to premium
      setIsPremium(true);
      // 2. Save to browser local storage so it stays after refresh
      localStorage.setItem('isPremium', 'true');
      
      // Clean up the URL query params so it looks neat
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleUpgrade = () => {
    setShowTransactionModal(true);
  };

  const handleConfirmTransaction = async () => {
    // Prompt user for email (or use logged-in user email)
    const userEmail = prompt("Enter your email address for receipt:");
    if (!userEmail) return;

    // Price in KES (e.g. 8 USD * 130 KES/USD = 1040 KES)
    const usdPrice = 8;
    const exchangeRate = 130;
    const amountInKes = Math.round(usdPrice * exchangeRate);

    try {
      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          amount: amountInKes,
        }),
      });

      const data = await response.json();

      if (data.success && data.authorization_url) {
        // Redirect user to Paystack (M-Pesa / Card checkout page)
        window.location.href = data.authorization_url;
      } else {
        alert("Payment setup failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Something went wrong processing payment.");
    }
  };

  const comparisonRows = [
    { feature: 'Neural Match Engine', free: 'Standard G1.5', pro: 'Neural G3.5 Pro Max' },
    { feature: 'Saved Vibe Boards', free: 'Limit 3 boards', pro: 'Unlimited' },
    { feature: 'Companion AI Advice', free: '10 daily messages', pro: 'Unlimited & Context-Aware' },
    { feature: 'WebGL Backgrounds', free: 'Midnight Slate', pro: 'Cyan Glow, Magenta Waves, Custom' },
    { feature: 'Profile Vibe Score boost', free: 'Dynamic only', pro: 'AI Profile Repair (+10 points)' },
    { feature: 'Match Compatibility Report', free: 'Basic summary', pro: 'Deep Interaction DNA Report' },
  ];

  return (
    <div className="w-full min-h-screen text-[#dfe1f6] px-4 md:px-10 lg:px-16 py-24 md:py-28 relative select-none pb-24">
      
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 bg-[#fface8]/10 border border-[#fface8]/20 px-3 py-1 rounded-full text-xs text-[#fface8] tracking-widest uppercase font-display font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          Pro Membership
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-black text-white tracking-tight leading-none">
          Experience the <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fface8] via-[#ff24e4] to-[#00dbe9]">
            Vibe Paradox.
          </span>
        </h1>
        <p className="font-sans text-sm md:text-base text-[#ddbed1]/80 max-w-2xl mx-auto leading-relaxed">
          Break the limitations of traditional digital discovery. Unlock deep machine neural matching, unlimited saved mood boards, and infinite companion wingman guidance.
        </p>
      </div>

      {/* Main Pricing Layout Card */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch mb-16">
        
        {/* Toggle + Price Display (5 cols) */}
        <div className="md:col-span-5 bg-[#0a0d1c]/40 backdrop-blur-xl border border-[#fface8]/15 p-8 rounded-3xl flex flex-col justify-between text-center relative overflow-hidden shadow-2xl">
          <div className="absolute -right-20 -top-20 w-44 h-44 bg-[#ff24e4]/10 blur-3xl rounded-full" />
          
          <div className="space-y-6 z-10">
            {/* Billing switcher */}
            <div className="flex bg-[#050816]/75 border border-white/5 rounded-xl p-1 max-w-[220px] mx-auto">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`flex-1 py-2 rounded-lg font-display text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-[#fface8] text-[#5e0053] shadow-md'
                    : 'text-[#ddbed1]/60 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`flex-1 py-2 rounded-lg font-display text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                  billingPeriod === 'yearly'
                    ? 'bg-[#fface8] text-[#5e0053] shadow-md'
                    : 'text-[#ddbed1]/60 hover:text-white'
                }`}
              >
                Yearly
              </button>
            </div>

            {/* Price display */}
            <div className="space-y-1">
              <div className="text-[10px] text-[#fface8] font-display font-black uppercase tracking-widest">Nexus Pro Access</div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-5xl font-display font-black text-white tracking-tighter">${price}</span>
                <span className="text-sm text-[#ddbed1]/50 font-sans">{rateLabel}</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 h-6">
                {saveBadge}
              </div>
            </div>
          </div>

          <div className="pt-8 space-y-4 z-10">
            {!isPremium ? (
              <button
                onClick={handleUpgrade}
                className="w-full py-4 bg-gradient-to-r from-[#ff24e4] via-[#fface8] to-[#00dbe9] text-[#050816] font-display text-xs font-bold uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,172,232,0.3)] cursor-pointer"
              >
                Unlock Pro Access
              </button>
            ) : (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center gap-2 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
                <span className="font-display text-xs font-bold uppercase tracking-wider">You are a Pro member!</span>
              </div>
            )}
            <p className="text-[10px] text-[#ddbed1]/40 uppercase font-display font-semibold">Instant unlock. Cancel anytime.</p>
          </div>
        </div>

        {/* Benefits list (7 cols) */}
        <div className="md:col-span-7 bg-[#0a0d1c]/40 backdrop-blur-xl border border-[#fface8]/15 p-8 md:p-10 rounded-3xl flex flex-col justify-center space-y-6 shadow-2xl">
          <h2 className="font-display text-lg font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
            Why go Pro?
          </h2>

          <div className="space-y-4">
            <div className="flex gap-3.5 items-start">
              <div className="p-1 rounded-full bg-gradient-to-r from-[#ff24e4] to-[#00dbe9] mt-0.5">
                <div className="bg-[#050816] p-1 rounded-full text-[#fface8]">
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">Unrestricted AI Advice</h3>
                <p className="text-xs text-[#ddbed1]/75 font-sans mt-0.5">Get real-time compatibility reports and tailored icebreakers on demand.</p>
              </div>
            </div>

            <div className="flex gap-3.5 items-start">
              <div className="p-1 rounded-full bg-gradient-to-r from-[#ff24e4] to-[#00dbe9] mt-0.5">
                <div className="bg-[#050816] p-1 rounded-full text-[#fface8]">
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">Deep Neural Match Algorithm</h3>
                <p className="text-xs text-[#ddbed1]/75 font-sans mt-0.5">Higher accuracy matching based on multimodal visual & structural vibe maps.</p>
              </div>
            </div>

            <div className="flex gap-3.5 items-start">
              <div className="p-1 rounded-full bg-gradient-to-r from-[#ff24e4] to-[#00dbe9] mt-0.5">
                <div className="bg-[#050816] p-1 rounded-full text-[#fface8]">
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">Premium Visual Skins</h3>
                <p className="text-xs text-[#ddbed1]/75 font-sans mt-0.5">Customise your application background with glowing neon liquid simulations.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Deep Comparison table */}
      <section className="max-w-4xl mx-auto bg-[#0a0d1c]/40 backdrop-blur-xl border border-[#fface8]/10 rounded-3xl p-6 md:p-8 shadow-xl">
        <h2 className="font-display text-xs font-bold uppercase tracking-widest text-[#fface8]/80 mb-6 flex items-center gap-2">
          <Award className="w-4 h-4 text-[#fface8]" />
          Deep tier comparison
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[#ddbed1]/50 text-[10px] uppercase font-display font-bold tracking-widest">
                <th className="py-3 px-4">Core Feature</th>
                <th className="py-3 px-4">Nexus Free</th>
                <th className="py-3 px-4 text-[#fface8]">Nexus Pro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {comparisonRows.map((row) => (
                <tr key={row.feature} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 font-display uppercase tracking-wider text-white font-semibold">{row.feature}</td>
                  <td className="py-4 px-4 text-[#ddbed1]/60">{row.free}</td>
                  <td className="py-4 px-4 text-[#00dbe9] font-semibold">{row.pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Transaction Modal Overlay */}
      <AnimatePresence>
        {showTransactionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0c0f1d] border border-[#fface8]/40 rounded-3xl max-w-md w-full p-8 space-y-6 shadow-2xl relative text-center"
            >
              <button
                onClick={() => setShowTransactionModal(false)}
                className="absolute top-4 right-4 p-1.5 text-[#ddbed1]/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#ff24e4] via-[#fface8] to-[#00dbe9] p-0.5 mx-auto animate-bounce">
                <div className="w-full h-full rounded-full bg-[#050816] flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-[#fface8]" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-xl font-bold text-white uppercase tracking-wider">Curate your digital DNA</h3>
                <p className="font-sans text-xs text-[#ddbed1]/80 leading-relaxed">
                  You are upgrading to <strong>Nexus Pro</strong>. This will instantly activate unlimited vibe boards, uncapped companion memory, and exclusive neon themes.
                </p>
              </div>

              <div className="bg-[#141829] border border-white/5 p-4 rounded-xl space-y-1.5 text-xs text-left">
                <div className="flex justify-between">
                  <span className="text-[#ddbed1]/60">Membership Type:</span>
                  <span className="text-white font-semibold uppercase">{billingPeriod} Premium</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-1.5">
                  <span className="text-[#ddbed1]/60">Total Billable Amount:</span>
                  <span className="text-[#00dbe9] font-bold">${price}.00</span>
                </div>
              </div>

<button
  onClick={handleConfirmTransaction}
  className="w-full py-4 bg-[#fface8] hover:opacity-90 text-black font-bold flex items-center justify-center space-x-2 rounded-xl transition-all"
>
  <span>Authorize & Unlock</span>
  <ChevronRight className="w-4 h-4" />
</button>

<PayPalScriptProvider
  options={{
    clientId: "AS3oK0BPCvTZ1Y0CjOTADYmsEDPQP55fn7TEbSscigZxmHMvyUWVrwgnyXMoUT9SgwkDFYjguSkNzQYD",
  }}
>
  <PayPalButtons
    style={{ layout: "vertical" }}
    createOrder={async () => {
      const response = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const order = await response.json();
      return order.id;
    }}
    onApprove={async (data) => {
      const response = await fetch(
        `/api/paypal/capture-order/${data.orderID}`,
        {
          method: "POST",
        }
      );

      const captureData = await response.json();

      if (captureData.status === "COMPLETED") {
        alert("Payment successful! Welcome to Nexus Pro.");
        setIsPremium(true);
        localStorage.setItem("is_premium", "true");
        setShowTransactionModal(false);
      } else {
        alert("Payment could not be completed.");
      }
    }}
  />
</PayPalScriptProvider>    
{/* Safe Render Block */}
{clientSecret ? (
  <Elements stripe={stripePromise} options={{ clientSecret }}>
    <CheckoutForm 
      setIsPremium={setIsPremium} 
      setShowTransactionModal={setShowTransactionModal} 
    />
  </Elements>
) : (
  <div className="p-4 text-center text-gray-400">
    Loading payment options...
  </div>
)}
</motion.div>
          </div>
        )}
        </AnimatePresence>
</div>
  );
}
function CheckoutForm({ setIsPremium, setShowTransactionModal }: any) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
      redirect: "if_required",
    });

    if (error) {
      alert(error.message);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      alert("Payment successful! Welcome to Nexus Pro.");
      setIsPremium(true);
      localStorage.setItem("is_premium", "true");
      setShowTransactionModal(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all"
      >
        Pay with Card
      </button>
    </form>
  );
}