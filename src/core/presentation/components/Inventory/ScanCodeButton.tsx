import { useMutation, useQuery } from "@tanstack/react-query";
import { MdQrCodeScanner } from "react-icons/md";
import { barcodeScannerService } from "../../../infrastructure/container";
import { scannerAvailabilityQueryOptions } from "../../queries/inventoryQueries";

interface ScanCodeButtonProps {
  onScanned: (code: string) => void;
  label: string;
  className?: string;
}

/**
 * Lee un código de barras con la cámara.
 *
 * En escritorio el plugin no existe, así que la consulta de disponibilidad
 * resuelve a `false` y el botón no se dibuja: nadie ve una cámara que no va a
 * abrirse.
 */
export const ScanCodeButton = ({
  onScanned,
  label,
  className = "btn btn-outline",
}: ScanCodeButtonProps) => {
  const { data: isAvailable } = useQuery(scannerAvailabilityQueryOptions);

  const scan = useMutation({
    mutationFn: () => barcodeScannerService.scanProductCode(),
    onSuccess: (result) => {
      if (result.ok) {
        onScanned(result.code);
      }
    },
  });

  if (!isAvailable) {
    return null;
  }

  return (
    <button
      aria-label={label}
      className={`${className} shrink-0`}
      disabled={scan.isPending}
      onClick={() => scan.mutate()}
      type="button"
    >
      {scan.isPending ? (
        <span className="loading loading-spinner loading-sm" />
      ) : (
        <MdQrCodeScanner size={20} />
      )}
    </button>
  );
};
