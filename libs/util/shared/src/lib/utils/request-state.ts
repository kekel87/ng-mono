import { RequestState } from '../enums';

export function merge(requestStates: RequestState[]): RequestState {
  return (
    [RequestState.Error, RequestState.Loading, RequestState.Initial].find((requestStateValue): RequestState | null =>
      requestStates.some((r) => r === requestStateValue) ? requestStateValue : null
    ) ?? RequestState.Success
  );
}
