import { useEffect } from "react";
import { useSelector } from "react-redux";
import { setAnalyticsConsent } from "../../lib/firebase";

export default function AnalyticsConsent() {
  const consent = useSelector((state) => state.consent);

  useEffect(() => {
    setAnalyticsConsent(consent?.preferences?.analytics === true).catch(
      (error) => console.error("Could not apply analytics consent:", error),
    );
  }, [consent]);

  return null;
}
