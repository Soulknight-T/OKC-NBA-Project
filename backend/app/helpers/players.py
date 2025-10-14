import json
import os
import random

from app.dbmodels import models

from app.models import Player, Shot, Pass, Turnover
from django.db.models import Sum, Count, F

def get_player_summary_stats(player_id: str):
    player = Player.objects.get(player_id=player_id)

    shots = Shot.objects.filter(player=player)
    passes = Pass.objects.filter(player=player)
    turnovers = Turnover.objects.filter(player=player)

    total_points = shots.aggregate(total=Sum('points'))['total'] or 0
    total_shots = shots.count()
    shooting_fouls_drawn = shots.filter(shooting_foul_drawn=True).count()

    total_passes = passes.count()
    completed_passes = passes.filter(completed_pass=True).count()
    potential_assists = passes.filter(potential_assist=True).count()

    turnovers_count = turnovers.count()

    action_types = shots.values('action_type').annotate(count=Count('shot_id'))
    action_counts = {item['action_type']: item['count'] for item in action_types}

    return {
        'player_id': player.player_id,
        'player_name': player.name,
        'team': player.team.name,
        'totalPoints': total_points,
        'totalShotAttempts': total_shots,
        'shootingFoulsDrawn': shooting_fouls_drawn,
        'totalPasses': total_passes,
        'completedPasses': completed_passes,
        'totalPotentialAssists': potential_assists,
        'totalTurnovers': turnovers_count,
        'pickAndRollCount': action_counts.get('pickAndRoll', 0),
        'isolationCount': action_counts.get('isolation', 0),
        'postUpCount': action_counts.get('postUp', 0),
        'offBallScreenCount': action_counts.get('offBallScreen', 0),
    }


def get_ranks(player_id: str, player_summary: dict):
    player_id = int(player_id)
    shot_agg = Shot.objects.values('player_id').annotate(
        totalPoints=Sum('points'),
        totalShotAttempts=Count('shot_id')
    )
    shot_stats = {item['player_id']: item for item in shot_agg}

    pass_agg = Pass.objects.values('player_id').annotate(
        totalPasses=Count('pass_id'),
        totalPotentialAssists=Count('pass_id', filter=F('potential_assist'))
    )
    pass_stats = {item['player_id']: item for item in pass_agg}
    turnover_agg = Turnover.objects.values('player_id').annotate(
        totalTurnovers=Count('turnover_id')
    )
    turnover_stats = {item['player_id']: item for item in turnover_agg}
    all_player_ids = set(shot_stats.keys()) | set(pass_stats.keys()) | set(turnover_stats.keys())

    def rank_field(field, stats_dict):
        sorted_list = sorted(
            [(pid, stats_dict.get(pid, {}).get(field, 0)) for pid in all_player_ids],
            key=lambda x: x[1],
            reverse=True
        )
        ranks = {pid: idx + 1 for idx, (pid, _) in enumerate(sorted_list)}
        return ranks

    totalPointsRank = rank_field('totalPoints', shot_stats)
    totalShotAttemptsRank = rank_field('totalShotAttempts', shot_stats)
    totalPassesRank = rank_field('totalPasses', pass_stats)
    totalPotentialAssistsRank = rank_field('totalPotentialAssists', pass_stats)
    totalTurnoversRank = rank_field('totalTurnovers', turnover_stats)

    return {
        'totalPointsRank': totalPointsRank.get(player_id, 0),
        'totalShotAttemptsRank': totalShotAttemptsRank.get(player_id, 0),
        'totalPassesRank': totalPassesRank.get(player_id, 0),
        'totalPotentialAssistsRank': totalPotentialAssistsRank.get(player_id, 0),
        'totalTurnoversRank': totalTurnoversRank.get(player_id, 0),
    }
