import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from './base.service';
import { PlayerSummaryResponse } from '../player-summary/player-summary.interface';

@Injectable({
  providedIn: 'root'
})
export class PlayersService extends BaseService {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getPlayerSummary(playerID: number): Observable<{ endpoint: string; apiResponse: PlayerSummaryResponse }> {
    const endpoint = `${this.baseUrl}/playerSummary/${playerID}`;

    return this.get(endpoint).pipe(
      map((data: PlayerSummaryResponse) => {
        return {
          endpoint: endpoint,
          apiResponse: data
        };
      })
    );
  }
}
