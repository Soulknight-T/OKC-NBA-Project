import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { PlayersService } from '../_services/players.service';
import { PlayerSummaryResponse, PlayerSummaryApiResponse } from './player-summary.interface';

@UntilDestroy()
@Component({
  selector: 'player-summary-component',
  templateUrl: './player-summary.component.html',
  styleUrls: ['./player-summary.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PlayerSummaryComponent implements OnInit, OnDestroy {

  playerSummary?: PlayerSummaryResponse;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected cdr: ChangeDetectorRef,
    protected playersService: PlayersService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(untilDestroyed(this))
      .subscribe(params => {
        const playerId = Number(params.get('playerId'));
  
        this.playersService.getPlayerSummary(playerId)
          .pipe(untilDestroyed(this))
          .subscribe(response => {
            const apiData = response.apiResponse as unknown as PlayerSummaryApiResponse;
  
            this.playerSummary = {
              player_id: apiData.player_id,
              player_name: apiData.player_name,
              team: apiData.team,
              totals: {
                totalPoints: apiData.totalPoints,
                totalShotAttempts: apiData.totalShotAttempts,
                shootingFoulsDrawn: apiData.shootingFoulsDrawn,
                totalPasses: apiData.totalPasses,
                completedPasses: apiData.completedPasses,
                totalPotentialAssists: apiData.totalPotentialAssists,
                totalTurnovers: apiData.totalTurnovers,
                pickAndRollCount: apiData.pickAndRollCount,
                isolationCount: apiData.isolationCount,
                postUpCount: apiData.postUpCount,
                offBallScreenCount: apiData.offBallScreenCount
              },
              ranks: {
                totalPointsRank: apiData.totalPointsRank,
                totalShotAttemptsRank: apiData.totalShotAttemptsRank,
                totalPassesRank: apiData.totalPassesRank,
                totalPotentialAssistsRank: apiData.totalPotentialAssistsRank,
                totalTurnoversRank: apiData.totalTurnoversRank
              }
            };
            this.cdr.markForCheck();
          });
      });
  }
  
  ngOnDestroy(): void {}
}