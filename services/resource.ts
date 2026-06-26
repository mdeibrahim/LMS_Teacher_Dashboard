import api from "./api";

export const getNextResourceId = async (): Promise<number | null> => {
  const response = await api.get("/next-resource-id/");

  const payload = response.data ?? {};
  const nextResourceId =
    payload.next_resource_id ??
    payload.data?.next_resource_id ??
    payload.data?.nextResourceId ??
    payload.data?.data?.next_resource_id ??
    null;

  if (
    typeof nextResourceId === "number" &&
    Number.isFinite(nextResourceId) &&
    nextResourceId > 0
  ) {
    return nextResourceId;
  }

  return null;
};
