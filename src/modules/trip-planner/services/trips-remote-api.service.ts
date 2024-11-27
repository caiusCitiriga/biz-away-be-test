import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import { catchError, map, of, take } from 'rxjs';
import { Injectable, Logger } from '@nestjs/common';

import { ENVConfig } from '@core';
import { Trip, TripsPlaces } from '@models';

@Injectable()
export class TripsRemoteApiService {
  private readonly logger = new Logger(TripsRemoteApiService.name);
  private readonly API_URL =
    'https://z0qw1e7jpd.execute-api.eu-west-1.amazonaws.com/default/trips';

  constructor(private readonly http: HttpService) {}

  getTrips(origin: TripsPlaces, destination: TripsPlaces): Promise<Trip[]> {
    const url = this.buildUrl(origin, destination);
    const headers = this.buildHeaders();

    return new Promise<Trip[]>((resolve, reject) => {
      this.http
        .get<Trip[]>(url, { headers })
        .pipe(
          take(1),
          map((resp) => resolve(resp.data)),
          catchError((e) => {
            if (e instanceof AxiosError) {
              this.logger.debug(`remote api error: ${e.code} - ${e.message}`);
              reject(new Error(e.message));
            } else {
              this.logger.debug(
                `unknown remote api error: ${e.message || e.name}`,
              );
              reject(new Error(`unknown remote api error`));
            }

            return of(e);
          }),
        )
        .subscribe();
    });
  }

  private buildHeaders(): Record<string, string> {
    return {
      ['x-api-key']: ENVConfig.remoteApiKey,
    };
  }

  private buildUrl(origin: TripsPlaces, destination: TripsPlaces): string {
    const url = new URL(this.API_URL);
    url.searchParams.append('origin', origin);
    url.searchParams.append('destination', destination);
    return url.toString();
  }
}
