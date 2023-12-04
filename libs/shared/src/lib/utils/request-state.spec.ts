import { merge } from './request-state';
import { RequestState } from '../enums';

describe('RequestState utils', () => {
  describe('merge', () => {
    it('should return Error state', () => {
      expect(merge([RequestState.Error, RequestState.Success])).toEqual(RequestState.Error);
      expect(merge([RequestState.Error, RequestState.Loading])).toEqual(RequestState.Error);
      expect(merge([RequestState.Error, RequestState.Initial])).toEqual(RequestState.Error);
    });

    it('should return Loading state', () => {
      expect(merge([RequestState.Loading, RequestState.Success])).toEqual(RequestState.Loading);
      expect(merge([RequestState.Loading, RequestState.Initial])).toEqual(RequestState.Loading);
    });

    it('should return Initial state', () => {
      expect(merge([RequestState.Initial, RequestState.Success])).toEqual(RequestState.Initial);
    });

    it('should return Success state', () => {
      expect(merge([RequestState.Success, RequestState.Success])).toEqual(RequestState.Success);
    });
  });
});
