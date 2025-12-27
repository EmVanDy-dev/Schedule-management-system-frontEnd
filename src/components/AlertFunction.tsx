import React, { useEffect, useState } from "react";

export type AlertType =
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "primary"
  | "secondary";

interface AlertProps {
  message: string;
  type?: AlertType;
  duration?: number;
  width?: string;
}

const AlertFunction = ({ message, type, duration, width }: AlertProps) => {
  const [isShow, setShow] = useState(true);

  // USE FOR SHOW DURATION
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => setShow(false), duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  if (!isShow) return null;

  return (
    <div
      className={`alert alert-${type} position-fixed top-0 start-50 translate-middle-x`}
      role="alert"
      style={{
        zIndex: 1050,
        marginTop: "10px",
        width,
        borderRadius: "8px",
        fontSize: "14px",
      }}
    >
      {message}
    </div>
  );
};

export default AlertFunction;
