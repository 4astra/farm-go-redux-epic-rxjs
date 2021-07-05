import { from, of } from 'rxjs';
import { Epic } from 'redux-observable';
import { isActionOf, RootState, RootAction, Services } from 'typesafe-actions';
import { filter, map, catchError, switchMap, mergeMap, tap } from 'rxjs/operators';
import { signin_with_fb, signin_with_apple, SIGNIN_FB_SUCCESS, register_from_social_network } from './actions';
import { navigate } from '../../navigation/RootNavigation'
import { ErrorMessage, SocialProfile } from 'MyModels';

export const signin_with_fb_epic: Epic<RootAction, RootAction, RootState, Services>
  = (action$, _, { Api }) => action$.pipe
    (
      filter(isActionOf(signin_with_fb.request)),
      mergeMap
        (_ =>
          from(Api.Authen.authen_in_fb()).pipe
            (
              map(next => signin_with_fb.success(next as SocialProfile)),
              catchError(error => of(signin_with_fb.failure(error)))
            )
            .pipe
            (
              switchMap
                (
                  next => {
                    if (next.type == SIGNIN_FB_SUCCESS) {
                      return of(register_from_social_network.request(next.payload))
                    }
                    else {
                      return of(signin_with_fb.failure(next.payload))
                    }
                  }
                )
            )
        )
    );

export const authen_fb_epic: Epic<RootAction, RootAction, RootState, Services>
  = (action$, _, { Logger, Api }) => action$.pipe
    (
      filter(isActionOf(register_from_social_network.request)),
      tap(next => Logger.i("Infoxxx", next)),
      mergeMap
        (
          next => from(Api.Authen.register_from_social_network(next.payload)).pipe
            (
              switchMap
                (
                  data => {
                    if (data.result == true) {
                      return of(register_from_social_network.success(data));
                    } else {
                      return of(register_from_social_network.failure(data))
                    }
                  }
                ),
              catchError(error => of(register_from_social_network.failure(error)))
            ).pipe(
              filter(isActionOf(register_from_social_network.success)),
              tap(_ => navigate('Root'))
            )
        )
    );

export const signin_with_apple_epic: Epic<RootAction, RootAction, RootState, Services>
  = (action$, state$, { Logger, Api }) => action$.pipe(
    filter(isActionOf(signin_with_apple.request)),
    mergeMap(_ =>
      from(Api.Authen.authen_in_apple()).pipe(
        map(credential => signin_with_apple.success(credential)),
        catchError(message => of(signin_with_apple.failure(message)))
      )
    )
  );
