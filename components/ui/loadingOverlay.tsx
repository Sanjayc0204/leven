interface LoadingOverlayInterface {
  isLoading: boolean;
  children: React.ReactNode;
}

export function LoadingOverlay({
  isLoading,
  children,
}: LoadingOverlayInterface) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-black border-opacity-75"></div>
        </div>
      )}
    </div>
  );
}
