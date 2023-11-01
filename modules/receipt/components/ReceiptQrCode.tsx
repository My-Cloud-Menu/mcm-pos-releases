import React from "react";
import QRCode from "react-native-qrcode-svg";
import { useQuery } from "@tanstack/react-query";
import { getQrCodeReceiptUrl } from "../../payment/PaymentApi";
import { Colors } from "react-native-ui-lib";

type props = {
  paymentId: string;
};

const ReceiptQrCode = ({ paymentId }: props) => {
  const { data } = useQuery({
    queryKey: ["receipt_qrcodeurl", paymentId],
    queryFn: () => getQrCodeReceiptUrl(paymentId),
    refetchOnMount: false,
  });

  if (!Boolean(data?.url)) return <></>;

  return <QRCode color={Colors.primary} size={150} value={data.url} />;
};

export default ReceiptQrCode;
