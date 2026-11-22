import { createContext, useContext, useEffect, useRef } from "react";
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";

const TawkContext = createContext(null);
export const useTawk = () => useContext(TawkContext);

export function TawkProvider({ children, user }) {
  const tawkRef = useRef();

  const sendUser = () => {
    if (user?.email) {
      tawkRef.current?.setAttributes(
        { name: user.name, email: user.email },
        () => {},
      );
    }
  };

  useEffect(sendUser, [user]);

  return (
    <TawkContext.Provider value={tawkRef}>
      {children}
      <TawkMessengerReact
        propertyId={import.meta.env.VITE_TAWK_PROPERTY_ID}
        widgetId={import.meta.env.VITE_TAWK_WIDGET_ID}
        ref={tawkRef}
        onLoad={sendUser}
      />
    </TawkContext.Provider>
  );
}
