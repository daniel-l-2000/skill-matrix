function useDatabase<T>(
  requestConfig: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body: any;
  },
  applyData: (data: T | undefined) => void
) {}

export default useDatabase;
